import { prisma } from "@/lib/prisma";
import { PageContainer, PageSectionTitle } from "@/app/_components/ui/page";
import { Separator } from "@/app/_components/ui/separator";
import { ServiceItem } from "@/app/_components/ServiceItem";
import { ContactInfo } from "@/app/_components/ContactInfo";
import { notFound } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/app/_components/Footer";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const BarberShopPage = async (props: PageProps) => {
  const params = await props.params;
  const barberShop = await prisma.barberShop.findUnique({
    where: { id: params.id },
    include: { services: true },
  });

  if (!barberShop) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header with Banner Image */}
      <div className="relative h-[297px] w-full">
        <Image
          src={barberShop.imageUrl}
          alt={barberShop.name}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute left-5 top-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-background rounded-tl-[24px] rounded-tr-[24px] -mt-6 relative z-10">
        <PageContainer className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Info + Services */}
            <div className="flex-1">
              {/* Barber Shop Info */}
              <div className="flex gap-[5px] items-start">
                <div className="flex flex-col gap-[4px]">
                  <div className="flex gap-[6px] items-start">
                    <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden">
                      <Image
                        src={barberShop.imageUrl}
                        alt={barberShop.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h1 className="font-bold text-[20px] text-foreground leading-normal">
                      {barberShop.name}
                    </h1>
                  </div>
                  <p className="text-[14px] text-muted-foreground leading-[1.4]">
                    {barberShop.address}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* About Us Section */}
              <div className="space-y-3">
                <PageSectionTitle>Sobre Nós</PageSectionTitle>
                <p className="text-[14px] text-foreground leading-[1.4]">
                  {barberShop.description}
                </p>
              </div>

              <Separator className="my-6" />

              {/* Services Section */}
              <div className="space-y-4">
                <PageSectionTitle>Serviços</PageSectionTitle>
                {barberShop.services.map((service) => (
                  <ServiceItem
                    key={service.id}
                    service={service}
                    barberShop={{ id: barberShop.id, name: barberShop.name }}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Contact + Footer (Desktop only) */}
            <div className="hidden lg:block lg:w-[300px] lg:shrink-0">
              <div className="sticky top-8 space-y-6">
                <div className="space-y-3">
                  <PageSectionTitle>Contato</PageSectionTitle>
                  <ContactInfo phones={barberShop.phones} />
                </div>
                <Separator />
                <Footer />
              </div>
            </div>
          </div>

          {/* Contact + Footer (Mobile only) */}
          <div className="lg:hidden">
            <Separator className="my-6" />
            <div className="space-y-3">
              <PageSectionTitle>Contato</PageSectionTitle>
              <ContactInfo phones={barberShop.phones} />
            </div>
            <Footer />
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default BarberShopPage;
