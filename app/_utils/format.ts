/**
 * Formata o preço em centavos para formato BRL.
 * @param priceInCents - Preço em centavos
 * @returns String formatada em reais (ex: "R$ 50,00")
 */

export function formatPriceInBRL(priceInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100);
}

/**
 * Capitaliza a primeira letra de uma string.
 * @param value - String a ser capitalizada
 * @returns String com a primeira letra maiúscula
 */
export function capitalizeFirstLetter(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Retorna a duração padrão do serviço em segundos baseada no nome.
 * @param serviceName - Nome do serviço
 * @returns Duração em segundos
 */
export function getDefaultServiceDurationInSeconds(
  serviceName: string,
): number {
  const normalizedName = serviceName.toLowerCase();

  if (normalizedName.includes("corte")) return 60 * 60;
  if (normalizedName.includes("barba")) return 30 * 60;
  if (normalizedName.includes("sobrancelha")) return 15 * 60;
  if (normalizedName.includes("pézinho")) return 20 * 60;
  if (normalizedName.includes("massagem")) return 30 * 60;
  if (normalizedName.includes("hidratação")) return 30 * 60;

  return 30 * 60;
}

/**
 * Gera os horários disponíveis para agendamento (9h às 18h, intervalo de 30min).
 * @returns Array de strings com horários (ex: ["09:00", "09:30", ...])
 */
export function buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let minutes = 9 * 60; minutes <= 18 * 60; minutes += 30) {
    const hoursPart = String(Math.floor(minutes / 60)).padStart(2, "0");
    const minutesPart = String(minutes % 60).padStart(2, "0");
    slots.push(`${hoursPart}:${minutesPart}`);
  }
  return slots;
}

/**
 * Formata duração em segundos para texto legível.
 * @param seconds - Duração em segundos
 * @returns String formatada (ex: "45 minutos", "1 hora", "1 hora e 30 minutos")
 */
export function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) return `${totalMinutes} minutos`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (mins === 0) return hours === 1 ? "1 hora" : `${hours} horas`;
  return `${hours} hora${hours > 1 ? "s" : ""} e ${mins} minutos`;
}
