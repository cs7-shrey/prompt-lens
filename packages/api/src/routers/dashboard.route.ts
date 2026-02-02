import { getCitationSchema, getMentionSchema } from "../schema/dashboard.schema";
import { protectedProcedure, router } from "..";
import prisma from "@prompt-lens/db";
import { getCurrentCompanyMentions } from "../services/company-analytics";
import { TRPCError } from "@trpc/server";

export const dashboardRouter = router({
    getAllAndRelevantMentions: protectedProcedure.input(getMentionSchema).query(async ({ input, ctx }) => {
        const user = ctx.user;
        const { trackingCompanyId, startDate, endDate } = input

        const company = await prisma.trackingCompany.findUnique({
            where: {
                id: trackingCompanyId,
                userId: user.id
            }
        })
        if (!company) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Could not find the given company"
            })
        }

        const mentions = await prisma.mention.findMany({
            where: {
                response: {
                    prompt: {
                        monitor: {
                            trackingCompanyId: trackingCompanyId
                        }
                    }
                },
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                brand: true
            }
        })

        // get relevant mentions
        const relevantMentions = getCurrentCompanyMentions(company, mentions)

        return {
            mentions,
            currentCompanyMentions: relevantMentions,
            responsesAnalyzed: new Set(mentions.map(m => m.responseId)).size
        }
    }),
    getCitations: protectedProcedure.input(getCitationSchema).query(async ({ input, ctx }) => {
        const user = ctx.user;

        const { trackingCompanyId, startDate, endDate } = input;
        const company = await prisma.trackingCompany.findUnique({
            where: {
                id: trackingCompanyId,
                userId: user.id
            }
        })
        if (!company) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Could not find the given company"
            })
        }

        const responses = await prisma.response.findMany({
            select: {
                citations: true
            },
            where: {
                prompt: {
                    monitor: {
                        trackingCompanyId: trackingCompanyId
                    }
                },
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
        })

        const citations = responses.map(response => response.citations).flat();

        return {
            citations
        }
    })
})