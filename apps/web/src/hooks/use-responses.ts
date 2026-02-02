import type { ResponseWithMentionsAndPrompt } from "@/types";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCompanyStore } from "@/store/company-store";
import { useTRPC } from "@/utils/trpc";

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

    const trpc = useTRPC();
    const getQueryOptions = (promptId?: string) => {
        const queryOptions = {
            trackingCompanyId: currentCompany!.id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            page,
            limit,
        }
        if(promptId) {
            return trpc.response.getResponseByPromptIdPaginated.queryOptions({
                ...queryOptions,
                promptId,
            }, {
                enabled: !!currentCompany?.id
            })
        }
        return trpc.response.getAllResponsesPaginated.queryOptions(queryOptions, {
            enabled: !!currentCompany?.id
        });
    }

    const { data: responsesData, isLoading: isResponsesLoading, isError: isResponsesError } = useQuery(
        getQueryOptions(promptId),
    )

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
