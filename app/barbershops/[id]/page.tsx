import { prisma } from "@/lib/prisma";
import {
  PageContainer,
  PageSectionTitle,
  CopyButton,
} from "@/app/_components/ui/page";
import { Separator } from "@/app/_components/ui/separator";
import { ServiceItem } from "@/app/_components/ui/ServiceItem";
import { notFound } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
        <PageContainer>
          {/* Barber Shop Info */}
          <div className="flex gap-[5px] items-start">
            <div className="flex flex-col gap-[4px]">
              <div className="flex gap-[6px] items-start">
                {/* Avatar Group - Using barbershop image repeated */}
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
          {barberShop.services.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}

          <Separator className="my-6" />

          {/* Contact Section */}
          <div className="space-y-3">
            <PageSectionTitle>Contato</PageSectionTitle>
            <div className="space-y-3">
              {barberShop.phones.map((phone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex gap-[10px] items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <p className="font-normal text-[14px] text-foreground leading-[1.4]">
                      {phone}
                    </p>
                  </div>
                  <CopyButton text={phone} />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-10">
            <div className="bg-secondary rounded-[20px] px-6 py-8 space-y-2">
              <p className="font-semibold text-[12px] text-foreground">
                © 2025 Copyright Aparatus
              </p>
              <p className="text-[12px] text-muted-foreground">
                Todos os direitos reservados.
              </p>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default BarberShopPage;
