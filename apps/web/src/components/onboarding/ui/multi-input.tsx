"use client";

import { X, Plus } from "lucide-react";

interface MultiInputProps {
    values: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    maxItems?: number;
    label?: string;
}

export function MultiInput({ 
    values, 
    onChange, 
    placeholder = "Add item...", 
    maxItems,
    label 
}: MultiInputProps) {
    // Ensure values is always an array
    const safeValues = Array.isArray(values) ? values : [];

    const handleAdd = () => {
        onChange([...safeValues, ""]);
    };

    const handleRemove = (index: number) => {
        onChange(safeValues.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, value: string) => {
        const newValues = [...safeValues];
        newValues[index] = value;
        onChange(newValues);
    };

    const canAdd = !maxItems || safeValues.length < maxItems;

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-medium text-zinc-400">
                    {label}
                </label>
            )}
            <div className="space-y-2">
                {safeValues.map((value, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(index, e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 px-4 py-3 bg-white/2 border border-white/6 rounded-lg text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#575BC7] transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="p-3 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
                {canAdd && (
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="w-full px-4 py-3 border border-dashed border-white/[0.1] rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:border-white/[0.2] transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        Add {label || "item"}
                    </button>
                )}
            </div>
        </div>
    );
}

interface CompetitorInputProps {
    competitors: { name: string; websiteUrl: string }[];
    onChange: (competitors: { name: string; websiteUrl: string }[]) => void;
    maxItems?: number;
}

export function CompetitorInput({ competitors, onChange, maxItems }: CompetitorInputProps) {
    // Ensure competitors is always an array
    const safeCompetitors = Array.isArray(competitors) ? competitors : [];

    const handleAdd = () => {
        onChange([...safeCompetitors, { name: "", websiteUrl: "" }]);
    };

    const handleRemove = (index: number) => {
        onChange(safeCompetitors.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: "name" | "websiteUrl", value: string) => {
        const newCompetitors = [...safeCompetitors];
        newCompetitors[index] = { ...newCompetitors[index], [field]: value };
        onChange(newCompetitors);
    };

    const canAdd = !maxItems || safeCompetitors.length < maxItems;

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-400">
                Competitors
            </label>
            <div className="space-y-4">
                {safeCompetitors.map((competitor, index) => (
                    <div key={index} className="space-y-2 p-4 bg-white/[0.01] border border-white/[0.04] rounded-lg hover:border-white/[0.08] transition-colors">
                        <div className="flex justify-between items-start">
                            <span className="text-xs text-zinc-600 font-medium">Competitor {index + 1}</span>
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="text-zinc-600 hover:text-zinc-400 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={competitor.name}
                            onChange={(e) => handleChange(index, "name", e.target.value)}
                            placeholder="Competitor name"
                            className="w-full px-4 py-2.5 bg-white/2 border border-white/6 rounded-lg text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#575BC7] transition-colors"
                        />
                        <input
                            type="url"
                            value={competitor.websiteUrl}
                            onChange={(e) => handleChange(index, "websiteUrl", e.target.value)}
                            placeholder="https://competitor.com"
                            className="w-full px-4 py-2.5 bg-white/2 border border-white/6 rounded-lg text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#575BC7] transition-colors"
                        />
                    </div>
                ))}
                {canAdd && (
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="w-full px-4 py-3 border border-dashed border-white/10 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        Add Competitor
                    </button>
                )}
            </div>
        </div>
    );
}
