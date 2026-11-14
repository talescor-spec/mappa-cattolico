export const PAYMENT_EVENTS = new Set(['PURCHASE_APPROVED', 'PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_CANCELED', 'PURCHASE_DELAYED', 'PURCHASE_EXPIRED', 'SUBSCRIPTION_CANCELLATION']);
const text = (value, max = 200) => typeof value === 'string' || typeof value === 'number' ? String(value).trim().slice(0, max) : '';
const timestamp = value => { const number = Number(value); return Number.isFinite(number) && number > 0 ? new Date(number).toISOString() : null; };
export function normalizeHotmart(payload, now = Date.now()) {
  if (payload?.version !== '2.0.0' || !text(payload?.id) || !PAYMENT_EVENTS.has(payload?.event)) return null;
  const data = payload.data || {}, purchase = data.purchase || {}, subscription = data.subscription || {};
  const cancellation = payload.event === 'SUBSCRIPTION_CANCELLATION';
  const email = text(cancellation ? data.subscriber?.email : data.buyer?.email, 320).toLowerCase();
  const createdAt = timestamp(payload.creation_date), approvedAt = timestamp(purchase.approved_date);
  const nextChargeAt = timestamp(purchase.date_next_charge);
  if (!createdAt || Date.parse(createdAt) > now + 300000 || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('invalid_event');
  const transaction = text(purchase.transaction), subscriberCode = text(cancellation ? data.subscriber?.code : subscription.subscriber?.code);
  if (!subscriberCode || (!cancellation && !transaction)) throw new Error('subscription_required');
  if (payload.event === 'PURCHASE_APPROVED' && (purchase.status !== 'APPROVED' || !approvedAt || Date.parse(approvedAt) > now + 300000)) throw new Error('unapproved_payment');
  return { id: text(payload.id), event: payload.event, created_at: createdAt, email,
    product_id: text(data.product?.id), product_ucode: text(data.product?.ucode),
    plan_id: text(subscription.plan?.id), subscriber_code: subscriberCode, transaction,
    approved_at: approvedAt, next_charge_at: nextChargeAt };
}
export async function validHottok(actual, expected) {
  if (!expected || expected.length < 8 || typeof actual !== 'string') return false;
  const digest = async value => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  const [a, b] = await Promise.all([digest(actual), digest(expected)]);
  let difference = 0; for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}
