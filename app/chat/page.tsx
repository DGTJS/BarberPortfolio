"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { Bot, ChevronLeft, Mic, SendHorizontal } from "lucide-react";
import Link from "next/link";
import { ChatMessage } from "./_components/chat-message";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleButtonClick = (value: string) => {
    sendMessage({ text: value });
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <Link href="/" className="flex size-10 items-center justify-center">
          <ChevronLeft className="size-6 text-foreground" />
        </Link>
        <h1 className="font-serif text-xl tracking-tight text-foreground">
          aparatus
        </h1>
        <div className="flex size-10 items-center justify-center" />
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-2">
        <div className="mx-auto max-w-lg">
          <div className="rounded-xl border border-border p-3 text-center">
            <p className="text-sm text-muted-foreground">
              Seu assistente de agendamentos está online.
            </p>
          </div>

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onButtonClick={handleButtonClick}
              disabledButtons={status === "submitted" || status === "streaming"}
            />
          ))}

          {(status === "submitted" || status === "streaming") && (
            <div className="flex gap-2 px-3 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12">
                <Bot className="size-4 text-primary" />
              </div>
              <div className="flex items-center gap-1 pt-1">
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-secondary px-5 py-4">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <input
            className="flex-1 rounded-full bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="Digite sua mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            disabled
            className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-primary/50 text-primary-foreground disabled:opacity-50"
          >
            <Mic className="size-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          >
            <SendHorizontal className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
