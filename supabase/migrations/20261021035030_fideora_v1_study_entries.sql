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
