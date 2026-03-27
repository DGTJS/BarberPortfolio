"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
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
import { X, House, CalendarDays, LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Separator } from "@/app/_components/ui/separator";
import { CategoryList } from "@/app/_components/CategoryList";

interface MenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
}

export function MenuSheet({ open, onOpenChange, isLoading }: MenuSheetProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const handleCategorySelect = (search: string) => {
    onOpenChange(false);
    router.push(`/barbershops?search=${encodeURIComponent(search)}`);
  };

  const isLoggedIn = !!session;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[370px] p-0 [&::-webkit-scrollbar]:hidden"
        showCloseButton={false}
      >
        <SheetClose
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-muted/50 hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          asChild
        >
          <button
            type="button"
            className="focus:outline-none"
            aria-label="Fechar menu"
          >
            <X className="size-5 text-foreground" />
          </button>
        </SheetClose>

        <SheetHeader className="border-b px-6 py-6">
          <SheetTitle className="font-nunito font-bold text-lg">
            Menu
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-6 py-6">
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

          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start gap-3 rounded-full px-5 py-3 h-auto hover:bg-muted/50 transition-colors"
              asChild
            >
              <Link href="/">
                <House className="size-4" />
                <span className="text-sm font-medium">Início</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-3 rounded-full px-5 py-3 h-auto hover:bg-muted/50 transition-colors"
              asChild
            >
              <Link href="/bookings">
                <CalendarDays className="size-4" />
                <span className="text-sm font-medium">Agendamentos</span>
              </Link>
            </Button>
          </div>
          <Separator />

          <CategoryList variant="links" onSelect={handleCategorySelect} />
          <Separator className="my-4" />

          {isLoggedIn && (
            <Button
              variant="ghost"
              className="justify-start gap-3 rounded-full px-5 py-3 h-auto text-red-500 hover:bg-red-500/10 transition-colors"
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
