create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text not null,
  role text not null check (role in ('farmer','aggregator','admin')),
  language text not null default 'en',
  created_at timestamptz not null default now()
);

create table if not exists public.agreements (
  id uuid primary key default gen_random_uuid(),
  agreement_number text unique not null,
  created_by uuid not null references public.users(id),
  farmer_id uuid not null references public.users(id),
  aggregator_id uuid not null references public.users(id),
  crop text not null,
  quantity numeric not null,
  unit text not null,
  price numeric not null,
  price_basis text not null,
  delivery_date date not null,
  quality text,
  payment_method text,
  status text not null,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evidence (
  id text primary key,
  agreement_id uuid not null references public.agreements(id),
  uploaded_by uuid not null references public.users(id),
  evidence_type text not null,
  storage_path text not null,
  sha256_hash text not null,
  mime_type text not null,
  file_size bigint not null,
  captured_at timestamptz not null,
  uploaded_at timestamptz not null default now(),
  server_recorded_at timestamptz not null default now(),
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.agreements(id),
  user_id uuid not null references public.users(id),
  evidence_id text not null references public.evidence(id),
  consent_type text not null,
  consented_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_confirmations (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.agreements(id),
  user_id uuid not null references public.users(id),
  confirmation_type text not null,
  confirmed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.amendments (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.agreements(id),
  created_by uuid not null references public.users(id),
  field_name text not null,
  old_value text,
  new_value text,
  reason text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.agreements(id),
  reported_by uuid not null references public.users(id),
  reason text not null,
  description text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid references public.agreements(id),
  actor_id uuid references public.users(id),
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.verification_logs (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.agreements(id),
  evidence_id text not null references public.evidence(id),
  verification_result text not null,
  stored_hash text not null,
  calculated_hash text not null,
  verified_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.agreements enable row level security;
alter table public.evidence enable row level security;
alter table public.consent_records enable row level security;
alter table public.delivery_confirmations enable row level security;
alter table public.amendments enable row level security;
alter table public.disputes enable row level security;
alter table public.audit_logs enable row level security;
alter table public.verification_logs enable row level security;

create policy "users can read own profile" on public.users
  for select using (auth.uid() = id);

create policy "agreement participants read" on public.agreements
  for select using (auth.uid() in (farmer_id, aggregator_id, created_by));
create policy "agreement participants write" on public.agreements
  for all using (auth.uid() in (farmer_id, aggregator_id, created_by));

create policy "evidence participants read" on public.evidence
  for select using (
    exists (
      select 1 from public.agreements a
      where a.id = agreement_id and auth.uid() in (a.farmer_id, a.aggregator_id, a.created_by)
    )
  );
create policy "evidence uploader write" on public.evidence
  for all using (auth.uid() = uploaded_by);

create policy "consent participants" on public.consent_records
  for all using (
    exists (
      select 1 from public.agreements a
      where a.id = agreement_id and auth.uid() in (a.farmer_id, a.aggregator_id)
    )
  );

create policy "delivery participants" on public.delivery_confirmations
  for all using (
    exists (
      select 1 from public.agreements a
      where a.id = agreement_id and auth.uid() in (a.farmer_id, a.aggregator_id)
    )
  );

create policy "dispute participants" on public.disputes
  for all using (
    exists (
      select 1 from public.agreements a
      where a.id = agreement_id and auth.uid() in (a.farmer_id, a.aggregator_id)
    )
  );

create policy "audit participants read" on public.audit_logs
  for select using (
    exists (
      select 1 from public.agreements a
      where a.id = agreement_id and auth.uid() in (a.farmer_id, a.aggregator_id, a.created_by)
    )
  );

create policy "verification public read" on public.verification_logs
  for select using (true);
