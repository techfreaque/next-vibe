/**
 * Engagement Level Enum
 * Defines the possible engagement levels for leads
 */

import { scopedTranslation } from "next-vibe/identity/tracking/engagement/i18n";
import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

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
