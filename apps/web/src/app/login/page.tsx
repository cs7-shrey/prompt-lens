"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Loader2, 
  ShieldCheck, 
  Command,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

// Unified Accent Color
const ACCENT = "#575BC7";


export default function LoginPage() {
  const { isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({ 
          provider: "google",
          callbackURL: "/dashboard",
        },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to sign in");
          },
        }
      );
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className='animate-spin'/>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen bg-[#030303] items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-6 h-6 border-2 border-white/10 border-t-[#575BC7] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#030303] selection:bg-[#575BC7]/30 selection:text-white">
      
      {/* Left side - Technical Auth Interface */}
      <div className="relative flex flex-col items-center justify-center p-8 border-r border-white/[0.02]">
        
        {/* Top Navigation / Brand */}
        <div className="absolute top-10 left-10 flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <Link href="/" className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">Back to Site</Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[380px]"
        >
          {/* Brand Identity */}
          <div className="flex justify-center mb-12">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-xl shadow-[#575BC7]/10"
              style={{ backgroundColor: ACCENT }}
            >
              <Target size={20} strokeWidth={3} />
            </div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-[28px] font-medium tracking-tight text-zinc-100 mb-2">
              Access Protocol
            </h1>
            <p className="text-[14px] text-zinc-500 font-medium">
              Authenticate via secure identity provider.
            </p>
          </div>

          <div className="space-y-6">
            {/* Google Login Button - Redesigned as a Technical Component */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`
                relative w-full flex items-center justify-center gap-3 px-6 py-4 
                bg-white/[0.02] border border-white/[0.06] rounded-xl text-[13px] font-bold text-zinc-200
                transition-all duration-300 group overflow-hidden
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/[0.04] hover:border-white/[0.1] active:scale-[0.99]'}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin text-zinc-500" />
                  <span className="tracking-widest uppercase text-[10px]">Verifying...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-80 group-hover:opacity-100 transition-opacity">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity="0.5"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff" opacity="0.3"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#fff" opacity="0.5"/>
                  </svg>
                  <span className="tracking-widest uppercase text-[10px]">Connect with Google</span>
                </>
              )}
              {/* Subtle accent hover line */}
              <div 
                className="absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: ACCENT }}
              />
            </button>
          </div>

          {/* Legal / Footer */}
          <div className="mt-20 pt-10 border-t border-white/[0.03] text-center">
            <p className="text-[11px] leading-relaxed text-zinc-600 font-medium">
              Enterprise grade encryption active. By entering, you confirm agreement with our{' '}
              <a href="#" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4 decoration-white/10">Protocols</a>.
            </p>
          </div>
        </motion.div>
        <div className='absolute w-[0.1rem] right-0 h-screen flex items-center justify-center'>
            <div className='w-full h-[60vh] bg-[#2c2e4e74]'>

            </div>
        </div>
      </div>


      {/* Right side - Spectral Data Stream Art */}
      <div className="hidden md:flex items-center justify-center bg-black relative overflow-hidden">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
        />
        
        {/* Subtle radial light from accent */}
        <div 
          className="absolute w-[600px] h-[600px] opacity-[0.1] blur-[120px]"
          style={{ background: `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)` }}
        />

        <div className="relative z-10 w-full max-w-md space-y-8 p-12">
          {/* Abstract Data Stream Visual */}
          <div className="space-y-3">
             {[0.1, 0.4, 0.2, 0.8, 0.3, 0.5, 0.2].map((op, i) => (
               <motion.div 
                 key={i}
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.random() * 100}%` }}
                 transition={{ repeat: Infinity, duration: 3 + i, repeatType: 'reverse' }}
                 className="h-1 rounded-full bg-white/[0.03] relative overflow-hidden"
               >
                 <div 
                    className="absolute inset-0 h-full w-24"
                    style={{ 
                      background: `linear-gradient(90deg, transparent, ${ACCENT}${Math.floor(op * 255).toString(16)}, transparent)`,
                      left: `${op * 100}%`
                    }}
                 />
               </motion.div>
             ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-zinc-500 font-bold uppercase text-[9px] tracking-[0.3em]">
              <ShieldCheck size={14} style={{ color: ACCENT }} />
              Secure Inference Endpoint
            </div>
            <h2 className="text-2xl font-medium text-zinc-200 tracking-tight leading-snug">
              "Is Salesforce or HubSpot better for a 10-person agency?"
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">
              We monitor 1.2M+ variations of this query daily to identify exactly how your brand is weighted in the synthetic recommendation layer.
            </p>
          </div>

          <div className="pt-8 flex gap-4">
             <div className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Stealth-Mode</div>
             <div className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Audit-Log: Enabled</div>
          </div>
        </div>

        {/* Floating Technical Badge */}
        <div className="absolute bottom-10 right-10 flex items-center gap-4 text-zinc-700 text-[9px] font-bold uppercase tracking-[0.2em]">
           <div className="flex items-center gap-2">
             <Command size={10} />
             Handshake Verified
           </div>
           <div className="w-1 h-1 rounded-full bg-zinc-800" />
           <div className="flex items-center gap-2">
             <div className="w-1 h-1 rounded-full" style={{ backgroundColor: ACCENT }} />
             Node 12-B
           </div>
        </div>
      </div>
    </div>
  );
}