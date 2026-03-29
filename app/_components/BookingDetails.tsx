"use client";

import { useState } from "react";
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
import { PageSectionTitle } from "./ui/page";
import { Separator } from "./ui/separator";

interface BookingDetailsProps {
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
      description: string | null;
      phones: string[];
    };
    date: Date;
    canceled: boolean;
  };
}

export const BookingDetails = ({ booking }: BookingDetailsProps) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const router = useRouter();
  const { execute, status } = useAction(cancelBookingAction, {
    onSuccess: () => {
      router.refresh();
    },
  });

  const bookingDate = new Date(booking.date);
  const isFuture = bookingDate > new Date();

  const currentStatus = booking.canceled
    ? ("canceled" as const)
    : isFuture
      ? ("confirmed" as const)
      : ("finished" as const);

  const formatPrice = (priceInCents: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col gap-6 ">
      {/* Map Image with Barbershop Overlay */}
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
              <p className="font-bold text-base truncate">
                {booking.barbershop.name}
              </p>
              <p className="text-xs text-foreground truncate">
                {booking.barbershop.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
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
          className="text-xs font-semibold tracking-tight"
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

      {/* Service Details Card */}
      <div className="bg-background border border-border rounded-[10px] p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-base text-foreground">
            {booking.service.name}
          </span>
          <span className="font-bold text-sm text-foreground">
            {formatPrice(booking.service.priceInCents)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Data</span>
          <span className="text-sm text-muted-foreground">
            {formatDate(bookingDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Horário</span>
          <span className="text-sm text-muted-foreground">
            {formatTime(bookingDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Barbearia</span>
          <span className="text-sm text-muted-foreground">
            {booking.barbershop.name}
          </span>
        </div>
      </div>

      {/* About */}
      {booking.barbershop.description && (
        <>
          <Separator />
          <div className="space-y-3">
            <PageSectionTitle>Sobre Nós</PageSectionTitle>
            <p className="text-[14px] text-foreground leading-[1.4]">
              {booking.barbershop.description}
            </p>
          </div>
        </>
      )}

      {/* Contact */}
      <Separator />
      <div className="space-y-3">
        <PageSectionTitle>Contato</PageSectionTitle>
        <ContactInfo phones={booking.barbershop.phones} />
      </div>

      {/* Cancel Button */}
      {currentStatus === "confirmed" && (
        <>
          <Separator />
          <Button
            onClick={() => setCancelDialogOpen(true)}
            className="w-full px-4 py-2 rounded-full font-bold text-sm bg-destructive text-destructive-foreground hover:bg-destructive/60"
          >
            Cancelar Reserva
          </Button>
        </>
      )}

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="max-w-[340px] rounded-[16px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              Cancelar Reserva
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Tem certeza que deseja cancelar este agendamento?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 sm:gap-3">
            <AlertDialogCancel className="flex-1 rounded-full border border-border font-bold text-sm">
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => execute({ bookingId: booking.id })}
              disabled={status === "executing"}
              className="flex-1 rounded-full font-bold text-sm bg-destructive text-destructive-foreground hover:bg-destructive/40 cursor-pointer"
            >
              {status === "executing" ? "Cancelando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
