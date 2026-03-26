"use client";

import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { MenuIcon } from "lucide-react";
import { MenuSheet } from "./MenuSheet";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Logo from "@/public/Logo.png";
import LogoBlack from "@/public/Logo.svg";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  return (
    <>
      <header className="flex justify-between items-center pt-4 px-5 ">
        {/* Logo modo claro */}
        <Image
          src={LogoBlack}
          alt="BarberShop"
          width={92}
          height={24}
          className="block dark:hidden"
        />

        {/* Logo modo escuro */}
        <Image
          src={Logo}
          alt="BarberShop"
          width={92}
          height={24}
          className="hidden dark:block"
        />
        <Button
          variant={"ghost"}
          className="w-12 h-12 rounded-full"
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon className="w-6 h-6" />
        </Button>
      </header>
      <MenuSheet
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        isLoading={isPending}
      />
    </>
  );
};
