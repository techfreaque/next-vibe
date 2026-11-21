/**
 * Geo IP update enums.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Outcome of one geo database update run. */
export const {
  enum: GeoUpdateStatus,
  options: GeoUpdateStatusOptions,
  Value: GeoUpdateStatusValue,
} = createEnumOptions(scopedTranslation, {
  UPDATED: "enums.updateStatus.updated",
  CURRENT: "enums.updateStatus.current",
  UNAVAILABLE: "enums.updateStatus.unavailable",
});
