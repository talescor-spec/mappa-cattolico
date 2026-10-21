begin;
revoke all on table public.fideora_profiles from authenticated;
revoke all on table public.fideora_progress from authenticated;
grant select, insert, update on table public.fideora_profiles to authenticated;
grant select, insert, update on table public.fideora_progress to authenticated;
commit;
