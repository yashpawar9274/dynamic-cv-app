
-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

create policy "admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- FAQ overrides
create table public.faq_overrides (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  priority int not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faq_overrides enable row level security;

-- Public read of enabled entries (chatbot context is public anyway)
create policy "anyone reads enabled faqs" on public.faq_overrides
  for select to anon, authenticated using (enabled = true);

create policy "admins read all faqs" on public.faq_overrides
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "admins insert faqs" on public.faq_overrides
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

create policy "admins update faqs" on public.faq_overrides
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "admins delete faqs" on public.faq_overrides
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger faq_overrides_touch
before update on public.faq_overrides
for each row execute function public.touch_updated_at();
