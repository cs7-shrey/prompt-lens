import type { ResponseWithMentionsAndPrompt } from "@/types";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchResponses } from "@/lib/api";
import { useCompanyStore } from "@/store/company-store";

interface Options {
    promptId?: string;
}

const useResponses = ({ promptId }: Options = {}) => {
    const { currentCompany } = useCompanyStore();
    const [responses, setResponses] = useState<ResponseWithMentionsAndPrompt[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState<Date>(new Date());

    const { data: responsesData, isLoading: isResponsesLoading, isError: isResponsesError } = useQuery({
        queryKey: ['responses', currentCompany?.id, startDate, endDate, page, limit, promptId],
        queryFn: () => {
            if (currentCompany?.id) {
                return fetchResponses({ trackingCompanyId: currentCompany.id, startDate, endDate, page, limit, promptId });
            }
            return { responses: [], totalCount: 0, totalPages: 0, page: 1, limit: 10 };
        },
        enabled: !!currentCompany?.id,
    });

    useEffect(() => {
        if (responsesData) {
            setResponses(responsesData.responses);
            setTotalCount(responsesData.totalCount);
            setTotalPages(responsesData.totalPages);
        }
    }, [responsesData]);

    return {
        responses,
        isResponsesLoading,
        isResponsesError,
        totalCount,
        totalPages,
        page,
        limit,
        setPage,
        setLimit,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
    };
};

export default useResponses;
