import { Header } from "@/app/_components/Header";
import { SearchInputs } from "@/app/_components/Search-inputs";
import Banner from "@/public/Banner.png";
import Image from "next/image";
import { BookingItem } from "./_components/BookingItem";
import { BarberShopItem } from "./_components/BarberShopItem";
import { Footer } from "./_components/Footer";
import { ChatButton } from "./_components/ChatButton";
import {
  PageContainer,
  PageSectionTitle,
  PageSection,
  PageSectionScroller,
  SectionScrollerWithArrows,
  PageBanner,
} from "./_components/ui/page";

import { prisma } from "@/lib/prisma";
import { getUserBookingsAction } from "@/app/_actions/get-user-bookings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function formatDatePtBR(date: Date): string {
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${dayName}, ${day} de ${month}`;
}

export default async function Home() {
  const [sessionResult, barberShops, bookingsResult] = await Promise.all([
    auth.api.getSession({ headers: await headers() }).catch(() => null),
    prisma.barberShop.findMany(),
    getUserBookingsAction(),
  ]);

  const session = sessionResult;
  const bookings = bookingsResult?.data ?? [];
  const now = new Date();

  const confirmedBookings = bookings
    .filter((b) => !b.canceled && new Date(b.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const lastBooking =
    confirmedBookings[0] ??
    bookings.find((b) => !b.canceled && new Date(b.date) <= now) ??
    null;

  const getBookingStatus = (
    booking: NonNullable<typeof lastBooking>,
  ): "confirmed" | "finished" | "canceled" => {
    if (booking.canceled) return "canceled";
    if (new Date(booking.date) > new Date()) return "confirmed";
    return "finished";
  };

  const todayFormatted = formatDatePtBR(now);

  return (
    <>
      <Header />
      <div className="mx-auto w-full max-w-7xl lg:hidden ">
        <PageContainer>
          <SearchInputs />
          <Image
            src={Banner}
            alt="Agendar Agora!"
            sizes="100vw"
            className="h-auto w-full object-cover rounded-xl"
          />
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
              {barberShops.map((barberShop) => (
                <BarberShopItem key={barberShop.id} barberShop={barberShop} />
              ))}
            </PageSectionScroller>
          </PageSection>
          <PageSection>
            <PageSectionTitle>Populares</PageSectionTitle>
            <PageSectionScroller>
              {barberShops.map((barberShop) => (
                <BarberShopItem key={barberShop.id} barberShop={barberShop} />
              ))}
            </PageSectionScroller>
          </PageSection>
        </PageContainer>
      </div>
      <div className="hidden lg:block relative w-full overflow-hidden max-w-7xl mx-auto">
        <div className="relative z-10 mx-auto max-w-7xl px-8">
          <PageBanner
            src={Banner.src}
            className="p-8 flex flex-row align-center justify-center"
          >
            <div className="flex flex-row gap-8">
              <div className="space-y-6 flex-1 min-w-0">
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-foreground">
                    {session?.user
                      ? `Olá, ${session.user.name}!`
                      : "Olá, faça seu login!"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {todayFormatted}
                  </p>
                </div>
                <SearchInputs />
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
              </div>
              <div className="space-y-3 flex-1 min-w-0 ">
                <PageSectionTitle className="px-10">
                  Barbearias
                </PageSectionTitle>
                <SectionScrollerWithArrows>
                  {barberShops.map((barberShop) => (
                    <BarberShopItem
                      key={barberShop.id}
                      barberShop={barberShop}
                    />
                  ))}
                </SectionScrollerWithArrows>
              </div>
            </div>
          </PageBanner>
        </div>
        <PageContainer className="min-xl:block">
          <PageSection>
            <PageSectionTitle className="px-10">Populares</PageSectionTitle>
            <SectionScrollerWithArrows>
              {barberShops.map((barberShop) => (
                <BarberShopItem key={barberShop.id} barberShop={barberShop} />
              ))}
            </SectionScrollerWithArrows>
          </PageSection>
        </PageContainer>
      </div>

      <ChatButton />
    </>
  );
}
