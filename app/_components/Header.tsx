import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { MenuIcon } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 px-5 ">
      <Image src="/Logo.png" alt="BarberShop" width={100} height={100} />
      <Button variant={"ghost"} className="w-12 h-12 rounded-full">
        <MenuIcon className="w-6 h-6" />
      </Button>
    </header>
  );
};
