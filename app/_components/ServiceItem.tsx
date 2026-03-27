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
import { Separator } from "./ui/separator";
import { TimeSlotsSelector } from "@/app/_components/TimeSlotsSelector";
import { BookingSummary } from "@/app/_components/BookingSummary";
import Image from "next/image";
import { BarberShopService } from "@prisma/client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ptBR } from "react-day-picker/locale";
import {
  formatPriceInBRL,
  capitalizeFirstLetter,
  getDefaultServiceDurationInSeconds,
} from "@/app/_utils/format";
import { createBookingCheckoutAction } from "@/app/_actions/create-booking-checkout";
import { createBookingAction } from "@/app/_actions/create-booking";
import { useAction } from "next-safe-action/hooks";
import { getDataAvailbleTimeSlots } from "@/app/_actions/get-date-available-time-slots";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface ServiceItemProps {
  service: BarberShopService;
  barberShop: {
    id: string;
    name: string;
  };
}

export const ServiceItem = ({ service, barberShop }: ServiceItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { executeAsync: executeCheckoutAsync } = useAction(
    createBookingCheckoutAction,
  );
  const { executeAsync } = useAction(createBookingAction);
  const { data: availableTimeSlots } = useQuery({
    queryKey: ["data-available-time-slots", service.barbershopId, selectedDate],
    queryFn: () =>
      getDataAvailbleTimeSlots({
        barberShopId: barberShop.id,
        date: selectedDate!,
      }),
    enabled: Boolean(selectedDate),
  });

  const serviceDurationInSeconds = useMemo(() => {
    const durationFromDb = (
      service as unknown as { durationInSeconds?: number }
    ).durationInSeconds;
    return durationFromDb ?? getDefaultServiceDurationInSeconds(service.name);
  }, [service]);

  const canConfirm = Boolean(selectedDate && selectedTime);

  const handleOpenBooking = () => {
    setSelectedDate(undefined);
    setSelectedTime(null);
    setIsSheetOpen(true);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      toast.message("Agendamento cancelado", {
        description: "Você fechou o agendamento sem salvar.",
      });
      setSelectedDate(undefined);
      setSelectedTime(null);
      setIsSheetOpen(false);
      return;
    }

    setIsSheetOpen(true);
  };

  const handleSelectDate = (date?: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    const hourSplit = selectedTime.split(":");
    const hour = Number(hourSplit[0]);
    const minute = Number(hourSplit[1]);
    const date = new Date(selectedDate);
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    const checkoutSessionResult = await executeCheckoutAsync({
      serviceId: service.id,
      date,
    });

    if (
      checkoutSessionResult.serverError ||
      checkoutSessionResult.validationErrors
    ) {
      toast.error("Erro ao processar pagamento");
      return;
    }

    const result = await executeAsync({
      serviceId: service.id,
      date,
    });

    if (result.validationErrors?._errors?.[0]) {
      toast.error("Horario indisponível");
      return;
    }
    if (checkoutSessionResult.data?.url) {
      redirect(checkoutSessionResult.data.url);
    }
    toast.success("Horário agendado com sucesso");
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
          <div className="flex h-full flex-col gap-6 py-2.5">
            <SheetHeader className="flex-row items-center border-b border-muted-foreground/20 justify-between py-5 px-5">
              <SheetTitle className="text-[18px] leading-[1.4]">
                Fazer Reserva
              </SheetTitle>
            </SheetHeader>

            <div className="px-2">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelectDate}
                  buttonVariant="outline"
                  disabled={{ before: new Date() }}
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
                    month: "w-full grid grid-cols-[2fr_1fr]",
                    month_caption: "w-full items-center",
                    month_grid: "w-full col-span-2",
                    table: "w-full",
                    weekdays: "flex w-full",
                    week: "flex w-full",
                    nav: "shrink-0 flex items-center w-full justify-end gap-2",
                    caption_label:
                      "flex-1 text-[16px] font-bold text-foreground",
                    button_previous:
                      "flex h-8 w-8 rounded-[8px] border border-muted-foreground/20 p-0 transition hover:bg-primary hover:text-primary-foreground justify-center items-center",
                    button_next:
                      " flex h-8 w-8 rounded-[8px] p-0 border justify-center bg-muted-foreground/50 text-foreground items-center transition hover:bg-primary hover:text-primary-foreground",
                    day: "group/day relative flex-1 p-0 text-center select-none",
                  }}
                />
              </div>
            </div>
            <Separator className="bg-muted-foreground/20" />

            <TimeSlotsSelector
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              isVisible={!!selectedDate}
              availableTimeSlots={availableTimeSlots}
            />

            <Separator className="bg-muted-foreground/20" />

            {selectedTime && selectedDate && (
              <BookingSummary
                service={{
                  name: service.name,
                  priceInCents: service.priceInCents,
                  durationInSeconds: serviceDurationInSeconds,
                }}
                barberShop={barberShop}
                date={selectedDate}
                time={selectedTime}
                isVisible={true}
              />
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
