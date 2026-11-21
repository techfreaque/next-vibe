import {
  PayoutCurrency,
  type PayoutCurrencyValue,
  PayoutStatus,
  type PayoutStatusValue,
} from "./enum";

export const adminPayoutActions = ["approve", "reject", "complete"] as const;

export function getAdminPayoutActions(request: {
  status: typeof PayoutStatusValue;
  currency: typeof PayoutCurrencyValue;
}): readonly (typeof adminPayoutActions)[number][] {
  if (request.currency === PayoutCurrency.CREDITS) {
    // Credits payouts convert when requested; a pending one is stuck and can
    // only be rejected (releases the reserved earnings).
    return request.status === PayoutStatus.PENDING ? ["reject"] : [];
  }
  if (request.status === PayoutStatus.PENDING) {
    return ["approve", "reject"];
  }
  return request.status === PayoutStatus.APPROVED ? ["complete"] : [];
}
