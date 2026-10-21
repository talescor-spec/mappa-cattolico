begin;

create table if not exists public.fideora_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  locale text not null default 'pt-BR' check (locale in ('it','fr','es','pt-BR','en','de')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fideora_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rosary_step integer not null default 0 check (rosary_step between 0 and 60),
  novena_progress jsonb not null default '{}'::jsonb,
  last_reading_key text,
  last_reading_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.fideora_profiles enable row level security;
alter table public.fideora_progress enable row level security;

revoke all on public.fideora_profiles from anon;
revoke all on public.fideora_progress from anon;

grant select, insert, update on public.fideora_profiles to authenticated;
grant select, insert, update on public.fideora_progress to authenticated;

create or replace function public.fideora_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists fideora_profiles_set_updated_at on public.fideora_profiles;
create trigger fideora_profiles_set_updated_at
before update on public.fideora_profiles
for each row execute function public.fideora_set_updated_at();

drop trigger if exists fideora_progress_set_updated_at on public.fideora_progress;
create trigger fideora_progress_set_updated_at
before update on public.fideora_progress
for each row execute function public.fideora_set_updated_at();

create or replace function public.fideora_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_locale text;
  requested_name text;
begin
  requested_locale := coalesce(new.raw_user_meta_data ->> 'locale', 'pt-BR');
  if requested_locale not in ('it','fr','es','pt-BR','en','de') then
    requested_locale := 'pt-BR';
  end if;

  requested_name := left(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), 80);

  insert into public.fideora_profiles (user_id, display_name, locale)
  values (new.id, requested_name, requested_locale)
  on conflict (user_id) do nothing;

  insert into public.fideora_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_fideora_auth_user_created on auth.users;
create trigger on_fideora_auth_user_created
after insert on auth.users
for each row execute function public.fideora_handle_new_user();

drop policy if exists "fideora_profiles_select_own" on public.fideora_profiles;
create policy "fideora_profiles_select_own" on public.fideora_profiles
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "fideora_profiles_insert_own" on public.fideora_profiles;
create policy "fideora_profiles_insert_own" on public.fideora_profiles
for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "fideora_profiles_update_own" on public.fideora_profiles;
create policy "fideora_profiles_update_own" on public.fideora_profiles
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "fideora_progress_select_own" on public.fideora_progress;
create policy "fideora_progress_select_own" on public.fideora_progress
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "fideora_progress_insert_own" on public.fideora_progress;
create policy "fideora_progress_insert_own" on public.fideora_progress
for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "fideora_progress_update_own" on public.fideora_progress;
create policy "fideora_progress_update_own" on public.fideora_progress
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

comment on table public.fideora_profiles is 'Fideora user profile keyed by Supabase Auth user id.';
comment on table public.fideora_progress is 'Fideora synchronized spiritual progress keyed by Supabase Auth user id.';

commit;
