import useDashboardStore from "@/store/dashboard-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCompanyStore } from "@/store/company-store";
import { useTRPC } from "@/utils/trpc";

export type DateRangeOption = "7d" | "14d" | "1m" | "6m";

const useDashboard = () => {
    const { 
        citations, 
        mentions, 
        currentCompanyMentions, 
        responsesAnalyzed, 
        setCitations, 
        setMentions, 
        setCurrentCompanyMentions, 
        setResponsesAnalyzed 
    } = useDashboardStore();
    const { currentCompany } = useCompanyStore();

    const [dateRange, setDateRange] = useState<DateRangeOption>("7d");
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState(new Date());

    const setDateRangeOption = (option: DateRangeOption) => {
        const end = new Date();
        let start = new Date();

        switch (option) {
            case "7d":
                start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "14d":
                start = new Date(end.getTime() - 14 * 24 * 60 * 60 * 1000);
                break;
            case "1m":
                start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "6m":
                start = new Date(end.getTime() - 180 * 24 * 60 * 60 * 1000);
                break;
        }

        setDateRange(option);
        setStartDate(start);
        setEndDate(end);
    };

    const trpc = useTRPC();
    const { 
        data: citationsData, 
        isLoading: isCitationsLoading, 
        isError: isCitationsError 
    } = useQuery(
        trpc.dashboard.getCitations.queryOptions({
            trackingCompanyId: currentCompany!.id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        }, {
            enabled: !!currentCompany?.id
        })
    )

    const { data: mentionsData, isLoading: isMentionsLoading, isError: isMentionsError } = useQuery(
        trpc.dashboard.getAllAndRelevantMentions.queryOptions({
            trackingCompanyId: currentCompany!.id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        }, {
            enabled: !!currentCompany?.id
        })
    )

    useEffect(() => {
        if(citationsData) {
            setCitations(citationsData.citations);
        }
    }, [citationsData])

    useEffect(() => {
        if(mentionsData) {
            setMentions(mentionsData.mentions);
            setCurrentCompanyMentions(mentionsData.currentCompanyMentions);
            setResponsesAnalyzed(mentionsData.responsesAnalyzed);
        }
    }, [mentionsData])

    return { 
        citations, 
        mentions, 
        currentCompanyMentions, 
        responsesAnalyzed, 
        isCitationsLoading, 
        isMentionsLoading, 
        isCitationsError, 
        isMentionsError,
        dateRange,
        setDateRangeOption
    } as const;
}

export default useDashboard;