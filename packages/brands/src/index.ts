import type { Brand } from "@prompt-lens/db";
import prisma, { Sentiment } from "@prompt-lens/db";
import { env } from "@prompt-lens/env/server";
import { z } from "zod";
import axios from "axios";

const mentionObject = z.object({
    brand: z.string(),
    cleanName: z.string(),
    position: z.number(),
    sentiment: z.enum([Sentiment.negative, Sentiment.positive, Sentiment.neutral])
})
type Mention = z.infer<typeof mentionObject>;

type MentionWithBrand = Omit<Mention, "brand"> & {
    brand: Brand;
};

class BrandRegistry {
    private brandMap: Map<string, Brand>;
    private aliasMap: Map<string, string>;

    constructor() {
        // In-memory cache for fast lookups
        this.brandMap = new Map();
        this.aliasMap = new Map();
    }

    async initialize() {
        // canonical name is lowercase by default
        const brands = await prisma.brand.findMany();
        for (const brand of brands) {
            this.brandMap.set(brand.canonicalName, brand);

            for (const alias of brand.aliases) {
                this.aliasMap.set(alias.toLowerCase(), brand.canonicalName);
            }
            this.aliasMap.set(brand.displayName.toLowerCase(), brand.canonicalName);
        }
    }

    normalize(brandName: string): Brand | null {
        // get direct match and alias match
        const normalized = brandName.toLowerCase().trim();

        const directMatch = this.brandMap.get(normalized);
        if (directMatch) return directMatch;

        const aliasMatch = this.aliasMap.get(normalized);
        if (aliasMatch) return this.brandMap.get(aliasMatch) ?? null;

        return null;
    }

    async addBrand(brand: { canonicalName: string, displayName: string, category?: string, websiteUrl?: string, aliases?: string[] }) {
        // canonical name is used to query, must be lower cased

        brand.canonicalName = brand.canonicalName.toLowerCase()
        const existingBrand = await prisma.brand.findUnique({
            where: {
                canonicalName: brand.canonicalName,
            },
        });

        if (existingBrand) return existingBrand;

        try {
            const newBrand = await prisma.brand.create({
                data: brand,
            });

            this.brandMap.set(newBrand.canonicalName, newBrand);
            for (const alias of newBrand.aliases) {
                this.aliasMap.set(alias.toLowerCase(), newBrand.canonicalName);
            }
            return newBrand;
        } catch (error: any) {
            console.log("ERROR WAS CAUGHT ———————————————————————————————————————————————")
            // If unique constraint fails (another worker created it), fetch and return it
            if (error?.code === 'P2002') {
                const createdBrand = await prisma.brand.findUnique({
                    where: {
                        canonicalName: brand.canonicalName,
                    },
                });
                
                if (createdBrand) {
                    this.brandMap.set(createdBrand.canonicalName, createdBrand);
                    for (const alias of createdBrand.aliases) {
                        this.aliasMap.set(alias.toLowerCase(), createdBrand.canonicalName);
                    }
                    return createdBrand;
                }
            }
            // Re-throw if it's a different error
            throw error;
        }
    }

    async learnAlias(detectedName: string, canonicalBrandName: string) {
        canonicalBrandName = canonicalBrandName.toLowerCase();
        const normalized = detectedName.toLowerCase().trim();

        if (this.aliasMap.has(normalized)) return;

        await prisma.brand.update({
            where: {
                canonicalName: canonicalBrandName,
            },
            data: {
                aliases: {
                    push: detectedName,
                },
            },
        });

        this.aliasMap.set(normalized, canonicalBrandName);
    }

    async getMentionsWithBrands(mentions: Mention[], currentCategory: string = "") {
        const mentionWithBrands: MentionWithBrand[] = [];
        const brandsToAddQueries: Promise<void>[] = [];

        // set to track new brands that are added
        const newBrandCanonicalNames = new Set<string>();

        mentions.forEach(async (mention) => {
            let normalizedBrand = this.normalize(mention.brand);

            if (!normalizedBrand) {
                normalizedBrand = this.normalize(mention.cleanName);
            }

            if (normalizedBrand) {
                mentionWithBrands.push({
                    ...mention,
                    brand: normalizedBrand,
                });

                if (mention.brand.toLowerCase() !== normalizedBrand.displayName.toLowerCase()) {
                    await brandRegistry.learnAlias(mention.brand, normalizedBrand.canonicalName);
                }
            }
            else {
                // TODO: test this extensively
                brandsToAddQueries.push((async () => {
                    if (newBrandCanonicalNames.has(mention.cleanName)) return;

                    newBrandCanonicalNames.add(mention.cleanName);

                    const websiteUrl = await this.getBrandWebsiteUrl(mention.brand, currentCategory)
                    const newBrand = await this.addBrand({
                        canonicalName: mention.cleanName.toLowerCase(),
                        displayName: mention.brand,
                        aliases: [],
                        websiteUrl: websiteUrl || undefined,
                    })
                    mentionWithBrands.push({
                        ...mention,
                        brand: newBrand,
                    });
                })())
            }
        });

        await Promise.all(brandsToAddQueries);
        return mentionWithBrands;
    }

    async getBrandWebsiteUrl(brandDisplayName: string, category: string = ""): Promise<string | null> {
        const params = {
            api_key: env.SCRAPING_DOG_API_KEY,
            query: `${category} ${brandDisplayName} official website`.trim(),
            country: 'us',
            advance_search: 'false',
            domain: 'google.com',
            language: 'en'
        };
        try {
            const response = await axios.get('https://api.scrapingdog.com/google', { params });
            const link = (response.data.organic_results[0].link as string)
            if (!link) {
                return null
            }
            const url = new URL(link)
            return `${url.protocol}//${url.host}`
        } catch (error) {
            console.error("Error occured while getting the brand website url for ", brandDisplayName, error)        
            return null
        }
    }
}

export const brandRegistry = new BrandRegistry();