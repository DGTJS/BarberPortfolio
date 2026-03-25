"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { House, CalendarDays, LogOut, Scissors, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface MenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
}

interface Category {
  name: string;
  icon: typeof Scissors;
}

const categories: Category[] = [
  { name: "Cabelo", icon: Scissors },
  { name: "Barba", icon: Scissors },
  { name: "Acabamento", icon: Scissors },
  { name: "Sombrancelha", icon: Scissors },
  { name: "Massagem", icon: Scissors },
  { name: "Hidratação", icon: Scissors },
];

export function MenuSheet({ open, onOpenChange, isLoading }: MenuSheetProps) {
  const { data: session } = authClient.useSession();
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const isLoggedIn = !!session;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[370px] p-0 [&::-webkit-scrollbar]:hidden"
        showCloseButton={false}
      >
        <SheetHeader className="border-b px-6 py-6">
          <SheetTitle className="font-nunito font-bold text-lg">
            Menu
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-6 py-6">
          {/* User Info */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-muted animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={session.user.image || undefined} />
                <AvatarFallback>
                  {session.user.name?.charAt(0) || <User className="size-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {session.user.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {session.user.email}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">
                Olá. Faça seu login!
              </span>
              <Button
                onClick={handleLogin}
                className="rounded-full px-6 py-3"
                size="sm"
              >
                Login
              </Button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start gap-3 rounded-full px-5 py-3 h-auto"
              asChild
            >
              <Link href="/">
                <House className="size-4" />
                <span className="text-sm font-medium">Início</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-3 rounded-full px-5 py-3 h-auto"
              asChild
            >
              <Link href="/bookings">
                <CalendarDays className="size-4" />
                <span className="text-sm font-medium">Agendamentos</span>
              </Link>
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                className="justify-start rounded-full px-5 py-3 h-10"
                asChild
              >
                <span className="text-sm font-medium">{category.name}</span>
              </Button>
            ))}
          </div>

          {/* Logout Button */}
          {isLoggedIn && (
            <Button
              variant="ghost"
              className="justify-start gap-3 rounded-full px-5 py-3 h-auto text-muted-foreground"
              onClick={() => authClient.signOut()}
            >
              <LogOut className="size-4" />
              <span className="text-sm font-medium">Sair da conta</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
