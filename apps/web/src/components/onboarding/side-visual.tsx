const ACCENT = "#575BC7";
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Zap, LineChart, BarChart3 } from 'lucide-react';

const SideVisual = () => {
    return (
        <div className="relative flex flex-col justify-between p-12 lg:p-16 bg-black border-r border-white/[0.02] min-h-screen">
                
                {/* Brand Logo */}
                <div className="flex items-center gap-2.5 group cursor-pointer">
                    <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: ACCENT }}
                    >
                        <Target size={16} strokeWidth={3} />
                    </div>
                    <span className="font-bold tracking-tight text-zinc-100 uppercase text-[11px]">PromptLens</span>
                </div>

                {/* Main Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-12 max-w-xl"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100 mb-6 leading-tight">
                            Optimize for{' '}
                            <span className="relative inline-block">
                                <span style={{ color: ACCENT }}>AI Search</span>
                                <div 
                                    className="absolute -bottom-2 left-0 w-full h-[2px]"
                                    style={{ backgroundColor: ACCENT, opacity: 0.3 }}
                                />
                            </span>
                        </h1>
                        <p className="text-base text-zinc-500 font-medium leading-relaxed">
                            AI is changing how consumers discover brands. PromptLens makes sure they discover yours.
                        </p>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-6">
                        <FeatureItem 
                            icon={<CheckCircle2 size={18} style={{ color: ACCENT }} />}
                            title="See what AI says about your business"
                            description="Your AI Visibility score shows how discoverable you are and how ChatGPT, Google AI and other models describe your brand."
                        />
                        <FeatureItem 
                            icon={<Zap size={18} style={{ color: ACCENT }} />}
                            title="Get content that boosts your AI Visibility"
                            description="We help you create content optimized for AI models tailored for your target audience."
                        />
                        <FeatureItem 
                            icon={<LineChart size={18} style={{ color: ACCENT }} />}
                            title="Measure outcome with clarity"
                            description="Detailed analytics help you evaluate progress and refine your strategy efficiently."
                        />
                    </div>
                </motion.div>

                {/* Bottom Badge */}
                <div className="flex items-center gap-3 text-[9px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: ACCENT }} />
                        Secure Setup
                    </div>
                </div>
            </div>
    )
}

const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-2">{title}</h3>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{description}</p>
        </div>
    </div>
);

const MetricCard = ({ label, value, trend }: { label: string, value: string, trend: string }) => (
    <div className="bg-white/[0.02] border border-white/[0.03] rounded-lg p-3">
        <div className="text-[8px] font-bold text-zinc-600 tracking-wider uppercase mb-1">{label}</div>
        <div className="text-lg font-semibold text-zinc-200 mb-1">{value}</div>
        <div className="text-[9px] font-bold text-emerald-500">{trend}</div>
    </div>
);

export default SideVisual;