begin;

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

commit;
