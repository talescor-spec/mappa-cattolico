BEGIN;
CREATE TEMP TABLE fideora_qa_ids (a uuid, b uuid) ON COMMIT DROP;
INSERT INTO fideora_qa_ids VALUES (gen_random_uuid(),gen_random_uuid());
GRANT SELECT ON fideora_qa_ids TO authenticated;
INSERT INTO auth.users (id,aud,role,raw_app_meta_data,raw_user_meta_data)
SELECT a,'authenticated','authenticated','{}'::jsonb,'{"display_name":"Fideora QA A","locale":"it"}'::jsonb FROM fideora_qa_ids
UNION ALL
SELECT b,'authenticated','authenticated','{}'::jsonb,'{"display_name":"Fideora QA B","locale":"pt"}'::jsonb FROM fideora_qa_ids;
SELECT set_config('request.jwt.claims',json_build_object('sub',a::text,'role','authenticated')::text,true) FROM fideora_qa_ids;
SET LOCAL ROLE authenticated;
DO $fideora_rls_test$
DECLARE own_id uuid; other_id uuid; affected integer; rejected boolean := false;
BEGIN
 SELECT a,b INTO own_id,other_id FROM pg_temp.fideora_qa_ids;
 IF (SELECT count(*) FROM public.fideora_profiles)<>1 THEN RAISE EXCEPTION 'RLS profile visibility failed'; END IF;
 IF (SELECT count(*) FROM public.fideora_progress)<>1 THEN RAISE EXCEPTION 'RLS progress visibility failed'; END IF;
 UPDATE public.fideora_profiles SET display_name='Fideora QA updated' WHERE user_id=own_id;
 GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>1 THEN RAISE EXCEPTION 'Own profile update failed'; END IF;
 UPDATE public.fideora_profiles SET display_name='must never change' WHERE user_id=other_id;
 GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>0 THEN RAISE EXCEPTION 'Cross-user profile update allowed'; END IF;
 BEGIN
  INSERT INTO public.fideora_study_entries(user_id,entry_id,kind,payload,client_updated_at)
  VALUES(other_id,'qa-cross-user','note','{}'::jsonb,now());
 EXCEPTION WHEN insufficient_privilege THEN rejected=true;
 END;
 IF NOT rejected THEN RAISE EXCEPTION 'Cross-user study insert allowed'; END IF;
 INSERT INTO public.fideora_study_entries(user_id,entry_id,kind,payload,client_updated_at)
 VALUES(own_id,'qa-own-note','note','{"text":"qa original"}'::jsonb,now());
 UPDATE public.fideora_study_entries SET payload='{"text":"stale"}'::jsonb,client_updated_at=now()-interval '1 minute' WHERE user_id=own_id AND entry_id='qa-own-note';
 GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>0 THEN RAISE EXCEPTION 'Stale write was accepted'; END IF;
 UPDATE public.fideora_study_entries SET deleted=true,client_updated_at=now()+interval '1 second' WHERE user_id=own_id AND entry_id='qa-own-note';
 IF EXISTS(SELECT 1 FROM public.fideora_study_entries WHERE user_id=own_id AND payload<>'{}'::jsonb) THEN RAISE EXCEPTION 'Deleted entry retained personal content'; END IF;
END;
$fideora_rls_test$;
RESET ROLE;
SET LOCAL ROLE anon;
DO $fideora_anon_test$
DECLARE rejected boolean := false;
BEGIN
 BEGIN
  PERFORM count(*) FROM public.fideora_profiles;
 EXCEPTION WHEN insufficient_privilege THEN rejected=true;
 END;
 IF NOT rejected THEN RAISE EXCEPTION 'Anonymous table access allowed'; END IF;
 IF has_function_privilege('public.fideora_delete_own_account()','EXECUTE') THEN RAISE EXCEPTION 'Anonymous account deletion allowed'; END IF;
END;
$fideora_anon_test$;
RESET ROLE;
SET LOCAL ROLE authenticated;
SELECT public.fideora_delete_own_account();
RESET ROLE;
DO $fideora_delete_test$
DECLARE own_id uuid; other_id uuid;
BEGIN
 SELECT a,b INTO own_id,other_id FROM pg_temp.fideora_qa_ids;
 IF EXISTS(SELECT 1 FROM auth.users WHERE id=own_id) THEN RAISE EXCEPTION 'Self deletion failed'; END IF;
 IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id=other_id) THEN RAISE EXCEPTION 'Self deletion removed another user'; END IF;
 IF EXISTS(SELECT 1 FROM public.fideora_profiles WHERE user_id=own_id) OR EXISTS(SELECT 1 FROM public.fideora_study_entries WHERE user_id=own_id) THEN RAISE EXCEPTION 'Self deletion cascade failed'; END IF;
END;
$fideora_delete_test$;
ROLLBACK;
SELECT json_build_object('result','passed','checks',ARRAY['own-row visibility','own-row update','cross-user update blocked','cross-user insertion blocked','stale write rejected','tombstone content removed','anonymous table access blocked','anonymous account deletion blocked','own account deletion and cascade','other account preserved'],'fixtures','rolled back') AS verification;
