-- Migration iniziale: tabella prenotazioni per la casa a Fanano.
-- Idempotente: applicabile in sicurezza anche sul DB dove la tabella esiste gia'.

create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  guest_name  text not null,
  check_in    date not null,
  check_out   date not null,
  num_people  integer not null check (num_people > 0),
  notes       text,
  created_at  timestamptz not null default now(),
  constraint valid_dates check (check_out > check_in)
);

create index if not exists bookings_dates_idx
  on public.bookings (check_in, check_out);

alter table public.bookings enable row level security;

-- Nessuna autenticazione: chiunque ha il link puo' leggere, creare e cancellare.
drop policy if exists "Lettura pubblica" on public.bookings;
create policy "Lettura pubblica"
  on public.bookings for select using (true);

drop policy if exists "Inserimento pubblico" on public.bookings;
create policy "Inserimento pubblico"
  on public.bookings for insert with check (true);

drop policy if exists "Cancellazione pubblica" on public.bookings;
create policy "Cancellazione pubblica"
  on public.bookings for delete using (true);
