/**
 * Favorites Enums
 * Centralized enum definitions for favorites system using localized enum pattern
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Model Selection Mode Enum
 * How the model is selected for a favorite
 */
export const {
  enum: ModelSelectionMode,
  options: ModelSelectionModeOptions,
  Value: ModelSelectionModeValue,
} = createEnumOptions({
  AUTO: "app.api.agent.chat.favorites.enums.mode.auto",
  MANUAL: "app.api.agent.chat.favorites.enums.mode.manual",
});

/**
 * Database enum array for Drizzle
 */
export const ModelSelectionModeDB = [
  ModelSelectionMode.AUTO,
  ModelSelectionMode.MANUAL,
] as const;

/**
 * Intelligence Level Enum
 * How smart the model should be
 */
export const {
  enum: IntelligenceLevel,
  options: IntelligenceLevelOptions,
  Value: IntelligenceLevelValue,
} = createEnumOptions({
  ANY: "app.api.agent.chat.favorites.enums.intelligence.any",
  QUICK: "app.api.agent.chat.favorites.enums.intelligence.quick",
  SMART: "app.api.agent.chat.favorites.enums.intelligence.smart",
  BRILLIANT: "app.api.agent.chat.favorites.enums.intelligence.brilliant",
});

/**
 * Database enum array for Drizzle
 */
export const IntelligenceLevelDB = [
  IntelligenceLevel.ANY,
  IntelligenceLevel.QUICK,
  IntelligenceLevel.SMART,
  IntelligenceLevel.BRILLIANT,
] as const;

/**
 * Price Level Enum
 * Maximum price tier for the model
 */
export const {
  enum: PriceLevel,
  options: PriceLevelOptions,
  Value: PriceLevelValue,
} = createEnumOptions({
  ANY: "app.api.agent.chat.favorites.enums.price.any",
  CHEAP: "app.api.agent.chat.favorites.enums.price.cheap",
  STANDARD: "app.api.agent.chat.favorites.enums.price.standard",
  PREMIUM: "app.api.agent.chat.favorites.enums.price.premium",
});

/**
 * Database enum array for Drizzle
 */
export const PriceLevelDB = [
  PriceLevel.ANY,
  PriceLevel.CHEAP,
  PriceLevel.STANDARD,
  PriceLevel.PREMIUM,
] as const;

/**
 * Content Level Enum
 * Content moderation level
 */
export const {
  enum: ContentLevel,
  options: ContentLevelOptions,
  Value: ContentLevelValue,
} = createEnumOptions({
  ANY: "app.api.agent.chat.favorites.enums.content.any",
  MAINSTREAM: "app.api.agent.chat.favorites.enums.content.mainstream",
  OPEN: "app.api.agent.chat.favorites.enums.content.open",
  UNCENSORED: "app.api.agent.chat.favorites.enums.content.uncensored",
});

/**
 * Database enum array for Drizzle
 */
export const ContentLevelDB = [
  ContentLevel.ANY,
  ContentLevel.MAINSTREAM,
  ContentLevel.OPEN,
  ContentLevel.UNCENSORED,
] as const;
