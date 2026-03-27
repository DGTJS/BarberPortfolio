import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const POST = async (req: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const text = await req.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const date = session.metadata?.date;
    const serviceId = session.metadata?.serviceId;
    const barbershopId = session.metadata?.barbershopId;
    const userId = session.metadata?.userId;
    if (!date || !serviceId || !barbershopId || !userId) {
      return NextResponse.error();
    }

    const bookingDate = new Date(date);
    const existingBooking = await prisma.booking.findFirst({
      where: {
        serviceId,
        barbershopId,
        userId,
        date: bookingDate,
      },
    });
    if (!existingBooking) {
      await prisma.booking.create({
        data: {
          serviceId,
          barbershopId,
          userId,
          date: bookingDate,
        },
      });
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
};
