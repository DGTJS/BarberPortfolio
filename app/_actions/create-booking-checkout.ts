"use server";

import { z } from "zod";
import Stripe from "stripe";
import { actionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { returnValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
});

export const createBookingCheckoutAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { serviceId, date } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autenticado"],
      });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-10-29.clover",
    });

    const service = await prisma.barberShopService.findUnique({
      where: {
        id: serviceId,
      },
    });

    const barberShop = await prisma.barberShop.findUnique({
      where: {
        id: service?.barbershopId,
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata: {
        serviceId: serviceId,
        userId: session.user.id,
        barbershopId: service?.barbershopId || "",
        date: date.toISOString(),
      },
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: service?.priceInCents,
            product_data: {
              name: `${barberShop?.name || ""} - ${service?.name || ""}  - Em ${format(date, "dd/MM/yyyy HH:mm")}`,
              description: `${service?.description || ""}`,
              images: [service?.imageUrl || ""],
            },
          },
          quantity: 1,
        },
      ],
    });
    return { url: checkoutSession.url };
  });
