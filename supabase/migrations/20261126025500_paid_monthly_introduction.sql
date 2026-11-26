-- Keep old plan identities active for renewal webhooks and running trials.
alter table public.fideora_web_plans drop constraint fideora_web_plans_plan_key_check;
alter table public.fideora_web_plans add constraint fideora_web_plans_plan_key_check check (plan_key in ('monthly','annual','monthly_intro'));
alter table public.fideora_web_plans add column available_for_purchase boolean not null default true;
alter table public.fideora_web_plans add column intro_amount numeric(12,2);
alter table public.fideora_web_plans add column intro_months integer;
alter table public.fideora_web_plans add constraint fideora_paid_intro_check check (
  (intro_amount is null and intro_months is null) or
  (intro_amount is not null and intro_months = 1 and interval_months = 1 and trial_days = 0 and intro_amount > 0 and intro_amount < amount)
);
