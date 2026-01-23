import { create } from "zustand";
import type { MentionWithBrand } from "@/types";

interface DashboardStore {
    citations: string[];
    mentions: MentionWithBrand[];
    currentCompanyMentions: MentionWithBrand[];
    responsesAnalyzed: number;
    setCitations: (citations: string[]) => void;
    setMentions: (mentions: MentionWithBrand[]) => void;
    setCurrentCompanyMentions: (currentCompanyMentions: MentionWithBrand[]) => void;
    setResponsesAnalyzed: (responsesAnalyzed: number) => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
    citations: [],
    mentions: [],
    currentCompanyMentions: [],
    responsesAnalyzed: 0,
    setCitations: (citations) => set({ citations }),
    setMentions: (mentions) => set({ mentions }),
    setCurrentCompanyMentions: (currentCompanyMentions) => set({ currentCompanyMentions }),
    setResponsesAnalyzed: (responsesAnalyzed) => set({ responsesAnalyzed }),
}));

export default useDashboardStore;