create schema if not exists fideora_social_private;
revoke all on schema fideora_social_private from public,anon,authenticated;
grant usage on schema fideora_social_private to service_role;
create table if not exists public.fideora_social_bridge_config(id boolean primary key default true check(id),token_hash text not null check(length(token_hash)=64));
alter table public.fideora_social_bridge_config enable row level security;
revoke all on public.fideora_social_bridge_config from public,anon,authenticated;
grant select,insert,update on public.fideora_social_bridge_config to service_role;
create or replace function fideora_social_private.lookup(p_emails text[])
returns jsonb language sql stable security definer set search_path='' as $$
 with requested as (select distinct lower(trim(e)) email from unnest(p_emails) e limit 30)
 select jsonb_build_object(
 'users',coalesce((select jsonb_agg(jsonb_build_object('id',u.id,'email',lower(u.email))) from auth.users u join requested r on r.email=lower(trim(u.email)) where u.email_confirmed_at is not null),'[]'::jsonb),
 'payments',coalesce((select jsonb_agg(to_jsonb(x)) from (select p.transaction_id,p.subscription_code,p.buyer_email as email,p.plan_key,p.status,p.approved_at,p.access_until,p.event_created_at from public.fideora_web_payments p join requested r on r.email=p.buyer_email order by p.event_created_at desc limit 200) x),'[]'::jsonb));
$$;
revoke all on function fideora_social_private.lookup(text[]) from public,anon,authenticated;
grant execute on function fideora_social_private.lookup(text[]) to service_role;
create or replace function public.fideora_social_lookup_v1(p_emails text[])
returns jsonb language sql stable security invoker set search_path='' as $$select fideora_social_private.lookup(p_emails);$$;
revoke all on function public.fideora_social_lookup_v1(text[]) from public,anon,authenticated;
grant execute on function public.fideora_social_lookup_v1(text[]) to service_role;
create or replace function fideora_social_private.updates(p_since timestamptz)
returns jsonb language sql stable security definer set search_path='' as $$
select coalesce(jsonb_agg(to_jsonb(x)),'[]'::jsonb) from (select p.transaction_id,p.subscription_code,p.buyer_email as email,p.plan_key,p.status,p.approved_at,p.access_until,p.event_created_at,p.updated_at from public.fideora_web_payments p where p.updated_at>=greatest(p_since,now()-interval '90 days') order by p.updated_at,p.transaction_id limit 200)x;
$$;
revoke all on function fideora_social_private.updates(timestamptz) from public,anon,authenticated;
grant execute on function fideora_social_private.updates(timestamptz) to service_role;
create or replace function public.fideora_social_updates_v1(p_since timestamptz)
returns jsonb language sql stable security invoker set search_path='' as $$select fideora_social_private.updates(p_since);$$;
revoke all on function public.fideora_social_updates_v1(timestamptz) from public,anon,authenticated;
grant execute on function public.fideora_social_updates_v1(timestamptz) to service_role;
