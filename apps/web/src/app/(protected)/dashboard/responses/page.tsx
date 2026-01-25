"use client";

import { useState } from "react";
import useResponses from "@/hooks/use-responses";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import type { ResponseWithMentionsAndPrompt } from "@/types";
import { Drawer } from "@/components/ui/drawer";
import { ResponseDrawer } from "@/components/response-drawer";

export default function ResponsesPage() {
    const {
        responses,
        isResponsesLoading,
        isResponsesError,
        totalCount,
        totalPages,
        page,
        limit,
        setPage,
    } = useResponses();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<ResponseWithMentionsAndPrompt | null>(null);

    const handleCellClick = (row: ResponseWithMentionsAndPrompt) => {
        setSelectedResponse(row);
        setIsDrawerOpen(true);
    }

    return (
        <div className="flex flex-col h-full">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                <div className="flex flex-col gap-1 px-8 pt-8 pb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">All Responses</h1>
                    <p className="text-sm text-zinc-500">View and analyze all AI responses captured by PromptLens.</p>
                </div>
                
                <div className="flex-1 px-8 pb-8 max-w-7xl">
                    {isResponsesLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
                                <p className="text-sm text-zinc-500">Loading responses...</p>
                            </div>
                        </div>
                    ) : isResponsesError ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-red-400">Failed to load responses</p>
                            </div>
                        </div>
                    ) : (
                        <DataTable 
                            columns={columns} 
                            data={responses}
                            pageCount={totalPages}
                            currentPage={page}
                            pageSize={limit}
                            totalCount={totalCount}
                            onPageChange={setPage}
                            handleCellClick={handleCellClick}
                        />
                    )}
                </div>

                {/* Render drawer content when a response is selected */}
                {selectedResponse && (
                    <div className="w-full">
                        <ResponseDrawer {...selectedResponse} />
                    </div>
                )}
            </Drawer>
        </div>
    );
}
