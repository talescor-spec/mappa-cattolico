// Only server-controlled Supabase app_metadata can grant administrator access.
// Customer-editable user_metadata and checkout parameters are never authoritative.
export function webAdminEntitlement(user, now = Date.now()) {
  if (!user?.id || !user.email || !user.email_confirmed_at || user.app_metadata?.web_admin !== true)
    return null;
  return {
    userId: user.id,
    isPremium: true,
    role: 'admin',
    billingProvider: 'admin',
    // Revalidate the protected role regularly instead of issuing an unbounded client entitlement.
    expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
  };
}
