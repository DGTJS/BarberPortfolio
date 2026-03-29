# Plano de Implementação - Sheet de Agendamento

## Visão Geral

Implementar um Sheet (painel lateral) na tela de agendamentos que exibe detalhes completos de um agendamento quando o usuário clica em um BookingItem. O Sheet deve permitir cancelar agendamentos e copiar números de telefone da barbearia.

## Requisitos

1. **Sheet de Detalhes do Agendamento**
   - Abrir ao clicar em um BookingItem
   - Exibir: status, serviço, valor, data, horário, barbearia (nome, endereço, imagem)
   - Usar imagem `public/MapCard.png` para informações da barbearia
   - Interface 100% fiel ao Figma

2. **Funcionalidades**
   - Botão de voltar para fechar o Sheet
   - Botão de cancelar agendamento (muda `canceled = true` no banco)
   - Botão de copiar número de telefone da barbearia
   - Status: "Confirmado" se agendamento é no futuro, "Finalizado" se já passou

3. **Server Action**
   - Criar `@app/_actions/cancel-booking.ts`
   - Receber ID do agendamento e cancelar no banco
   - Sem dupla verificação (front/back)

## Arquivos a Serem Criados/Modificados

### 1. Server Action: `app/_actions/cancel-booking.ts` (NOVO)

```typescript
"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { actionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const inputSchema = z.object({
  bookingId: z.uuid(),
});

export const cancelBookingAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { bookingId } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      throw new Error("Usuário não autenticado");
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        userId: session.user.id,
      },
    });

    if (!booking) {
      throw new Error("Agendamento não encontrado");
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        canceled: true,
        canceledAt: new Date(),
      },
    });

    return updatedBooking;
  });
```

### 2. Componente: `app/_components/CopyToClipboardButton.tsx` (NOVO)

```typescript
"use client";

import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface CopyToClipboardButtonProps {
  text: string;
}

export const CopyToClipboardButton = ({ text }: CopyToClipboardButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar:", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2"
    >
      <Copy className="h-4 w-4" />
      {copied ? "Copiado!" : "Copiar"}
    </Button>
  );
};
```

### 3. Componente: `app/_components/BookingSheet.tsx` (NOVO)

```typescript
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CopyToClipboardButton } from "./CopyToClipboardButton";
import { cancelBookingAction } from "@/app/_actions/cancel-booking";
import { useAction } from "next-safe-action";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BookingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    service: {
      name: string;
      priceInCents: number;
    };
    barbershop: {
      name: string;
      address: string;
      imageUrl: string;
      phones: string[];
    };
    date: Date;
    canceled: boolean;
  };
}

export const BookingSheet = ({
  open,
  onOpenChange,
  booking,
}: BookingSheetProps) => {
  const router = useRouter();
  const { execute, status } = useAction(cancelBookingAction, {
    onSuccess: () => {
      onOpenChange(false);
      router.refresh();
    },
  });

  const now = new Date();
  const bookingDate = new Date(booking.date);
  const isFuture = bookingDate > now;

  const getStatus = () => {
    if (booking.canceled) return "canceled";
    if (isFuture) return "confirmed";
    return "finished";
  };

  const status = getStatus();

  const getStatusBadge = () => {
    switch (status) {
      case "confirmed":
        return <Badge>Confirmado</Badge>;
      case "finished":
        return <Badge variant="secondary">Finalizado</Badge>;
      case "canceled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>Confirmado</Badge>;
    }
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Detalhes do Agendamento</SheetTitle>
          <SheetDescription>
            Informações completas sobre seu agendamento
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            {getStatusBadge()}
          </div>

          <Separator />

          {/* Serviço */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Serviço</span>
            <p className="text-lg font-semibold">{booking.service.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatPrice(booking.service.priceInCents)}
            </p>
          </div>

          <Separator />

          {/* Data e Horário */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Data e Horário</span>
            <p className="text-lg font-semibold">{formatDate(bookingDate)}</p>
            <p className="text-sm text-muted-foreground">
              {formatTime(bookingDate)}
            </p>
          </div>

          <Separator />

          {/* Barbearia */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium">Barbearia</span>
            <div className="relative h-40 w-full overflow-hidden rounded-lg">
              <Image
                src="/MapCard.png"
                alt={booking.barbershop.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-lg font-semibold text-white">
                  {booking.barbershop.name}
                </p>
                <p className="text-sm text-white/80">
                  {booking.barbershop.address}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Telefones */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">Telefones</span>
            {booking.barbershop.phones.map((phone, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-sm">{phone}</p>
                <CopyToClipboardButton text={phone} />
              </div>
            ))}
          </div>
        </div>

        <SheetFooter className="flex flex-col gap-3">
          {status === "confirmed" && (
            <Button
              variant="destructive"
              onClick={() => execute({ bookingId: booking.id })}
              disabled={status === "executing"}
            >
              {status === "executing" ? "Cancelando..." : "Cancelar Agendamento"}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Voltar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
```

### 4. Componente Atualizado: `app/_components/BookingItem.tsx` (MODIFICAR)

Adicionar:

- Import do `BookingSheet`
- Estado para controlar abertura do Sheet
- `onClick` no Card para abrir o Sheet
- Renderização do `BookingSheet`

```typescript
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
        return <Badge variant="secondary">Finalizado</Badge>;
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
```

### 5. Página Atualizada: `app/bookings/page.tsx` (MODIFICAR)

Atualizar as props passadas para `BookingItem`:

```typescript
// No map dos bookings, atualizar as props:
<BookingItem
  key={booking.id}
  id={booking.id}
  serviceName={booking.service.name}
  barberShopName={booking.barbershop.name}
  barberShopImage={booking.barbershop.imageUrl}
  barberShopAddress={booking.barbershop.address}
  barberShopPhones={booking.barbershop.phones}
  servicePriceInCents={booking.service.priceInCents}
  date={new Date(booking.date)}
  canceled={booking.canceled}
  status={getBookingStatus(booking)}
/>
```

## Fluxo de Implementação

1. **Criar server action `cancel-booking.ts`**
   - Validar autenticação
   - Verificar se agendamento pertence ao usuário
   - Atualizar `canceled = true` e `canceledAt = new Date()`

2. **Criar componente `CopyToClipboardButton.tsx`**
   - Usar `navigator.clipboard.writeText()`
   - Feedback visual "Copiado!"

3. **Criar componente `BookingSheet.tsx`**
   - Usar `Sheet` do shadcn/ui
   - Exibir todos os campos requeridos
   - Usar imagem `/MapCard.png` para barbearia
   - Botão de cancelar (apenas para agendamentos confirmados)
   - Botão de voltar para fechar

4. **Atualizar `BookingItem.tsx`**
   - Adicionar estado para controlar Sheet
   - Adicionar `onClick` para abrir Sheet
   - Passar todas as props necessárias para o Sheet

5. **Atualizar `bookings/page.tsx`**
   - Passar props adicionais para `BookingItem`

## Dependências

- `lucide-react` (já instalado) - para ícone de copiar
- `next-safe-action` (já instalado) - para server action
- `shadcn/ui` (já configurado) - para Sheet, Button, Badge, Separator

## Validações

- [ ] Server action cancel-booking.ts criada corretamente
- [ ] Componente CopyToClipboardButton funciona
- [ ] Componente BookingSheet exibe todas as informações
- [ ] BookingItem abre o Sheet ao ser clicado
- [ ] Botão de cancelar funciona apenas para agendamentos confirmados
- [ ] Botão de copiar telefone funciona
- [ ] Interface é fiel ao Figma
- [ ] Status é exibido corretamente (Confirmado/Finalizado/Cancelado)
