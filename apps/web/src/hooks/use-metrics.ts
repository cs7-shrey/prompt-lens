import { getMentionScoreAccumulative } from "@/lib/metrics";
import { useCompanyStore } from "@/store/company-store";
import useDashboardStore from "@/store/dashboard-store";
import { useEffect, useMemo, useState } from "react";

const useMetrics = () => {
    const { currentCompany } = useCompanyStore();
    const { citations, mentions, getCurrentCompanyCitations, getCurrentCompanyMentions, responsesAnalyzed } = useDashboardStore();

    const [mentionScore, setMentionScore] = useState(0);
    const [citationShare, setCitationShare] = useState(0);

    useEffect(() => {
        const currentCompanyMentions = getCurrentCompanyMentions();

        if (citations.length > 0 && currentCompany?.url) {
            const citationShareCalculated = getCurrentCompanyCitations().length / citations.length
            setCitationShare(citationShareCalculated);
        }

        if (currentCompanyMentions.length > 0) {
            const mentionScore = getMentionScoreAccumulative(currentCompanyMentions, responsesAnalyzed);
            setMentionScore(mentionScore);

            console.log(mentions.length, responsesAnalyzed, currentCompanyMentions.length);
        }
    }, [citations, mentions, getCurrentCompanyMentions]);

    return {
        visibilityScore: (mentionScore * 0.8 + citationShare * 0.2) * 100,
        citationShare: citationShare * 100,
        mentionScore,
    } as const;
}


export default useMetrics;