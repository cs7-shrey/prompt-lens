import { z } from "zod";

export const getMentionSchema = z.object({
    trackingCompanyId: z.string(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
})

export const getCitationSchema = z.object({
    trackingCompanyId: z.string(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
})

export const getHighLevelMetricsSchema = z.object({
    trackingCompanyId: z.string(),
})