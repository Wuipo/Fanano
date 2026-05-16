"use client";

import { useMemo, useState } from "react";
import type { Booking } from "@/lib/types";
import { GIORNI, MESI, bookingsForDay, toISODate } from "@/lib/dates";

interface Props {
  bookings: Booking[];
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0];
}

export default function Calendar({ bookings }: Props) {
  const oggi = useMemo(() => new Date(), []);
  const [vista, setVista] = useState(
    () => new Date(oggi.getFullYear(), oggi.getMonth(), 1),
  );

  const oggiISO = toISODate(oggi);
  const anno = vista.getFullYear();
  const mese = vista.getMonth();

  // Indice 0 = Lunedi
  const primoGiornoSettimana = (new Date(anno, mese, 1).getDay() + 6) % 7;
  const giorniNelMese = new Date(anno, mese + 1, 0).getDate();

  const celle: (number | null)[] = [];
  for (let i = 0; i < primoGiornoSettimana; i++) celle.push(null);
  for (let g = 1; g <= giorniNelMese; g++) celle.push(g);
  while (celle.length % 7 !== 0) celle.push(null);

  function cambiaMese(delta: number) {
    setVista(new Date(anno, mese + delta, 1));
  }

  return (
    <div className="rounded-2xl border border-bosco-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => cambiaMese(-1)}
          aria-label="Mese precedente"
          className="h-9 w-9 rounded-lg text-bosco-600 transition hover:bg-bosco-100 active:scale-95"
        >
          ‹
        </button>
        <h2 className="text-base font-semibold sm:text-lg">
          {MESI[mese]} {anno}
        </h2>
        <button
          onClick={() => cambiaMese(1)}
          aria-label="Mese successivo"
          className="h-9 w-9 rounded-lg text-bosco-600 transition hover:bg-bosco-100 active:scale-95"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {GIORNI.map((g) => (
          <div
            key={g}
            className="pb-1 text-center text-[11px] font-medium text-bosco-400"
          >
            {g}
          </div>
        ))}

        {celle.map((giorno, idx) => {
          if (giorno === null) {
            return <div key={`v-${idx}`} />;
          }
          const dataISO = toISODate(new Date(anno, mese, giorno));
          const occupanti = bookingsForDay(bookings, dataISO);
          const occupato = occupanti.length > 0;
          const passato = dataISO < oggiISO;
          const isOggi = dataISO === oggiISO;
          const persone = occupanti.reduce((s, b) => s + b.num_people, 0);

          return (
            <div
              key={dataISO}
              className={[
                "flex min-h-[58px] flex-col rounded-lg border p-1 sm:min-h-[72px]",
                occupato
                  ? "border-bosco-300 bg-bosco-100"
                  : "border-bosco-100 bg-bosco-50",
                passato && !occupato ? "opacity-50" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[11px] font-semibold leading-none",
                  isOggi
                    ? "flex h-5 w-5 items-center justify-center rounded-full bg-bosco-600 text-white"
                    : "text-bosco-500",
                ].join(" ")}
              >
                {giorno}
              </span>

              {occupato && (
                <div className="mt-0.5 flex flex-col gap-0.5 overflow-hidden">
                  {occupanti.slice(0, 2).map((b) => (
                    <span
                      key={b.id}
                      className="truncate rounded bg-bosco-600 px-1 py-0.5 text-[10px] font-medium leading-tight text-white"
                      title={`${b.guest_name} — ${b.num_people} persone`}
                    >
                      {firstName(b.guest_name)}
                    </span>
                  ))}
                  {occupanti.length > 2 && (
                    <span className="text-[10px] text-bosco-600">
                      +{occupanti.length - 2} altri
                    </span>
                  )}
                  <span className="text-[10px] text-bosco-600">
                    {persone} {persone === 1 ? "persona" : "persone"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-bosco-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-bosco-300 bg-bosco-100" />
          Occupato
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-bosco-100 bg-bosco-50" />
          Libero
        </span>
      </div>
    </div>
  );
}
