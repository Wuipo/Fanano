"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Booking } from "@/lib/types";
import { toISODate } from "@/lib/dates";
import Calendar from "@/components/Calendar";
import BookingForm from "@/components/BookingForm";
import BookingList from "@/components/BookingList";

export default function Home() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  const carica = useCallback(async () => {
    setErrore(null);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("check_in", { ascending: true });

    if (error) {
      setErrore("Impossibile caricare le prenotazioni: " + error.message);
    } else {
      setBookings(data ?? []);
    }
    setCaricamento(false);
  }, []);

  useEffect(() => {
    carica();
  }, [carica]);

  const oggiISO = toISODate(new Date());
  const attive = useMemo(
    () => bookings.filter((b) => b.check_out >= oggiISO),
    [bookings, oggiISO],
  );

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:pt-10">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-bosco-800 sm:text-3xl">
          Casa Fanano
        </h1>
        <p className="mt-1 text-sm text-bosco-500">
          Calendario e prenotazioni della casa in montagna
        </p>
      </header>

      {errore && (
        <p className="mb-4 rounded-lg border border-legno-300 bg-legno-50 px-3 py-2 text-sm text-legno-800">
          {errore}
        </p>
      )}

      {caricamento ? (
        <p className="py-10 text-center text-bosco-400">Caricamento…</p>
      ) : (
        <div className="space-y-6">
          <Calendar bookings={bookings} />

          <BookingForm bookings={bookings} onCreated={carica} />

          <section>
            <h2 className="mb-3 text-lg font-semibold text-bosco-800">
              Prenotazioni attive{" "}
              <span className="font-normal text-bosco-400">
                ({attive.length})
              </span>
            </h2>
            <BookingList bookings={attive} onChanged={carica} />
          </section>
        </div>
      )}

      <footer className="mt-10 text-center text-xs text-bosco-300">
        Casa Fanano — chiunque ha il link può prenotare
      </footer>
    </main>
  );
}
