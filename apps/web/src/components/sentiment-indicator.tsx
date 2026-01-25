"use client";

import { Triangle } from "lucide-react";

interface SentimentIndicatorProps {
  sentimentScore: number; // 0 to 1 scale
}

const SentimentIndicator = ({ sentimentScore = 0.5 }) => {
  const score = Math.max(0, Math.min(1, sentimentScore));
  const percentage = score * 100;

  const getStatus = (val: number) => {
    if (val < 0.35) return { text: 'Negative', color: 'text-rose-400', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.2)]' };
    if (val > 0.65) return { text: 'Positive', color: 'text-emerald-400', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]' };
    return { text: 'Neutral', color: 'text-amber-400', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.2)]' };
  };

  const status = getStatus(score);

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-[240px] font-sans selection:bg-zinc-800">
      <div className="relative group">
        {/* The Track: Deeper integration for dark mode */}
        <div className="relative h-1.5 w-full rounded-full bg-zinc-900 border border-zinc-800/50 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-90 transition-opacity"
            style={{
              background: 'linear-gradient(to right, #f43f5e 0%, #fbbf24 50%, #10b981 100%)'
            }}
          />
          {/* Subtle "Vignette" to make the center feel deeper */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        </div>

        {/* The Needle: Precision light-colored pointer */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
          style={{ left: `${percentage}%` }}
        >
          <div className="relative flex flex-col items-center">
            {/* Pointer: White with a subtle outer glow for "active" feeling */}
            <div className={`w-1 h-4 bg-white rounded-full ring-2 ring-zinc-950 shadow-xl ${status.glow} transition-shadow duration-500`} />
            
            {/* Tooltip: Refined for dark mode (zinc-800 background) */}
            <div className="absolute -bottom-7 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
              <span className="text-[9px] font-bold bg-zinc-800 text-zinc-100 border border-zinc-700 px-2 py-0.5 rounded shadow-2xl backdrop-blur-sm">
                {status.text.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentIndicator;