import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { SearchIcon } from "lucide-react";

export const SearchInputs = () => {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Pesquise serviços ou barbearias"
        className="!bg-transparent px-3 !py-5 rounded-full"
      />
      <Button
        variant={"default"}
        className="[width:44px] [height:42px] !p-2.5 rounded-full"
      >
        <SearchIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};
