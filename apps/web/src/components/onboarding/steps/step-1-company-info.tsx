"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const companyInfoSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    websiteUrl: z.string().url("Please enter a valid URL"),
});

type CompanyInfoForm = z.infer<typeof companyInfoSchema>;

interface Step1Props {
    defaultValues?: Partial<CompanyInfoForm>;
    onNext: (data: CompanyInfoForm) => void;
}

export function Step1CompanyInfo({ defaultValues, onNext }: Step1Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CompanyInfoForm>({
        resolver: zodResolver(companyInfoSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-8">
            <div>
                <h2 className="text-2xl font-medium text-zinc-100 mb-2">
                    Let's get started
                </h2>
                <p className="text-sm text-zinc-500">
                    Tell us about your company to begin monitoring your AI visibility.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-zinc-400 mb-2">
                        Company Name
                    </label>
                    <input
                        {...register("companyName")}
                        type="text"
                        id="companyName"
                        placeholder="Acme Corporation"
                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-lg text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#575BC7] transition-colors"
                    />
                    {errors.companyName && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.companyName.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-zinc-400 mb-2">
                        Company Website
                    </label>
                    <input
                        {...register("websiteUrl")}
                        type="url"
                        id="websiteUrl"
                        placeholder="https://acme.com"
                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-lg text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#575BC7] transition-colors"
                    />
                    {errors.websiteUrl && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.websiteUrl.message}
                        </p>
                    )}
                    <p className="mt-2 text-xs text-zinc-600">
                        We'll analyze your website to provide personalized suggestions.
                    </p>
                </div>
            </div>
        </form>
    );
}
