"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { cancelBookingAction } from "@/app/_actions/cancel-booking";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { ContactInfo } from "./ContactInfo";
import { Badge } from "./ui/badge";

interface BookingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    service: {
      name: string;
      priceInCents: number;
    };
    barbershop: {
      name: string;
      address: string;
      imageUrl: string;
      phones: string[];
    };
    date: Date;
    canceled: boolean;
  };
}

export const BookingSheet = ({
  open,
  onOpenChange,
  booking,
}: BookingSheetProps) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const router = useRouter();
  const { execute, status } = useAction(cancelBookingAction, {
    onSuccess: () => {
      onOpenChange(false);
      router.refresh();
    },
  });

  const now = new Date();
  const bookingDate = new Date(booking.date);
  const isFuture = bookingDate > now;

  const getStatus = () => {
    if (booking.canceled) return "canceled";
    if (isFuture) return "confirmed";
    return "finished";
  };

  const currentStatus = getStatus();

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[390px] p-0 flex flex-col gap-6 pb-6"
      >
        <SheetHeader className="py-7 align-center">
          <SheetTitle className="text-lg align-center font-bold font-[family-name:var(--font-sans)] flexx ">
            Informacões da Reserva
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6">
          <div className="px-5">
            <div className="relative w-full h-[180px] rounded-lg overflow-hidden">
              <Image
                src="/MapCard.png"
                alt={booking.barbershop.name}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background rounded-lg m-5 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={booking.barbershop.imageUrl}
                      alt={booking.barbershop.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-bold text-base font-[family-name:var(--font-sans)] truncate">
                      {booking.barbershop.name}
                    </p>
                    <p className="text-xs font-[family-name:var(--font-sans)] text-foreground truncate">
                      {booking.barbershop.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5">
            <div
              className="inline-flex items-center justify-center gap-2 px-2 py-1.5 rounded-full w-fit"
              style={{
                backgroundColor:
                  currentStatus === "confirmed"
                    ? "var(--primary)"
                    : currentStatus === "canceled"
                      ? "var(--destructive)"
                      : "var(--input)",
              }}
            >
              <Badge
                className="text-xs font-semibold  tracking-tight"
                style={{
                  color:
                    currentStatus === "confirmed"
                      ? "var(--primary-foreground)"
                      : currentStatus === "canceled"
                        ? "var(--primary-foreground)"
                        : "var(--success-foreground)",
                  backgroundColor:
                    currentStatus === "confirmed"
                      ? "var(--primary)"
                      : currentStatus === "canceled"
                        ? "var(--destructive)"
                        : "var(--input)",
                }}
              >
                {currentStatus === "confirmed"
                  ? "CONFIRMADO"
                  : currentStatus === "canceled"
                    ? "CANCELADO"
                    : "FINALIZADO"}
              </Badge>
            </div>

            <div className="bg-background border border-border rounded-[10px] p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base font-[family-name:var(--font-sans)] text-foreground">
                  {booking.service.name}
                </span>
                <span className="font-bold text-sm font-[family-name:var(--font-sans)] text-foreground">
                  {formatPrice(booking.service.priceInCents)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-[family-name:var(--font-sans)] text-muted-foreground">
                  Data
                </span>
                <span className="text-sm font-[family-name:var(--font-sans)] text-muted-foreground">
                  {formatDate(bookingDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-[family-name:var(--font-sans)] text-muted-foreground">
                  Horário
                </span>
                <span className="text-sm font-[family-name:var(--font-sans)] text-muted-foreground">
                  {formatTime(bookingDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-[family-name:var(--font-sans)] text-muted-foreground">
                  Barbearia
                </span>
                <span className="text-sm font-[family-name:var(--font-sans)] text-muted-foreground">
                  {booking.barbershop.name}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5">
            <ContactInfo phones={booking.barbershop.phones} />
          </div>
        </div>

        {/* Buttons - Fixed at bottom */}
        <div className="flex items-center gap-3 px-5 mt-auto">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="flex-1 px-4 py-2 rounded-full border border-border font-bold text-sm font-[family-name:var(--font-sans)]"
          >
            Voltar
          </Button>
          {currentStatus === "confirmed" && (
            <Button
              onClick={() => setCancelDialogOpen(true)}
              className="flex-1 px-4 py-2 rounded-full font-bold text-sm font-[family-name:var(--font-sans)] bg-destructive text-destructive-foreground hover:bg-destructive/60"
            >
              Cancelar Reserva
            </Button>
          )}
        </div>

        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent className="max-w-[340px] rounded-[16px] ">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold font-[family-name:var(--font-sans)]">
                Cancelar Reserva
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground font-[family-name:var(--font-sans)]">
                Tem certeza que deseja cancelar este agendamento?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-3 sm:gap-3">
              <AlertDialogCancel className="flex-1 rounded-full border border-border font-bold text-sm font-[family-name:var(--font-sans)]">
                Voltar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => execute({ bookingId: booking.id })}
                disabled={status === "executing"}
                className="flex-1 rounded-full font-bold text-sm font-[family-name:var(--font-sans)] bg-destructive text-destructive-foreground hover:bg-destructive/40 cursor-pointer"
              >
                {status === "executing" ? "Cancelando..." : "Confirmar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
};
