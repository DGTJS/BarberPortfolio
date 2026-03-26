"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import Image from "next/image";
import { BarberShopService } from "@prisma/client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ptBR } from "react-day-picker/locale";
import { Separator } from "./separator";

interface ServiceItemProps {
  service: BarberShopService;
  barberShop: {
    id: string;
    name: string;
  };
}

type BookingDraft = {
  service: {
    id: string;
    name: string;
    priceInCents: number;
    durationInSeconds: number;
  };
  barberShop: {
    id: string;
    name: string;
  };
  date?: Date;
  time: string | null;
};

function formatDuration(durationInSeconds: number) {
  const totalMinutes = Math.max(0, Math.floor(durationInSeconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes}min`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
}

function formatPriceInBRL(priceInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100);
}

function capitalizeFirstLetter(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getDefaultServiceDurationInSeconds(serviceName: string) {
  const normalizedName = serviceName.toLowerCase();

  if (normalizedName.includes("corte")) return 60 * 60;
  if (normalizedName.includes("barba")) return 30 * 60;
  if (normalizedName.includes("sobrancelha")) return 15 * 60;
  if (normalizedName.includes("pézinho")) return 20 * 60;
  if (normalizedName.includes("massagem")) return 30 * 60;
  if (normalizedName.includes("hidratação")) return 30 * 60;

  return 30 * 60;
}

function buildTimeSlots() {
  const slots: string[] = [];
  for (let minutes = 9 * 60; minutes <= 18 * 60; minutes += 30) {
    const hoursPart = String(Math.floor(minutes / 60)).padStart(2, "0");
    const minutesPart = String(minutes % 60).padStart(2, "0");
    slots.push(`${hoursPart}:${minutesPart}`);
  }
  return slots;
}

export const ServiceItem = ({ service, barberShop }: ServiceItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);

  const timeSlots = useMemo(() => buildTimeSlots(), []);
  const serviceDurationInSeconds = useMemo(() => {
    const durationFromDb = (
      service as unknown as { durationInSeconds?: number }
    ).durationInSeconds;
    return durationFromDb ?? getDefaultServiceDurationInSeconds(service.name);
  }, [service]);

  const canConfirm = Boolean(bookingDraft?.date && bookingDraft?.time);

  const handleOpenBooking = () => {
    setBookingDraft({
      service: {
        id: service.id,
        name: service.name,
        priceInCents: service.priceInCents,
        durationInSeconds: serviceDurationInSeconds,
      },
      barberShop,
      date: undefined,
      time: null,
    });
    setIsSheetOpen(true);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      toast.message("Agendamento cancelado", {
        description: "Você fechou o agendamento sem salvar.",
      });
      setBookingDraft(null);
      setIsSheetOpen(false);
      return;
    }

    setIsSheetOpen(true);
  };

  const handleSelectDate = (date?: Date) => {
    setBookingDraft((current) => {
      if (!current) return current;
      return {
        ...current,
        date,
        time: null,
      };
    });
  };

  const handleSelectTime = (time: string) => {
    setBookingDraft((current) => {
      if (!current) return current;
      return {
        ...current,
        time,
      };
    });
  };

  const handleConfirm = () => {
    if (!bookingDraft?.date || !bookingDraft.time) return;

    toast.success("Agendamento confirmado com sucesso!");
    setBookingDraft(null);
    setIsSheetOpen(false);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-[16px] p-3 flex gap-3 items-center">
        <div className="relative w-[110px] h-[110px] rounded-[10px] overflow-hidden shrink-0">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col h-full justify-between">
          <div className="space-y-1">
            <p className="font-bold text-[14px] text-card-foreground">
              {service.name}
            </p>
            <p className="text-[14px] text-muted-foreground leading-[1.4]">
              {service.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="font-bold text-[14px] text-card-foreground leading-[1.4]">
              {formatPriceInBRL(service.priceInCents)}
            </p>
            <Button
              onClick={handleOpenBooking}
              className="bg-primary text-primary-foreground rounded-[999px] px-4 py-2 h-auto"
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="flex w-[370px] flex-col gap-0 overflow-y-auto  p-0 [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex h-full flex-col gap-6 py-6">
            <SheetHeader className="flex-row items-center justify-between py-5 px-5">
              <SheetTitle className="text-[18px] leading-[1.4]">
                Fazer Reserva
              </SheetTitle>
            </SheetHeader>

            <div className="px-5">
              <div>
                <Calendar
                  mode="single"
                  selected={bookingDraft?.date}
                  onSelect={handleSelectDate}
                  showOutsideDays
                  buttonVariant="outline"
                  navLayout="after"
                  locale={ptBR}
                  formatters={{
                    formatCaption: (date) =>
                      capitalizeFirstLetter(
                        date.toLocaleString("pt-BR", { month: "long" }),
                      ),
                  }}
                  className="w-full bg-background"
                  classNames={{
                    root: "w-full",
                    months: "w-full",
                    month: "w-full grid grid-cols-[2fr_1fr] gap-x-4 gap-y-2",
                    month_caption: "w-full items-center",
                    month_grid: "w-full col-span-2",
                    table: "w-full",
                    weekdays: "flex w-full",
                    week: "flex w-full",
                    nav: "shrink-0 flex items-center w-full justify-end gap-2",
                    caption_label:
                      "flex-1 text-[16px] font-bold text-foreground",
                    button_previous: "h-8 w-8 rounded-[8px] p-0",
                    button_next: "h-8 w-8 rounded-[8px] p-0",
                    day: "group/day relative flex-1 p-0 text-center select-none",
                  }}
                />
              </div>
            </div>
            <Separator className="my-2" />

            {bookingDraft?.date && (
              <div className="px-5">
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  <div className="flex w-max flex-nowrap items-center gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={
                          bookingDraft.time === time ? "default" : "outline"
                        }
                        className="h-auto rounded-full px-4 py-2"
                        onClick={() => handleSelectTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <Separator className="my-2" />
            {bookingDraft?.time && bookingDraft.date && (
              <div className="px-5">
                <div className="w-full rounded-[10px] border border-border bg-secondary p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] font-bold leading-[1.4] text-foreground">
                      {bookingDraft.service.name}
                    </span>
                    <span className="text-[14px] font-bold leading-[1.4] text-foreground">
                      {formatPriceInBRL(bookingDraft.service.priceInCents)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[1.4] text-muted-foreground">
                        Data
                      </span>
                      <span className="text-[14px] leading-[1.4] text-muted-foreground">
                        {bookingDraft.date.toLocaleDateString("pt-BR", {
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
                        {bookingDraft.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[1.4] text-muted-foreground">
                        Barbearia
                      </span>
                      <span className="text-[14px] leading-[1.4] text-muted-foreground">
                        {bookingDraft.barberShop.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[1.4] text-muted-foreground">
                        Duração
                      </span>
                      <span className="text-[14px] leading-[1.4] text-muted-foreground">
                        {formatDuration(bookingDraft.service.durationInSeconds)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <SheetFooter className="mt-auto gap-2 p-0 px-5">
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="h-auto rounded-full px-4 py-2"
              >
                Confirmar
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
