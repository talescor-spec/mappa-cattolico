begin;

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

commit;
