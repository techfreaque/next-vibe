/**
 * Credits Purchased - Enums
 * Which credit grants to count.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: CreditIssueKind,
  options: CreditIssueKindOptions,
  Value: CreditIssueKindValue,
} = createEnumOptions(scopedTranslation, {
  /** Paid checkouts: credit packs + subscription credits (metadata.sessionId set) */
  PAID: "enums.kind.paid",
  /** Paid credit packs only */
  PACKS: "enums.kind.packs",
  /** Paid subscription credits only */
  SUBSCRIPTIONS: "enums.kind.subscriptions",
  /** Admin-granted bonus packs (testers, creators, goodwill): no checkout behind them */
  GIFTED: "enums.kind.gifted",
});
