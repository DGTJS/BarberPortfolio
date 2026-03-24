import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import { BarberShopService } from "@/app/generated/prisma";

interface ServiceItemProps {
  service: BarberShopService;
}

export const ServiceItem = ({ service }: ServiceItemProps) => {
  return (
    <div className="bg-card border border-border rounded-[16px] p-3 flex gap-3 items-center">
      <div className="relative w-[110px] h-[110px] rounded-[10px] overflow-hidden shrink-0">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col h-full justify-between">
        <div className="space-y-1">
          <p className="font-bold text-[14px] text-card-foreground">
            {service.name}
          </p>
          <p className="text-[14px] text-muted-foreground leading-[1.4]">
            {service.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="font-bold text-[14px] text-card-foreground leading-[1.4]">
            R$ {(service.priceInCents / 100).toFixed(2)}
          </p>
          <Button className="bg-primary text-primary-foreground rounded-[999px] px-4 py-2 h-auto">
            Reservar
          </Button>
        </div>
      </div>
    </div>
  );
};
