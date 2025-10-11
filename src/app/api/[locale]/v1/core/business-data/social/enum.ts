/**
 * Social Platform API Enums with Translation Options
 * Defines enum values for social platform operations with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

export const {
  enum: SocialPlatform,
  options: SocialPlatformOptions,
  Value: SocialPlatformValue,
} = createEnumOptions({
  FACEBOOK: "app.api.v1.core.businessData.social.enums.socialPlatform.facebook",
  INSTAGRAM:
    "app.api.v1.core.businessData.social.enums.socialPlatform.instagram",
  TWITTER: "app.api.v1.core.businessData.social.enums.socialPlatform.twitter",
  LINKEDIN: "app.api.v1.core.businessData.social.enums.socialPlatform.linkedin",
  TIKTOK: "app.api.v1.core.businessData.social.enums.socialPlatform.tiktok",
  YOUTUBE: "app.api.v1.core.businessData.social.enums.socialPlatform.youtube",
  PINTEREST:
    "app.api.v1.core.businessData.social.enums.socialPlatform.pinterest",
  SNAPCHAT: "app.api.v1.core.businessData.social.enums.socialPlatform.snapchat",
  DISCORD: "app.api.v1.core.businessData.social.enums.socialPlatform.discord",
  REDDIT: "app.api.v1.core.businessData.social.enums.socialPlatform.reddit",
  TELEGRAM: "app.api.v1.core.businessData.social.enums.socialPlatform.telegram",
  WHATSAPP: "app.api.v1.core.businessData.social.enums.socialPlatform.whatsapp",
  OTHER: "app.api.v1.core.businessData.social.enums.socialPlatform.other",
});

export const {
  enum: PlatformPriority,
  options: PlatformPriorityOptions,
  Value: PlatformPriorityValue,
} = createEnumOptions({
  HIGH: "app.api.v1.core.businessData.social.enums.platformPriority.high",
  MEDIUM: "app.api.v1.core.businessData.social.enums.platformPriority.medium",
  LOW: "app.api.v1.core.businessData.social.enums.platformPriority.low",
});

// Create DB arrays for database schema
export const SocialPlatformDB = [
  SocialPlatform.FACEBOOK,
  SocialPlatform.INSTAGRAM,
  SocialPlatform.TWITTER,
  SocialPlatform.LINKEDIN,
  SocialPlatform.TIKTOK,
  SocialPlatform.YOUTUBE,
  SocialPlatform.PINTEREST,
  SocialPlatform.SNAPCHAT,
  SocialPlatform.DISCORD,
  SocialPlatform.REDDIT,
  SocialPlatform.TELEGRAM,
  SocialPlatform.WHATSAPP,
  SocialPlatform.OTHER,
] as const;

export const PlatformPriorityDB = [
  PlatformPriority.HIGH,
  PlatformPriority.MEDIUM,
  PlatformPriority.LOW,
] as const;
