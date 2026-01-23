import { safeMembershipCheck } from "@/utils";
import type { Prisma } from "@prompt-lens/db";
import type { TrackingCompany } from "@prompt-lens/db";

export const getCurrentCompanyMentions = (trackingCompany: TrackingCompany, mentions: Prisma.MentionGetPayload<{ include: { brand: true } }>[]) => {
    const relevantMentions = []
    for(const mention of mentions) {
        let isRelevant = safeMembershipCheck(trackingCompany.name, mention.brand.aliases)
        isRelevant = isRelevant || trackingCompany.name.toLowerCase() == mention.brand.displayName.toLowerCase()
        isRelevant = isRelevant || trackingCompany.name.toLowerCase() == mention.brand.canonicalName.toLowerCase()
        isRelevant = isRelevant || trackingCompany.url.toLowerCase() == mention.brand.websiteUrl?.toLowerCase()

        if (isRelevant) {
            relevantMentions.push(mention)
        }
    }
    return relevantMentions;
}