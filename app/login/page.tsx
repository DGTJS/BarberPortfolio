"use client";

import { Button } from "@/app/_components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Bot } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <Link href="/" className="flex size-10 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="font-serif text-xl tracking-tight text-foreground">
          aparatus
        </h1>
        <div className="flex size-10" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-5">
        <div className="flex flex-col items-center gap-8 max-w-sm w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/12">
              <Bot className="size-8 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-xl font-bold text-foreground">
                Bem-vindo ao Aparatus
              </h2>
              <p className="text-sm text-muted-foreground">
                Faça login para agendar seus serviços de barbearia
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full rounded-full py-6 text-base font-semibold"
          >
            <svg className="mr-2 size-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Entrar com Google
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Ao continuar, você concorda com nossos termos de serviço e política
            de privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
