import { type Request, type Response } from "express";
import prisma, { type TrackingCompany } from "@prompt-lens/db";
import { z } from "zod";
import { getAllResponsesPaginatedSchema, getResponseByPromptIdPaginatedSchema } from "../schema/response.schema";
import { getCurrentCompanyMentions } from "@/services/company-analytics";

export const getAllResponsesPaginated = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const { trackingCompanyId, startDate, endDate, page, limit } = req.body as z.infer<typeof getAllResponsesPaginatedSchema>;
        const company = await prisma.trackingCompany.findUnique({
            where: {
                id: trackingCompanyId,
                userId: user.id
            }
        })
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const { responses, totalCount, totalPages } = await getPaginatedResponses({
            trackingComapny: company,
            startDate,
            endDate,
            page,
            limit,
        });

        return res.json({
            responses,
            page,
            limit,
            totalPages,
            totalCount,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getResponseByPromptIdPaginated = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const { trackingCompanyId, promptId, startDate, endDate, page, limit } = req.body as z.infer<typeof getResponseByPromptIdPaginatedSchema>;
        const company = await prisma.trackingCompany.findUnique({
            where: {
                id: trackingCompanyId,
                userId: user.id
            }
        })
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const { responses, totalCount, totalPages } = await getPaginatedResponses({
            trackingComapny: company,
            promptId,
            startDate,
            endDate,
            page,
            limit,
        });

        return res.json({
            responses,
            page,
            limit,
            totalPages,
            totalCount,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getPaginatedResponses = async ({
    trackingComapny,
    promptId,
    startDate,
    endDate,
    page,
    limit,
}: Omit<z.infer<typeof getAllResponsesPaginatedSchema>, "trackingCompanyId"> & 
{ promptId?: string } & {
    trackingComapny: TrackingCompany
}
) => {
    const promptIdFilter = promptId ? { id: promptId } : {};
    const trackingCompanyId = trackingComapny.id;

    const responsesPromise = prisma.response.findMany({
        where: {
            prompt: {
                monitor: { trackingCompanyId: trackingCompanyId },
                ...promptIdFilter
            },
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
            prompt: true,
            mentions: {
                include: {
                    brand: true
                }
            }
        }
    })
    const totalCountPromise = prisma.response.count({
        where: {
            prompt: {
                monitor: { trackingCompanyId: trackingCompanyId },
                ...promptIdFilter
            },
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        }
    })

    const [responses, totalCount] = await Promise.all([responsesPromise, totalCountPromise]);
    return {
        responses: responses.map(res => {
            return {
                ...res,
                relevantMentions: getCurrentCompanyMentions(trackingComapny, res.mentions)
            }
        }),
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
    }
}