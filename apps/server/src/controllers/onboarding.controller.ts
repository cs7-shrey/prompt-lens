import type { Request, Response } from "express";
import { createTrackingCompanyAndMonitorSchema, extractDataFromWebsiteSchema } from "../schema/onboarding.schema";
import { z } from "zod";
import { scrapeWebsiteContent } from "../utils/scrape";
import { extractCompanyData, getCompetitors, getPromptsToMonitorSuggestions } from "../services/company-info";
import prisma from "@prompt-lens/db";

// authenticated but no need to 
export const extractDataFromWebsite = async (req: Request, res: Response) => {
    try {
        const body = req.body as z.infer<typeof extractDataFromWebsiteSchema>;
        const content = await scrapeWebsiteContent(body.websiteUrl);
        const companyData = await extractCompanyData(content);
        const competitors = await getCompetitors(body.companyName, companyData);
        const promptSuggestions = await getPromptsToMonitorSuggestions(body.companyName, companyData)

        return res.status(200).json({
            companyData: {
                ...companyData,
                name: body.companyName,
                websiteUrl: body.websiteUrl.toString(),
            },
            competitors,
            promptSuggestions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Onboarding request
export const createTrackingCompanyAndMonitor = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const { company: { companyName: name, ...company }, promptsToMonitor, sourcesToMonitor } = req.body as z.infer<typeof createTrackingCompanyAndMonitorSchema>;
        const existingCompany = await prisma.trackingCompany.findUnique({
            where: {
                url: company.websiteUrl,
            }
        })

        if (existingCompany) {
            return res.status(400).json({ message: "Invalid request" })
        }

        await prisma.$transaction(async (tx) => {
            const dbTrackingCompany = await tx.trackingCompany.create({
                data: {
                    name,
                    url: company.websiteUrl,
                    shortDescription: company.shortDescription,
                    fullDescription: company.fullDescription,
                    keyFeatures: company.keyFeatures,
                    userId: user.id
                }
            })
            const dbMonitor = await tx.monitor.create({
                data: {
                    name: `First ${name} Monitor`,
                    aiSources: sourcesToMonitor,
                    trackingCompanyId: dbTrackingCompany.id
                }
            })
            await tx.prompt.createMany({
                data: promptsToMonitor.map((content: string) => {
                    return {
                        content,
                        monitorId: dbMonitor.id,
                    }
                })
            })
        })

        return res.status(201).json({ 
            message: "Tracking company and monitor created successfully" 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}