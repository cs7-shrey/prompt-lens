"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import type { DateRangeOption } from "@/hooks/use-dashboard";

interface DateRangeSelectorProps {
  value: DateRangeOption;
  onValueChange: (value: DateRangeOption) => void;
}

const dateRangeLabels: Record<DateRangeOption, string> = {
  "7d": "Last 7 days",
  "14d": "Last 14 days",
  "1m": "Last month",
  "6m": "Last 6 months",
};

export function DateRangeSelector({ value, onValueChange }: DateRangeSelectorProps) {
  const handleValueChange = (newValue: DateRangeOption | null) => {
    if (newValue) {
      onValueChange(newValue);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-45 bg-[#0a0a0a] border-zinc-800 text-zinc-400 hover:bg-[#111111] hover:text-zinc-300 transition-all duration-200">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#0a0a0a] border-zinc-800 animate-in fade-in-0 zoom-in-95 duration-200">
        {(Object.entries(dateRangeLabels) as [DateRangeOption, string][]).map(([key, label]) => (
          <SelectItem 
            key={key} 
            value={key}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer transition-colors duration-150"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
