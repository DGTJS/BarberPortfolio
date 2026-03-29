"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { actionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Stripe from "stripe";

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

    if (booking.stripeChargeId) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      await stripe.refunds.create({
        charge: booking.stripeChargeId,
      });
    }

    if (booking.canceled) {
      throw new Error("Agendamento já cancelado");
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
