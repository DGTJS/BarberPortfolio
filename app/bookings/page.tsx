import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";
import {
  PageContainer,
  PageSection,
  PageSectionTitle,
} from "@/app/_components/ui/page";
import { BookingItem } from "@/app/_components/BookingItem";
import { getUserBookingsAction } from "@/app/_actions/get-user-bookings";

export default async function BookingsPage() {
  const result = await getUserBookingsAction();

  if (!result?.data) {
    return (
      <>
        <Header />
        <PageContainer>
          <PageSection>
            <PageSectionTitle>Meus Agendamentos</PageSectionTitle>
            <p className="text-muted-foreground">
              Você não tem agendamentos no momento.
            </p>
          </PageSection>
        </PageContainer>
        <Footer />
      </>
    );
  }

  const bookings = result.data;
  const now = new Date();

  const confirmedBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    return bookingDate > now && !booking.canceled;
  });

  const finishedAndCanceledBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    return bookingDate <= now || booking.canceled;
  });

  const getBookingStatus = (booking: (typeof bookings)[0]) => {
    const bookingDate = new Date(booking.date);
    if (booking.canceled) {
      return "canceled" as const;
    }
    if (bookingDate > now) {
      return "confirmed" as const;
    }
    return "finished" as const;
  };

  return (
    <>
      <Header />
      <PageContainer>
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
                />
              ))}
            </div>
          )}
        </PageSection>
      </PageContainer>
      <Footer />
    </>
  );
}
