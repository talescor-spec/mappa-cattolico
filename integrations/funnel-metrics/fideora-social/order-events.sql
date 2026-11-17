create schema if not exists fm_social_private;
revoke all on schema fm_social_private from public,anon,authenticated;
grant usage on schema fm_social_private to service_role;
create or replace function fm_social_private.order_event()
returns trigger language plpgsql security invoker set search_path='' as $$
declare event_type text;
begin
 if new.is_test is true or new.customer_email is null or new.status not in ('paid','refunded','chargeback') then return new;end if;
 if not exists(select 1 from public.funnels_v2 f where f.id=new.funnel_id and f.slug='mdb-studio-libro-it') then return new;end if;
 event_type:=case new.status when 'paid' then 'purchase_confirmed' when 'refunded' then 'refunded' else 'chargeback' end;
 insert into public.fm_social_conversions_v1(event_key,provider,event_name,email,transaction_id,amount,currency,amount_basis,occurred_at,properties)
 values('mp:'||new.order_id||':'||new.status,'mundpay',event_type,lower(trim(new.customer_email)),new.order_id,new.gross_amount_cents::numeric/100,new.currency,'provider_gross',coalesce(new.approved_at,new.created_at),jsonb_build_object('net_amount',new.net_amount_cents::numeric/100,'source_order_id',new.id))
 on conflict(event_key) do update set amount=excluded.amount,properties=excluded.properties;
 if new.status='paid' then perform public.fm_social_stop_recovery_v1(lower(trim(new.customer_email)));end if;
 return new;
end;
$$;
revoke all on function fm_social_private.order_event() from public,anon,authenticated;
grant execute on function fm_social_private.order_event() to service_role;
do $$begin if not exists(select 1 from pg_trigger where tgname='fm_social_order_event' and tgrelid='public.orders_v2'::regclass) then create trigger fm_social_order_event after insert or update of status,funnel_id on public.orders_v2 for each row execute function fm_social_private.order_event();end if;end;$$;
