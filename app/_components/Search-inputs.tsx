"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { SearchIcon } from "lucide-react";
import { CategoryList } from "./CategoryList";

export const SearchInputs = () => {
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
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          placeholder="Pesquise serviços ou barbearias"
          className="!bg-transparent px-3 !py-5 rounded-full"
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
      <CategoryList variant="buttons" onSelect={handleQuickSearch} />
    </div>
  );
};
