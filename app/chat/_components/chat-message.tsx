import type { UIMessage } from "ai";
import { Bot } from "lucide-react";
import { Streamdown } from "streamdown";

export const ChatMessage = ({ message }: { message: UIMessage }) => {
  const isUser = message.role === "user";

  if (isUser) {
    const textParts = message.parts.filter(
      (part) => part.type === "text",
    );
    return (
      <div className="flex justify-end px-5 py-3">
        <div className="max-w-[80%] rounded-full bg-secondary px-4 py-3">
          {textParts.map((part, i) => (
            <p
              key={`${message.id}-${i}`}
              className="text-sm leading-relaxed text-foreground"
            >
              {part.text}
            </p>
          ))}
        </div>
      </div>
    );
  }

  const textParts = message.parts.filter(
    (part) => part.type === "text",
  );

  const toolParts = message.parts.filter(
    (part) => part.type === "tool-result",
  );

  const hasContent = textParts.length > 0;

  if (!hasContent) return null;

  return (
    <div className="flex gap-2 px-3 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12">
        <Bot className="size-4 text-primary" />
      </div>
      <div className="flex-1 pt-1 text-sm leading-relaxed text-foreground">
        {textParts.map((part, i) => {
          let text = part.text;
          // Remove tool call JSON from displayed text
          text = text.replace(/CALL>\{[^}]*\}/g, "").trim();
          if (!text) return null;
          return (
            <Streamdown key={`${message.id}-${i}`}>{text}</Streamdown>
          );
        })}
      </div>
    </div>
  );
};
