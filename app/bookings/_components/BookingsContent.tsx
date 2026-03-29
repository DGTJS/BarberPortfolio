"use client";

import { useState } from "react";
import { BookingItem } from "@/app/_components/BookingItem";
import { BookingDetails } from "@/app/_components/BookingDetails";
import { PageSection, PageSectionTitle } from "@/app/_components/ui/page";

interface BookingData {
  id: string;
  service: {
    name: string;
    priceInCents: number;
  };
  barbershop: {
    name: string;
    imageUrl: string;
    address: string;
    description: string | null;
    phones: string[];
  };
  date: Date;
  canceled: boolean;
}

interface BookingsContentProps {
  bookings: BookingData[];
}

function getBookingStatus(
  booking: BookingData,
): "confirmed" | "finished" | "canceled" {
  if (booking.canceled) return "canceled";
  if (new Date(booking.date) > new Date()) return "confirmed";
  return "finished";
}

function getDefaultSelectedBooking(
  bookings: BookingData[],
): BookingData | null {
  const now = new Date();
  const confirmed = bookings.filter(
    (b) => !b.canceled && new Date(b.date) > now,
  );
  if (confirmed.length > 0) return confirmed[0];

  const finished = bookings.filter(
    (b) => !b.canceled && new Date(b.date) <= now,
  );
  if (finished.length > 0) return finished[0];

  const canceled = bookings.filter((b) => b.canceled);
  if (canceled.length > 0) return canceled[0];

  return null;
}

export function BookingsContent({ bookings }: BookingsContentProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    () => getDefaultSelectedBooking(bookings),
  );

  const now = new Date();

  const confirmedBookings = bookings.filter(
    (b) => !b.canceled && new Date(b.date) > now,
  );

  const finishedAndCanceledBookings = bookings.filter(
    (b) => b.canceled || new Date(b.date) <= now,
  );

  const handleSelectBooking = (booking: BookingData) => {
    setSelectedBooking(booking);
  };

  const selectedBookingData = selectedBooking
    ? {
        id: selectedBooking.id,
        service: {
          name: selectedBooking.service.name,
          priceInCents: selectedBooking.service.priceInCents,
        },
        barbershop: {
          name: selectedBooking.barbershop.name,
          address: selectedBooking.barbershop.address,
          imageUrl: selectedBooking.barbershop.imageUrl,
          description: selectedBooking.barbershop.description,
          phones: selectedBooking.barbershop.phones,
        },
        date: selectedBooking.date,
        canceled: selectedBooking.canceled,
      }
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:pt-10">
      {/* Column 1: Booking Lists */}
      <div className="flex-1 space-y-6">
        <PageSection>
          <PageSectionTitle>Agendamentos Confirmados</PageSectionTitle>
          {confirmedBookings.length === 0 ? (
            <p className="text-muted-foreground">
              Você não tem agendamentos confirmados no momento.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {confirmedBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  id={booking.id}
                  serviceName={booking.service.name}
                  barberShopName={booking.barbershop.name}
                  barberShopImage={booking.barbershop.imageUrl}
                  barberShopAddress={booking.barbershop.address}
                  barberShopPhones={booking.barbershop.phones}
                  servicePriceInCents={booking.service.priceInCents}
                  date={new Date(booking.date)}
                  canceled={booking.canceled}
                  status={getBookingStatus(booking)}
                  isSelected={selectedBooking?.id === booking.id}
                  onSelect={() => handleSelectBooking(booking)}
                />
              ))}
            </div>
          )}
        </PageSection>

        <PageSection>
          <PageSectionTitle>Agendamentos Finalizados</PageSectionTitle>
          {finishedAndCanceledBookings.length === 0 ? (
            <p className="text-muted-foreground">
              Você não tem agendamentos finalizados ou cancelados.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {finishedAndCanceledBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  id={booking.id}
                  serviceName={booking.service.name}
                  barberShopName={booking.barbershop.name}
                  barberShopImage={booking.barbershop.imageUrl}
                  barberShopAddress={booking.barbershop.address}
                  barberShopPhones={booking.barbershop.phones}
                  servicePriceInCents={booking.service.priceInCents}
                  date={new Date(booking.date)}
                  canceled={booking.canceled}
                  status={getBookingStatus(booking)}
                  isSelected={selectedBooking?.id === booking.id}
                  onSelect={() => handleSelectBooking(booking)}
                />
              ))}
            </div>
          )}
        </PageSection>
      </div>

      {/* Column 2: Booking Details (Desktop only) */}
      <div className="hidden lg:block lg:w-[400px] lg:shrink-0 bg-card p-5 rounded-md">
        <div className="sticky top-8">
          {selectedBookingData ? (
            <BookingDetails booking={selectedBookingData} />
          ) : (
            <p className="text-muted-foreground">
              Selecione um agendamento para ver os detalhes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
