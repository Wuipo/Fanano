"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Booking } from "@/lib/types";
import { formatGiorno } from "@/lib/dates";

interface Props {
  bookings: Booking[];
  onChanged: () => void;
}

export default function BookingList({ bookings, onChanged }: Props) {
  const [annullando, setAnnullando] = useState<string | null>(null);

  async function annulla(b: Booking) {
    if (!confirm(`Annullare la prenotazione di ${b.guest_name}?`)) return;
    setAnnullando(b.id);
    const { error } = await supabase.from("bookings").delete().eq("id", b.id);
    setAnnullando(null);
    if (error) {
      alert("Errore nell'annullamento: " + error.message);
      return;
    }
    onChanged();
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-bosco-200 bg-white p-6 text-center text-sm text-bosco-400">
        Nessuna prenotazione attiva.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {bookings.map((b) => (
        <div
          key={b.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-bosco-200 bg-white p-3 shadow-sm"
        >
          <div className="min-w-0">
            <p className="truncate font-semibold text-bosco-900">
              {b.guest_name}
            </p>
            <p className="text-sm text-bosco-500">
              {formatGiorno(b.check_in)} → {formatGiorno(b.check_out)}
            </p>
            <p className="text-sm text-bosco-500">
              {b.num_people} {b.num_people === 1 ? "persona" : "persone"}
            </p>
            {b.notes && (
              <p className="mt-1 text-sm italic text-bosco-400">“{b.notes}”</p>
            )}
          </div>
          <button
            onClick={() => annulla(b)}
            disabled={annullando === b.id}
            className="shrink-0 rounded-lg border border-legno-300 px-3 py-2 text-sm font-medium text-legno-700 transition hover:bg-legno-50 active:scale-95 disabled:opacity-60"
          >
            {annullando === b.id ? "…" : "Annulla"}
          </button>
        </div>
      ))}
    </div>
  );
}
