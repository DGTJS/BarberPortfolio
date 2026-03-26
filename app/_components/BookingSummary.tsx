"use client";

import { formatDuration, formatPriceInBRL } from "@/app/_utils/format";

interface BookingSummaryProps {
  service: {
    name: string;
    priceInCents: number;
    durationInSeconds: number;
  };
  barberShop: {
    name: string;
  };
  date: Date;
  time: string;
  isVisible: boolean;
}

export function BookingSummary({
  service,
  barberShop,
  date,
  time,
  isVisible,
}: BookingSummaryProps) {
  if (!isVisible) return null;

  return (
    <div className="px-5">
      <div className="w-full rounded-[10px] border border-border bg-muted-foreground/25 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-bold leading-[1.4] text-foreground">
            {service.name}
          </span>
          <span className="text-[14px] font-bold leading-[1.4] text-foreground">
            {formatPriceInBRL(service.priceInCents)}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[14px] leading-[1.4] text-muted-foreground">
              Data
            </span>
            <span className="text-[14px] leading-[1.4] text-muted-foreground">
              {date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] leading-[1.4] text-muted-foreground">
              Horário
            </span>
            <span className="text-[14px] leading-[1.4] text-muted-foreground">
              {time}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] leading-[1.4] text-muted-foreground">
              Barbearia
            </span>
            <span className="text-[14px] leading-[1.4] text-muted-foreground">
              {barberShop.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] leading-[1.4] text-muted-foreground">
              Duração
            </span>
            <span className="text-[14px] leading-[1.4] text-muted-foreground">
              {formatDuration(service.durationInSeconds)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
