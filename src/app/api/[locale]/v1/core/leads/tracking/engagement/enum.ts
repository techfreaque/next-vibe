/**
 * Engagement Level Enum
 * Defines the possible engagement levels for leads
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

export const {
  enum: EngagementLevel,
  options: EngagementLevelOptions,
  Value: EngagementLevelValue,
} = createEnumOptions({
  HIGH: "app.api.v1.core.leads.tracking.engagement.enums.engagementLevel.high",
  MEDIUM:
    "app.api.v1.core.leads.tracking.engagement.enums.engagementLevel.medium",
  LOW: "app.api.v1.core.leads.tracking.engagement.enums.engagementLevel.low",
  NONE: "app.api.v1.core.leads.tracking.engagement.enums.engagementLevel.none",
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
