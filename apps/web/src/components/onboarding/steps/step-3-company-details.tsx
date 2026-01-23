"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";
import { MultiInput } from "../ui/multi-input";
import { InputShimmer } from "../ui/input-shimmer";

const companyDetailsSchema = z.object({
    shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
    fullDescription: z.string().optional(),
    keyFeatures: z.array(z.string()).optional(),
});

type CompanyDetailsForm = z.infer<typeof companyDetailsSchema>;

interface Step3Props {
    defaultValues?: Partial<CompanyDetailsForm>;
    isLoading?: boolean;
    loadingFailed?: boolean;
    onNext: (data: CompanyDetailsForm) => void;
}

export function Step3CompanyDetails({ 
    defaultValues, 
    isLoading = false,
    loadingFailed = false,
    onNext 
}: Step3Props) {
    const [showOptional, setShowOptional] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CompanyDetailsForm>({
        resolver: zodResolver(companyDetailsSchema),
        defaultValues,
    });

    const keyFeatures = watch("keyFeatures") || [];

    // Update form values when suggestions arrive
    useEffect(() => {
        if (defaultValues && !isLoading) {
            Object.entries(defaultValues).forEach(([key, value]) => {
                setValue(key as keyof CompanyDetailsForm, value);
            });
        }
    }, [defaultValues, isLoading, setValue]);

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-8">
            <div>
                <h2 className="text-2xl font-medium text-zinc-100 mb-2">
                    Company details
                </h2>
                <p className="text-sm text-zinc-500">
                    Help AI models understand what your company does.
                </p>
            </div>

            {/* Loading Banner */}
            {isLoading && (
                <div className="flex items-center gap-3 p-4 bg-[#575BC7]/10 border border-[#575BC7]/20 rounded-lg">
                    <Loader2 size={16} className="animate-spin text-[#575BC7]" />
                    <span className="text-sm text-zinc-300">
                        Analyzing your website to generate suggestions...
                    </span>
                </div>
            )}

            {/* Error Banner */}
            {loadingFailed && !isLoading && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-sm text-zinc-300">
                        Could not load suggestions. Please fill in the details manually.
                    </span>
                </div>
            )}

            <div className="space-y-6">
                {/* Short Description */}
                <div className="relative">
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-zinc-400 mb-2">
                        Short Description <span className="text-red-500">*</span>
                    </label>
                    {isLoading && (
                        <div className="relative">
                            <div className="h-[88px] rounded-lg"></div>
                            <InputShimmer />
                        </div>
                    )}
                    {!isLoading && (
                        <>
                            <textarea
                                {...register("shortDescription")}
                                id="shortDescription"
                                rows={3}
                                placeholder="A brief description of what your company does..."
                                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-lg text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#575BC7] transition-colors resize-none"
                            />
                            {errors.shortDescription && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.shortDescription.message}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Category */}
                <div className="relative">
                    <label htmlFor="category" className="block text-sm font-medium text-zinc-400 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    {isLoading && (
                        <div className="relative">
                            <div className="h-[48px] rounded-lg"></div>
                            <InputShimmer />
                        </div>
                    )}
                    {!isLoading && (
                        <>
                            <input
                                {...register("category")}
                                type="text"
                                id="category"
                                placeholder="e.g., SaaS, E-commerce, AI Tools..."
                                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-lg text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#575BC7] transition-colors"
                            />
                            {errors.category && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.category.message}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Show/Hide Optional Fields */}
                <button
                    type="button"
                    onClick={() => setShowOptional(!showOptional)}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {showOptional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {showOptional ? "Hide" : "Show"} optional fields
                </button>

                {/* Optional Fields */}
                {showOptional && (
                    <div className="space-y-6 pt-2">
                        {/* Full Description */}
                        <div className="relative">
                            <label htmlFor="fullDescription" className="block text-sm font-medium text-zinc-400 mb-2">
                                Full Description
                            </label>
                            {isLoading && (
                                <div className="relative">
                                    <div className="h-[120px] rounded-lg"></div>
                                    <InputShimmer />
                                </div>
                            )}
                            {!isLoading && (
                                <textarea
                                    {...register("fullDescription")}
                                    id="fullDescription"
                                    rows={4}
                                    placeholder="A more detailed description of your company, products, and services..."
                                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-lg text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#575BC7] transition-colors resize-none"
                                />
                            )}
                        </div>

                        {/* Key Features */}
                        {!isLoading && (
                            <MultiInput
                                label="Key Features"
                                values={keyFeatures}
                                onChange={(values) => setValue("keyFeatures", values)}
                                placeholder="Enter a key feature..."
                                maxItems={10}
                            />
                        )}
                    </div>
                )}
            </div>
        </form>
    );
}
