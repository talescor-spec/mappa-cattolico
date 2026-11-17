-- Fideora social funnel. PII and conversion state are server-only.
create table if not exists public.fm_social_journeys_v1 (
 id uuid primary key default gen_random_uuid(), session_id uuid not null,
 email text not null check(email=lower(trim(email))), contact_name text not null,
 offer text not null check(offer in ('book','ios','android')),
 platform text not null check(platform in ('ios','android','desktop','other')),
 funnel_id integer not null references public.funnels_v2(id), lead_id bigint references public.lead_captures_v2(id),
 attribution jsonb not null default '{}'::jsonb, is_test boolean not null default false,
 converted_at timestamptz, conversion_source text, checked_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists fm_social_journey_email on public.fm_social_journeys_v1(email,created_at desc);
create index if not exists fm_social_journey_session on public.fm_social_journeys_v1(session_id);
create table if not exists public.fm_social_events_v1 (
 event_key text primary key, session_id uuid, journey_id uuid references public.fm_social_journeys_v1(id),
 event_name text not null check(event_name in ('page_view','offer_view','capture_started','capture_success','capture_error','checkout_click','store_click','preview_open','resume_open')),
 platform text not null check(platform in ('ios','android','desktop','other')),
 offer text check(offer in ('book','ios','android')),
 source text not null default 'website' check(source in ('website','server')),
 attribution jsonb not null default '{}'::jsonb, is_test boolean not null default false,
 occurred_at timestamptz not null default now(), received_at timestamptz not null default now()
);
create index if not exists fm_social_event_date on public.fm_social_events_v1(occurred_at,event_name) where not is_test;
create table if not exists public.fm_social_conversions_v1 (
 event_key text primary key, provider text not null check(provider in ('mundpay','hotmart','revenuecat')),
 event_name text not null check(event_name in ('purchase_confirmed','trial_started','subscription_started','subscription_renewed','refunded','chargeback','subscription_cancelled','subscription_expired')),
 email text, customer_hash text, transaction_id text,
 amount numeric, currency text, amount_basis text,
 occurred_at timestamptz not null, is_test boolean not null default false,
 properties jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(),
 check(email is null or email=lower(trim(email)))
);
create index if not exists fm_social_conversion_email on public.fm_social_conversions_v1(email,occurred_at desc);
create index if not exists fm_social_conversion_customer on public.fm_social_conversions_v1(customer_hash) where customer_hash is not null;
create table if not exists public.fm_social_identities_v1 (
 email text not null, customer_hash text not null, verified_at timestamptz not null default now(),
 primary key(email,customer_hash)
);
create table if not exists public.fm_social_config_v1 (
 id text primary key, config jsonb not null, updated_at timestamptz not null default now()
);
alter table public.fm_social_journeys_v1 enable row level security;
alter table public.fm_social_events_v1 enable row level security;
alter table public.fm_social_conversions_v1 enable row level security;
alter table public.fm_social_identities_v1 enable row level security;
alter table public.fm_social_config_v1 enable row level security;
revoke all on public.fm_social_journeys_v1,public.fm_social_events_v1,public.fm_social_conversions_v1,public.fm_social_identities_v1,public.fm_social_config_v1 from public,anon,authenticated;
grant select,insert,update,delete on public.fm_social_journeys_v1,public.fm_social_events_v1,public.fm_social_conversions_v1,public.fm_social_identities_v1,public.fm_social_config_v1 to service_role;

create or replace function public.fm_social_has_conversion_v1(p_email text)
returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.fm_social_conversions_v1 c
 where c.email=lower(trim(p_email)) and not c.is_test and c.event_name in ('purchase_confirmed','trial_started','subscription_started','subscription_renewed'))
 or exists(select 1 from public.orders_v2 o join public.funnels_v2 f on f.id=o.funnel_id
 where f.slug in ('mdb-studio-libro-it','fideora-social-ios-it','fideora-social-android-it')
 and lower(trim(o.customer_email))=lower(trim(p_email)) and o.is_test is distinct from true
 and (o.status in ('paid','refunded','chargeback') or o.approved_at is not null));
$$;
revoke all on function public.fm_social_has_conversion_v1(text) from public,anon,authenticated;
grant execute on function public.fm_social_has_conversion_v1(text) to service_role;

create or replace function public.fm_social_stop_recovery_v1(p_email text)
returns void language sql security invoker set search_path='' as $$
 update public.fm_email_enrollments_v1 e set state='cancelled',cancelled_at=now()
 from public.fm_email_sequences_v1 s join public.funnels_v2 f on f.id=s.funnel_id
 where e.sequence_id=s.id and f.slug in ('mdb-studio-libro-it','fideora-social-ios-it','fideora-social-android-it')
 and e.email=lower(trim(p_email)) and e.category in ('capture','recovery') and e.state='active';
 update public.fm_email_delivery_queue_v1 q set state='cancelled',lease_token=null,leased_until=null,last_error='purchase_or_activation_confirmed'
 from public.fm_email_enrollments_v1 e join public.fm_email_sequences_v1 s on s.id=e.sequence_id join public.funnels_v2 f on f.id=s.funnel_id
 where q.enrollment_id=e.id and f.slug in ('mdb-studio-libro-it','fideora-social-ios-it','fideora-social-android-it')
 and e.email=lower(trim(p_email)) and e.category in ('capture','recovery') and q.state='queued';
 update public.fm_social_journeys_v1 set converted_at=coalesce(converted_at,now()) where email=lower(trim(p_email)) and not is_test;
$$;
revoke all on function public.fm_social_stop_recovery_v1(text) from public,anon,authenticated;
grant execute on function public.fm_social_stop_recovery_v1(text) to service_role;
