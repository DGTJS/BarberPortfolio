"use client";

import { cn } from "@/lib/utils";
import { Store, Scissors, Calendar, Clock } from "lucide-react";

export interface ChatButtonOption {
  id?: string;
  value?: string;
  label: string;
}

interface ChatButtonGroupProps {
  type: "barbershops" | "services" | "dates" | "timeSlots";
  options: ChatButtonOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

const iconMap = {
  barbershops: Store,
  services: Scissors,
  dates: Calendar,
  timeSlots: Clock,
};

export function ChatButtonGroup({
  type,
  options,
  onSelect,
  disabled,
}: ChatButtonGroupProps) {
  const Icon = iconMap[type];

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {options.map((option, index) => {
        const value = option.id ?? option.value ?? option.label;
        return (
          <button
            key={`${type}-${index}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(value)}
            className={cn(
              "flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm max-w-full bg-background text-foreground hover:bg-secondary transition-colors cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
