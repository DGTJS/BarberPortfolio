"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { actionClient } from "./safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { toast } from "sonner";
import { returnValidationErrors } from "next-safe-action";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
});

export const createBookingAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { serviceId, date } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      throw new Error("Usuário não autenticado");
    }

    const service = await prisma.barberShopService.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      throw new Error("Serviço não encontrado");
    }
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date,
      },
    });
    if (existingBooking) {
      returnValidationErrors(inputSchema, {
        _errors: ["Já existe uma agendamento nesse horário"],
      });
    }
    const booking = await prisma.booking.create({
      data: {
        date,
        serviceId,
        barbershopId: service.barbershopId,
        userId: session?.user.id,
      },
    });
    return booking;
  });
