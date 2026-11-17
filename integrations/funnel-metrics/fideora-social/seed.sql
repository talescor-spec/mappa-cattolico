insert into public.brevo_capture_mappings_v2(funnel_id,list_id,list_name,auto_matched,match_score,active)
select f.id,v.list_id,v.list_name,false,999,true from (values
 ('mdb-studio-libro-it',217,'Captura MDB Studio IT - Livro'),
 ('fideora-social-ios-it',218,'Captura Fideora Social IT - iOS'),
 ('fideora-social-android-it',219,'Captura Fideora Social IT - Android')) as v(slug,list_id,list_name)
join public.funnels_v2 f on f.slug=v.slug
on conflict(funnel_id) do update set list_id=excluded.list_id,list_name=excluded.list_name,active=true,updated_at=now();
insert into public.brevo_recovery_mappings_v2(funnel_id,trigger_status,list_id,list_name,language,product_key,active)
select f.id,'paid',v.list_id,v.list_name,'it',v.slug,true from (values
 ('mdb-studio-libro-it',220,'Compradores MDB Studio IT'),
 ('fideora-social-ios-it',221,'Assinantes Fideora Social IT'),
 ('fideora-social-android-it',221,'Assinantes Fideora Social IT')) as v(slug,list_id,list_name)
join public.funnels_v2 f on f.slug=v.slug
on conflict(funnel_id,trigger_status) do update set list_id=excluded.list_id,list_name=excluded.list_name,active=true,updated_at=now();
insert into public.product_mappings_v2(platform,product_id,product_name,funnel_id,stage,active)
select 'MundPay',v.product_id,'Mappa della Bibbia — Edizione Studio Cattolica',f.id,'front',true
from (values ('3891abcc-aaa1-4bae-bd7b-b316a853f717'),('01a1e740-380f-71d4-b88f-e8c4124b323f')) v(product_id)
cross join public.funnels_v2 f where f.slug='mdb-studio-libro-it'
on conflict(platform,product_id) do update set funnel_id=excluded.funnel_id,stage=excluded.stage,active=true,updated_at=now();
insert into public.fm_social_config_v1(id,config) values ('mdb-studio-it','{"parentList":214,"lists":{"book":217,"ios":218,"android":219},"buyerLists":{"book":220,"app":221},"sender":{"name":"Fideora · Don Luca","email":"supporto@vitanaturale.fun"},"deliveryStatus":"publisher_confirmed","campaign":"mdb_studio_v1"}')
on conflict(id) do update set config=excluded.config,updated_at=now();
update public.fm_email_sequences_v1 s set product_name=case when f.slug='mdb-studio-libro-it' then 'Mappa della Bibbia · Libro e Biblioteca' else 'Fideora · App e Biblioteca' end,
 language='it',checkout_url='https://fideora.app/mappa-della-bibbia/',access_url='https://fideora.app/mappa-della-bibbia/grazie/',support_url='https://fideora.app/support.html?lang=it',
 sender_name='Fideora · Don Luca',sender_email='supporto@vitanaturale.fun',notes='Social launch 2026-11-17. New captures only. Delivery confirmed by publisher. Three order-specific reminders; verified purchases/activations suppress recovery. Apple anonymous installs are not individual attribution.',updated_at=now()
from public.funnels_v2 f where s.funnel_id=f.id and f.slug in ('mdb-studio-libro-it','fideora-social-ios-it','fideora-social-android-it');
