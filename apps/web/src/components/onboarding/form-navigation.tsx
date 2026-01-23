"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const ACCENT = "#575BC7";

interface FormNavigationProps {
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
    isNextDisabled?: boolean;
    isLoading?: boolean;
    nextLabel?: string;
}

export function FormNavigation({
    currentStep,
    totalSteps,
    onBack,
    onNext,
    isNextDisabled = false,
    isLoading = false,
    nextLabel
}: FormNavigationProps) {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;
    
    const defaultNextLabel = isLastStep ? "Complete Setup" : "Next";
    const buttonLabel = nextLabel || defaultNextLabel;

    return (
        <div className="flex items-center justify-between pt-8 border-t border-white/[0.05]">
            <button
                type="button"
                onClick={onBack}
                disabled={isFirstStep || isLoading}
                className={`
                    px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                    ${isFirstStep || isLoading
                        ? 'text-zinc-700 cursor-not-allowed'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                    }
                `}
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <button
                type="button"
                onClick={onNext}
                disabled={isNextDisabled || isLoading}
                className={`
                    px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                    ${isNextDisabled || isLoading
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'text-white hover:brightness-110'
                    }
                `}
                style={
                    !isNextDisabled && !isLoading
                        ? { backgroundColor: ACCENT }
                        : undefined
                }
            >
                {isLoading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        {buttonLabel}
                        {!isLastStep && <ArrowRight size={16} />}
                    </>
                )}
            </button>
        </div>
    );
}
