import prisma, { Prisma, type TrackingCompany } from "@prompt-lens/db";
import type { Request, Response } from "express";
import { getCurrentCompanyMentions } from "@/services/company-analytics";

export const getAllPromptsWithAnalytics = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const trackingCompanyId = req.params.trackingCompanyId as string | undefined;
        if (!trackingCompanyId) {
            return res.status(400).json({ message: "Tracking company ID is required" });
        }

        const company = await prisma.trackingCompany.findUnique({
            where: {
                id: trackingCompanyId,
                userId: user.id
            }
        })
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        const prompts = await getPrompts(trackingCompanyId);

        const promptsWithRelevantMentions = getPromptsWithRelevantMentions(company, prompts);

        return res.status(200).json({
            prompts: promptsWithRelevantMentions
        })
    } catch (error) {
        console.error(error);
        
    }
}
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