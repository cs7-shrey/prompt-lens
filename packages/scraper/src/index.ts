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
                try {
                    const jobs = await this.fetchAndLockJobs(availableSlots);
                    for (const job of jobs) {
                        this.runJob(job);
                    }
                } catch (error) {
                    // TODO: Add browser crash restart (if needed)
                    console.error("Error in Executor.start:", error);
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

                // Add response
                await prisma.response.create({
                    data: {
                        content: response,
                        citations: citations,
                        aiSource: this.aiSource,
                        promptId: job.promptId
                    }
                })

                const dbJobUpdated = await prisma.job.update({
                    where: { id: job.id },
                    data: { status: JobStatus.COMPLETED },
                });

                const date = new Date(dbJobUpdated.runAfter);
                date.setHours(date.getHours() + 24);

                // Create a job for the next day
                await prisma.job.create({
                    data: {
                        promptId: dbJobUpdated.promptId,
                        aiSource: dbJobUpdated.aiSource,
                        status: JobStatus.PENDING,
                        runAfter: date
                    }
                })
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
        const getQuery = (jobStatus: JobStatus, extraCondition?: string) => {
            const whereClause = extraCondition 
                ? `WHERE "Job"."status" = '${jobStatus.toString()}'
                AND "Job"."aiSource" = '${this.aiSource.toString()}'
                AND "runAfter" < NOW()
                AND ${extraCondition}`
                : `WHERE "Job"."status" = '${jobStatus.toString()}'
                AND "Job"."aiSource" = '${this.aiSource.toString()}'
                AND "runAfter" < NOW()`;
            
            return `
                SELECT "Job"."id", "Job"."promptId", "Prompt"."content" as "promptContent"
                FROM "Job" JOIN "Prompt" ON "Job"."promptId" = "Prompt"."id"
                ${whereClause}
                ORDER BY "Job"."createdAt"
                LIMIT ${availableSlots}
                FOR UPDATE OF "Job" SKIP LOCKED
            `;
        }

        return await prisma.$transaction(async (tx) => {
            let jobs = await tx.$queryRawUnsafe<
                { id: string; promptId: string, promptContent: string }[]
            >(getQuery(JobStatus.PENDING));
            
            // get failed jobs if pending jobs are ready to retry (after 1 hour)
            if (jobs.length === 0) {
                jobs = await tx.$queryRawUnsafe<
                    { id: string; promptId: string, promptContent: string }[]
                >(getQuery(JobStatus.FAILED, `NOW() > "Job"."updatedAt" + INTERVAL '1 hour'`));
            }

            if (jobs.length === 0) return [];

            await tx.job.updateMany({
                where: { id: { in: jobs.map(job => job.id) } },
                data: { status: JobStatus.RUNNING },
            });
            
            return jobs;
        });
    }
}

export async function startJobExecutor(maxConcurrencyPerSource: number) {
    const { browser } = await launchRealChromeWithProfile();
    for (const [aiSource, ScraperService] of Object.entries(scraperServices)) {
        const executor = new Executor(new ScraperService(browser), aiSource as AISource, maxConcurrencyPerSource);
        executor.start();
    }
}