alter table public.fm_fideora_events_v1
  drop constraint fm_fideora_events_v1_event_name_check,
  add constraint fm_fideora_events_v1_event_name_check check (event_name in (
    'page_view', 'store_click', 'demo_view', 'trial_started', 'subscription_started',
    'subscription_renewed', 'subscription_expired', 'subscription_cancelled',
    'subscription_billing_issue', 'purchase_cancelled', 'purchase_error',
    'onboarding_started', 'onboarding_completed', 'paywall_view',
    'review_milestone', 'review_requested', 'review_link_clicked'
  ));

create function public.fm_fideora_review_counts_v1()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'milestones', count(*) filter (where event_name = 'review_milestone'),
    'requests', count(*) filter (where event_name = 'review_requested'),
    'profile_clicks', count(*) filter (where event_name = 'review_link_clicked')
  )
  from public.fm_fideora_events_v1
  where source = 'app' and not is_test
    and received_at >= now() - interval '30 days'
    and event_name in ('review_milestone', 'review_requested', 'review_link_clicked');
$$;

revoke all on function public.fm_fideora_review_counts_v1() from public, anon, authenticated;
grant execute on function public.fm_fideora_review_counts_v1() to service_role;
