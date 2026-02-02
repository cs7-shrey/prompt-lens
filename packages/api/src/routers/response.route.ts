import { getAllResponsesPaginatedSchema, getResponseByPromptIdPaginatedSchema } from "../schema/response.schema";
import { protectedProcedure, router } from "..";
import type { TrackingCompany } from "@prompt-lens/db";
import prisma from "@prompt-lens/db";
import { z } from "zod";
import { getCurrentCompanyMentions } from "../services/company-analytics";
import { TRPCError } from "@trpc/server";

export const responseRouter = router({
    getAllResponsesPaginated: protectedProcedure.input(getAllResponsesPaginatedSchema).query(async ({ input, ctx }) => {
        const user = ctx.user;
        const { trackingCompanyId, startDate, endDate, page, limit } = input;

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

        const { responses, totalCount, totalPages } = await getPaginatedResponses({
            trackingCompany: company,
            startDate,
            endDate,
            page,
            limit,
        });

        return {
            responses,
            page,
            limit,
            totalPages,
            totalCount,
        }
    }),
    getResponseByPromptIdPaginated: protectedProcedure.input(getResponseByPromptIdPaginatedSchema)
        .query(async ({ input, ctx }) => {
            const user = ctx.user;

            const { trackingCompanyId, promptId, startDate, endDate, page, limit } = input;
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

            const { responses, totalCount, totalPages } = await getPaginatedResponses({
                trackingCompany: company,
                promptId,
                startDate,
                endDate,
                page,
                limit,
            });

            return {
                responses,
                page,
                limit,
                totalPages,
                totalCount,
            }
        })
})

const getPaginatedResponses = async ({
    trackingCompany,
    promptId,
    startDate,
    endDate,
    page,
    limit,
}: Omit<z.infer<typeof getAllResponsesPaginatedSchema>, "trackingCompanyId"> & 
{ promptId?: string } & {
    trackingCompany: TrackingCompany
}
) => {
    const promptIdFilter = promptId ? { id: promptId } : {};
    const trackingCompanyId = trackingCompany.id;

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
                relevantMentions: getCurrentCompanyMentions(trackingCompany, res.mentions)
            }
        }),
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
    }
}