"use server";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getUserBookingsAction = actionClient.action(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return [];
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      service: true,
      barbershop: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return bookings;
});
