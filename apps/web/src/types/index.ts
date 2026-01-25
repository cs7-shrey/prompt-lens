import type { Mention, Brand, Prompt, Response } from "@prompt-lens/common-types";

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

export type ResponseWithMentionsAndPrompt = ResponseWithMentions & {
    prompt: Prompt;
    relevantMentions: MentionWithBrand[]
}

export interface FetchResponsesResponse {
    responses: ResponseWithMentionsAndPrompt[];
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
}