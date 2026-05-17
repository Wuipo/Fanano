# Casa Fanano

App web per gestire le prenotazioni della casa in montagna a Fanano. Chiunque abbia il link può consultare il calendario e prenotare.

## Funzionalità

- **Calendario mensile** — visualizza i giorni occupati con il nome dell'ospite
- **Nuova prenotazione** — form con validazione date e controllo automatico delle sovrapposizioni
- **Lista prenotazioni attive** — elenco delle prenotazioni future con possibilità di annullamento

## Stack tecnico

- [Next.js](https://nextjs.org/) (App Router) con TypeScript
- [Supabase](https://supabase.com/) come database e backend
- [Tailwind CSS](https://tailwindcss.com/) per lo stile

## Avvio locale

1. Clona il repository e installa le dipendenze:

   ```bash
   npm install
   ```

2. Crea un file `.env.local` con le credenziali Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<tuo-progetto>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<tua-anon-key>
   ```

3. Applica le migration al database:

   ```bash
   supabase db push
   ```

4. Avvia il server di sviluppo:

   ```bash
   npm run dev
   ```

   L'app sarà disponibile su [http://localhost:3000](http://localhost:3000).

## Struttura del progetto

```
app/
  page.tsx          # Pagina principale
  layout.tsx        # Layout globale
  globals.css       # Stili globali
components/
  Calendar.tsx      # Calendario mensile navigabile
  BookingForm.tsx   # Form per nuove prenotazioni
  BookingList.tsx   # Lista prenotazioni attive
lib/
  supabase.ts       # Client Supabase
  types.ts          # Tipi TypeScript
  dates.ts          # Utility per date
supabase/
  migrations/       # Migration SQL
```
