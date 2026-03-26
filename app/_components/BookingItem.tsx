"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage } from "./ui/avatar";
import { BookingSheet } from "./BookingSheet";

interface BookingItemProps {
  id: string;
  serviceName: string;
  barberShopName: string;
  barberShopImage: string;
  barberShopAddress: string;
  barberShopPhones: string[];
  servicePriceInCents: number;
  date: Date;
  canceled: boolean;
  status: "confirmed" | "finished" | "canceled";
}

export const BookingItem = ({
  id,
  serviceName,
  barberShopName,
  barberShopImage,
  barberShopAddress,
  barberShopPhones,
  servicePriceInCents,
  date,
  canceled,
  status,
}: BookingItemProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const getStatusBadge = () => {
    switch (status) {
      case "confirmed":
        return <Badge>Confirmado</Badge>;
      case "finished":
        return (
          <Badge variant="secondary" className="bg-input">
            Finalizado
          </Badge>
        );
      case "canceled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>Confirmado</Badge>;
    }
  };

  return (
    <>
      <div onClick={() => setSheetOpen(true)} className="cursor-pointer">
        <Card className="flex flex-row items-center justify-between w-full h-full min-w-full p-0">
          {/* {ESQUERDA} */}
          <div className="flex flex-col gap-4 p-4">
            {getStatusBadge()}
            <div className="flex flex-col gap-2">
              <p className=" font-bold">{serviceName}</p>
              <div className="flex flex-row gap-2 ">
                <Avatar>
                  <AvatarImage src={barberShopImage} alt={barberShopName} />
                </Avatar>
                <p className="text-sm text-muted-foreground ">
                  {barberShopName}
                </p>
              </div>
            </div>
          </div>
          {/* {DIREITA} */}
          <div className="flex flex-col px-8 py-4 h-full border-l">
            <p className="text-sm capitalize text-foreground ">
              {date.toLocaleDateString("pt-BR", {
                month: "long",
              })}
            </p>
            <p className="text-2xl text-center font-light capitalize text-foreground ">
              {date.toLocaleDateString("pt-BR", {
                day: "2-digit",
              })}
            </p>
            <p className="text-sm capitalize text-foreground ">
              {date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </Card>
      </div>

      <BookingSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        booking={{
          id,
          service: {
            name: serviceName,
            priceInCents: servicePriceInCents,
          },
          barbershop: {
            name: barberShopName,
            address: barberShopAddress,
            imageUrl: barberShopImage,
            phones: barberShopPhones,
          },
          date,
          canceled,
        }}
      />
    </>
  );
};
