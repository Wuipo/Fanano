"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Booking } from "@/lib/types";
import { formatGiorno, overlaps, toISODate } from "@/lib/dates";

interface Props {
  bookings: Booking[];
  onCreated: () => void;
}

const oggiISO = toISODate(new Date());

export default function BookingForm({ bookings, onCreated }: Props) {
  const [nome, setNome] = useState("");
  const [arrivo, setArrivo] = useState("");
  const [partenza, setPartenza] = useState("");
  const [persone, setPersone] = useState("2");
  const [note, setNote] = useState("");
  const [errore, setErrore] = useState<string | null>(null);
  const [invio, setInvio] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrore(null);

    if (!nome.trim()) {
      setErrore("Inserisci il nome di chi prenota.");
      return;
    }
    if (!arrivo || !partenza) {
      setErrore("Inserisci sia la data di arrivo che quella di partenza.");
      return;
    }
    if (partenza <= arrivo) {
      setErrore("La data di partenza deve essere successiva a quella di arrivo.");
      return;
    }
    const n = Number(persone);
    if (!Number.isInteger(n) || n < 1) {
      setErrore("Il numero di persone deve essere almeno 1.");
      return;
    }

    const conflitto = bookings.find((b) =>
      overlaps(arrivo, partenza, b.check_in, b.check_out),
    );
    if (conflitto) {
      setErrore(
        `Date non disponibili: si sovrappongono alla prenotazione di ${conflitto.guest_name} ` +
          `(${formatGiorno(conflitto.check_in)} → ${formatGiorno(conflitto.check_out)}).`,
      );
      return;
    }

    setInvio(true);
    const { error } = await supabase.from("bookings").insert({
      guest_name: nome.trim(),
      check_in: arrivo,
      check_out: partenza,
      num_people: n,
      notes: note.trim() || null,
    });
    setInvio(false);

    if (error) {
      setErrore("Errore nel salvataggio: " + error.message);
      return;
    }

    setNome("");
    setArrivo("");
    setPartenza("");
    setPersone("2");
    setNote("");
    onCreated();
  }

  const labelCls = "mb-1 block text-sm font-medium text-bosco-700";
  const inputCls =
    "w-full rounded-lg border border-bosco-200 bg-white px-3 py-2.5 text-bosco-900 " +
    "outline-none transition focus:border-bosco-500 focus:ring-2 focus:ring-bosco-200";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-bosco-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <h2 className="mb-4 text-lg font-semibold">Nuova prenotazione</h2>

      <div className="space-y-3">
        <div>
          <label htmlFor="nome" className={labelCls}>
            Nome di chi prenota
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Es. Marco Rossi"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="arrivo" className={labelCls}>
              Arrivo
            </label>
            <input
              id="arrivo"
              type="date"
              value={arrivo}
              min={oggiISO}
              onChange={(e) => setArrivo(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="partenza" className={labelCls}>
              Partenza
            </label>
            <input
              id="partenza"
              type="date"
              value={partenza}
              min={arrivo || oggiISO}
              onChange={(e) => setPartenza(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label htmlFor="persone" className={labelCls}>
            Numero di persone
          </label>
          <input
            id="persone"
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            value={persone}
            onChange={(e) => setPersone(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="note" className={labelCls}>
            Note <span className="font-normal text-bosco-400">(opzionale)</span>
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Es. arriviamo in tarda serata"
            className={inputCls + " resize-none"}
          />
        </div>
      </div>

      {errore && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-legno-300 bg-legno-50 px-3 py-2 text-sm text-legno-800"
        >
          {errore}
        </p>
      )}

      <button
        type="submit"
        disabled={invio}
        className="mt-4 w-full rounded-lg bg-bosco-600 px-4 py-3 font-semibold text-white transition hover:bg-bosco-700 active:scale-[0.99] disabled:opacity-60"
      >
        {invio ? "Salvataggio…" : "Prenota"}
      </button>
    </form>
  );
}
