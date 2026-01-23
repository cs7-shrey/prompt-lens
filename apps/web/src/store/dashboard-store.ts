import { create } from "zustand";
import type { MentionWithBrand } from "@/types";
import type { Brand } from "@prompt-lens/common-types";
import { useCompanyStore } from "./company-store";
import { getCurrentCompanyCitations } from "@/lib/metrics";

interface DashboardStore {
    citations: string[];
    mentions: MentionWithBrand[];
    currentCompanyMentions: MentionWithBrand[];
    responsesAnalyzed: number;

    impersonatingBrand: Brand | null;
    setImpersonatingBrand: (impersonatingBrand: Brand | null) => void;

    setCitations: (citations: string[]) => void;
    setMentions: (mentions: MentionWithBrand[]) => void;
    setCurrentCompanyMentions: (currentCompanyMentions: MentionWithBrand[]) => void;
    setResponsesAnalyzed: (responsesAnalyzed: number) => void;

    getCurrentCompanyMentions: () => MentionWithBrand[];
    getCurrentCompanyCitations: () => string[];
}

const useDashboardStore = create<DashboardStore>((set, get) => ({
    citations: [],
    mentions: [],
    currentCompanyMentions: [],
    responsesAnalyzed: 0,
    impersonatingBrand: null,

    setImpersonatingBrand: (impersonatingBrand) => set({ impersonatingBrand }),
    setCitations: (citations) => set({ citations }),
    setMentions: (mentions) => set({ mentions }),
    setCurrentCompanyMentions: (currentCompanyMentions) => set({ currentCompanyMentions }),
    setResponsesAnalyzed: (responsesAnalyzed) => set({ responsesAnalyzed }),

    getCurrentCompanyMentions: () => {
        const { mentions, currentCompanyMentions, impersonatingBrand } = get();
        if (impersonatingBrand != null) {
            return mentions.filter((mention) => mention.brand.id === impersonatingBrand.id);
        }
        return currentCompanyMentions;
    },
    getCurrentCompanyCitations: () => {
        const { citations, impersonatingBrand } = get();
        const currentCompany = useCompanyStore.getState().currentCompany;

        if (currentCompany == null) {
            return [];
        }

        const websiteUrlToUse = impersonatingBrand ? impersonatingBrand.websiteUrl : currentCompany.url;
        if (!websiteUrlToUse) return []

        return getCurrentCompanyCitations(citations, websiteUrlToUse);
    }
}));

export default useDashboardStore;