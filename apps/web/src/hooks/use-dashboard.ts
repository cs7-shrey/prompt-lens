import { fetchCitations, fetchMentions } from "@/lib/api";
import useDashboardStore from "@/store/dashboard-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCompanyStore } from "@/store/company-store";

const useDashboard = () => {
    const { citations, mentions, currentCompanyMentions, responsesAnalyzed, setCitations, setMentions, setCurrentCompanyMentions, setResponsesAnalyzed } = useDashboardStore();
    const { currentCompany } = useCompanyStore();

    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState(new Date());

    const { data: citationsData, isLoading: isCitationsLoading, isError: isCitationsError } = useQuery({
        queryKey: ['citations', currentCompany?.id],
        queryFn: () => {
            if (currentCompany?.id) {
                return fetchCitations(currentCompany.id, startDate, endDate);
            }
            return [];
        },
    });
    const { data: mentionsData, isLoading: isMentionsLoading, isError: isMentionsError } = useQuery({
        queryKey: ['mentions', currentCompany?.id],
        queryFn: () => {
            if (currentCompany?.id) {
                return fetchMentions(currentCompany.id, startDate, endDate);
            }
            return { mentions: [], currentCompanyMentions: [], responsesAnalyzed: 0 };
        },
    });

    useEffect(() => {
        if(citationsData) {
            setCitations(citationsData);
        }
    }, [citationsData])

    useEffect(() => {
        if(mentionsData) {
            setMentions(mentionsData.mentions);
            setCurrentCompanyMentions(mentionsData.currentCompanyMentions);
            setResponsesAnalyzed(mentionsData.responsesAnalyzed);
        }
    }, [mentionsData])

    return { citations, mentions, currentCompanyMentions, responsesAnalyzed, isCitationsLoading, isMentionsLoading, isCitationsError, isMentionsError } as const;
}

export default useDashboard;