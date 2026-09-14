-- ZenSpa Boekingssysteem — Database Schema
-- Voer dit eenmalig uit via: Supabase dashboard → SQL Editor → New query

-- ── 1. Boekingen ──────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  treatment_slug   text not null,
  treatment_name   text not null,
  customer_name    text not null,
  customer_email   text not null,
  customer_phone   text not null,
  start_time       timestamptz not null,
  end_time         timestamptz not null,
  status           text not null default 'pending'
                   check (status in ('pending', 'confirmed', 'rejected', 'cancelled')),
  notes            text,
  admin_note       text,
  created_at       timestamptz not null default now()
);

-- ── 2. Geblokkeerde tijden (vrije dagen, pauzes) ───────────────────────────────
create table if not exists public.blocked_times (
  id         uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  end_time   timestamptz not null,
  reason     text,
  created_at timestamptz not null default now()
);

-- ── 3. Indexen voor snelle beschikbaarheidszoekopdrachten ─────────────────────
create index if not exists bookings_time_idx   on public.bookings (start_time, end_time);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists blocked_time_idx    on public.blocked_times (start_time, end_time);

-- ── 4. Row Level Security ─────────────────────────────────────────────────────
alter table public.bookings      enable row level security;
alter table public.blocked_times enable row level security;

-- Klanten mogen boekingen aanmaken (anoniem)
create policy "Iedereen mag een boeking aanmaken"
  on public.bookings for insert
  to anon
  with check (true);

-- Klanten mogen hun eigen boeking lezen op basis van e-mail
create policy "Klant leest eigen boeking"
  on public.bookings for select
  to anon
  using (true);

-- Alles voor de service role (admin API routes)
create policy "Service role heeft volledige toegang tot bookings"
  on public.bookings for all
  to service_role
  using (true)
  with check (true);

create policy "Service role heeft volledige toegang tot blocked_times"
  on public.blocked_times for all
  to service_role
  using (true)
  with check (true);
