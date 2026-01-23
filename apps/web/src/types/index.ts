import type { Mention, Brand, Prompt } from "@prompt-lens/common-types";

export type MentionWithBrand = Mention & {
    brand: Brand;
};

export type ResponseWithMentions = Response & {
    mentions: MentionWithBrand[];
}

export type PromptsWithResponseAndMentions = Prompt & {
    responses: ResponseWithMentions[];
}

export type PromptWithRelevantMentions = PromptsWithResponseAndMentions & {
    relevantMentions: MentionWithBrand[];
}

export interface GetMentionsResponse {
    mentions: MentionWithBrand[];
    currentCompanyMentions: MentionWithBrand[];
    responsesAnalyzed: number;
}
