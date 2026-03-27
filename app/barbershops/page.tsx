import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";
import { SearchInputs } from "@/app/_components/Search-inputs";
import { BarberShopItem } from "@/app/_components/BarberShopItem";
import {
  PageContainer,
  PageSection,
  PageSectionTitle,
} from "@/app/_components/ui/page";
import { prisma } from "@/lib/prisma";

interface BarbershopsPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function BarbershopsPage({
  searchParams,
}: BarbershopsPageProps) {
  const { search } = await searchParams;

  const barbershops = search
    ? await prisma.barberShop.findMany({
        where: {
          services: {
            some: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      })
    : await prisma.barberShop.findMany();

  return (
    <>
      <Header />
      <PageContainer>
        <SearchInputs />
        <PageSection>
          <PageSectionTitle>
            {search
              ? `Resultados para "${search}"`
              : "Barbearias"}
          </PageSectionTitle>
          {barbershops.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum barbeiro encontrado com o serviço &quot;{search}&quot;.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {barbershops.map((barberShop) => (
                <BarberShopItem key={barberShop.id} barberShop={barberShop} />
              ))}
            </div>
          )}
        </PageSection>
      </PageContainer>
      <Footer />
    </>
  );
}
