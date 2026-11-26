-- Separate provider records preserve all existing Hotmart/native subscriptions.
-- No offers are seeded: enable only after Mundpay approves recurrence and real IDs are verified.
create table public.fideora_mundpay_offers (
  offer_id uuid primary key,
  product_id uuid not null,
  checkout_url text not null check (checkout_url ~ '^https://checkout[.]mundpay[.]com/[^[:space:]]+$'),
  currency text not null default 'EUR' check (currency = 'EUR'),
  amount_cents integer not null default 1990 check (amount_cents = 1990),
  intro_amount_cents integer not null default 100 check (intro_amount_cents = 100),
  active boolean not null default false,
  available_for_purchase boolean not null default false
);
create table public.fideora_mundpay_subscriptions (
  subscription_id text primary key,
  offer_id uuid not null references public.fideora_mundpay_offers(offer_id),
  buyer_email text not null check (buyer_email = lower(trim(buyer_email))),
  status text not null,
  expires_at timestamptz,
  checked_at timestamptz not null
);
create index fideora_mundpay_email_idx on public.fideora_mundpay_subscriptions(buyer_email);
alter table public.fideora_mundpay_offers enable row level security;
alter table public.fideora_mundpay_subscriptions enable row level security;
revoke all on public.fideora_mundpay_offers, public.fideora_mundpay_subscriptions from public, anon, authenticated;
grant select, insert, update, delete on public.fideora_mundpay_offers, public.fideora_mundpay_subscriptions to service_role;
create function public.fideora_save_mundpay_subscription(snapshot jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.fideora_mundpay_subscriptions(subscription_id, offer_id, buyer_email, status, expires_at, checked_at)
  values (snapshot->>'subscription_id', (snapshot->>'offer_id')::uuid, snapshot->>'buyer_email', snapshot->>'status',
          (snapshot->>'expires_at')::timestamptz, (snapshot->>'checked_at')::timestamptz)
  on conflict (subscription_id) do update set offer_id = excluded.offer_id, buyer_email = excluded.buyer_email,
    status = excluded.status, expires_at = excluded.expires_at, checked_at = excluded.checked_at
  where public.fideora_mundpay_subscriptions.checked_at < excluded.checked_at;
$$;
revoke all on function public.fideora_save_mundpay_subscription(jsonb) from public, anon, authenticated;
grant execute on function public.fideora_save_mundpay_subscription(jsonb) to service_role;
