"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { actionClient } from "@/lib/action-client";
import { endOfDay, format, startOfDay } from "date-fns";
import { buildTimeSlots } from "../_utils/format";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { returnValidationErrors } from "next-safe-action";

const inputSchema = z.object({
  barberShopId: z.string(),
  date: z.date(),
});

export const getDataAvailbleTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barberShopId, date } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      returnValidationErrors(inputSchema, {
        _errors: ["User not logged in"],
      });
    }
    const booking = await prisma.booking.findMany({
      where: {
        barbershopId: barberShopId,
        date: {
          gte: startOfDay(date),
          lt: endOfDay(date),
        },
      },
    });
    const occupiedSlots = booking.map((booking) =>
      format(booking.date, "HH:mm"),
    );
    const availableSlots = buildTimeSlots().filter(
      (slot) => !occupiedSlots.includes(slot),
    );
    return availableSlots;
  });
