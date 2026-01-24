"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Sparkles, Search } from "lucide-react";
import type { AISource } from "@/types/onboarding";
import perplexityIcon from "@/assets/perplexity-ai-icon.svg";
import claudeIcon from "@/assets/claude-ai-icon.svg";
import chatgptIcon from "@/assets/chatgpt-ai-icon.svg";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const aiSourcesSchema = z.object({
    sourcesToMonitor: z
        .array(z.enum(["CHATGPT", "CLAUDE", "PERPLEXITY"]))
        .min(1, "Select at least one AI source")
        .max(3, "You can select up to 3 sources"),
});

type AISourcesForm = z.infer<typeof aiSourcesSchema>;

interface Step2Props {
    defaultValues?: Partial<AISourcesForm>;
    onNext: (data: AISourcesForm) => void;
}

const IMAGE_SIZE = 40;

const sources: { id: AISource; label: string; icon: React.ReactNode }[] = [
    { id: "CHATGPT", label: "ChatGPT", icon: <Image src={"/chatgpt-icon.svg"} alt="ChatGPT" width={IMAGE_SIZE} height={IMAGE_SIZE} /> },
    { id: "CLAUDE", label: "Claude", icon: <Image src={"/claude-ai-icon.svg"} alt="Claude" width={IMAGE_SIZE} height={IMAGE_SIZE} /> },
    { id: "PERPLEXITY", label: "Perplexity", icon: <Image src={"/perplexity-ai-icon.svg"} alt="Perplexity" width={IMAGE_SIZE} height={IMAGE_SIZE} /> },
];

export function Step2AISources({ defaultValues, onNext }: Step2Props) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AISourcesForm>({
        resolver: zodResolver(aiSourcesSchema),
        defaultValues,
    });

    const selectedSources = watch("sourcesToMonitor") || [];

    const handleCheckboxChange = (sourceId: AISource, checked: boolean) => {
        const current = selectedSources;
        const updated = checked
            ? [...current, sourceId]
            : current.filter((id) => id !== sourceId);
        setValue("sourcesToMonitor", updated, { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-8">
            <div>
                <h2 className="text-2xl font-medium text-zinc-100 mb-2">
                    Select AI sources to monitor
                </h2>
                <p className="text-sm text-zinc-500">
                    Choose which AI platforms you want to track. You can select up to 3.
                </p>
            </div>

            <div className="space-y-4">
                {sources.map((source) => {
                    const isChecked = selectedSources.includes(source.id);
                    return (
                        <label
                            key={source.id}
                            className={`
                                flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all
                                ${isChecked
                                    ? 'border-[#575BC7] bg-[#575BC7]/5'
                                    : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.02]'
                                }
                            `}
                        >
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => handleCheckboxChange(source.id, checked as boolean)}
                                className="w-5 h-5"
                            />
                            <div className="flex items-center gap-3 flex-1">
                                <div
                                    className={`
                                        p-2 rounded-lg transition-colors
                                        ${isChecked ? 'text-[#575BC7]' : 'text-zinc-500'}
                                    `}
                                >
                                    {source.icon}
                                </div>
                                <span className="text-base font-medium text-zinc-200">
                                    {source.label}
                                </span>
                            </div>
                        </label>
                    );
                })}
                {errors.sourcesToMonitor && (
                    <p className="text-sm text-red-500">
                        {errors.sourcesToMonitor.message}
                    </p>
                )}
            </div>
        </form>
    );
}
