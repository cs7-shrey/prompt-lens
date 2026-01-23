"use client";

import { Loader2 } from "lucide-react";
import { useCompany } from "@/hooks/use-company";
import HighLevelMetrics from "@/components/dashboard/high-level-metrics";
import MentionsData from "@/components/dashboard/mentions-data";
import CitationsData from "@/components/dashboard/citations-data";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import type { Mention, Brand } from "@prompt-lens/common-types";
import useDashboard from "@/hooks/use-dashboard";
import useMetrics from "@/hooks/use-metrics";

type MentionWithBrand = Mention & {
  brand: Brand;
};

const mockBrands: Brand[] = [
  {
    id: "1",
    canonicalName: "maxim",
    displayName: "Maxim",
    category: "AI Agent Platform",
    websiteUrl: "https://getmaxim.ai",
    aliases: ["maxim-ai", "getmaxim"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    canonicalName: "langfuse",
    displayName: "Langfuse",
    category: "LLM Observability",
    websiteUrl: "https://langfuse.com",
    aliases: ["langfuse-llm"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    canonicalName: "braintrust",
    displayName: "Braintrust",
    category: "AI Evaluation",
    websiteUrl: "https://braintrust.dev",
    aliases: ["braintrust-ai"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    canonicalName: "promptfoo",
    displayName: "Promptfoo",
    category: "LLM Testing",
    websiteUrl: "https://promptfoo.dev",
    aliases: ["prompt-foo"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    canonicalName: "kubeflow",
    displayName: "Kubeflow",
    category: "ML Platform",
    websiteUrl: "https://kubeflow.org",
    aliases: ["kube-flow"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    canonicalName: "datarobot",
    displayName: "DataRobot",
    category: "AutoML Platform",
    websiteUrl: "https://datarobot.com",
    aliases: ["data-robot"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    canonicalName: "weights-biases",
    displayName: "Weights & Biases",
    category: "ML Ops",
    websiteUrl: "https://wandb.ai",
    aliases: ["wandb", "weights-and-biases"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    canonicalName: "mlflow",
    displayName: "MLflow",
    category: "ML Lifecycle",
    websiteUrl: "https://mlflow.org",
    aliases: ["ml-flow"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Create mentions with distribution: Maxim (40%), Langfuse (5%), Braintrust (5.1%), etc.
const mockMentions: MentionWithBrand[] = [
  // Maxim - 40 mentions (40%)
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `maxim-${i}`,
    position: i % 5,
    sentiment: (["positive", "neutral", "negative"] as const)[i % 3],
    mentionScore: 0.8 + Math.random() * 0.2,
    responseId: `response-${i}`,
    brandId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: mockBrands[0],
  })),
  // Langfuse - 5 mentions (5%)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `langfuse-${i}`,
    position: i % 3,
    sentiment: "positive" as const,
    mentionScore: 0.75 + Math.random() * 0.15,
    responseId: `response-${40 + i}`,
    brandId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: mockBrands[1],
  })),
  // Braintrust - 5 mentions (5.1%)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `braintrust-${i}`,
    position: i % 4,
    sentiment: (["positive", "neutral"] as const)[i % 2],
    mentionScore: 0.7 + Math.random() * 0.2,
    responseId: `response-${45 + i}`,
    brandId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: mockBrands[2],
  })),
  // Promptfoo - 3 mentions (3.1%)
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `promptfoo-${i}`,
    position: i,
    sentiment: "neutral" as const,
    mentionScore: 0.65 + Math.random() * 0.2,
    responseId: `response-${50 + i}`,
    brandId: "4",
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: mockBrands[3],
  })),
  // Kubeflow - 4 mentions (4%)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `kubeflow-${i}`,
    position: i % 3,
    sentiment: (["positive", "neutral"] as const)[i % 2],
    mentionScore: 0.72 + Math.random() * 0.18,
    responseId: `response-${53 + i}`,
    brandId: "5",
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: mockBrands[4],
  })),
  // DataRobot - 4 mentions (3.6%)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `datarobot-${i}`,
    position: i % 2,
    sentiment: "positive" as const,
    mentionScore: 0.8 + Math.random() * 0.15,
    responseId: `response-${57 + i}`,
    brandId: "6",
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: mockBrands[5],
  })),
  // Weights & Biases - 3 mentions (2.4%)
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `wandb-${i}`,
    position: i,
    sentiment: "positive" as const,
    mentionScore: 0.85 + Math.random() * 0.1,
    responseId: `response-${61 + i}`,
    brandId: "7",
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: mockBrands[6],
  })),
  // MLflow - 2 mentions (should not appear in top 7)
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `mlflow-${i}`,
    position: i,
    sentiment: "neutral" as const,
    mentionScore: 0.7 + Math.random() * 0.2,
    responseId: `response-${63 + i}`,
    brandId: "8",
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: mockBrands[7],
  })),
];

// Mock citations data
const mockCitations: string[] = [
  // TechCrunch - 35%
  ...Array.from({ length: 35 }, () => "https://techcrunch.com/article"),
  // GitHub - 25%
  ...Array.from({ length: 25 }, () => "https://github.com/repo"),
  // Medium - 15%
  ...Array.from({ length: 15 }, () => "https://medium.com/article"),
  // Stack Overflow - 10%
  ...Array.from({ length: 10 }, () => "https://stackoverflow.com/questions"),
  // Dev.to - 8%
  ...Array.from({ length: 8 }, () => "https://dev.to/article"),
  // Reddit - 5%
  ...Array.from({ length: 5 }, () => "https://reddit.com/r/programming"),
  // ArXiv - 2%
  ...Array.from({ length: 2 }, () => "https://arxiv.org/paper"),
];

export default function DashboardPage() {
  const { currentCompany, isLoading } = useCompany();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#030303]">
        <Loader2 className="animate-spin text-zinc-600" />
      </div>
    );
  }

  if (!currentCompany) {
    return null;
  }

  return (
    <div className="flex flex-col border-white/30 gap-8">
      {/* Header */}
      <div className="p-4 flex justify-between items-start border-b my-2 px-12">
        <div className="max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-100 my-2">
            {currentCompany.name} Dashboard
          </h1>
          <p className="text-[14px] text-zinc-500 font-medium">
            Real-time visibility protocol for {currentCompany.name}
          </p>
        </div>
        <div className="mt-2">
          <DateRangeSelector value={dateRange} onValueChange={setDateRangeOption} />
        </div>
      </div>
      <div className="mx-8">
        <HighLevelMetrics visibilityScore={visibilityScore.toFixed(2)} citationShare={citationShare.toFixed(2)} responsesAnalyzed={responsesAnalyzed} />
      </div>
      <div className="mx-8">
        <MentionsData mentions={mentions} />
      </div>
      <div className="mx-8">
        <CitationsData citations={citations} />
      </div>
    </div>
  );
}