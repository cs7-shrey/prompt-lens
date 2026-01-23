import { z } from "zod";

export const getAllPromptsSchema = z.object({
    trackingCompanyId: z.string(),
})

export const getPromptAnalyticsSchema = z.object({
    promptIds: z.array(z.string()),
})