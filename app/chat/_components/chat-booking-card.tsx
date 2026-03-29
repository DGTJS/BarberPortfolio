import { CheckCircle, Store, Scissors, Calendar, Clock } from "lucide-react";

interface ChatBookingCardProps {
  barbershopName: string;
  serviceName: string;
  date: string;
  time: string;
}

export function ChatBookingCard({
  barbershopName,
  serviceName,
  date,
  time,
}: ChatBookingCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 mt-2">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="size-5 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Agendamento Confirmado
        </span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <Store className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground">{barbershopName}</span>
        </div>

        <div className="flex items-center gap-3">
          <Scissors className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground">{serviceName}</span>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground">{date}</span>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground">{time}</span>
        </div>
      </div>
    </div>
  );
}
