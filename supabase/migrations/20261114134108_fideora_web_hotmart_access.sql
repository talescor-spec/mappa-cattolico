-- Web-only billing. No changes to Apple/RevenueCat subscription records.
create table public.fideora_web_plans (
  plan_key text primary key check (plan_key in ('monthly','annual')),
  hotmart_product_ucode text,
  hotmart_product_id text,
  hotmart_plan_id text,
  checkout_url text check (checkout_url is null or checkout_url ~ '^https://pay[.]hotmart[.]com/[^[:space:]]+$'),
  amount numeric(12,2) check (amount > 0),
  currency text not null default 'EUR' check (currency in ('EUR','BRL','USD')),
  interval_months integer not null check (interval_months in (1,12)),
  active boolean not null default false,
  check (not active or (hotmart_product_ucode is not null and hotmart_plan_id is not null and checkout_url is not null and amount is not null))
);
insert into public.fideora_web_plans(plan_key,interval_months) values ('monthly',1),('annual',12);
create table public.fideora_web_events (
  event_id text primary key,
  event_type text not null,
  event_created_at timestamptz not null,
  processed_at timestamptz not null default now()
);
create table public.fideora_web_payments (
  transaction_id text primary key,
  subscription_code text not null,
  buyer_email text not null check (buyer_email = lower(trim(buyer_email))),
  plan_key text references public.fideora_web_plans(plan_key),
  status text not null check (status in ('approved','refunded','chargeback','canceled','delayed','expired')),
  approved_at timestamptz,
  access_until timestamptz,
  event_created_at timestamptz not null,
  updated_at timestamptz not null default now()
);
create index fideora_web_payments_access on public.fideora_web_payments(buyer_email,access_until desc) where status='approved';
create table public.fideora_web_subscriptions (
  subscription_code text primary key,
  buyer_email text not null,
  auto_renew boolean not null,
  event_created_at timestamptz not null
);
alter table public.fideora_web_plans enable row level security;
alter table public.fideora_web_events enable row level security;
alter table public.fideora_web_payments enable row level security;
alter table public.fideora_web_subscriptions enable row level security;
revoke all on public.fideora_web_plans, public.fideora_web_events, public.fideora_web_payments, public.fideora_web_subscriptions from public, anon, authenticated;
grant select,insert,update,delete on public.fideora_web_plans, public.fideora_web_events, public.fideora_web_payments, public.fideora_web_subscriptions to service_role;

-- One Postgres transaction covers event deduplication and all writes. This
-- function is SECURITY INVOKER and can only be called by the server service role.
create function public.fideora_process_hotmart_event(p_event jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  plan public.fideora_web_plans%rowtype;
  event_at timestamptz := (p_event->>'created_at')::timestamptz;
  approved_at timestamptz;
  until_at timestamptz;
  next_at timestamptz;
  payment_status text;
  inserted_count integer;
begin
  if p_event->>'event' not in ('PURCHASE_APPROVED','PURCHASE_REFUNDED','PURCHASE_CHARGEBACK','PURCHASE_CANCELED','PURCHASE_DELAYED','PURCHASE_EXPIRED','SUBSCRIPTION_CANCELLATION')
    or coalesce(p_event->>'id','') = '' or coalesce(p_event->>'subscriber_code','') = ''
    or coalesce(p_event->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    or event_at is null or event_at > now()+interval '5 minutes' then
    raise exception 'invalid_event';
  end if;
  select * into plan from public.fideora_web_plans p
    where ((p.hotmart_product_ucode is not null and p.hotmart_product_ucode = nullif(p_event->>'product_ucode',''))
      or (nullif(p_event->>'product_ucode','') is null and p.hotmart_product_id is not null and p.hotmart_product_id = p_event->>'product_id'))
    and (p_event->>'event' = 'SUBSCRIPTION_CANCELLATION' or p.hotmart_plan_id = nullif(p_event->>'plan_id',''))
    order by p.plan_key limit 1;
  if not found then return jsonb_build_object('ignored',true,'reason','unconfigured_product_or_plan'); end if;
  insert into public.fideora_web_events(event_id,event_type,event_created_at)
    values(p_event->>'id',p_event->>'event',event_at) on conflict do nothing;
  get diagnostics inserted_count = row_count;
  if inserted_count = 0 then return jsonb_build_object('duplicate',true); end if;
  -- Subscriptions are informational; canceling renewal preserves paid access.
  if p_event->>'event' in ('PURCHASE_APPROVED','SUBSCRIPTION_CANCELLATION') then
    insert into public.fideora_web_subscriptions(subscription_code,buyer_email,auto_renew,event_created_at)
      values(p_event->>'subscriber_code',lower(trim(p_event->>'email')),p_event->>'event' = 'PURCHASE_APPROVED',event_at)
      on conflict(subscription_code) do update set auto_renew=excluded.auto_renew,event_created_at=excluded.event_created_at
      where excluded.event_created_at > fideora_web_subscriptions.event_created_at;
  end if;
  if p_event->>'event' = 'SUBSCRIPTION_CANCELLATION' then return jsonb_build_object('processed',true); end if;
  if coalesce(p_event->>'transaction','')='' then raise exception 'transaction_required'; end if;
  payment_status := case p_event->>'event'
    when 'PURCHASE_APPROVED' then 'approved' when 'PURCHASE_REFUNDED' then 'refunded'
    when 'PURCHASE_CHARGEBACK' then 'chargeback' when 'PURCHASE_CANCELED' then 'canceled'
    when 'PURCHASE_DELAYED' then 'delayed' when 'PURCHASE_EXPIRED' then 'expired' end;
  if payment_status='approved' then
    approved_at := (p_event->>'approved_at')::timestamptz;
    if approved_at is null or approved_at > now()+interval '5 minutes' then raise exception 'approval_required'; end if;
    next_at := (p_event->>'next_charge_at')::timestamptz;
    until_at := coalesce(next_at, approved_at + make_interval(months => plan.interval_months));
    if until_at <= approved_at or until_at > approved_at + interval '2 years' then raise exception 'invalid_period'; end if;
  end if;
  insert into public.fideora_web_payments(transaction_id,subscription_code,buyer_email,plan_key,status,approved_at,access_until,event_created_at)
    values(p_event->>'transaction',p_event->>'subscriber_code',lower(trim(p_event->>'email')),plan.plan_key,payment_status,approved_at,until_at,event_at)
    on conflict(transaction_id) do update set status=excluded.status,
      approved_at=coalesce(excluded.approved_at,fideora_web_payments.approved_at),
      access_until=coalesce(excluded.access_until,fideora_web_payments.access_until),
      event_created_at=excluded.event_created_at,updated_at=now()
    where (excluded.event_created_at > fideora_web_payments.event_created_at
      or (excluded.event_created_at = fideora_web_payments.event_created_at and excluded.status in ('refunded','chargeback')))
      and (fideora_web_payments.status not in ('refunded','chargeback') or excluded.status in ('refunded','chargeback'));
  return jsonb_build_object('processed',true);
end;
$$;
revoke all on function public.fideora_process_hotmart_event(jsonb) from public,anon,authenticated;
grant execute on function public.fideora_process_hotmart_event(jsonb) to service_role;
