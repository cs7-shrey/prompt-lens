interface HighLevelMetricsProps {
    visibilityScore: number | string;
    citationShare: number | string;
    responsesAnalyzed: number;
}

const MetricCard = ({ label, value, accentColor }: { label: string; value: number; accentColor: string }) => {
    return (
        <div className="flex-1 min-w-40 p-6 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03] transition-all duration-300 relative group">
            {/* Subtle accent line on top */}
            <div 
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: accentColor }}
            />
            
            <div className="text-[10px] font-bold text-zinc-500 tracking-[0.15em] uppercase mb-3">
                {label}
            </div>
            
            <div className="flex items-baseline gap-2">
                <div className="text-3xl font-semibold text-zinc-100">
                    {value}
                </div>
            </div>
        </div>
    );
};

const HighLevelMetrics = ({ visibilityScore, citationShare, responsesAnalyzed }: HighLevelMetricsProps) => {
    return (
        <div className="flex flex-wrap gap-4 p-4">
            <MetricCard 
                label="Visibility Score" 
                value={visibilityScore} 
                accentColor="#575BC7"
            />
            <MetricCard 
                label="Citation Share" 
                value={citationShare} 
                accentColor="#10b981"
            />
            <MetricCard 
                label="Responses Analyzed" 
                value={responsesAnalyzed} 
                accentColor="#f59e0b"
            />
        </div>
    );
};

export default HighLevelMetrics;