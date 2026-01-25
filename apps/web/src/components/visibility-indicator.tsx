interface VisibilityIndicatorProps {
  visibility: number;
}

const VisibilityIndicator = ({ visibility = 0 }) => {
  const percentage = Math.round(visibility * 100);
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (visibility * circumference);

  // Color logic: Muted zinc for low visibility, emerald for high
  const colorClass = visibility > 0.7 ? 'text-emerald-500' : visibility > 0.3 ? 'text-zinc-400' : 'text-zinc-600';
  const glowClass = visibility > 0.8 ? 'drop-shadow-[0_0_3px_rgba(16,185,129,0.4)]' : '';

  return (
    <div className="flex items-center gap-3 w-fit group cursor-default">
      <div className="relative flex items-center justify-center flex-shrink-0">
        {/* The Track: Subtle depth for dark mode */}
        <svg className="w-6 h-6 -rotate-90 transform transition-transform duration-500 group-hover:scale-110">
          <circle
            cx="12"
            cy="12"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-zinc-800"
          />
          {/* The Progress Fill */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease'
            }}
            className={`${colorClass} ${glowClass}`}
            strokeLinecap="round"
          />
          {/* Precision Center Point */}
          <circle
            cx="12"
            cy="12"
            r="1"
            className="fill-zinc-700"
          />
        </svg>
      </div>

      <div className="flex flex-col -space-y-1">
        <span className="text-[12px] font-mono font-bold text-zinc-200 tabular-nums">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default VisibilityIndicator;