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

export const competitorSchema = z.object({
    websiteUrl: z.url(),
    name: z.string()
})


export const createTrackingCompanyAndMonitorSchema = z.object({
    company: companyDataSchema.extend(extractDataFromWebsiteSchema.shape),
    competitors: z.array(competitorSchema).max(10),
    promptsToMonitor: z.array(z.string()).min(1).max(10).refine(
        (prompts) => new Set(prompts).size === prompts.length,
        { message: "Prompts must be unique" }
    ),
    sourcesToMonitor: z.array(z.enum(AISource)).min(1).max(3).refine(
        (sources) => new Set(sources).size === sources.length,
        { message: "Source values must be unique" }
    )
})