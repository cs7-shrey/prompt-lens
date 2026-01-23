"use client";

import { Check } from "lucide-react";

const ACCENT = "#575BC7";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number;
}

const stepLabels = [
    "Company Info",
    "AI Sources",
    "Details",
    "Competitors",
    "Prompts"
];

export function StepIndicator({ currentStep, totalSteps = 5 }: StepIndicatorProps) {
    return (
        <div className="mb-12">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
                    const isCompleted = step < currentStep;
                    const isCurrent = step === currentStep;
                    
                    return (
                        <div key={step} className="flex items-center flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`
                                        flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                                        ${isCurrent ? 'border-[#575BC7] bg-[#575BC7]/10' : ''}
                                        ${isCompleted ? 'border-[#575BC7] bg-[#575BC7]' : ''}
                                        ${!isCurrent && !isCompleted ? 'border-white/[0.1] bg-white/[0.02]' : ''}
                                    `}
                                >
                                    {isCompleted ? (
                                        <Check size={16} style={{ color: '#fff' }} strokeWidth={3} />
                                    ) : (
                                        <span
                                            className={`text-sm font-semibold ${
                                                isCurrent ? 'text-[#575BC7]' : 'text-zinc-600'
                                            }`}
                                        >
                                            {step}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden sm:block">
                                    <div
                                        className={`text-sm font-medium transition-colors ${
                                            isCurrent ? 'text-zinc-200' : 'text-zinc-600'
                                        }`}
                                    >
                                        {stepLabels[step - 1]}
                                    </div>
                                </div>
                            </div>
                            {step < totalSteps && (
                                <div
                                    className={`w-8 sm:w-12 h-[2px] mx-2 transition-colors ${
                                        isCompleted ? 'bg-[#575BC7]' : 'bg-white/[0.05]'
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
