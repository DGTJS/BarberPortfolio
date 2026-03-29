"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { SearchIcon } from "lucide-react";
import { CategoryList } from "./CategoryList";

interface SearchInputsProps {
  className?: string;
  showCategories?: boolean;
}

export const SearchInputs = ({
  className,
  showCategories = true,
}: SearchInputsProps) => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/barbershops?search=${encodeURIComponent(search.trim())}`);
  };

  const handleQuickSearch = (value: string) => {
    router.push(`/barbershops?search=${encodeURIComponent(value)}`);
  };

  return (
    <div className={`flex flex-col gap-4 ${className || ""}`}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          placeholder="Pesquise serviços ou barbearias"
          className="!xl:!bg-foreground/50  px-3 !py-5 rounded-full xl:!placeholder:text-muted xl:!border-muted/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          type="submit"
          variant={"default"}
          className="[width:44px] [height:42px] !p-2.5 rounded-full"
        >
          <SearchIcon className="w-5 h-5" />
        </Button>
      </form>
      {showCategories && (
        <CategoryList variant="buttons" onSelect={handleQuickSearch} />
      )}
    </div>
  );
};
