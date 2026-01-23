"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MultiInput } from "../ui/multi-input";

const promptsSchema = z.object({
    promptsToMonitor: z
        .array(z.string().min(1, "Prompt cannot be empty"))
        .min(1, "Add at least one prompt to monitor")
        .max(10, "You can add up to 10 prompts")
        .refine((prompts) => new Set(prompts).size === prompts.length, {
            message: "Prompts must be unique",
        }),
});

type PromptsForm = z.infer<typeof promptsSchema>;

interface Step5Props {
    defaultValues?: Partial<PromptsForm>;
    onNext: (data: PromptsForm) => void;
}

export function Step5Prompts({ defaultValues, onNext }: Step5Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PromptsForm>({
        resolver: zodResolver(promptsSchema),
        defaultValues: defaultValues || { promptsToMonitor: [""] },
    });

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-8">
            <div>
                <h2 className="text-2xl font-medium text-zinc-100 mb-2">
                    What prompts should we monitor?
                </h2>
                <p className="text-sm text-zinc-500">
                    Add the questions or prompts you want to track across AI platforms. These will help you understand how AI models respond about your industry.
                </p>
            </div>

            <div>
                <Controller
                    name="promptsToMonitor"
                    control={control}
                    render={({ field }) => (
                        <MultiInput
                            label="Prompts"
                            values={field.value || [""]}
                            onChange={field.onChange}
                            placeholder="e.g., What are the best CRM tools for small businesses?"
                            maxItems={10}
                        />
                    )}
                />
                {errors.promptsToMonitor && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.promptsToMonitor.message}
                    </p>
                )}
            </div>

            <div className="bg-white/[0.01] border border-white/[0.04] rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-300 mb-2">Tips for effective prompts:</h3>
                <ul className="text-xs text-zinc-500 space-y-1 list-disc list-inside">
                    <li>Use questions your customers would ask</li>
                    <li>Include industry-specific keywords</li>
                    <li>Focus on comparison and recommendation queries</li>
                    <li>Be specific about use cases or scenarios</li>
                </ul>
            </div>
        </form>
    );
}
