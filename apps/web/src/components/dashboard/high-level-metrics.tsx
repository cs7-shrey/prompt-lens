import { TrendingUp, Target, FileText, Award } from "lucide-react";

interface HighLevelMetricsProps {
    visibilityScore: number | string;
    citationShare: number | string;
    responsesAnalyzed: number;
    mentionRate: number;
}

interface MetricCardProps {
    label: string;
    value: string | number;
    accentColor: string;
    icon: React.ReactNode;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const MetricCard = ({ label, value, accentColor, icon, subtitle, trend }: MetricCardProps) => {
    return (
        <div 
            className="flex-1 min-w-[200px] p-5 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-white/20 transition-all duration-300 relative group"
            >
            
            {/* Icon */}
            <div 
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg mb-3 opacity-80"
                style={{ backgroundColor: `${accentColor}15` }}
            >
                <div style={{ color: accentColor }} className="w-4 h-4">
                    {icon}
                </div>
            </div>

            {/* Label */}
            <div className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase mb-2">
                {label}
            </div>
            
            {/* Value and Trend */}
            <div className="flex items-baseline gap-3">
                <div className="text-3xl font-bold text-zinc-50">
                    {value}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        <TrendingUp className={`w-3 h-3 ${!trend.isPositive && 'rotate-180'}`} />
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>

            {/* Subtitle */}
            {subtitle && (
                <div className="mt-1 text-xs text-zinc-500">
                    {subtitle}
                </div>
            )}
        </div>
    );
};

const HighLevelMetrics = ({ visibilityScore, citationShare, responsesAnalyzed, mentionRate }: HighLevelMetricsProps) => {
    // Format values for display
    const visibilityValue = typeof visibilityScore === 'string' ? visibilityScore : visibilityScore.toFixed(1);
    const citationValue = typeof citationShare === 'string' ? citationShare : citationShare.toFixed(1);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                label="Visibility Score"
                value={`${visibilityValue}%`}
                accentColor="#f59e0b"
                icon={<Target className="w-full h-full" />}
                subtitle="vs last period"
            />
            <MetricCard
                label="Citation Share"
                value={`${citationValue}%`}
                accentColor="#10b981"
                icon={<Award className="w-full h-full" />}
                subtitle="of total mentions"
            />
            <MetricCard
                label="Responses Analyzed"
                value={responsesAnalyzed.toLocaleString()}
                accentColor="#575BC7"
                icon={<FileText className="w-full h-full" />}
                subtitle="in selected period"
            />
            <MetricCard
                label="Mention Rate"
                value={mentionRate.toFixed(2)}
                accentColor="#3b82f6"
                icon={<TrendingUp className="w-full h-full" />}
                subtitle="total brand mentions"
            />
        </div>
    );
};

export default HighLevelMetrics;