import { BarberShop } from "../generated/prisma/browser";
import Image from "next/image";

interface BarberShopItemProps {
  barberShop: BarberShop;
}

export const BarberShopItem = ({ barberShop }: BarberShopItemProps) => {
  return (
    <div className="relative min-h-[200px] min-w-[290px] flex flex-row">
      <div className="absolute top-0 left-0 right-0 z-20 h-full w-full bg-linear-to-t from-black to-transparent rounded-xl" />
      <Image
        src={barberShop.imageUrl}
        alt={barberShop.name}
        className="object-cover rounded-xl"
        fill
      />
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <p className="text-foreground text-lg font-bold">{barberShop.name}</p>
        <p className="text-foreground text-xs font-light">
          {barberShop.address}
        </p>
      </div>
    </div>
  );
};
