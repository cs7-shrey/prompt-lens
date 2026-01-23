import type { Mention, Brand } from "@prompt-lens/common-types";

export type MentionWithBrand = Mention & {
    brand: Brand;
};

export interface GetMentionsResponse {
    mentions: MentionWithBrand[];
    currentCompanyMentions: MentionWithBrand[];
    responsesAnalyzed: number;
}
