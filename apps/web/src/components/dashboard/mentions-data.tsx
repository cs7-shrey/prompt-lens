import type { MentionWithBrand } from "@/types";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import type { Brand } from "@prompt-lens/common-types";
import { getLogoUrl } from "@/lib/utils";
import Image from "next/image";
import BrandLogo from "../brand-logo";

interface MentionsDataProps {
    mentions: MentionWithBrand[];
}

interface BrandData {
    brand: Brand;
    count: number;
    percentage: number;
}

const BRAND_COLORS = [
    "#575BC7", // Primary purple
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#06b6d4", // Cyan
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#14b8a6", // Teal
];

const MentionsData = ({ mentions }: MentionsDataProps) => {
    // Group mentions by brand and count them
    const brandMap = new Map<string, BrandData>();
    
    mentions.forEach((mention) => {
        const brandId = mention.brand.id;
        if (brandMap.has(brandId)) {
            brandMap.get(brandId)!.count += 1;
        } else {
            brandMap.set(brandId, {
                brand: mention.brand,
                count: 1,
                percentage: 0,
            });
        }
    });

    // Calculate percentages and get top 7 brands
    const totalMentions = mentions.length;
    const topBrands = Array.from(brandMap.values())
        .map((data) => ({
            ...data,
            percentage: totalMentions > 0 ? (data.count / totalMentions) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);

    // Prepare data for chart
    const chartData = topBrands.map((item) => ({
        name: item.brand.displayName,
        value: item.percentage,
    })).sort((a, b) => a.value - b.value);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-white/2 border border-white/5 rounded-xl p-8">
                <div className="mb-8">
                    <h3 className="text-xl font-medium text-zinc-100 tracking-tight mb-2">
                        Brand Visibility
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium">
                        Track how your brand performs over time compared to competitors
                    </p>
                </div>

                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
                        >
                            <XAxis
                                dataKey="name"
                                height={80}
                                interval={0}
                                tick={(props) => {
                                    const { x, y, payload, index } = props;
                                    const maxLength = 15;
                                    const text = String(payload.value);
                                    const truncated = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
                                    const brand = topBrands[index as number]?.brand;
                                    const logoUrl = brand?.websiteUrl ? getLogoUrl(brand.websiteUrl).primary : null;
                                    
                                    return (
                                        <g>
                                            <text
                                                x={x}
                                                y={Number(y) + 10}
                                                fill="#71717a"
                                                fontSize={11}
                                                fontWeight={500}
                                                textAnchor="middle"
                                            >
                                                {truncated}
                                            </text>
                                            {logoUrl && (
                                                <foreignObject x={Number(x) - 8} y={Number(y) + 18} width={24} height={24}>
                                                    <BrandLogo domain={brand?.websiteUrl} name={brand?.displayName} size={24} />
                                                </foreignObject>
                                            )}
                                        </g>
                                    );
                                }}
                                axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "#71717a", fontSize: 11, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                                        opacity={0.9}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white/2 border border-white/5 rounded-xl">
                <div className="border-b w-full px-6 py-4">
                    <h4 className="text-sm font-medium text-zinc-400 mb-1">
                        Top Brands by Visibility
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-zinc-100">
                            {totalMentions}
                        </span>
                        <span className="text-xs text-zinc-500">mentions</span>
                    </div>
                </div>

                <div className="space-y-1 flex flex-col divide-y">
                    {topBrands.map((item, index) => (
                        <div
                            key={item.brand.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors group"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Color indicator */}
                                <div
                                    className="rounded-sm shrink-0"
                                >
                                    <BrandLogo domain={item.brand.websiteUrl} name={item.brand.displayName} size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-zinc-200 truncate">
                                        {item.brand.displayName}
                                    </div>
                                    <div className="text-[10px] text-zinc-600 truncate">
                                        {item.brand.websiteUrl?.replace(/^https?:\/\//, "") || "—"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-zinc-100">
                                        {item.percentage.toFixed(1)}%
                                    </div>
                                    <div className="text-[10px] text-zinc-600">
                                        {item.count} mention{item.count !== 1 ? "s" : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {topBrands.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <TrendingUp className="w-10 h-10 text-zinc-700 mb-3" />
                        <p className="text-sm text-zinc-500 font-medium">
                            No mention data available
                        </p>
                        <p className="text-xs text-zinc-600 mt-1">
                            Data will appear here once monitoring begins
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentionsData;