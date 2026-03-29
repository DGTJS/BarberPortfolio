import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";
import { PageContainer } from "@/app/_components/ui/page";
import { getUserBookingsAction } from "@/app/_actions/get-user-bookings";
import { BookingsContent } from "./_components/BookingsContent";

export default async function BookingsPage() {
  const result = await getUserBookingsAction();

  if (!result?.data) {
    return (
      <>
        <Header showSearch />
        <div className="max-w-7xl mx-auto">
          <PageContainer>
            <p className="text-muted-foreground">
              Você não tem agendamentos no momento.
            </p>
          </PageContainer>
        </div>
        <Footer />
      </>
    );
  }

  const bookings = result.data.map((booking) => ({
    id: booking.id,
    service: {
      name: booking.service.name,
      priceInCents: booking.service.priceInCents,
    },
    barbershop: {
      name: booking.barbershop.name,
      imageUrl: booking.barbershop.imageUrl,
      address: booking.barbershop.address,
      description: booking.barbershop.description,
      phones: booking.barbershop.phones,
    },
    date: new Date(booking.date),
    canceled: booking.canceled,
  }));

  return (
    <>
      <Header showSearch />
      <main className="max-w-7xl mx-auto">
        <PageContainer className="flex-1">
          <BookingsContent bookings={bookings} />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
