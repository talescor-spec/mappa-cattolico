create or replace function public.fm_social_report_v1(p_days integer default 30)
returns jsonb language sql stable security invoker set search_path='' as $$
with ev as (select * from public.fm_social_events_v1 where not is_test and occurred_at>=now()-make_interval(days=>least(90,greatest(1,p_days)))),
journeys as (select * from public.fm_social_journeys_v1 where not is_test and created_at>=now()-make_interval(days=>least(90,greatest(1,p_days)))),
cv as (select c.*,j.id journey_id,j.offer,j.attribution from public.fm_social_conversions_v1 c left join lateral (select j.* from journeys j where j.email=c.email and j.created_at<=c.occurred_at order by j.created_at desc limit 1)j on true where not c.is_test and c.occurred_at>=now()-make_interval(days=>least(90,greatest(1,p_days))))
select jsonb_build_object('days',p_days,'website',(select coalesce(jsonb_agg(x),'[]'::jsonb) from (select coalesce(attribution->>'utm_source','direct') source,coalesce(attribution->>'utm_medium','unknown') medium,event_name,offer,platform,count(*) events,count(distinct session_id) sessions from ev group by 1,2,3,4,5)x),
'conversions',(select coalesce(jsonb_agg(x),'[]'::jsonb) from(select coalesce(attribution->>'utm_source','unattributed') source,offer,provider,event_name,count(*) events,count(distinct coalesce(email,customer_hash)) customers from cv group by 1,2,3,4)x),
'revenue',(select coalesce(jsonb_agg(x),'[]'::jsonb) from(select coalesce(attribution->>'utm_source','unattributed') source,provider,currency,amount_basis,sum(case when event_name in ('refunded','chargeback') then -amount else amount end) amount from cv where event_name in ('purchase_confirmed','subscription_started','subscription_renewed','refunded','chargeback') and amount is not null group by 1,2,3,4)x),
'limitations',jsonb_build_array('App Store clicks are not downloads or subscriptions.','Anonymous Apple customers without verified identity remain unattributed.','Hotmart access webhooks do not provide actual collected amounts; missing amounts are not estimated.','App Store campaign metrics require Apple campaign reporting.'));
$$;
revoke all on function public.fm_social_report_v1(integer) from public,anon,authenticated;
grant execute on function public.fm_social_report_v1(integer) to service_role;
