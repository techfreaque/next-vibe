/**
 * Engagement Level Enum
 * Defines the possible engagement levels for leads
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: EngagementLevel,
  options: EngagementLevelOptions,
  Value: EngagementLevelValue,
} = createEnumOptions(scopedTranslation, {
  HIGH: "enums.engagementLevel.high",
  MEDIUM: "enums.engagementLevel.medium",
  LOW: "enums.engagementLevel.low",
  NONE: "enums.engagementLevel.none",
});

/**
 * Database Enum Arrays
 * Dedicated arrays for pgEnum usage with translation keys
 * Following established pattern for database compatibility
 */
export const EngagementLevelDB = [
  EngagementLevel.HIGH,
  EngagementLevel.MEDIUM,
  EngagementLevel.LOW,
  EngagementLevel.NONE,
] as const;
