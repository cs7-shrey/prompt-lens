"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { MentionWithBrand, PromptWithRelevantMentions, ResponseWithMentions } from "@/types";
import type { Brand } from "@prompt-lens/common-types";
import { BrandStack } from "@/components/brand-stack";
import SentimentIndicator from "@/components/sentiment-indicator";
import VisibilityIndicator from "@/components/visibility-indicator";
import { getMentionScoreAccumulative, getSentimentScoreAccumulative } from "@/lib/metrics";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<PromptWithRelevantMentions>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-zinc-700"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-zinc-700"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    size: 120,
    cell: ({ row }) => {
      const prompt = row.original;
      const visibility = getMentionScoreAccumulative(
        prompt.relevantMentions,
        prompt.responses.length
      );
      
      return <VisibilityIndicator visibility={visibility} />;
    },
  },
  {
    accessorKey: "content",
    header: "Prompt",
    size: 400,
    cell: ({ row }) => {
      const content = row.original.content;
      const truncated = content.length > 60 ? content.slice(0, 60) + "..." : content;
      return (
        <div className="w-[400px]">
          <p className="text-sm text-zinc-100 font-normal leading-relaxed">{truncated}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "sentiment",
    header: "Sentiment",
    size: 160,
    cell: ({ row }) => {
      const prompt = row.original;
      
      // Only show sentiment if there are relevant mentions
      if (!prompt.relevantMentions || prompt.relevantMentions.length === 0) {
        return <span className="text-xs text-zinc-500">—</span>;
      }
      
      const sentimentScore = getSentimentScoreAccumulative(prompt.relevantMentions);
      
      return <SentimentIndicator sentimentScore={sentimentScore} />;
    },
  },
  {
    accessorKey: "brands",
    header: "Brands",
    size: 180,
    cell: ({ row }) => {
      const prompt = row.original;
      
      // Count mentions per brand
      const mentions = prompt.responses.flatMap((response: ResponseWithMentions) => response.mentions);
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
      
      return <BrandStack brands={topBrands.map((brand: { brand: Brand }) => brand.brand)} remainingCount={remainingCount} />;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    size: 100,
    cell: ({ row }) => {
      // Placeholder for tags
      return <span className="text-xs text-zinc-500">—</span>;
    },
  },
  {
    accessorKey: "responses",
    header: "Resp.",
    size: 80,
    cell: ({ row }) => {
      const count = row.original.responses.length;
      return (
        <div className="text-center w-[30px] flex items-center justify-center">
          <span className="text-sm font-medium text-zinc-100 tabular-nums">{count}</span>
        </div>
      );
    },
  },
];
