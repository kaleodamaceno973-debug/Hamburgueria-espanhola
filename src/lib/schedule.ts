import { OPENING_HOURS } from "./constants";

/** Brasil não tem horário de verão desde 2019: São Paulo = UTC-3 fixo. */
const SP_OFFSET_MIN = -3 * 60;
const SLOT_MINUTES = 30;
const LEAD_MINUTES = 40;
const MAX_DAYS = 3;

function toSaoPaulo(date: Date) {
  return new Date(date.getTime() + SP_OFFSET_MIN * 60_000);
}

/** Horários (ISO) disponíveis para agendar retirada/entrega nos próximos dias. */
export function availableSlots(now = new Date()): { iso: string; label: string; day: string }[] {
  const slots: { iso: string; label: string; day: string }[] = [];
  const earliest = now.getTime() + LEAD_MINUTES * 60_000;
  const spNow = toSaoPaulo(now);
  for (let d = 0; d < MAX_DAYS; d++) {
    for (let h = OPENING_HOURS.open; h < OPENING_HOURS.close; h++) {
      for (const m of [0, 30]) {
        // Constrói a data em SP e converte para UTC.
        const utc = Date.UTC(spNow.getUTCFullYear(), spNow.getUTCMonth(), spNow.getUTCDate() + d, h, m) - SP_OFFSET_MIN * 60_000;
        if (utc < earliest) continue;
        const date = new Date(utc);
        const sp = toSaoPaulo(date);
        const day = d === 0 ? "Hoje" : d === 1 ? "Amanhã" : sp.toISOString().slice(8, 10) + "/" + sp.toISOString().slice(5, 7);
        slots.push({
          iso: date.toISOString(),
          label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
          day,
        });
      }
    }
  }
  return slots;
}

/** Valida no servidor um horário agendado. */
export function isValidSlot(iso: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  if (date.getTime() < now.getTime() + (LEAD_MINUTES - 5) * 60_000) return false;
  if (date.getTime() > now.getTime() + MAX_DAYS * 24 * 3600_000) return false;
  const sp = toSaoPaulo(date);
  const h = sp.getUTCHours();
  const m = sp.getUTCMinutes();
  if (m % SLOT_MINUTES !== 0) return false;
  return h >= OPENING_HOURS.open && h < OPENING_HOURS.close;
}

export function isOpenNow(now = new Date()) {
  const h = toSaoPaulo(now).getUTCHours();
  return h >= OPENING_HOURS.open && h < OPENING_HOURS.close;
}
