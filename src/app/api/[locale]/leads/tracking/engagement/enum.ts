/**
 * Engagement Level Enum
 * Defines the possible engagement levels for leads
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

export const {
  enum: EngagementLevel,
  options: EngagementLevelOptions,
  Value: EngagementLevelValue,
} = createEnumOptions({
  HIGH: "app.api.leads.tracking.engagement.enums.engagementLevel.high",
  MEDIUM: "app.api.leads.tracking.engagement.enums.engagementLevel.medium",
  LOW: "app.api.leads.tracking.engagement.enums.engagementLevel.low",
  NONE: "app.api.leads.tracking.engagement.enums.engagementLevel.none",
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
