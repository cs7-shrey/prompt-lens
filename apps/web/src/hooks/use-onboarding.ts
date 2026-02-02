"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
    OnboardingFormData,
    ExtractDataResponse,
    CompanyInfo,
    AISource,
    CompanyDetails,
    Competitor,
} from "@/types/onboarding";
import { trpcClient } from "@/utils/trpc-client";

interface UseOnboardingReturn {
    currentStep: number;
    formData: Partial<OnboardingFormData>;
    suggestions: ExtractDataResponse | null;
    isExtractLoading: boolean;
    extractFailed: boolean;
    isSubmitting: boolean;
    goToStep: (step: number) => void;
    goNext: () => void;
    goBack: () => void;
    updateStep1: (data: CompanyInfo) => void;
    updateStep2: (data: { sourcesToMonitor: AISource[] }) => void;
    updateStep3: (data: CompanyDetails) => void;
    updateStep4: (data: { competitors: Competitor[] }) => void;
    updateStep5: (data: { promptsToMonitor: string[] }) => void;
    submitOnboarding: (finalStepData?: { promptsToMonitor: string[] }) => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});
    const [suggestions, setSuggestions] = useState<ExtractDataResponse | null>(null);
    const [isExtractLoading, setIsExtractLoading] = useState(false);
    const [extractFailed, setExtractFailed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const goToStep = useCallback((step: number) => {
        setCurrentStep(step);
    }, []);

    const goNext = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, 5));
    }, []);

    const goBack = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    }, []);

    const updateStep1 = useCallback((data: CompanyInfo) => {
        setFormData((prev) => ({ ...prev, companyInfo: data }));
        
        // Trigger extract data API (non-blocking) - fire and forget
        setIsExtractLoading(true);
        setExtractFailed(false);
        
        // Fire off the API call asynchronously without blocking
        trpcClient.onboarding.extractDataFromWebsite.query({
            companyName: data.companyName,
            websiteUrl: data.websiteUrl
        })
        .then((result) => {
            console.log(result);
            setSuggestions(result);
            toast.success("Website analyzed successfully!");
        })
        .catch((error) => {
            console.error("Extract data failed:", error);
            setExtractFailed(true);
            toast.error("Could not analyze website. You can fill details manually.");
        })
        .finally(() => {
            setIsExtractLoading(false);
        });
        
        // Proceed to next step immediately without waiting
        goNext();
    }, [goNext]);

    const updateStep2 = useCallback((data: { sourcesToMonitor: AISource[] }) => {
        setFormData((prev) => ({ ...prev, sourcesToMonitor: data.sourcesToMonitor }));
        goNext();
    }, [goNext]);

    const updateStep3 = useCallback((data: CompanyDetails) => {
        setFormData((prev) => ({ ...prev, companyDetails: data }));
        goNext();
    }, [goNext]);

    const updateStep4 = useCallback((data: { competitors: Competitor[] }) => {
        setFormData((prev) => ({ ...prev, competitors: data.competitors }));
        goNext();
    }, [goNext]);

    const updateStep5 = useCallback((data: { promptsToMonitor: string[] }) => {
        setFormData((prev) => ({ ...prev, promptsToMonitor: data.promptsToMonitor }));
        // Final step - data is set but not submitted yet
    }, []);

    const submitOnboarding = useCallback(async (finalStepData?: { promptsToMonitor: string[] }) => {
        // Use finalStepData if provided (from step 5 submit), otherwise use state
        const promptsToMonitor = finalStepData?.promptsToMonitor || formData.promptsToMonitor;
        
        if (!formData.companyInfo || !formData.sourcesToMonitor || !formData.companyDetails || !promptsToMonitor) {
            toast.error("Please complete all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                company: {
                    companyName: formData.companyInfo.companyName,
                    websiteUrl: formData.companyInfo.websiteUrl,
                    shortDescription: formData.companyDetails.shortDescription,
                    category: formData.companyDetails.category,
                    fullDescription: formData.companyDetails.fullDescription || "",
                    keyFeatures: formData.companyDetails.keyFeatures || [],
                },
                competitors: formData.competitors || [],
                promptsToMonitor: promptsToMonitor,
                sourcesToMonitor: formData.sourcesToMonitor,
            };

            await trpcClient.onboarding.createTrackingCompanyAndMonitor.mutate(payload)
            toast.success("Onboarding completed successfully!");
            router.push("/dashboard" as any);
        } catch (error: any) {
            console.error("Onboarding failed:", error);
            const message = error?.response?.data?.message || "Failed to complete onboarding";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, router]);

    return {
        currentStep,
        formData,
        suggestions,
        isExtractLoading,
        extractFailed,
        isSubmitting,
        goToStep,
        goNext,
        goBack,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStep4,
        updateStep5,
        submitOnboarding,
    };
}
