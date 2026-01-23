import type { MentionWithBrand } from "@/types";
import { Sentiment } from "@prompt-lens/common-types";

export const getCurrentCompanyCitations = (citations: string[], websiteUrl: string) => {
    const urlObject = new URL(websiteUrl);
    let currentCompanyCitations: string[] = [];

    for(const citation of citations) {
        const citationUrlObject = new URL(citation);
        if(citationUrlObject.hostname === urlObject.hostname) {
            currentCompanyCitations.push(citation);
        }
    }

    return currentCompanyCitations;
}

export const getMentionScoreAccumulative = (relevantMentions: MentionWithBrand[], responsesAnalyzed: number) => {
    if (responsesAnalyzed == 0) return 0;
    const mentionScoreSum = relevantMentions.reduce((acc, mention) => acc + mention.mentionScore, 0)
    return mentionScoreSum / responsesAnalyzed
}

export const getSentimentScoreAccumulative = (relevantMentions: MentionWithBrand[]) => {
    const sentimentScoreSum = relevantMentions.reduce((acc, mention) => acc + sentimentToScore(mention.sentiment as unknown as Sentiment), 0)
    return sentimentScoreSum / relevantMentions.length
}

export const sentimentToScore = (sentiment: Sentiment) => {
    switch (sentiment) {
        case Sentiment.positive:
            return 1;
        case Sentiment.neutral:
            return 0.5;
        case Sentiment.negative:
            return 0;
    }
}