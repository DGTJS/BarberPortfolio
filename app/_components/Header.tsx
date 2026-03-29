"use client";

import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Bot, Calendar, MenuIcon, User } from "lucide-react";
import { MenuSheet } from "./MenuSheet";
import { ModeToggle } from "./ModeToggle";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Logo from "@/public/Logo.png";
import LogoBlack from "@/public/Logo.svg";
import Link from "next/link";
import { SearchInputs } from "./Search-inputs";

interface HeaderProps {
  showSearch?: boolean;
}

export const Header = ({ showSearch = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  return (
    <>
      <header className="px-5 lg:px-8 pt-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center gap-6">
          {/* Logo modo claro */}
          <Link href="/" className="block dark:hidden shrink-0 pr-4">
            <Image src={LogoBlack} alt="BarberShop" width={92} height={24} />
          </Link>

          {/* Logo modo escuro */}
          <Link href="/" className="hidden dark:block shrink-0 pr-4">
            <Image src={Logo} alt="BarberShop" width={92} height={24} />
          </Link>

          {/* Search inline on desktop */}
          {showSearch && (
            <div className="hidden lg:flex flex-1 w-full">
              <SearchInputs showCategories={false} className="w-full" />
            </div>
          )}

          <div className="flex items-center gap-1">
            <ModeToggle />

            {/* Desktop: botões de navegação */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-lg"
              >
                <Link href={session?.user ? "/bookings" : "/login"}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendamentos
                </Link>
              </Button>

              {session?.user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="rounded-lg"
                  >
                    <Link href="/chat">
                      <Bot className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsMenuOpen(true)}
                    className="flex items-center gap-2 ml-2 cursor-pointer"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || (
                          <User className="size-2" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-foreground">
                      {session.user.name}
                    </span>
                  </Button>
                </>
              ) : (
                <Button size="sm" asChild className="rounded-lg ml-2">
                  <Link href="/login">Faça login</Link>
                </Button>
              )}
            </div>

            {/* Mobile: menu */}
            <Button
              variant="ghost"
              className="w-12 h-12 rounded-full lg:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Search below header on mobile only */}
        {showSearch && (
          <div className="mt-4 lg:hidden">
            <SearchInputs showCategories={false} className="w-full" />
          </div>
        )}
      </header>
      <MenuSheet
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        isLoading={isPending}
      />
    </>
  );
};
