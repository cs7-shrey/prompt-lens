import prisma, { Prisma, type TrackingCompany } from "@prompt-lens/db";
import { protectedProcedure, router } from "..";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getCurrentCompanyMentions } from "../services/company-analytics";

export const promptRouter = router({
    getAllPromptsWithAnalytics: protectedProcedure.input(z.object({
        trackingCompanyId: z.string(),
    })).query(async ({ input, ctx }) => {
        const user = ctx.user;

        const trackingCompanyId = input.trackingCompanyId;

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

        const prompts = await getPrompts(trackingCompanyId);

        const promptsWithRelevantMentions = getPromptsWithRelevantMentions(company, prompts);

        return {
            prompts: promptsWithRelevantMentions
        }
    })
})

const getPrompts = async (trackingCompanyId: string) => {
    return await prisma.prompt.findMany({
        where: {
            monitor: {
                trackingCompanyId: trackingCompanyId
            }
        },
        include: {
            responses: {
                include: {
                    mentions: {
                        include: {
                            brand: true
                        }
                    }
                }
            }
        }
    })
}

const getPromptsWithRelevantMentions = (trackingCompany: TrackingCompany, prompts: Prisma.PromptGetPayload<{ include: { responses: { include: { mentions: { include: { brand: true } } } } } }>[]) => {
    const promptsWithRelevantMentions = [];
    for(const prompt of prompts) {
        const mentions = prompt.responses.flatMap(response => response.mentions);
        const relevantMentions = getCurrentCompanyMentions(trackingCompany, mentions);
        promptsWithRelevantMentions.push({
            ...prompt,
            relevantMentions
        })
    }
    return promptsWithRelevantMentions;
}