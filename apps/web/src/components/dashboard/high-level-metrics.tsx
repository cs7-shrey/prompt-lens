import { useEffect, useRef, useState } from "react";

interface HighLevelMetricsProps {
    visibilityScore: number | string;
    citationShare: number | string;
    responsesAnalyzed: number;
}

const LuminaGauge = ({ 
    label = "System Load", 
    value = 0, 
    color = "#3b82f6", 
    size = 280 
}: {
    label: string;
    value: number | string;
    color: string;
    size?: number;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [displayValue, setDisplayValue] = useState(0);
    const requestRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number | undefined>(undefined);

    const numericValue = Math.min(Math.max(typeof value === "string" ? parseFloat(value) : value, 0), 100);

    // Animation logic
    useEffect(() => {
        const duration = 1500; // ms
        const startValue = displayValue;
        const endValue = numericValue;

        const animate = (time: number) => {
            if (startTimeRef.current === undefined) startTimeRef.current = time;
            const progress = Math.min((time - startTimeRef.current) / duration, 1);
            
            // Power ease-out function
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (endValue - startValue) * ease;
            
            setDisplayValue(current);
            draw(current);

            if (progress < 1) {
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        startTimeRef.current = undefined;
        requestRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numericValue]);

    const draw = (val: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        
        // Setup dimensions
        const width = size;
        const height = size * 0.7;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const centerX = width / 2;
        const centerY = height - 40;
        const radius = (width / 2) - 40;
        const startAngle = Math.PI; // 180 degrees
        const endAngle = 2 * Math.PI; // 360 degrees
        const currentAngle = startAngle + (val / 100) * (endAngle - startAngle);

        ctx.clearRect(0, 0, width, height);

        // 1. Draw Background Track
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 2. Draw Subtle Inner Shadow for Track
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 8, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3. Draw Main Progress Arc (reduced glow)
        ctx.save();
        ctx.shadowBlur = 6; // Reduced from 15
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();

        // 4. Draw Highlight Trace (a bright tip)
        if (val > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle - 0.05, currentAngle);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        // 5. Draw the "Needle" or Point
        const needleX = centerX + Math.cos(currentAngle) * radius;
        const needleY = centerY + Math.sin(currentAngle) * radius;
        
        ctx.beginPath();
        ctx.arc(needleX, needleY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
    };

    return (
        <div 
            className="relative flex flex-col items-center justify-center overflow-hidden transition-all duration-500 rounded-3xl bg-[#0a0a0a] border border-white/5 p-4"
            style={{ width: size }}
        >
            <canvas 
                ref={canvasRef} 
                style={{ width: size, height: size * 0.7 }}
                className="z-10"
            />
            
            {/* Centered Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 pointer-events-none">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white tracking-tighter">
                        {Math.round(displayValue)}
                    </span>
                    <span className="text-xl font-medium text-zinc-500">%</span>
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 opacity-60">
                    {label}
                </div>
            </div>

            {/* Ambient Floor Glow - Very subtle */}
            <div 
                className="absolute bottom-[-20%] w-[40%] h-[20%] blur-2xl opacity-20 transition-all duration-1000"
                style={{ backgroundColor: color }}
            />
        </div>
    );
};

const MetricCard = ({ label, value, accentColor }: { label: string; value: number; accentColor: string }) => {
    return (
        <div className="flex-1 min-w-40 p-6 rounded-lg border border-white/6 bg-white/2 hover:bg-white/3 transition-all duration-300 relative group">
            {/* Subtle accent line on top */}
            <div 
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg opacity-60 group-hover:opacity-100 transition-opacity"
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
            <LuminaGauge 
                label="Visibility Score" 
                value={visibilityScore} 
                color="#f59e0b"
                size={280}
            />
            <LuminaGauge 
                label="Citation Share" 
                value={citationShare} 
                color="#10b981"
                size={280}
            />
            <MetricCard 
                label="Responses Analyzed" 
                value={responsesAnalyzed} 
                accentColor="#575BC7"
            />
        </div>
    );
};

export default HighLevelMetrics;