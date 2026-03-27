import { Header } from "@/app/_components/Header";
import { SearchInputs } from "@/app/_components/Search-inputs";
import Banner from "@/public/Banner.png";
import Image from "next/image";
import { BookingItem } from "./_components/BookingItem";
import { BarberShopItem } from "./_components/BarberShopItem";
import { Footer } from "./_components/Footer";
import {
  PageContainer,
  PageSectionTitle,
  PageSection,
  PageSectionScroller,
} from "./_components/ui/page";

import { prisma } from "@/lib/prisma";
import { getUserBookingsAction } from "@/app/_actions/get-user-bookings";

export default async function Home() {
  const [barberShops, bookingsResult] = await Promise.all([
    prisma.barberShop.findMany(),
    getUserBookingsAction(),
  ]);

  const bookings = bookingsResult?.data ?? [];
  const now = new Date();

  const confirmedBookings = bookings
    .filter((b) => !b.canceled && new Date(b.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const lastBooking = confirmedBookings[0] ?? bookings.find((b) => !b.canceled && new Date(b.date) <= now) ?? null;

  const getBookingStatus = (
    booking: NonNullable<typeof lastBooking>,
  ): "confirmed" | "finished" | "canceled" => {
    if (booking.canceled) return "canceled";
    if (new Date(booking.date) > new Date()) return "confirmed";
    return "finished";
  };

  return (
    <>
      <Header />
      <PageContainer>
        <div className="flex flex-col gap-4">
          <SearchInputs />
          <Image
            src={Banner}
            alt="Agendar Agora!"
            sizes="100vw"
            className="h-auto w-full "
          />
        </div>
        {lastBooking && (
          <PageSection>
            <PageSectionTitle>Agendamentos</PageSectionTitle>
            <BookingItem
              id={lastBooking.id}
              serviceName={lastBooking.service.name}
              barberShopName={lastBooking.barbershop.name}
              barberShopImage={lastBooking.barbershop.imageUrl}
              barberShopAddress={lastBooking.barbershop.address}
              barberShopPhones={lastBooking.barbershop.phones}
              servicePriceInCents={lastBooking.service.priceInCents}
              date={new Date(lastBooking.date)}
              canceled={lastBooking.canceled}
              status={getBookingStatus(lastBooking)}
            />
          </PageSection>
        )}
        <PageSection>
          <PageSectionTitle>Barbearias</PageSectionTitle>
          <PageSectionScroller>
            {barberShops.map((barberShop) => {
              return (
                <BarberShopItem key={barberShop.id} barberShop={barberShop} />
              );
            })}
          </PageSectionScroller>
        </PageSection>
        <PageSection>
          <PageSectionTitle>Populares</PageSectionTitle>
          <PageSectionScroller>
            {barberShops.map((barberShop) => {
              return (
                <BarberShopItem key={barberShop.id} barberShop={barberShop} />
              );
            })}
          </PageSectionScroller>
        </PageSection>
      </PageContainer>
      <Footer />
    </>
  );
}
