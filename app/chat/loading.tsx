import { Bot } from "lucide-react";

export default function ChatLoading() {
  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <div className="size-10" />
        <h1 className="font-serif text-xl tracking-tight text-foreground">
          aparatus
        </h1>
        <div className="size-10" />
      </header>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/12">
            <Bot className="size-6 text-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">
            Carregando assistente...
          </p>
        </div>
      </div>
    </div>
  );
}
