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
            // If unique constraint fails (another worker created it), fetch and return it
            if (error?.code === 'P2002') {
                // Could be canonicalName or displayName conflict
                let createdBrand = await prisma.brand.findUnique({
                    where: {
                        canonicalName: brand.canonicalName,
                    },
                });
                
                // If not found by canonicalName, try displayName
                if (!createdBrand) {
                    createdBrand = await prisma.brand.findUnique({
                        where: {
                            displayName: brand.displayName,
                        },
                    });
                }
                
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

    updateCache(brand: Brand) {
        this.brandMap.set(brand.canonicalName, brand);
        
        // Update alias mappings
        this.aliasMap.set(brand.displayName.toLowerCase(), brand.canonicalName);
        for (const alias of brand.aliases) {
            this.aliasMap.set(alias.toLowerCase(), brand.canonicalName);
        }
    }

    async getMentionsWithBrands(mentions: Mention[]) {
        const mentionWithBrands: MentionWithBrand[] = [];
        const brandsToAddQueries: Promise<void>[] = [];

        // set to track new brands that are added
        const newBrandCanonicalNames = new Set<string>();

        for(const mention of mentions) {
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
                // Brand not found in registry - create without website URL
                // The BrandEnricher will fetch website URLs asynchronously
                brandsToAddQueries.push((async () => {
                    if (newBrandCanonicalNames.has(mention.cleanName)) return;

                    newBrandCanonicalNames.add(mention.cleanName);

                    const newBrand = await this.addBrand({
                        canonicalName: mention.cleanName.toLowerCase(),
                        displayName: mention.brand,
                        aliases: [],
                        websiteUrl: undefined,
                    })
                    mentionWithBrands.push({
                        ...mention,
                        brand: newBrand,
                    });
                })())
            }
        };

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
        } catch (error: any) {
            if (error?.response?.status === 429) {
                console.error(`Rate limited while fetching website URL for ${brandDisplayName}`);
            } else {
                console.error("Error occured while getting the brand website url for ", brandDisplayName, error);
            }
            return null
        }
    }
}

export const brandRegistry = new BrandRegistry();

// Brand Enricher - Rate-limited website URL fetcher
class BrandEnricher {
    private running = true;
    private requestsPerSecond: number;
    private delayMs: number;

    constructor(requestsPerSecond: number = 10) {
        this.requestsPerSecond = requestsPerSecond;
        this.delayMs = 1000 / requestsPerSecond;
    }

    async start() {
        console.log(`BrandEnricher started (${this.requestsPerSecond} req/s)`);
        
        while (this.running) {
            try {
                // Fetch brands without website URLs
                const brandsToEnrich = await prisma.brand.findMany({
                    where: {
                        OR: [
                            { websiteUrl: null },
                            { websiteUrl: "" },
                        ],
                    },
                    take: 10, // Process in small batches
                    orderBy: {
                        createdAt: 'asc', // Oldest first
                    },
                });

                if (brandsToEnrich.length === 0) {
                    // No brands to enrich, wait longer before checking again
                    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
                    continue;
                }

                console.log(`Found ${brandsToEnrich.length} brands to enrich`);

                // Process each brand with rate limiting
                const websites = new Set<string>();

                for (const brand of brandsToEnrich) {
                    const startTime = Date.now();

                    try {
                        console.log(`Fetching website URL for: ${brand.displayName}`);
                        const websiteUrl = await brandRegistry.getBrandWebsiteUrl(
                            brand.displayName,
                            brand.category || ""
                        );

                        if (websiteUrl) {
                            websites.add(websiteUrl);
                            await prisma.brand.update({
                                where: { id: brand.id },
                                data: { websiteUrl },
                            });
                            console.log(`✓ Updated ${brand.displayName}: ${websiteUrl}`);
                            
                            // Update the in-memory cache
                            const updatedBrand = await prisma.brand.findUnique({
                                where: { id: brand.id }
                            });
                            if (updatedBrand) {
                                brandRegistry.updateCache(updatedBrand);
                            }
                        } else {
                            console.log(`✗ Could not find website URL for ${brand.displayName}`);
                        }
                    } catch (error) {
                        console.error(`Error enriching brand ${brand.displayName}:`, error);
                    }

                    // Rate limiting: wait for remaining time
                    const elapsed = Date.now() - startTime;
                    const waitTime = Math.max(0, this.delayMs - elapsed);
                    
                    if (waitTime > 0) {
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }
                }

                // After processing batch, merge brands with same website
                console.log(`\nChecking for duplicate brands across ${websites.size} websites...`);
                for (const websiteUrl of websites) {
                    await this.mergeBrandsWithSameWebsite(websiteUrl);
                }

            } catch (error) {
                console.error("Error in BrandEnricher:", error);
                // Wait a bit before retrying on error
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

    async mergeBrandsWithSameWebsite(websiteUrl: string) {
        // Find all brands with this website URL
        const brandsWithSameWebsite = await prisma.brand.findMany({
            where: { 
                websiteUrl,
                NOT: {
                    websiteUrl: "" // Exclude empty string (failed lookups)
                }
            },
            orderBy: { createdAt: 'asc' }, // First created is the primary
            include: {
                mentions: true // Include mentions to update them
            }
        });

        // If 0 or 1 brands, nothing to merge
        if (brandsWithSameWebsite.length <= 1) return;

        console.log(`Found ${brandsWithSameWebsite.length} brands with website ${websiteUrl}, merging...`);

        const primaryBrand = brandsWithSameWebsite[0]!;
        const brandsToMerge = brandsWithSameWebsite.slice(1);

        // Collect all aliases from all brands
        const allAliases = new Set<string>(primaryBrand.aliases);
        
        // Add all displayNames from merged brands to aliases
        for (const brand of brandsToMerge) {
            allAliases.add(brand.displayName);
            
            // Add all existing aliases from merged brands
            for (const alias of brand.aliases) {
                allAliases.add(alias);
            }
        }

        // Update primary brand with merged aliases
        await prisma.brand.update({
            where: { id: primaryBrand.id },
            data: {
                aliases: Array.from(allAliases)
            }
        });

        // Update all mentions from merged brands to point to primary brand
        for (const brand of brandsToMerge) {
            if (brand.mentions.length > 0) {
                await prisma.mention.updateMany({
                    where: { brandId: brand.id },
                    data: { brandId: primaryBrand.id }
                });
            }
        }

        // Delete the merged brands
        await prisma.brand.deleteMany({
            where: {
                id: { in: brandsToMerge.map(b => b.id) }
            }
        });

        // Update the in-memory cache with the merged brand
        const updatedBrand = await prisma.brand.findUnique({
            where: { id: primaryBrand.id }
        });
        
        // handles updating aliases from other brands
        if (updatedBrand) {
            brandRegistry.updateCache(updatedBrand);
        }

        console.log(`✓ Merged ${brandsToMerge.length} brands into "${primaryBrand.displayName}" (${primaryBrand.canonicalName})`);
        console.log(`  New aliases: ${Array.from(allAliases).join(', ')}`);
    }

    stop() {
        this.running = false;
    }
}

export async function startBrandEnricher(requestsPerSecond: number = 10) {
    const enricher = new BrandEnricher(requestsPerSecond);
    await enricher.start();
    return enricher;
}