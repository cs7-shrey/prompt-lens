// collect jobs from db
// and process them in a worker pool fashion

import prisma, { AISource, JobStatus } from "@prompt-lens/db";
import { launchRealChromeWithProfile, type ScraperService } from "./services/base";
import { ChatGPTService } from "./services/chatgpt";
import { ClaudeService } from "./services/claude";
import { PerplexityService } from "./services/perplexity";

const scraperServices = {
    [AISource.CHATGPT]: ChatGPTService,
    [AISource.CLAUDE]: ClaudeService,
    [AISource.PERPLEXITY]: PerplexityService,
}

class Semaphore {
    private current = 0;
    private queue: (() => void)[] = [];

    constructor(private readonly max: number) { }

    async acquire() {
        if (this.current < this.max) {
            this.current++;
            return;
        }
        await new Promise<void>(res => this.queue.push(res));
        this.current++;
    }

    release() {
        this.current--;
        const next = this.queue.shift();
        if (next) next();
    }

    available() {
        return this.max - this.current;
    }
}


class Executor {
    private semaphore: Semaphore;
    private running = true;

    constructor(
        private readonly scraper: ScraperService,
        private readonly aiSource: AISource,
        maxConcurrency: number
    ) {
        this.semaphore = new Semaphore(maxConcurrency);
    }

    async start() {
        while (this.running) {
            const availableSlots = this.semaphore.available();

            if (availableSlots > 0) {
                const jobs = await this.fetchAndLockJobs(availableSlots);
                for (const job of jobs) {
                    this.runJob(job);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    private async runJob(job: { id: string; promptId: string, promptContent: string }) {
        await this.semaphore.acquire();

        (async () => {
            try {
                const { response, citations } =
                    await this.scraper.getResponse(job.promptContent);

                if (response === undefined) {
                    throw new Error("No response from scraper");
                }

                await prisma.response.create({
                    data: {
                        content: response,
                        citations: citations,
                        aiSource: this.aiSource,
                        promptId: job.promptId
                    }
                })

                await prisma.job.update({
                    where: { id: job.id },
                    data: { status: JobStatus.COMPLETED },
                });
            } catch (err) {
                await prisma.job.update({
                    where: { id: job.id },
                    data: { status: JobStatus.FAILED },
                });
            } finally {
                this.semaphore.release();
            }
        })();
    }
    private async fetchAndLockJobs(availableSlots: number) {
        return await prisma.$transaction(async (tx) => {
            const jobs = await tx.$queryRaw<
                { id: string; promptId: string, promptContent: string }[]
                >`
                SELECT id, promptId, "content" as "promptContent"
                FROM "Job" JOIN "Prompt" ON "Job"."promptId" = "Prompt"."id"
                WHERE status = ${JobStatus.PENDING.toString()}
                AND aiSource = ${this.aiSource.toString()}
                ORDER BY "createdAt"
                LIMIT ${availableSlots}
                FOR UPDATE SKIP LOCKED
            `;
            
            if (jobs.length === 0) return []

            await tx.job.updateMany({
                where: { id: { in: jobs.map(job => job.id) } },
                data: { status: JobStatus.RUNNING },
            });
            
            return jobs;
        });
    }
}

export async function startScraper(maxConcurrencyPerSource: number) {
    const { browser } = await launchRealChromeWithProfile();
    for (const [aiSource, ScraperService] of Object.entries(scraperServices)) {
        const executor = new Executor(new ScraperService(browser), aiSource as AISource, maxConcurrencyPerSource);
        executor.start();
    }
}