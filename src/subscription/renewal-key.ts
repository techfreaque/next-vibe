/**
 * Canonical idempotency key for a subscription period's credit grant.
 * Shared by every grant path (invoice handlers, subscription.updated, sync)
 * and by the renewal payment record, so a refund finds the credits it bought.
 *
 * Client+server safe. No imports.
 */
export function subscriptionRenewalSessionKey(
  providerSubscriptionId: string,
  periodEndMs: number,
): string {
  return `renewal_${providerSubscriptionId}_${periodEndMs}`;
}
