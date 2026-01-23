import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Link as LinkIcon } from "lucide-react";
import { getLogoUrl } from "@/lib/utils";
import Image from "next/image";
import BrandLogo from "../brand-logo";

interface CitationsDataProps {
    citations: string[];
}

interface DomainData {
    domain: string;
    count: number;
    percentage: number;
}

const DOMAIN_COLORS = [
    "#575BC7", // Primary purple
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#06b6d4", // Cyan
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#14b8a6", // Teal
];

const extractDomain = (url: string): string => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
};

const CitationsData = ({ citations }: CitationsDataProps) => {
    // Group citations by domain and count them
    const domainMap = new Map<string, number>();
    
    citations.forEach((citation) => {
        const domain = extractDomain(citation);
        domainMap.set(domain, (domainMap.get(domain) || 0) + 1);
    });

    // Calculate percentages and get top 7 domains
    const totalCitations = citations.length;
    const topDomains: DomainData[] = Array.from(domainMap.entries())
        .map(([domain, count]) => ({
            domain,
            count,
            percentage: totalCitations > 0 ? (count / totalCitations) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);

    // Prepare data for chart (sorted ascending for better visualization)
    const chartData = topDomains.map((item) => ({
        name: item.domain,
        value: item.percentage,
        domain: item.domain,
    })).sort((a, b) => a.value - b.value);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List Section - LEFT */}
            <div className="bg-white/2 border border-white/5 rounded-xl">
                <div className="border-b w-full px-6 py-4">
                    <h4 className="text-sm font-medium text-zinc-400 mb-1">
                        Top Sources by Citations
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-zinc-100">
                            {totalCitations}
                        </span>
                        <span className="text-xs text-zinc-500">citations</span>
                    </div>
                </div>

                <div className="space-y-1 flex flex-col divide-y">
                    {topDomains.map((item, index) => (
                        <div
                            key={item.domain}
                            className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors group"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Logo or fallback */}
                                <div
                                    className="rounded-sm shrink-0"
                                >
                                    <BrandLogo domain={`https://${item.domain}`} name={item.domain} size={24} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-zinc-200 truncate">
                                        {item.domain}
                                    </div>
                                    <div className="text-[10px] text-zinc-600 truncate">
                                        {item.count} citation{item.count !== 1 ? "s" : ""}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-zinc-100">
                                        {item.percentage.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {topDomains.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <LinkIcon className="w-10 h-10 text-zinc-700 mb-3" />
                        <p className="text-sm text-zinc-500 font-medium">
                            No citation data available
                        </p>
                        <p className="text-xs text-zinc-600 mt-1">
                            Data will appear here once monitoring begins
                        </p>
                    </div>
                )}
            </div>

            {/* Chart Section - RIGHT */}
            <div className="lg:col-span-2 bg-white/2 border border-white/5 rounded-xl p-8">
                <div className="mb-8">
                    <h3 className="text-xl font-medium text-zinc-100 tracking-tight mb-2">
                        Citation Sources
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium">
                        Distribution of sources cited by AI models in responses
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
                                    const domain = chartData[index as number]?.domain;
                                    const logoUrl = domain ? getLogoUrl(`https://${domain}`).primary : null;
                                    
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
                                                    <BrandLogo domain={`https://${domain}`} name={domain} size={24} />
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
                                        fill={DOMAIN_COLORS[index % DOMAIN_COLORS.length]}
                                        opacity={0.9}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CitationsData;