import { useCompanyStore } from "@/store/company-store";
import useDashboardStore from "@/store/dashboard-store";
import { useEffect, useMemo, useState } from "react";

const useMetrics = () => {
    const { currentCompany } = useCompanyStore();
    const { citations, mentions, currentCompanyMentions, responsesAnalyzed } = useDashboardStore();

    const [mentionScore, setMentionScore] = useState(0);
    const [citationShare, setCitationShare] = useState(0);

    useEffect(() => {
        if (citations.length > 0 && currentCompany?.url) {
            setCitationShare(getCurrentCompanyCitations(citations, currentCompany?.url).length / citations.length);
        }
        if (currentCompanyMentions.length > 0) {
            setMentionScore(currentCompanyMentions.length / mentions.length);
        }
    }, [citations, mentions, currentCompanyMentions]);

    return {
        visibilityScore: (mentionScore * 0.8 + citationShare * 0.2) * 100,
        citationShare: citationShare * 100,
        mentionScore,
    } as const;
}

const getCurrentCompanyCitations = (citations: string[], websiteUrl: string) => {
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

export default useMetrics;