import Link from "next/link";
import { Bot } from "lucide-react";

export const ChatButton = () => {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 block md:hidden">
      <Link
        href="/chat"
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        <Bot className="size-6" />
      </Link>
    </div>
  );
};
