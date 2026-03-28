import { convertToModelMessages, streamText, stepCountIs, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { endOfDay, format, startOfDay, parseISO, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { buildTimeSlots } from "@/app/_utils/format";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const TIME_SLOT = [...buildTimeSlots()];

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const now = new Date();
  const currentDateTime = format(now, "EEEE, dd 'de' MMMM 'de' yyyy, HH:mm", {
    locale: ptBR,
  });

  const result = streamText({
    model: openrouter.chat("openrouter/auto"),
    system: `Você é o Aparatus AI, assistente virtual de agendamento de barbeiro.

Data/hora atual: ${currentDateTime}

REGRAS OBRIGATÓRIAS:
- Seja MUITO breve. Máximo 2-3 linhas por resposta.
- NUNCA invente horários. Use APENAS o que getAvailableTimeSlots retornar.
- NUNCA mostre IDs.
- Horários disponíveis são SEMPRE de 30 em 30 minutos: 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00, 12:30, 13:00, 13:30, 14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00, 17:30, 18:00.
- NUNCA invente horários como 12:10, 12:15 etc. Só use horários de 30 em 30 minutos.
- Horários precisam de 10 min de antecedência.
- Quando não houver horários, já diga de uma vez com a melhor opção.
- Formato de data: "Amanhã Dia 28 - Sábado", "Hoje Dia 27 - Sexta".
- Não faça perguntas desnecessárias. Se o horário não existe, já sugira o próximo.
- Fluxo: searchBarbershops → getServices → getAvailableTimeSlots → createBooking.
- SEMPRE chame getAvailableTimeSlots antes de createBooking.
- Converta datas relativas para YYYY-MM-DD.`,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(8),
    tools: {
      searchBarbershops: tool({
        description: "Busca barbearias pelo nome ou lista todas",
        inputSchema: z.object({
          query: z.string().optional().describe("Nome da barbearia."),
        }),
        execute: async ({ query }) => {
          const barbershops = await prisma.barberShop.findMany({
            where: query
              ? { name: { contains: query, mode: "insensitive" } }
              : undefined,
            select: { id: true, name: true, address: true },
          });

          if (barbershops.length === 0) {
            return "Nenhuma barbearia encontrada.";
          }

          return JSON.stringify(
            barbershops.map((b) => ({
              id: b.id,
              name: `${b.name} - ${b.address}`,
            })),
          );
        },
      }),

      getServices: tool({
        description: "Lista os serviços de uma barbearia",
        inputSchema: z.object({
          barbershopId: z.string().describe("ID da barbearia"),
        }),
        execute: async ({ barbershopId }) => {
          const services = await prisma.barberShopService.findMany({
            where: { barbershopId },
            select: {
              id: true,
              name: true,
              priceInCents: true,
              description: true,
            },
          });

          if (services.length === 0) {
            return "Nenhum serviço encontrado.";
          }

          return JSON.stringify(
            services.map((s) => ({
              id: s.id,
              name: `${s.name} - R$ ${(s.priceInCents / 100).toFixed(2)}`,
            })),
          );
        },
      }),

      getAvailableTimeSlots: tool({
        description:
          "Retorna horários disponíveis. Se não houver, já busca nos próximos 2 dias.",
        inputSchema: z.object({
          barbershopId: z.string().describe("ID da barbearia"),
          date: z.string().describe("Data no formato YYYY-MM-DD"),
        }),
        execute: async ({ barbershopId, date }) => {
          const parsedDate = parseISO(date);
          const now = new Date();

          const getSlotsForDate = async (d: Date) => {
            const bookings = await prisma.booking.findMany({
              where: {
                barbershopId,
                date: { gte: startOfDay(d), lt: endOfDay(d) },
                canceled: false,
              },
            });
            const occupied = bookings.map((b) => format(b.date, "HH:mm"));
            let slots = TIME_SLOT.filter((s) => !occupied.includes(s));

            if (isToday(d)) {
              const minTime = new Date(now.getTime() + 10 * 60 * 1000);
              const minMinutes = minTime.getHours() * 60 + minTime.getMinutes();
              slots = slots.filter((s) => {
                const [h, m] = s.split(":").map(Number);
                return h * 60 + m >= minMinutes;
              });
            }
            return slots;
          };

          const slots = await getSlotsForDate(parsedDate);

          if (slots.length > 0) {
            const dayLabel = isToday(parsedDate)
              ? `Hoje Dia ${format(parsedDate, "dd")} - ${format(parsedDate, "EEEE", { locale: ptBR })}`
              : `${format(parsedDate, "EEEE", { locale: ptBR })} Dia ${format(parsedDate, "dd")}`;
            return `${dayLabel}:\n${slots.join(", ")}`;
          }

          const results: string[] = [];
          for (let i = 1; i <= 2; i++) {
            const nextDate = new Date(parsedDate);
            nextDate.setDate(nextDate.getDate() + i);
            const nextSlots = await getSlotsForDate(nextDate);
            if (nextSlots.length > 0) {
              const dayLabel = `${format(nextDate, "EEEE", { locale: ptBR })} Dia ${format(nextDate, "dd")}`;
              results.push(`${dayLabel}: ${nextSlots.join(", ")}`);
            }
          }

          if (results.length === 0) {
            return "Nenhum horário disponível nos próximos 3 dias.";
          }

          return `Sem horários disponíveis hoje.\nPróximos disponíveis:\n${results.join("\n")}`;
        },
      }),

      createBooking: tool({
        description: "Cria um agendamento",
        inputSchema: z.object({
          serviceId: z.string().describe("ID do serviço"),
          date: z.string().describe("Data e hora ISO (YYYY-MM-DDTHH:mm:ss)"),
        }),
        execute: async ({ serviceId, date }) => {
          const session = await auth.api.getSession({
            headers: await headers(),
          });

          if (!session?.user?.id) {
            return "Você precisa estar logado para agendar.";
          }

          const service = await prisma.barberShopService.findUnique({
            where: { id: serviceId },
            include: { barbershop: true },
          });

          if (!service) {
            return "Serviço não encontrado.";
          }

          const bookingDate = new Date(date);
          const now = new Date();
          const tenMinutesMs = 10 * 60 * 1000;

          if (bookingDate.getTime() - now.getTime() < tenMinutesMs) {
            return `Não é possível agendar às ${format(bookingDate, "HH:mm")} porque esse horário já passou ou está muito próximo. É necessário agendar com pelo menos 10 minutos de antecedência.`;
          }

          const existingBooking = await prisma.booking.findFirst({
            where: {
              barbershopId: service.barbershopId,
              date: bookingDate,
              canceled: false,
            },
          });

          if (existingBooking) {
            return "Este horário já está ocupado. Escolha outro horário.";
          }

          const booking = await prisma.booking.create({
            data: {
              date: bookingDate,
              serviceId,
              barbershopId: service.barbershopId,
              userId: session.user.id,
            },
          });

          return `Agendamento confirmado!\nBarbearia: ${service.barbershop.name}\nServiço: ${service.name}\nData: ${format(bookingDate, "dd/MM/yyyy 'às' HH:mm")}`;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
};
