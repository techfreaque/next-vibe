/**
 * Referral overview enums.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Server-side sort of the per-code table (always descending). */
export const { enum: ReferralCodeSort, options: ReferralCodeSortOptions } =
  createEnumOptions(scopedTranslation, {
    REVENUE: "enums.sort.revenue",
    COMMISSION: "enums.sort.commission",
    PAYERS: "enums.sort.payers",
    SIGNUPS: "enums.sort.signups",
    LEADS: "enums.sort.leads",
    CLICKS: "enums.sort.clicks",
    CONVERSION: "enums.sort.conversion",
    OWNER_QUEUE: "enums.sort.ownerQueue",
    OWNER_FREE: "enums.sort.ownerFree",
    NEWEST: "enums.sort.newest",
  });

export type ReferralCodeSortValue =
  (typeof ReferralCodeSort)[keyof typeof ReferralCodeSort];

export const ReferralCodeSortDB = [
  ReferralCodeSort.REVENUE,
  ReferralCodeSort.COMMISSION,
  ReferralCodeSort.PAYERS,
  ReferralCodeSort.SIGNUPS,
  ReferralCodeSort.LEADS,
  ReferralCodeSort.CLICKS,
  ReferralCodeSort.CONVERSION,
  ReferralCodeSort.OWNER_QUEUE,
  ReferralCodeSort.OWNER_FREE,
  ReferralCodeSort.NEWEST,
] as const;
