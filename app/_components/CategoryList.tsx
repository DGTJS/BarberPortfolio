"use client";

import { cn } from "@/lib/utils";
import { categories } from "@/app/_data/categories";

interface CategoryListProps {
  variant?: "buttons" | "links";
  onSelect?: (search: string) => void;
  className?: string;
}

export function CategoryList({
  variant = "buttons",
  onSelect,
  className,
}: CategoryListProps) {
  return (
    <div
      className={cn(
        variant === "buttons"
          ? "flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden"
          : "flex flex-col gap-1",
        className,
      )}
    >
      {categories.map(({ name, search, icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect?.(search)}
          className={cn(
            variant === "buttons"
              ? "flex items-center gap-3 rounded-full border border-border px-4 py-3 shrink-0 text-foreground hover:bg-accent transition-colors cursor-pointer"
              : "flex items-center gap-3 rounded-full px-5 py-3 h-10 text-foreground hover:bg-muted/50 transition-colors text-sm font-medium cursor-pointer",
          )}
        >
          <span
            className="[&>svg]:w-4 [&>svg]:h-4 shrink-0 flex items-center"
            dangerouslySetInnerHTML={{ __html: icon }}
          />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
}
