"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Share2, 
  Target, 
  Layers, 
  Globe, 
  ChevronRight, 
  ArrowUpRight, 
  Zap,
  Activity,
  ShieldCheck,
  MousePointer2
} from 'lucide-react';

// New Muted Accent Color: #575BC7
const ACCENT = "#575BC7";

const App = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-400 font-sans selection:bg-[#575BC7]/20 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <MetricsStrip />
        <FeatureBento />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

/**
 * NAVBAR
 * Ultra-thin border, reduced blur for a "sharper" feel
 */
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/[0.03] bg-[#030303]/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2.5 group cursor-pointer">
        <div 
          className="w-6 h-6 rounded flex items-center justify-center text-white transition-all duration-500"
          style={{ backgroundColor: ACCENT }}
        >
          <Target size={13} strokeWidth={3} />
        </div>
        <span className="font-bold tracking-tight text-zinc-100 uppercase text-[10px] letter-spacing-widest">PromptLens</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
        {['Platform', 'Methodology', 'Enterprise'].map(item => (
          <a key={item} href="#" className="hover:text-zinc-200 transition-colors">{item}</a>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <Link href="/login" className="text-[12px] font-medium text-zinc-500 hover:text-zinc-200 transition-colors">Sign in</Link>
        <button className="bg-zinc-100 text-black px-4 py-1.5 rounded text-[11px] font-bold hover:bg-white transition-all">
          Get Access
        </button>
      </div>
    </div>
  </nav>
);

/**
 * HERO
 * Removed loud glows. Used a "shimmer" effect on the text and a very muted radial gradient.
 */
const Hero = () => {
  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden">
      {/* Restrained Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-[0.08]"
          style={{ background: `radial-gradient(circle at center, ${ACCENT} 0%, transparent 70%)` }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full border-x border-white/[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/[0.03] border border-white/[0.05] mb-10">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">Infrastructure v2.4.0 Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-zinc-100 mb-10 max-w-5xl mx-auto leading-[0.9] text-balance">
            The standard for <br /> 
            <span className="text-zinc-500">AI search visibility.</span>
          </h1>
          
          <p className="text-base md:text-lg text-zinc-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
            PromptLens provides the technical framework to monitor, quantify, and optimize your brand presence inside Large Language Models.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              className="px-8 py-3.5 rounded text-white font-bold text-sm transition-all hover:brightness-110 shadow-lg"
              style={{ backgroundColor: ACCENT }}
            >
              Start Free Audit
            </button>
            <button className="bg-transparent text-zinc-400 border border-white/[0.08] px-8 py-3.5 rounded text-sm font-bold hover:bg-white/[0.02] hover:text-zinc-200 transition-all flex items-center gap-2">
              View Methodology
              <ArrowUpRight size={14} className="opacity-40" />
            </button>
          </div>
        </motion.div>

        {/* Hero Visual: Subtle Technical Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-28 relative max-w-5xl mx-auto"
        >
          <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg shadow-3xl overflow-hidden text-left">
            <div className="bg-white/[0.02] border-b border-white/[0.05] px-5 py-3 flex items-center justify-between">
              <div className="flex gap-1.5 opacity-20">
                {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white" />)}
              </div>
              <div className="text-[9px] font-bold text-zinc-600 tracking-[0.3em] uppercase">
                Real-Time Inference Stream
              </div>
              <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-8">
                <div className="h-56 bg-black/40 rounded border border-white/[0.03] relative overflow-hidden flex items-end px-6 py-4">
                   <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                   <div className="w-full flex items-end justify-between gap-2 z-10">
                      {[30, 45, 35, 70, 50, 40, 85, 65, 75, 55, 65, 45, 30].map((h, i) => (
                        <div key={i} className="flex-1 relative group">
                           <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: `${h}%` }}
                             transition={{ delay: 1 + (i * 0.04), duration: 0.8 }}
                             className="w-full rounded-t-[1px] opacity-40 group-hover:opacity-100 transition-opacity"
                             style={{ backgroundColor: ACCENT }}
                           />
                        </div>
                      ))}
                   </div>
                </div>
              </div>
              <div className="md:col-span-4 space-y-5">
                <SmallMetric label="Citation Share" value="24.8%" status="up" />
                <SmallMetric label="Model Authority" value="High" status="stable" />
                <SmallMetric label="Source Count" value="1,402" status="up" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SmallMetric = ({ label, value, status }: { label: string, value: string, status: string }) => (
  <div className="p-4 rounded border border-white/[0.03] bg-white/[0.01]">
    <div className="text-[9px] font-bold text-zinc-600 tracking-widest uppercase mb-1">{label}</div>
    <div className="flex items-center justify-between">
      <div className="text-lg font-medium text-zinc-200">{value}</div>
      <div className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-white/[0.03] text-zinc-500 uppercase tracking-tighter">
        {status}
      </div>
    </div>
  </div>
);

/**
 * METRICS
 */
const MetricsStrip = () => (
  <div className="py-16 border-y border-white/[0.03] bg-black">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
      {[
        { label: 'Latency', value: '84ms' },
        { label: 'Uptime', value: '99.99%' },
        { label: 'Sources', value: '1.2B+' },
        { label: 'Accuracy', value: '99.8%' }
      ].map(m => (
        <div key={m.label} className="text-center">
          <div className="text-xl font-medium text-zinc-200 mb-1">{m.value}</div>
          <div className="text-[9px] font-bold text-zinc-600 tracking-[0.2em] uppercase">{m.label}</div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * FEATURE BENTO
 * Subtle interactions, dark-on-dark contrast
 */
const FeatureBento = () => {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Hero Feature Card */}
          <div className="md:col-span-7 bg-white/[0.01] border border-white/[0.04] rounded-xl p-10 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-zinc-400 mb-8">
                <Activity size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-medium text-zinc-100 mb-4 tracking-tight">Technical Sentiment Audits</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm">
                Understand the weighted semantic bias LLMs hold toward your brand in comparative queries.
              </p>
            </div>
            {/* Very subtle accent hover effect */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
            />
          </div>

          {/* Minimal Solid Card */}
          <div className="md:col-span-5 bg-zinc-900/40 border border-white/[0.04] rounded-xl p-10 flex flex-col justify-between">
            <div>
              <ShieldCheck size={20} className="text-zinc-600 mb-8" />
              <h3 className="text-xl font-medium text-zinc-100 mb-3 tracking-tight">Compliance Grade Proxies</h3>
              <p className="text-zinc-500 text-sm font-medium">Enterprise-level anonymity for high-frequency model monitoring.</p>
            </div>
            <div className="flex gap-2 mt-8">
              {[1,2,3].map(i => <div key={i} className="w-6 h-1 rounded-full bg-zinc-800" />)}
            </div>
          </div>

          <FeatureSmall title="Inference History" icon={Layers} />
          <FeatureSmall title="Global Node Network" icon={Globe} />
          <FeatureSmall title="Automated Reporting" icon={Bot} />
          <FeatureSmall title="Shadow Monitoring" icon={MousePointer2} />
          <FeatureSmall title="Source Attribution" icon={Target} />
        </div>
      </div>
    </section>
  );
};

const FeatureSmall = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
  <div className="md:col-span-2.4 min-w-[200px] flex-1 bg-white/[0.01] border border-white/[0.03] rounded-xl p-6 hover:bg-white/[0.02] transition-colors">
    <Icon size={16} className="text-zinc-600 mb-4" />
    <h4 className="text-[13px] font-medium text-zinc-300">{title}</h4>
  </div>
);

/**
 * CTA
 * High restraint. Pure black background with a very tight border.
 */
const CTASection = () => (
  <section className="py-40 px-6">
    <div className="max-w-4xl mx-auto text-center border border-white/[0.05] rounded-2xl p-16 md:p-24 bg-black relative">
       <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px]" 
          style={{ backgroundColor: ACCENT }}
       />
       <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100 mb-10">
         Secure your AI <br />visibility protocol.
       </h2>
       <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            className="px-10 py-4 rounded font-bold text-sm text-white hover:brightness-110 transition-all shadow-xl"
            style={{ backgroundColor: ACCENT }}
          >
            Start Integration
          </button>
          <button className="text-zinc-500 hover:text-zinc-200 font-bold px-10 py-4 text-sm transition-colors">
            Contact Technical Sales
          </button>
       </div>
    </div>
  </section>
);

/**
 * FOOTER
 */
const Footer = () => (
  <footer className="bg-black border-t border-white/[0.03] pt-24 pb-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
        <div>
           <div className="flex items-center gap-2 mb-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="w-5 h-5 rounded flex items-center justify-center text-white" style={{ backgroundColor: ACCENT }}>
              <Target size={11} strokeWidth={4} />
            </div>
            <span className="font-bold tracking-tighter text-white uppercase text-[9px]">PromptLens</span>
          </div>
          <p className="text-zinc-600 text-[12px] leading-relaxed font-medium">
            Advancing the science of model reputation management.
          </p>
        </div>
        
        {['Infrastructure', 'Resources', 'Legal'].map((col, idx) => (
          <div key={idx}>
            <h4 className="text-[9px] font-bold text-zinc-200 uppercase tracking-[0.3em] mb-8">{col}</h4>
            <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
              {idx === 0 && ['API Reference', 'Model Coverage', 'Stealth Architecture'].map(item => <li key={item}><a href="#" className="hover:text-zinc-200">{item}</a></li>)}
              {idx === 1 && ['Methodology', 'Benchmarks', 'Engineering Blog'].map(item => <li key={item}><a href="#" className="hover:text-white">{item}</a></li>)}
              {idx === 2 && ['Privacy Policy', 'Terms of Service', 'Security'].map(item => <li key={item}><a href="#" className="hover:text-white">{item}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="pt-10 border-t border-white/[0.02] flex justify-between items-center text-[9px] font-bold tracking-[0.25em] text-zinc-700 uppercase">
        <div>© 2026 PromptLens Intelligence Corp.</div>
        <div className="flex items-center gap-2 text-emerald-900">
            <div className="w-1 h-1 rounded-full bg-emerald-700" />
            Core Systems: Active
        </div>
      </div>
    </div>
  </footer>
);

export default App;