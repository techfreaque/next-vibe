/**
 * Engagement Level Enum
 * Defines the possible engagement levels for leads
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

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
