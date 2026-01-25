"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ResponseWithMentionsAndPrompt, MentionWithBrand } from "@/types";
import type { Brand, AISource } from "@prompt-lens/common-types";
import { BrandStack } from "@/components/brand-stack";
import SentimentIndicator from "@/components/sentiment-indicator";
import VisibilityIndicator from "@/components/visibility-indicator";
import { getMentionScoreAccumulative, getSentimentScoreAccumulative } from "@/lib/metrics";
import Image from "next/image";

// AI Source badge component
function AISourceBadge({ source }: { source: AISource }) {
  const getSourceStyle = (source: AISource) => {
    switch (source) {
      case "CHATGPT":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "CLAUDE":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "PERPLEXITY":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const getSourceName = (source: AISource) => {
    switch (source) {
      case "CHATGPT":
        return "ChatGPT";
      case "CLAUDE":
        return "Claude";
      case "PERPLEXITY":
        return "Perplexity";
      default:
        return source;
    }
  };

  const getSourceIconPath = (source: AISource) => {
    switch (source) {
        case "CHATGPT":
            return "/chatgpt-icon.svg";
        case "CLAUDE":
            return "/claude-ai-icon.svg";
        case "PERPLEXITY":
            return "/perplexity-ai-icon.svg";
        }
    }

    const IMAGE_SIZE = 16;
  return (
    <div className={`inline-flex gap-2 items-center px-2 py-1.5 rounded-md border border-white/15 text-[0.8rem] font-medium `}>
    <Image src={getSourceIconPath(source)} alt={source} width={IMAGE_SIZE} height={IMAGE_SIZE} />
      <p className="text-white/90">
        {getSourceName(source)}
      </p>
    </div>
  );
}

export const columns: ColumnDef<ResponseWithMentionsAndPrompt>[] = [
  {
    accessorKey: "visibility",
    header: "Visibility",
    size: 120,
    cell: ({ row }) => {
      const response = row.original;
      
      // Calculate visibility based on relevant mentions
      if (!response.relevantMentions || response.relevantMentions.length === 0) {
        return <VisibilityIndicator visibility={0} />;
      }

      const visibility = getMentionScoreAccumulative(response.relevantMentions, 1);
      
      return <VisibilityIndicator visibility={visibility} />;
    },
  },
  {
    accessorKey: "content",
    header: "Response",
    size: 400,
    cell: ({ row }) => {
      const content = row.original.content;
      const truncated = content.length > 80 ? content.slice(0, 80) + "..." : content;
      return (
        <div className="w-[400px] truncate">
          <p className="text-sm text-zinc-100 font-normal leading-relaxed">{truncated}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "aiSource",
    header: "Source",
    size: 120,
    cell: ({ row }) => {
      return <AISourceBadge source={row.original.aiSource} />;
    },
  },
  {
    accessorKey: "sentiment",
    header: "Sentiment",
    size: 160,
    cell: ({ row }) => {
      const response = row.original;
      
      // Only show sentiment if there are relevant mentions
      if (!response.relevantMentions || response.relevantMentions.length === 0) {
        return <span className="text-xs text-zinc-500">-</span>;
      }
      
      const sentimentScore = getSentimentScoreAccumulative(response.relevantMentions);
      
      return <SentimentIndicator sentimentScore={sentimentScore} />;
    },
  },
  {
    accessorKey: "brands",
    header: "Brands",
    size: 180,
    cell: ({ row }) => {
      const response = row.original;
      
      // Count mentions per brand
      const mentions = response.mentions;
      const brandMap = new Map();

      mentions.forEach((mention: MentionWithBrand) => {
        const brandId = mention.brand.id;
        if (brandMap.has(brandId)) {
          brandMap.get(brandId)!.count += 1;
        } else {
          brandMap.set(brandId, {
            brand: mention.brand,
            count: 1,
          });
        }
      });

      const topBrands = Array.from(brandMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      if (topBrands.length === 0) {
        return <span className="text-xs text-zinc-500">-</span>;
      }
      
      const remainingCount = brandMap.size - topBrands.length;
      
      return <BrandStack brands={topBrands.map((item: { brand: Brand }) => item.brand)} remainingCount={remainingCount} />;
    },
  },
  {
    accessorKey: "citations",
    header: "Citations",
    size: 100,
    cell: ({ row }) => {
      const count = row.original.citations?.length || 0;
      return (
        <div className="text-center w-[100px]">
          <span className="text-sm font-medium text-zinc-100 tabular-nums">{count}</span>
        </div>
      );
    },
  },
];
