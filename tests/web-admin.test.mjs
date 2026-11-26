import test from 'node:test';
import assert from 'node:assert/strict';
import { webAdminEntitlement } from '../supabase/functions/_shared/web-roles.mjs';
const now = Date.parse('2026-11-26T19:00:00Z');
const user = { id: 'admin-user', email: 'review@example.com', email_confirmed_at: '2026-11-26T18:00:00Z' };
test('only a confirmed account with the server-controlled boolean role receives admin Premium', () => {
  const grant = webAdminEntitlement({ ...user, app_metadata: { web_admin: true } }, now);
  assert.equal(grant.userId, user.id);
  assert.equal(grant.role, 'admin');
  assert.equal(grant.billingProvider, 'admin');
  assert.equal(grant.isPremium, true);
  assert.equal(grant.expiresAt, '2026-11-27T19:00:00.000Z');
});
test('user-editable metadata, string claims, missing identity and unconfirmed accounts cannot become admins', () => {
  for (const candidate of [null, user, { ...user, user_metadata: { web_admin: true, role: 'admin' } },
    { ...user, app_metadata: { web_admin: 'true' } },
    { ...user, email_confirmed_at: null, app_metadata: { web_admin: true } },
    { ...user, id: null, app_metadata: { web_admin: true } }])
    assert.equal(webAdminEntitlement(candidate, now), null);
});
