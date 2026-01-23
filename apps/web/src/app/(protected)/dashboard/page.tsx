"use client";

import HighLevelMetrics from "@/components/dashboard/high-level-metrics";
import MentionsData from "@/components/dashboard/mentions-data";
import CitationsData from "@/components/dashboard/citations-data";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import useDashboard from "@/hooks/use-dashboard";
import useMetrics from "@/hooks/use-metrics";
import { useCompanyStore } from "@/store/company-store";

export default function DashboardPage() {
  const {
    citations,
    mentions,
    currentCompanyMentions,
    responsesAnalyzed,
    isCitationsLoading,
    isMentionsLoading,
    isCitationsError,
    isMentionsError,
    dateRange,
    setDateRangeOption,
  } = useDashboard();
  const { visibilityScore, mentionScore, citationShare } = useMetrics();
  const { currentCompany } = useCompanyStore();

  if (!currentCompany) {
    return null;
  }

  return (
    <div className="flex flex-col border-white/30 gap-5">
      {/* Header */}
      <div className="p-3 flex justify-between items-start border-b border-white/5 px-8 pb-5">
        <div className="max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-100 my-2">
            {currentCompany.name} Dashboard
          </h1>
          <p className="text-[13px] text-zinc-400 font-medium">
            Real-time visibility protocol for {currentCompany.name}
          </p>
        </div>
        <div className="mt-1">
          <DateRangeSelector value={dateRange} onValueChange={setDateRangeOption} />
        </div>
      </div>
      <div className="mx-8 mt-2">
        <HighLevelMetrics 
          visibilityScore={visibilityScore.toFixed(2)} 
          citationShare={citationShare.toFixed(2)} 
          responsesAnalyzed={responsesAnalyzed} 
          mentionRate={mentions.length > 0 ? (currentCompanyMentions.length / mentions.length) * 100 : 0} />
      </div>
      <div className="mx-8">
        <MentionsData mentions={mentions} />
      </div>
      <div className="mx-8 mb-8">
        <CitationsData citations={citations} />
      </div>
    </div>
  );
}