import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage } from "./ui/avatar";

interface BookingItemProps {
  serviceName: string;
  barberShopName: string;
  barberShopImage: string;
  date: Date;
}

export const BookingItem = ({
  serviceName,
  barberShopName,
  barberShopImage,
  date,
}: BookingItemProps) => {
  return (
    <div>
      <Card className="flex flex-row items-center justify-between w-full h-full min-w-full p-0">
        {/* {ESQUERDA} */}
        <div className="flex flex-col gap-4 p-4">
          <Badge>Confirmado</Badge>
          <div className="flex flex-col gap-2">
            <p className=" font-bold">{serviceName}</p>
            <div className="flex flex-row gap-2 ">
              <Avatar>
                <AvatarImage src={barberShopImage} alt={barberShopName} />
              </Avatar>
              <p className="text-sm text-muted-foreground ">{barberShopName}</p>
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
  );
};
