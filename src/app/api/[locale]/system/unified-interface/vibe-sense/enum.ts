/**
 * Vibe Sense — Shared Enums
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: GraphResolution,
  options: GraphResolutionOptions,
  Value: GraphResolutionValue,
} = createEnumOptions(scopedTranslation, {
  ONE_MINUTE: "enums.resolution.1m",
  THREE_MINUTES: "enums.resolution.3m",
  FIVE_MINUTES: "enums.resolution.5m",
  FIFTEEN_MINUTES: "enums.resolution.15m",
  THIRTY_MINUTES: "enums.resolution.30m",
  ONE_HOUR: "enums.resolution.1h",
  FOUR_HOURS: "enums.resolution.4h",
  ONE_DAY: "enums.resolution.1d",
  ONE_WEEK: "enums.resolution.1w",
  ONE_MONTH: "enums.resolution.1M",
} as const);

export type GraphResolutionType = typeof GraphResolutionValue;

export const GraphResolutionDB = [
  GraphResolution.ONE_MINUTE,
  GraphResolution.THREE_MINUTES,
  GraphResolution.FIVE_MINUTES,
  GraphResolution.FIFTEEN_MINUTES,
  GraphResolution.THIRTY_MINUTES,
  GraphResolution.ONE_HOUR,
  GraphResolution.FOUR_HOURS,
  GraphResolution.ONE_DAY,
  GraphResolution.ONE_WEEK,
  GraphResolution.ONE_MONTH,
] as const;
