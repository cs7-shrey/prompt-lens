import { protectedProcedure, router } from "..";
import { createTrackingCompanyAndMonitorSchema, extractDataFromWebsiteSchema } from "../schema/onboarding.schema";
import { scrapeWebsiteContent } from "@/utils/scrape";
import { extractCompanyData, getCompetitors, getPromptsToMonitorSuggestions } from "../services/company-info";
import prisma, { JobStatus, type JobCreateManyAndReturnArgs } from "@prompt-lens/db";
import { TRPCError } from "@trpc/server";
// import prisma, { JobStatus, type JobCreateManyAndReturnArgs } from "@prompt-lens/db";

export const onboardingRouter = router({
    extractDataFromWbsite: protectedProcedure.input(extractDataFromWebsiteSchema).query(async ({ input }) => {
        const content = await scrapeWebsiteContent(input.websiteUrl);
        const companyData = await extractCompanyData(content);
        const competitors = await getCompetitors(input.companyName, companyData);
        const promptSuggestions = await getPromptsToMonitorSuggestions(input.companyName, companyData)

        return {
            companyData: {
                ...companyData,
                name: input.companyName,
                websiteUrl: input.websiteUrl.toString().replace(/\/+$/, ''),
            },
            competitors,
            promptSuggestions
        };
    }),
    createTrackingCompanyAndMonitor: protectedProcedure.input(createTrackingCompanyAndMonitorSchema)
        .mutation(async ({ input, ctx }) => {
            const user = ctx.user;
            const existingTrackingCompany = await prisma.trackingCompany.findFirst({
                where: {
                    userId: user.id
                }
            })

            if (existingTrackingCompany) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User already has a tracking company"
                })
            }

            console.log(input);

            const { company: { companyName: name, ...company }, competitors, promptsToMonitor, sourcesToMonitor } = input;
            company.websiteUrl = company.websiteUrl.replace(/\/+$/, "")

            await prisma.$transaction(async (tx) => {
                const dbTrackingCompany = await tx.trackingCompany.create({
                    data: {
                        name,
                        url: company.websiteUrl,
                        shortDescription: company.shortDescription,
                        fullDescription: company.fullDescription,
                        keyFeatures: company.keyFeatures,
                        userId: user.id
                    }
                })
                await tx.competitor.createMany({
                    data: competitors.map((competitor) => {
                        return {
                            name: competitor.name,
                            url: competitor.websiteUrl,
                            trackingCompanyId: dbTrackingCompany.id
                        }
                    })
                })
                const dbMonitor = await tx.monitor.create({
                    data: {
                        name: `First ${name} Monitor`,
                        aiSources: sourcesToMonitor,
                        trackingCompanyId: dbTrackingCompany.id
                    }
                })
                const dbPrompts = await tx.prompt.createManyAndReturn({
                    data: promptsToMonitor.map((content: string) => {
                        return {
                            content,
                            monitorId: dbMonitor.id,
                        }
                    })
                })
                const createJobs: JobCreateManyAndReturnArgs["data"] = []
                const currentTime = new Date()
                for (const prompt of dbPrompts) {
                    for(const source of sourcesToMonitor) {
                        createJobs.push({
                            aiSource: source,
                            promptId: prompt.id,
                            status: JobStatus.PENDING,
                            runAfter: currentTime
                        })
                    }
                }
                await tx.job.createMany({
                    data: createJobs
                })
            })
        }),
    isCompleted: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.user;

        const trackingCompany = await prisma.trackingCompany.findFirst({
            where: {
                userId: user.id
            }
        })

        let completed = trackingCompany !== null
        return {
            isCompleted: completed
        }
    })
})