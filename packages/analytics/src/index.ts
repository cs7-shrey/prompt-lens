import prisma, { AnalyticsStatus, Sentiment, type MentionCreateManyInput, type Response } from "@prompt-lens/db";
import { brandRegistry } from "@prompt-lens/brands";
import { generateText, Output } from "ai";
import { anthropic } from '@ai-sdk/anthropic';

import { z } from "zod";

// brand -> exact name of the brand as mentioned in the response
// cleanName -> best effort at extracting a consistent name for the brand

const mentionObject = z.object({
    brand: z.string(),
    cleanName: z.string(),
    position: z.number(),
    sentiment: z.enum([Sentiment.negative, Sentiment.positive, Sentiment.neutral])
})

const mentionSchema = z.object({
    mentions: z.array(mentionObject)
});

export class Analytics {
    constructor() {}

    async analyseResponse(response: Response) {
        // TODO: This only gets one mention per brand for now,
        // later, search the response for the brand name, and manually populate the rankings
        // such that consequent occurences are skipped for ranking but discontinous ones are counted

        const mentions = await this.extractMentions(response)
        const fullResponse = await prisma.prompt.findFirstOrThrow({
            where: {
                id: response.promptId,
            },
            select:  {
                monitor: {
                    select: {
                        trackingCompany: {
                            select: {
                                industry: true
                            }
                        }
                    }
                }
            }
        })

        const category = fullResponse.monitor.trackingCompany.industry || ""

        const mentionWithBrands = await brandRegistry.getMentionsWithBrands(mentions, category);
        const dbMentionAddObjects: MentionCreateManyInput[] = mentionWithBrands.map((mention) => {
            return {
                position: mention.position,
                sentiment: mention.sentiment,
                mentionScore: this.calculateMentionScore({          // 0 to 1
                    position: mention.position,
                    sentiment: mention.sentiment,
                }),
                responseId: response.id,
                brandId: mention.brand.id,
            }
        })

        await prisma.mention.createMany({
            data: dbMentionAddObjects,
        })
    }

    private calculateMentionScore(mention: {
        position: number;
        sentiment: Sentiment;
      }): number {
        const { position, sentiment } = mention;
      
        // Defensive: position should never be < 1
        if (position < 1) {
          throw new Error("Position must be >= 1");
        }
      
        const positionWeight = 1 / position;
      
        const sentimentWeightMap: Record<Sentiment, number> = {
          [Sentiment.positive]: 1.0,
          [Sentiment.neutral]: 0.6,
          [Sentiment.negative]: 0.2,
        };
      
        const sentimentWeight = sentimentWeightMap[sentiment];
      
        return positionWeight * sentimentWeight;
      }
      
    private async extractMentions(response: Response) {
        const { output } = await generateText({
            model: anthropic("claude-3-5-haiku-20241022"),
            prompt: this.getFullPrompt(response),
            output: Output.object({
                schema: mentionSchema
            })
        })

        return output.mentions
    }

