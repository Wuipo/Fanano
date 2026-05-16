import type { Booking } from "./types";

const MESI = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

const GIORNI = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export { MESI, GIORNI };

/** Converte una Date in stringa YYYY-MM-DD in orario locale. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parsea YYYY-MM-DD come data locale (no shift di fuso). */
export function fromISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatGiorno(s: string): string {
  const d = fromISODate(s);
  return `${d.getDate()} ${MESI[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Due prenotazioni si sovrappongono se condividono almeno una notte.
 * check_out e' il giorno di partenza, quindi non e' una notte occupata.
 */
export function overlaps(
  inA: string, outA: string,
  inB: string, outB: string,
): boolean {
  return inA < outB && inB < outA;
}

/** Restituisce le prenotazioni che occupano un dato giorno (notte). */
export function bookingsForDay(bookings: Booking[], day: string): Booking[] {
  return bookings.filter((b) => b.check_in <= day && day < b.check_out);
}
