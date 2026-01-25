import { type Request, type Response } from "express";
import prisma from "@prompt-lens/db";
import { getMentionSchema, getCitationSchema } from "../schema/dashboard.schema";
import { z } from "zod";
import { getCurrentCompanyMentions } from "@/services/company-analytics";

export const getAllAndRelevantMentions = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const { trackingCompanyId, startDate, endDate } = req.body as z.infer<typeof getMentionSchema>

        const company = await prisma.trackingCompany.findUnique({
            where: {
                id: trackingCompanyId,
                userId: user.id
            }
        })
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
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

        return res.status(200).json({
            mentions,
            currentCompanyMentions: relevantMentions,
            responsesAnalyzed: new Set(mentions.map(m => m.responseId)).size
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getCitations = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const { trackingCompanyId, startDate, endDate } = req.body as z.infer<typeof getCitationSchema>
        const company = await prisma.trackingCompany.findUnique({
            where: {
                id: trackingCompanyId,
                userId: user.id
            }
        })
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
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

        return res.status(200).json({
            citations
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
