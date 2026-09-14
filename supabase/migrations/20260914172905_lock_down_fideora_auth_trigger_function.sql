begin;
revoke all on function public.fideora_handle_new_user() from public;
revoke all on function public.fideora_handle_new_user() from anon;
revoke all on function public.fideora_handle_new_user() from authenticated;
commit;
