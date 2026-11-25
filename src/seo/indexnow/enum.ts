/**
 * IndexNow submit enums.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Outcome of one IndexNow run. */
export const {
  enum: IndexNowStatus,
  options: IndexNowStatusOptions,
  Value: IndexNowStatusValue,
} = createEnumOptions(scopedTranslation, {
  SUBMITTED: "enums.status.submitted",
  UNCHANGED: "enums.status.unchanged",
  DRY_RUN: "enums.status.dryRun",
  NOT_PRODUCTION: "enums.status.notProduction",
});
