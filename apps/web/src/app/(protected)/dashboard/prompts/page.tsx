"use client";

import usePrompts from "@/hooks/use-prompts";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function PromptsPage() {
    const { prompts, isPromptsLoading, isPromptsError } = usePrompts();

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-1 px-8 pt-8 pb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">All Prompts</h1>
                <p className="text-sm text-zinc-500">View and manage all prompts monitored by PromptLens.</p>
            </div>
            
            <div className="flex-1 px-8 pb-8 max-w-7xl">
                {isPromptsLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
                            <p className="text-sm text-zinc-500">Loading prompts...</p>
                        </div>
                    </div>
                ) : isPromptsError ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm text-red-400">Failed to load prompts</p>
                        </div>
                    </div>
                ) : (
                    <DataTable columns={columns} data={prompts} />
                )}
            </div>
        </div>
    );
}