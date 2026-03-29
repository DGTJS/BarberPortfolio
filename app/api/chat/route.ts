import { convertToModelMessages, streamText, stepCountIs, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { endOfDay, format, startOfDay, parseISO, isToday, addDays } from "date-fns";
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
    system: `Você é o assistente virtual de agendamento da Barbearia Vintage. Seu objetivo é auxiliar os clientes a marcar serviços de forma clara, precisa e respeitando a disponibilidade real do salão.

Data/hora atual: ${currentDateTime}

REGRAS OBRIGATÓRIAS:

IDIOMA E TOM:
1. Responda apenas em português. Tom cordial e profissional. Seja breve (1-2 frases por mensagem).

CONTEXTO (CRÍTICO):
2. NUNCA pergunte informações que o cliente já forneceu. Se o cliente disse "barba às 18hrs hoje", ele já deu serviço (barba), hora (18:00) e data (hoje). NÃO pergunte de novo.
3. Quando o cliente usar "hoje", "amanhã", "depois de amanhã", converta IMEDIATAMENTE para a data real usando a data/hora atual fornecida acima.
4. Se faltar apenas UMA informação, pergunte APENAS essa informação.
5. Se o cliente mudar de ideia, atualize o contexto.

FLUXO DE RESPOSTA (CRÍTICO):
6. Quando o cliente pedir um agendamento, SEMPRE siga esta sequência:
   PASSO 1 - Responda PRIMEIRO com uma mensagem curta: "Vou verificar para você..." ou "Deixa eu ver as opções..."
   PASSO 2 - DEPOIS dessa mensagem, chame as tools necessárias.
   PASSO 3 - DEPOIS das tools retornarem, faça APENAS uma pergunta curta. NÃO repita o output das tools. NÃO mostre JSON. NÃO mostre IDs. Apenas pergunte "Qual barbearia?" ou "Qual serviço?" etc.
7. NUNCA pule o PASSO 1.
8. NUNCA liste opções em texto. As opções aparecem como BOTÕES no frontend. Apenas chame a tool e faça uma pergunta curta.
9. NUNCA inclua o output das tools (JSON, IDs, labels) na sua mensagem de texto. O frontend renderiza os botões automaticamente.

FLUXO CONDICIONAL DE AGENDAMENTO (CRÍTICO):
9. Quando o cliente pedir um agendamento, PRIMEIRO identifique o que ele já informou na mensagem:
   - Barbearia mencionada? (ex: "barbearia vintage", "na vintage", "vintage")
   - Serviço mencionado? (ex: "corte", "barba", "combo", "cabelo")
   - Data mencionada? (ex: "hoje", "amanhã", "segunda", "30/03")
   - Horário mencionado? (ex: "18hrs", "às 15:30", "10h")

10. Com base no que foi informado, chame APENAS as tools necessárias:
    a) Se barbearia NÃO foi mencionada → searchBarbershops → pergunta "Qual barbearia?"
    b) Se barbearia foi mencionada mas serviço NÃO → getServices(barbershopId) → pergunta "Qual serviço?"
    c) Se serviço e barbearia foram mencionados mas data NÃO → getAvailableDates(barbershopId) → pergunta "Qual dia?"
    d) Se data foi mencionada mas horário NÃO → getAvailableTimeSlots(barbershopId, date) → pergunta "Qual horário?"
    e) Se TUDO foi mencionado (barbearia + serviço + data + horário) → chame searchBarbershops, getServices, getAvailableDates, getAvailableTimeSlots e verifique se o horário está disponível. Depois confirme ou negue.

11. NUNCA pergunte algo que o cliente já informou.
12. Se o cliente disse tudo de uma vez, apenas verifique disponibilidade e:
    - Se disponível: "O horário das 18:00 está disponível! Deseja confirmar?"
    - Se indisponível: "Infelizmente o horário das 18:00 não está disponível. Horários livres: [botões]"
13. Quando o cliente confirmar, chame createBooking.

QUANDO O CLIENTE CLICA UM BOTÃO:
14. O frontend envia o valor como texto. Exemplo: cliente clica em "Barbearia Vintage" → você recebe "Barbearia Vintage".
15. Identifique qual informação foi recebida (barbearia, serviço, data ou horário) e prossiga para o próximo passo.
16. NÃO repita a informação recebida de forma longa. Confirme brevemente e prossiga. Exemplo: "Ótimo! Qual serviço você gostaria?"

QUANDO O CLIENTE ENVIA UMA DATA YYYY-MM-DD (CRÍTICO):
17. Se o cliente enviar uma string no formato "YYYY-MM-DD" (ex: "2026-03-29"), isso é uma SELEÇÃO DE DATA dos botões.
18. Identifique o barbershopId e serviceId do contexto anterior na conversa.
19. Chame getAvailableTimeSlots(barbershopId, date) com essa data.
20. Pergunte "Qual horário?" e deixe os botões de horários aparecerem.
21. NÃO repita a data. Apenas prossiga.

QUANDO UMA TOOL RETORNA OPTIONS VAZIO:
22. Se searchBarbershops retornar empty: true → "Não encontrei barbearias disponíveis. Tente novamente."
23. Se searchBarbershops retornar error: true → "Ocorreu um erro ao buscar barbearias. Tente novamente."
24. Se getServices retornar options: [] → "Não encontrei serviços disponíveis nesta barbearia."
25. Se getAvailableDates retornar options: [] → "Não há datas disponíveis para esta barbearia."
26. Se getAvailableTimeSlots retornar options: [] → "Não há horários disponíveis para esta data. Escolha outra data."

AGENDAMENTO (CRÍTICO):
27. Quando o cliente CONFIRMAR um horário (disser "sim", "ok", "pode ser", "confirma", "marca pra mim"), chame createBooking IMEDIATAMENTE.
23. Após createBooking retornar sucesso, confirme: "Agendamento realizado com sucesso! Até lá!"
24. Se createBooking retornar erro, informe: "Desculpe, [mensagem de erro]. Quer tentar outro horário?"

DISPONIBILIDADE:
25. O salão abre às 09:00 e o último horário possível é às 18:00. Horários são de 30 em 30 minutos.
26. 18:00 É um horário possível. NUNCA diga que 18:00 não é possível.
27. NUNCA diga que um horário é "válido" ou "disponível" ANTES de chamar getAvailableTimeSlots.
28. Se um horário não estiver disponível, informe e deixe os botões de horários alternativos aparecerem.

CANCELAMENTO/REAGENDAMENTO:
29. Se o cliente disser "quero cancelar", peça confirmação.
30. Se "quero reagendar", reinicie o fluxo do passo 9.

NUNCA mostre IDs ao cliente.
Converta datas relativas para YYYY-MM-DD antes de chamar tools.`,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(12),
    tools: {
      searchBarbershops: tool({
        description: "Busca barbearias pelo nome ou lista todas. Retorna JSON com type: barbearhops e options[] para renderizar botões.",
        inputSchema: z.object({
          query: z.string().optional().describe("Nome da barbearia."),
        }),
        execute: async ({ query }) => {
          try {
            const barbershops = await prisma.barberShop.findMany({
              where: query
                ? { name: { contains: query, mode: "insensitive" } }
                : undefined,
              select: { id: true, name: true, address: true },
            });

            if (barbershops.length === 0) {
              return JSON.stringify({ type: "barbershops", options: [], empty: true });
            }

            return JSON.stringify({
              type: "barbershops",
              options: barbershops.map((b) => ({
                id: b.id,
                label: b.name,
              })),
            });
          } catch (error) {
            console.error("Erro ao buscar barbearias:", error);
            return JSON.stringify({ type: "barbershops", options: [], error: true });
          }
        },
      }),

      getServices: tool({
        description: "Lista os serviços de uma barbearia. Retorna JSON com type: services e options[] para renderizar botões.",
        inputSchema: z.object({
          barbershopId: z.string().describe("ID da barbearia"),
        }),
        execute: async ({ barbershopId }) => {
          try {
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
              return JSON.stringify({ type: "services", options: [] });
            }

            return JSON.stringify({
              type: "services",
              options: services.map((s) => ({
                id: s.id,
                label: `${s.name} - R$ ${(s.priceInCents / 100).toFixed(2)}`,
              })),
            });
          } catch {
            return JSON.stringify({ type: "services", options: [] });
          }
        },
      }),

      getAvailableTimeSlots: tool({
        description:
          "Retorna horários disponíveis para uma data. Retorna JSON com type: timeSlots e options[] para renderizar botões.",
        inputSchema: z.object({
          barbershopId: z.string().describe("ID da barbearia"),
          date: z.string().describe("Data no formato YYYY-MM-DD"),
        }),
        execute: async ({ barbershopId, date }) => {
          try {
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
              return JSON.stringify({
                type: "timeSlots",
                options: slots.map((s) => ({ value: s, label: s })),
              });
            }

            return JSON.stringify({ type: "timeSlots", options: [] });
          } catch {
            return JSON.stringify({ type: "timeSlots", options: [] });
          }
        },
      }),

      getAvailableDates: tool({
        description:
          "Retorna datas disponíveis para agendamento nos próximos 7 dias. Retorna JSON com type: dates e options[] para renderizar botões.",
        inputSchema: z.object({
          barbershopId: z.string().describe("ID da barbearia"),
        }),
        execute: async ({ barbershopId }) => {
          try {
            const now = new Date();
            const options: { value: string; label: string }[] = [];

            for (let i = 0; i < 7; i++) {
              const checkDate = addDays(now, i);
              const bookings = await prisma.booking.findMany({
                where: {
                  barbershopId,
                  date: { gte: startOfDay(checkDate), lt: endOfDay(checkDate) },
                  canceled: false,
                },
              });
              const occupied = bookings.map((b) => format(b.date, "HH:mm"));
              let slots = TIME_SLOT.filter((s) => !occupied.includes(s));

              if (isToday(checkDate)) {
                const minTime = new Date(now.getTime() + 10 * 60 * 1000);
                const minMinutes =
                  minTime.getHours() * 60 + minTime.getMinutes();
                slots = slots.filter((s) => {
                  const [h, m] = s.split(":").map(Number);
                  return h * 60 + m >= minMinutes;
                });
              }

              if (slots.length > 0) {
                const dayName = format(checkDate, "EEEE", { locale: ptBR });
                const dayFormatted = format(checkDate, "dd/MM");
                const prefix = isToday(checkDate) ? "Hoje" : i === 1 ? "Amanhã" : dayName;
                options.push({
                  value: format(checkDate, "yyyy-MM-dd"),
                  label: `${prefix} ${dayFormatted} - ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`,
                });
              }
            }

            return JSON.stringify({ type: "dates", options });
          } catch {
            return JSON.stringify({ type: "dates", options: [] });
          }
        },
      }),

      createBooking: tool({
        description: "Cria um agendamento. Retorna JSON com type: booking para renderizar card de confirmação.",
        inputSchema: z.object({
          serviceId: z.string().describe("ID do serviço"),
          date: z.string().describe("Data e hora ISO (YYYY-MM-DDTHH:mm:ss)"),
        }),
        execute: async ({ serviceId, date }) => {
          try {
            const session = await auth.api.getSession({
              headers: await headers(),
            });

            if (!session?.user?.id) {
              return JSON.stringify({
                type: "error",
                message: "Você precisa estar logado para agendar.",
              });
            }

            const service = await prisma.barberShopService.findUnique({
              where: { id: serviceId },
              include: { barbershop: true },
            });

            if (!service) {
              return JSON.stringify({
                type: "error",
                message: "Serviço não encontrado.",
              });
            }

            const bookingDate = new Date(date);
            const now = new Date();
            const tenMinutesMs = 10 * 60 * 1000;

            if (bookingDate.getTime() - now.getTime() < tenMinutesMs) {
              return JSON.stringify({
                type: "error",
                message: `Não é possível agendar às ${format(bookingDate, "HH:mm")} porque esse horário já passou ou está muito próximo.`,
              });
            }

            const existingBooking = await prisma.booking.findFirst({
              where: {
                barbershopId: service.barbershopId,
                date: bookingDate,
                canceled: false,
              },
            });

            if (existingBooking) {
              return JSON.stringify({
                type: "error",
                message: "Este horário já está ocupado. Escolha outro horário.",
              });
            }

            await prisma.booking.create({
              data: {
                date: bookingDate,
                serviceId,
                barbershopId: service.barbershopId,
                userId: session.user.id,
              },
            });

            return JSON.stringify({
              type: "booking",
              barbershopName: service.barbershop.name,
              serviceName: service.name,
              date: format(bookingDate, "dd/MM/yyyy"),
              time: format(bookingDate, "HH:mm"),
            });
          } catch {
            return JSON.stringify({
              type: "error",
              message: "Erro ao criar agendamento. Tente novamente.",
            });
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
};
