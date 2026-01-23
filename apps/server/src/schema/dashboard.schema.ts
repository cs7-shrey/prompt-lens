import { z } from "zod";

export const getMentionSchema = z.object({
    companyId: z.string(),
    startDate: z.date(),
    endDate: z.date(),
})

export const getCitationSchema = z.object({
    trackingCompanyId: z.string(),
    startDate: z.date(),
    endDate: z.date(),
})

export const getHighLevelMetricsSchema = z.object({
    trackingCompanyId: z.string(),
})