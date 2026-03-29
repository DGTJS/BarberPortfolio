import type { UIMessage } from "ai";
import { Bot } from "lucide-react";
import { ChatButtonGroup, type ChatButtonOption } from "./chat-button-group";
import { ChatBookingCard } from "./chat-booking-card";

type ButtonType = "barbershops" | "services" | "dates" | "timeSlots";

interface StructuredToolResult {
  type: ButtonType;
  options: ChatButtonOption[];
}

interface BookingToolResult {
  type: "booking";
  barbershopName: string;
  serviceName: string;
  date: string;
  time: string;
}

function parseToolOutput(output: unknown): StructuredToolResult | BookingToolResult | null {
  if (typeof output !== "string") return null;
  try {
    const parsed = JSON.parse(output);
    if (
      parsed &&
      typeof parsed === "object" &&
      "type" in parsed &&
      ["barbershops", "services", "dates", "timeSlots"].includes(parsed.type) &&
      Array.isArray(parsed.options)
    ) {
      return parsed as StructuredToolResult;
    }
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.type === "booking"
    ) {
      return parsed as BookingToolResult;
    }
  } catch {
    return null;
  }
  return null;
}

interface ChatMessageProps {
  message: UIMessage;
  onButtonClick?: (value: string) => void;
  disabledButtons?: boolean;
}

export const ChatMessage = ({
  message,
  onButtonClick,
  disabledButtons,
}: ChatMessageProps) => {
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
    (part): part is typeof part & { type: string } =>
      typeof part.type === "string" && part.type.startsWith("tool-"),
  );

  const hasContent = textParts.length > 0 || toolParts.length > 0;

  if (!hasContent) return null;

  const renderButtons = () => {
    const buttonResults: { type: ButtonType; options: ChatButtonOption[] }[] =
      [];
    let bookingResult: BookingToolResult | null = null;

    for (const part of toolParts) {
      if ("output" in part && part.output !== undefined) {
        const parsed = parseToolOutput(part.output);
        if (parsed) {
          if (parsed.type === "booking") {
            bookingResult = parsed;
          } else {
            buttonResults.push(parsed as { type: ButtonType; options: ChatButtonOption[] });
          }
        }
      }
    }

    return { buttonResults, bookingResult };
  };

  const { buttonResults, bookingResult } = renderButtons();

  return (
    <div className="flex gap-2 px-3 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12">
        <Bot className="size-4 text-primary" />
      </div>
      <div className="flex-1 pt-1 text-sm leading-relaxed text-foreground">
        {textParts.map((part, i) => {
          let text = part.text;
          text = text
            .replace(/tool_\w+\.\w+\([^)]*\)/g, "")
            .replace(/CALL>\{[^}]*\}/g, "")
            .replace(/get_available_time_slots\([^)]*\)/g, "")
            .trim();
          if (!text) return null;
          return (
            <p
              key={`${message.id}-${i}`}
              className="whitespace-pre-wrap"
            >
              {text}
            </p>
          );
        })}

        {buttonResults.map((result, i) => (
          <ChatButtonGroup
            key={`${message.id}-buttons-${i}`}
            type={result.type}
            options={result.options}
            onSelect={(value) => onButtonClick?.(value)}
            disabled={disabledButtons}
          />
        ))}

        {bookingResult && (
          <ChatBookingCard
            barbershopName={bookingResult.barbershopName}
            serviceName={bookingResult.serviceName}
            date={bookingResult.date}
            time={bookingResult.time}
          />
        )}
      </div>
    </div>
  );
};
