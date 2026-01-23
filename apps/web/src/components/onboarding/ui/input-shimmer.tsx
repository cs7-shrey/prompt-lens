export function InputShimmer() {
    return (
        <div className="absolute inset-0 overflow-hidden rounded-lg bg-white/2 border border-white/6">
            <div className="h-full w-full relative">
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
                    style={{
                        animation: "shimmer 2s infinite",
                    }}
                />
            </div>
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
}
