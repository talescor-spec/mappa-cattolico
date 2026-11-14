create table public.fideora_web_access_grants (
  user_id uuid primary key references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  reason text not null check (reason='hotmart_review'),
  created_at timestamptz not null default now()
);
alter table public.fideora_web_access_grants enable row level security;
revoke all on public.fideora_web_access_grants from public,anon,authenticated;
grant all on public.fideora_web_access_grants to service_role;