    private getFullPrompt(response: Response) {
        return `You are a brand mention extraction specialist. Your task is to analyze AI-generated responses and identify brands that are being recommended, compared, or evaluated as solutions.

# Task
Extract commercial products, services, and companies that are presented as solutions, recommendations, or alternatives. For each mention, provide:
1. The exact brand name as it appears in the text
2. A clean, normalized version of the brand name
3. The position in which it was mentioned (1 for first mention, 2 for second, etc.)
4. The sentiment with which it was mentioned

# Core Principle
**Extract brands that are ANSWERS to the user's question, not technical tools mentioned in passing.**

Think: "If someone asked 'What should I use?', which brands are being suggested?"

## What TO Extract
- **Product/Service Brands**: Any commercial product, platform, or service being recommended or compared
- **Company Names**: When representing their products/services (e.g., "OpenAI", "Salesforce", "HubSpot")
- **SaaS Platforms**: Software tools, applications, platforms across ANY industry
- **Alternative Solutions**: Competing products mentioned for comparison
- **Examples**: Maxim AI, Helicone, Promptfoo, Arize, Langfuse, LangSmith, LangChain, Slack, Asana, Notion, Stripe, Shopify

## What NOT to Extract
**Infrastructure & Development Tools** (unless they're the main subject):
- CI/CD Tools: GitHub Actions, Jenkins, CircleCI, GitLab CI, Travis CI
- Containers/Orchestration: Docker, Kubernetes, Podman
- IaC Tools: Terraform, Ansible, Puppet, Chef
- Version Control: Git, GitHub, GitLab (when mentioned as integration points)
- Build Tools: Webpack, Vite, Rollup, Maven, Gradle

**Languages, Frameworks & Libraries**:
- Programming Languages: Python, JavaScript, TypeScript, Java, Go, Rust
- Frameworks: React, Vue, Angular, Django, Rails, Express
- Libraries: lodash, numpy, pandas (unless the response is about choosing libraries)

**Protocols, Standards & Generic Terms**:
- Protocols: REST, GraphQL, HTTP, WebSocket, MQTT
- Formats: JSON, YAML, XML, CSV
- Generic Concepts: API, SDK, CLI, UI, DevOps, MLOps, CI/CD

## Critical Distinction
Ask yourself: **"Is this brand a solution being recommended, or just mentioned as a technical detail?"**

✅ EXTRACT: "Maxim AI is better than Arize for agent monitoring"
→ Extract: Maxim AI, Arize

✅ EXTRACT: "We recommend Slack for team communication"  
→ Extract: Slack

❌ DON'T EXTRACT: "Maxim integrates with GitHub Actions and Jenkins"
→ Extract ONLY: Maxim AI (GitHub Actions and Jenkins are integration points, not solutions)

❌ DON'T EXTRACT: "Built with Python and TypeScript using the Stripe SDK"
→ Extract ONLY: Stripe (Python/TypeScript are languages, not products being recommended)

## Position Assignment
- Position represents the ORDER in which brands are first mentioned in the response
- First brand mentioned = position 1, second = position 2, etc.
- If a brand is mentioned multiple times, only count its FIRST occurrence
- Position should be sequential with no gaps (1, 2, 3, 4...)

## Sentiment Analysis
- Analyze the sentiment/tone with which each brand is mentioned:
  - **positive**: Brand is recommended, praised, or presented favorably (e.g., "I recommend X", "X is excellent", "X is a great choice")
  - **negative**: Brand is criticized, discouraged, or presented unfavorably (e.g., "avoid X", "X has issues", "X is not recommended")
  - **neutral**: Brand is mentioned factually without clear positive or negative framing (e.g., "X also offers this", "you could use X", "X is an option")
- Consider the CONTEXT around the mention, not just individual words
- If a brand is mentioned with mixed sentiment, choose the dominant sentiment
- Err on the side of neutral if sentiment is ambiguous

## Name Normalization (cleanName)
- Extract a consistent, canonical form of the brand name:
  - Remove unnecessary articles, punctuation, or formatting
  - Use the official brand capitalization (e.g., "iPhone" not "iphone", "ChatGPT" not "Chat GPT")
  - Use the most common/recognizable form of the name
  - For products, include the parent brand if relevant (e.g., "Google Cloud Platform" not just "Cloud Platform")
  - Remove version numbers or model variants (e.g., "iPhone" not "iPhone 15 Pro")
- The cleanName should be what you'd use to group all mentions of this brand across different responses

## Important Notes
- Be thorough - missing brand mentions is worse than including borderline cases
- The response text may be recommending alternatives, listing options, or comparing solutions
- Pay attention to implicit mentions (e.g., "their cloud platform" right after mentioning "Google" likely refers to "Google Cloud")
- Only extract direct mentions, not implicit references without a clear brand name

# Response to Analyze
${response.content}

# Output Format
Return a JSON array where each object contains:
- brand: exact text as it appears in the response
- cleanName: normalized brand name
- position: integer (1, 2, 3...)
- sentiment: "positive", "negative", or "neutral"

If no brands are mentioned, return an empty array.`
    }
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

class AnalyticsRunner {
    private semaphore: Semaphore;
    private running = true;
    private analytics: Analytics;

    constructor(maxConcurrency: number) {
        this.semaphore = new Semaphore(maxConcurrency);
        this.analytics = new Analytics();
    }

    async start() {
        console.log("AnalyticsRunner started");
        while (this.running) {
            const availableSlots = this.semaphore.available();

            if (availableSlots > 0) {
                const responses = await this.fetchAndLockResponses(availableSlots);
                for (const response of responses) {
                    this.runAnalysis(response);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    stop() {
        this.running = false;
    }

    private async runAnalysis(response: Response) {
        await this.semaphore.acquire();

        (async () => {
            try {
                console.log(`Analyzing response ${response.id}`);
                await this.analytics.analyseResponse(response);

                await prisma.response.update({
                    where: { id: response.id },
                    data: { 
                        analyticsStatus: AnalyticsStatus.COMPLETED,
                        analysedAt: new Date()
                    },
                });
                console.log(`Successfully analyzed response ${response.id}`);
            } catch (err) {
                console.error(`Failed to analyze response ${response.id}:`, err);
                await prisma.response.update({
                    where: { id: response.id },
                    data: { analyticsStatus: AnalyticsStatus.FAILED },
                });
            } finally {
                this.semaphore.release();
            }
        })();
    }

    private async fetchAndLockResponses(availableSlots: number): Promise<Response[]> {
        return await prisma.$transaction(async (tx) => {
            const responses = await tx.$queryRaw<
                { 
                    id: string; 
                    content: string; 
                    citations: string[];
                    aiSource: string;
                    promptId: string;
                    analyticsStatus: string;
                    createdAt: Date;
                    updatedAt: Date;
                    analysedAt: Date | null;
                }[]
            >`
                SELECT "id", "content", "citations", "aiSource", "promptId", "analyticsStatus", "createdAt", "updatedAt", "analysedAt"
                FROM "Response"
                WHERE "analyticsStatus" = ${AnalyticsStatus.PENDING.toString()}
                ORDER BY "createdAt"
                LIMIT ${availableSlots}
                FOR UPDATE OF "Response" SKIP LOCKED
            `;
            
            if (responses.length === 0) return []

            await tx.response.updateMany({
                where: { id: { in: responses.map(r => r.id) } },
                data: { analyticsStatus: AnalyticsStatus.RUNNING },
            });
            
            return responses as Response[];
        }, {
            maxWait: 5000,
            timeout: 10000,
        });
    }
}

export async function startAnalyticsRunner(maxConcurrency: number = 5) {
    const runner = new AnalyticsRunner(maxConcurrency);
    await runner.start();
    return runner;
}