"use client";

import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { ResponseWithMentionsAndPrompt, MentionWithBrand } from "@/types";
import type { Brand } from "@prompt-lens/common-types";
import { X, ExternalLink } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import SentimentIndicator from "./sentiment-indicator";
import VisibilityIndicator from "./visibility-indicator";
import { BrandStack } from "./brand-stack";
import { getMentionScoreAccumulative, getSentimentScoreAccumulative } from "@/lib/metrics";

type ResponseDrawerProps = ResponseWithMentionsAndPrompt;

export function ResponseDrawer({
  id,
  content,
  aiSource,
  citations,
  createdAt,
  prompt,
  mentions,
  relevantMentions,
}: ResponseDrawerProps) {
  const [activeTab, setActiveTab] = useState<"response" | "citations">("response");

  // Calculate visibility and sentiment
  const visibility = relevantMentions.length > 0 ? getMentionScoreAccumulative(relevantMentions, 1) : 0;
  const sentimentScore = relevantMentions.length > 0 ? getSentimentScoreAccumulative(relevantMentions) : 0.5;

  // Get provider name
  const getProviderName = (source: typeof aiSource) => {
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

  const getProviderIconPath = (source: typeof aiSource) => {
    switch (source) {
      case "CHATGPT":
        return "/chatgpt-icon.svg";
      case "CLAUDE":
        return "/claude-ai-icon.svg";
      case "PERPLEXITY":
        return "/perplexity-ai-icon.svg";
      default:
        return "/chatgpt-icon.svg";
    }
  };

  // Get brands mentioned
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
  const remainingCount = brandMap.size - topBrands.length;

  // Format time
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `Generated ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }
    return `Generated about ${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  };

  return (
    <DrawerContent className="h-full bg-[#0A0A0A] border-t border-zinc-800 sm:max-w-4xl">
      <DrawerHeader className="border-b border-zinc-800 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <DrawerTitle className="text-xl font-semibold text-white mb-2">
              Response Details
            </DrawerTitle>
            <p className="text-sm text-zinc-400">{formatTimeAgo(createdAt)}</p>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-zinc-800/50">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Provider</span>
            <div className="flex items-center gap-2">
              <Image
                src={getProviderIconPath(aiSource)}
                alt={aiSource}
                width={16}
                height={16}
              />
              <span className="text-sm font-medium text-zinc-200">
                {getProviderName(aiSource)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Sentiment</span>
            <div className="flex items-center">
              {relevantMentions.length > 0 ? (
                <SentimentIndicator sentimentScore={sentimentScore} />
              ) : (
                <span className="text-xs text-zinc-500">-</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              Visibility Score
            </span>
            <VisibilityIndicator visibility={visibility} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              Brands Mentioned
            </span>
            {topBrands.length > 0 ? (
              <BrandStack
                brands={topBrands.map((item: { brand: Brand }) => item.brand)}
                remainingCount={remainingCount}
              />
            ) : (
              <span className="text-xs text-zinc-500">-</span>
            )}
          </div>
        </div>
      </DrawerHeader>

      {/* User prompt section */}
      <div className="px-6 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-1.5">
            User prompt
          </h3>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <p className="text-sm text-zinc-200 leading-relaxed">{prompt.content}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex gap-1 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("response")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === "response"
                ? "text-blue-400"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            Response
            {activeTab === "response" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("citations")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === "citations"
                ? "text-blue-400"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            Citations ({citations?.length || 0})
            {activeTab === "citations" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === "response" ? (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white mb-3">AI Response</h3>
            <p className="text-sm text-zinc-400 mb-4">
              The AI-generated response to the prompt above.
            </p>
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-5">
              <div className="prose prose-invert prose-sm max-w-none">
                {/* Parse content for citations */}
                {content.split(/(\[[\w\.-]+\])/).map((part, idx) => {
                  // Check if this part is a citation reference like [getmaxim.ai]
                  const citationMatch = part.match(/\[([\w\.-]+)\]/);
                  if (citationMatch) {
                    const domain = citationMatch[1];
                    // Find matching citation
                    const citation = citations?.find((c) =>
                      c.includes(domain)
                    );
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 mx-0.5 px-1.5 py-0.5 text-xs bg-zinc-800/50 border border-zinc-700 rounded text-zinc-300 hover:bg-zinc-700/50 cursor-pointer transition-colors"
                        title={citation || domain}
                      >
                        <Image
                          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                          alt={domain}
                          width={12}
                          height={12}
                          className="rounded-sm"
                        />
                        {domain}
                      </span>
                    );
                  }
                  return (
                    <span key={idx} className="text-zinc-200 text-[0.9rem] leading-relaxed">
                      {part}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {citations && citations.length > 0 ? (
              citations.map((citation, idx) => {
                const url = new URL(citation);
                const domain = url.hostname.replace("www.", "");
                return (
                  <a
                    key={idx}
                    href={citation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-zinc-800 flex items-center justify-center">
                      <Image
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                        alt={domain}
                        width={20}
                        height={20}
                        className="rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">
                        {domain}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{citation}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  </a>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-zinc-500">No citations found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DrawerContent>
  );
}