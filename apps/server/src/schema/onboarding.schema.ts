import { AISource } from "@prompt-lens/db";
import { z } from "zod";

export const extractDataFromWebsiteSchema = z.object({
    companyName: z.string(),
    websiteUrl: z.url(),
});

export const companyDataSchema = z.object({
    shortDescription: z.string(),
    fullDescription: z.string(),
    category: z.string(),
    keyFeatures: z.array(z.string())
})


export const createTrackingCompanyAndMonitorSchema = z.object({
    company: companyDataSchema.extend(extractDataFromWebsiteSchema.shape),
    promptsToMonitor: z.array(z.string()),
    sourcesToMonitor: z.array(z.enum(AISource))
})