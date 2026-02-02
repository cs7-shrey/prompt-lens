"use client"
import { useOnboarding } from "@/hooks/use-onboarding";
import SideVisual from "@/components/onboarding/side-visual";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { FormNavigation } from "@/components/onboarding/form-navigation";
import { Step1CompanyInfo } from "@/components/onboarding/steps/step-1-company-info";
import { Step2AISources } from "@/components/onboarding/steps/step-2-ai-sources";
import { Step3CompanyDetails } from "@/components/onboarding/steps/step-3-company-details";
import { Step4Competitors } from "@/components/onboarding/steps/step-4-competitors";
import { Step5Prompts } from "@/components/onboarding/steps/step-5-prompts";

export default function OnboardingPage() {
    const {
        currentStep,
        formData,
        suggestions,
        isExtractLoading,
        extractFailed,
        isSubmitting,
        goBack,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStep4,
        updateStep5,
        submitOnboarding,
    } = useOnboarding();

    const handleStep1Submit = (data: any) => {
        updateStep1(data);
    };

    const handleStep2Submit = (data: any) => {
        updateStep2(data);
    };

    const handleStep3Submit = (data: any) => {
        updateStep3(data);
    };

    const handleStep4Submit = (data: any) => {
        updateStep4(data);
    };

    const handleStep5Submit = (data: any) => {
        updateStep5(data);
        // Pass the data directly to avoid state timing issues
        submitOnboarding(data);
    };

    // Get the current step form ref for navigation
    const getCurrentStepHandler = () => {
        const formElement = document.querySelector("form");
        if (formElement) {
            formElement.requestSubmit();
        }
    };

    return (
        <div className="flex min-h-screen bg-[#030303]">
            {/* Left Side - Info/Marketing */}
            <div className="hidden lg:block lg:basis-2/5 border-r border-white/[0.02]">
                <SideVisual />
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 lg:basis-3/5 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-2xl">
                    <StepIndicator currentStep={currentStep} totalSteps={5} />

                    <div className="mb-8">
                        {currentStep === 1 && (
                            <Step1CompanyInfo
                                defaultValues={formData.companyInfo}
                                onNext={handleStep1Submit}
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2AISources
                                defaultValues={{ sourcesToMonitor: formData.sourcesToMonitor }}
                                onNext={handleStep2Submit}
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3CompanyDetails
                                defaultValues={
                                    suggestions?.companyData
                                        ? {
                                              shortDescription: suggestions.companyData.shortDescription || "",
                                              category: suggestions.companyData.category || "",
                                              fullDescription: suggestions.companyData.fullDescription || "",
                                              keyFeatures: suggestions.companyData.keyFeatures || [],
                                          }
                                        : formData.companyDetails
                                }
                                isLoading={isExtractLoading}
                                loadingFailed={extractFailed}
                                onNext={handleStep3Submit}
                            />
                        )}
                        {currentStep === 4 && (
                            <Step4Competitors
                                defaultValues={{
                                    competitors: suggestions?.competitors || formData.competitors || [],
                                }}
                                onNext={handleStep4Submit}
                            />
                        )}
                        {currentStep === 5 && (
                            <Step5Prompts
                                defaultValues={{
                                    promptsToMonitor: suggestions?.promptSuggestions || formData.promptsToMonitor || [""],
                                }}
                                onNext={handleStep5Submit}
                            />
                        )}
                    </div>

                    <FormNavigation
                        currentStep={currentStep}
                        totalSteps={5}
                        onBack={goBack}
                        onNext={getCurrentStepHandler}
                        isLoading={isSubmitting || (currentStep === 3 && isExtractLoading)}
                    />
                </div>
            </div>
        </div>
    );
}
