"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CompetitorInput } from "../ui/multi-input";
import type { Competitor } from "@/types/onboarding";

const competitorsSchema = z.object({
    competitors: z
        .array(
            z.object({
                name: z.string().min(1, "Competitor name is required"),
                websiteUrl: z.string().url("Please enter a valid URL"),
            })
        )
        .max(10, "You can add up to 10 competitors"),
});

type CompetitorsForm = z.infer<typeof competitorsSchema>;

interface Step4Props {
    defaultValues?: Partial<CompetitorsForm>;
    onNext: (data: CompetitorsForm) => void;
}

export function Step4Competitors({ defaultValues, onNext }: Step4Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CompetitorsForm>({
        resolver: zodResolver(competitorsSchema),
        defaultValues: defaultValues || { competitors: [] },
    });

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-8">
            <div>
                <h2 className="text-2xl font-medium text-zinc-100 mb-2">
                    Add your competitors
                </h2>
                <p className="text-sm text-zinc-500">
                    Help us understand your competitive landscape. You can add up to 10 competitors.
                </p>
            </div>

            <div>
                <Controller
                    name="competitors"
                    control={control}
                    render={({ field }) => (
                        <CompetitorInput
                            competitors={field.value || []}
                            onChange={field.onChange}
                            maxItems={10}
                        />
                    )}
                />
                {errors.competitors && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.competitors.message}
                    </p>
                )}
            </div>

            <p className="text-xs text-zinc-600">
                This information helps us track how your brand compares to competitors in AI responses.
            </p>
        </form>
    );
}
