import { create } from "zustand";
import type { PromptWithRelevantMentions } from "@/types";

interface PromptStore {
    prompts: PromptWithRelevantMentions[];
    setPrompts: (prompts: PromptWithRelevantMentions[]) => void;
}

const usePromptStore = create<PromptStore>((set) => ({
    prompts: [],
    setPrompts: (prompts) => set({ prompts }),
}));

export default usePromptStore;