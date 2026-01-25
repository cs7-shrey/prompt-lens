import { z } from "zod";

export const getAllResponsesPaginatedSchema = z.object({
    trackingCompanyId: z.string(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(15),
})

export const getResponseByPromptIdPaginatedSchema = getAllResponsesPaginatedSchema.extend({
    promptId: z.string(),
})