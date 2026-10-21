-- Fideora dedicated project setup
-- Authorized target only: sysuottboucultzzaagv
-- Dashboard: https://supabase.com/dashboard/project/sysuottboucultzzaagv
-- Review the selected project before execution. This file does not rename the
-- project or configure Auth URLs/SMTP, and must never run on metrics-dashboard
-- (kgyqpedwgilotlwyhmnb) or Herbalia (fdpwtslfvhujzrkdkpjh).
-- Transactional bundle of the six existing versioned migrations below.
-- Refuses a nonempty public schema, Auth user list or Storage bucket list.
BEGIN;
DO $fideora_empty_target$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p', 'v', 'm', 'f')
  ) THEN
    RAISE EXCEPTION 'Fideora setup requires an empty public schema. Stop and verify the target project.';
  END IF;
  IF EXISTS (SELECT 1 FROM auth.users) OR EXISTS (SELECT 1 FROM storage.buckets) THEN
    RAISE EXCEPTION 'Fideora setup requires an empty Auth and Storage project. Stop and review existing data.';
  END IF;
END;
$fideora_empty_target$;

-- 20260914172853_create_fideora_auth_profile_progress.sql
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

-- 20260914172905_lock_down_fideora_auth_trigger_function.sql
revoke all on function public.fideora_handle_new_user() from public;
revoke all on function public.fideora_handle_new_user() from anon;
revoke all on function public.fideora_handle_new_user() from authenticated;

-- 20260914173029_align_fideora_progress_with_client_state.sql
alter table public.fideora_progress
  add column if not exists rosary_progress jsonb not null default '{}'::jsonb;

alter table public.fideora_progress
  drop column if exists rosary_step;

alter table public.fideora_profiles
  drop constraint if exists fideora_profiles_locale_check;

alter table public.fideora_profiles
  alter column locale set default 'pt';

update public.fideora_profiles set locale = 'pt' where locale = 'pt-BR';

alter table public.fideora_profiles
  add constraint fideora_profiles_locale_check check (locale in ('it','fr','es','pt','en','de'));

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
  requested_locale := coalesce(new.raw_user_meta_data ->> 'locale', 'pt');
  if requested_locale not in ('it','fr','es','pt','en','de') then
    requested_locale := 'pt';
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

revoke all on function public.fideora_handle_new_user() from public;
revoke all on function public.fideora_handle_new_user() from anon;
revoke all on function public.fideora_handle_new_user() from authenticated;

-- 20260914173121_add_fideora_delete_own_account_rpc.sql
create or replace function public.fideora_delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid;
begin
  caller_id := auth.uid();
  if caller_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  delete from auth.users where id = caller_id;

  if not found then
    raise exception 'user_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.fideora_delete_own_account() from public;
revoke all on function public.fideora_delete_own_account() from anon;
grant execute on function public.fideora_delete_own_account() to authenticated;

comment on function public.fideora_delete_own_account() is 'Deletes only the currently authenticated Fideora user. No user id parameter is accepted.';

-- 20260914174029_minimize_fideora_authenticated_table_grants.sql
revoke all on table public.fideora_profiles from authenticated;
revoke all on table public.fideora_progress from authenticated;
grant select, insert, update on table public.fideora_profiles to authenticated;
grant select, insert, update on table public.fideora_progress to authenticated;

-- 20261021035030_fideora_v1_study_entries.sql
create table if not exists public.fideora_study_entries (
 user_id uuid not null references auth.users(id) on delete cascade,
 entry_id text not null check (char_length(entry_id) between 1 and 160),
 kind text not null check (kind in ('verse','note','intention','novena','reading')),
 payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload)='object' and octet_length(payload::text)<=160000),
 deleted boolean not null default false,
 client_updated_at timestamptz not null,
 primary key (user_id,entry_id)
);
alter table public.fideora_study_entries enable row level security;
revoke all on public.fideora_study_entries from anon, authenticated;
grant select,insert,update on public.fideora_study_entries to authenticated;
create policy fideora_study_select on public.fideora_study_entries for select to authenticated using ((select auth.uid())=user_id);
create policy fideora_study_insert on public.fideora_study_entries for insert to authenticated with check ((select auth.uid())=user_id);
create policy fideora_study_update on public.fideora_study_entries for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
-- Reject stale offline writes and remove personal content from deletion tombstones.
create or replace function public.fideora_study_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if tg_op='UPDATE' and new.client_updated_at<=old.client_updated_at then return null; end if;
 if new.client_updated_at>now()+interval '5 minutes' then raise exception 'Client clock too far ahead'; end if;
 if new.deleted then new.payload='{}'::jsonb; end if;
 return new;
end; $$;
revoke all on function public.fideora_study_guard() from public,anon,authenticated;
create trigger fideora_study_guard before insert or update on public.fideora_study_entries for each row execute function public.fideora_study_guard();

COMMIT;

-- Verification after successful setup; no personal data is returned.
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('fideora_profiles', 'fideora_progress', 'fideora_study_entries')
ORDER BY c.relname;
