"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { PromptWithRelevantMentions } from "@/types";
import type { Brand } from "@prompt-lens/common-types";
import BrandLogo from "@/components/brand-logo";
import { getMentionScoreAccumulative, getSentimentScoreAccumulative } from "@/lib/metrics";
import { Checkbox } from "@/components/ui/checkbox";
import { Triangle } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

// Brand Stack Component
function BrandStack({ brands, remainingCount }: { brands: Brand[], remainingCount?: number }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const totalItems = brands.length + (remainingCount && remainingCount > 0 ? 1 : 0);

  console.log(brands)
  
  return (
    <div 
      className="relative flex items-center w-[180px] h-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-7 flex items-center" style={{ width: isHovered ? totalItems * 36 : totalItems * 14 + 14 }}>
        {brands.map((brand, idx) => (
          <motion.div 
            key={brand.id}
            className="absolute ring-2 ring-zinc-900 rounded-md"
            initial={false}
            animate={{
              x: isHovered ? idx * 36 : idx * 28,
              zIndex: brands.length - idx + 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <BrandLogo 
              domain={brand.websiteUrl} 
              name={brand.displayName} 
              size={28} 
            />
          </motion.div>
        ))}
        {remainingCount && remainingCount > 0 && (
          <motion.div
            className="absolute flex items-center justify-center w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 ring-2 ring-zinc-900"
            initial={false}
            animate={{
              x: isHovered ? brands.length * 36 : brands.length * 14,
              zIndex: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <span className="text-[10px] font-medium text-zinc-400">
              +{remainingCount}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

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
      const percentage = Math.round(visibility * 100);
      
      return (
        <div className="flex items-center gap-2 w-[120px]">
          <div className="relative flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 -rotate-90">
              <circle
                cx="14"
                cy="14"
                r="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-zinc-800/50"
              />
              <circle
                cx="14"
                cy="14"
                r="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray={`${2 * Math.PI * 12}`}
                strokeDashoffset={`${2 * Math.PI * 12 * (1 - visibility)}`}
                className="text-emerald-500"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-zinc-300 tabular-nums">{percentage}%</span>
        </div>
      );
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
        return <span className="text-xs text-zinc-500">-</span>;
      }
      
      const sentimentScore = getSentimentScoreAccumulative(prompt.relevantMentions);
      const percentage = Math.round(sentimentScore * 100);
      
      // Calculate position on the gradient (0-100)
      const position = percentage;
      
      return (
        <div className="flex items-center gap-3 w-[80px]">
          <div className="relative w-full h-2 rounded-full  bg-linear-to-r from-red-500 via-yellow-500 to-emerald-500">
            <div className="absolute inset-0 rounded-full bg-black/40"></div>
            {/* Pointer indicator */}
            <div 
              className="absolute z-20 -translate-x-1 top-[0.3rem] "
              style={{ left: `${position * 10/11}%` }}
            >
              <Triangle className="text-[rgb(188,186,180)] rounded-none" fill="currentColor" size={12} />
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "brands",
    header: "Brands",
    size: 180,
    cell: ({ row }) => {
      const prompt = row.original;
      
      // Count mentions per brand
      const mentions = prompt.responses.flatMap(response => response.mentions);
      const brandMap = new Map();

      mentions.forEach((mention) => {
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
      
      return <BrandStack brands={topBrands.map(brand => brand.brand)} remainingCount={remainingCount} />;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    size: 100,
    cell: ({ row }) => {
      // Placeholder for tags
      return <span className="text-xs text-zinc-500">-</span>;
    },
  },
  {
    accessorKey: "responses",
    header: "Resp.",
    size: 80,
    cell: ({ row }) => {
      const count = row.original.responses.length;
      return (
        <div className="text-center w-[80px]">
          <span className="text-sm font-medium text-zinc-100 tabular-nums">{count}</span>
        </div>
      );
    },
  },
];
