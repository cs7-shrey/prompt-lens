import { fetchPrompts } from "@/lib/api";
import { getMentionScoreAccumulative, getSentimentScoreAccumulative } from "@/lib/metrics";
import { useCompanyStore } from "@/store/company-store";
import usePromptStore from "@/store/prompt-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const usePrompts = () => {
    const { prompts, setPrompts } = usePromptStore();
    const { currentCompany } = useCompanyStore();
    const [visibilityAndSentimentMap, setVisibilityAndSentimentMap] = useState<Record<string, { visibility: number; sentiment: number }>>({});

    const { data: promptsData, isLoading: isPromptsLoading, isError: isPromptsError } = useQuery({
        queryKey: ['prompts', currentCompany?.id],
        queryFn: () => {
            if (currentCompany?.id) {
                return fetchPrompts(currentCompany.id);
            }
            return [];
        },
    });

    useEffect(() => {
        if (promptsData) {
            console.log(promptsData);
            setPrompts(promptsData);
            for(const prompt of promptsData) {
                const relevantMentions = prompt.relevantMentions;
                const mentionScore = getMentionScoreAccumulative(relevantMentions, prompt.responses.length);
                setVisibilityAndSentimentMap(prev => ({
                    ...prev,
                    [prompt.id]: {
                        visibility: mentionScore,
                        sentiment: getSentimentScoreAccumulative(relevantMentions)
                    }
                }));
            }
        }
    }, [promptsData])

    return { prompts, isPromptsLoading, isPromptsError };
}

export default usePrompts;