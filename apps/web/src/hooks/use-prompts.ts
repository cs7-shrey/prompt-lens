import { getMentionScoreAccumulative, getSentimentScoreAccumulative } from "@/lib/metrics";
import { useCompanyStore } from "@/store/company-store";
import usePromptStore from "@/store/prompt-store";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const usePrompts = () => {
    const { prompts, setPrompts } = usePromptStore();
    const { currentCompany } = useCompanyStore();
    const [visibilityAndSentimentMap, setVisibilityAndSentimentMap] = useState<Record<string, { visibility: number; sentiment: number }>>({});
    const trpc = useTRPC();
    const { data: promptsData, isLoading: isPromptsLoading, isError: isPromptsError } = useQuery(
        trpc.prompt.getAllPromptsWithAnalytics.queryOptions({
            trackingCompanyId: currentCompany!.id,
        }, {
            enabled: !!currentCompany?.id
        }),
    )

    useEffect(() => {
        if (promptsData) {
            setPrompts(promptsData.prompts);
            for(const prompt of promptsData.prompts) {
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