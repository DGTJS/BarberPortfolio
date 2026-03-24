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

export default async function Home() {
  const barberShops = await prisma.barberShop.findMany();
  return (
    <>
      <Header />
      <PageContainer>
        <SearchInputs />
        <Image
          src={Banner}
          alt="Agendar Agora!"
          sizes="100vw"
          className="h-auto w-full "
        />
        <PageSection>
          <PageSectionTitle>Agendamentos</PageSectionTitle>
          <BookingItem
            serviceName="Corte de Cabelo"
            barberShopName="Barbearia do João"
            barberShopImage="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
            date={new Date()}
          />
        </PageSection>
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
