import { OutreachDealStatus, type OutreachDealStatusValue } from "../enum";

/** Date of the activity that makes the deal eligible for supplier evidence. */
export function creatorDealBillDate<TDate extends Date | string>(deal: {
  amountCents: number;
  status: typeof OutreachDealStatusValue;
  liveAt?: TDate | null;
  paidAt?: TDate | null;
}): TDate | null {
  if (deal.amountCents <= 0) {
    return null;
  }
  if (deal.status === OutreachDealStatus.PAID && deal.paidAt) {
    return deal.liveAt ?? deal.paidAt;
  }
  return deal.status === OutreachDealStatus.COMMITTED && !deal.paidAt
    ? (deal.liveAt ?? null)
    : null;
}
