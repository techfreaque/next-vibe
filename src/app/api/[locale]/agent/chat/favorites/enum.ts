/**
 * Favorites Enums
 * Centralized enum definitions for favorites system using localized enum pattern
 * Values match the database format (lowercase strings from ../types.ts)
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
  auto: "app.api.agent.chat.favorites.enums.mode.auto",
  manual: "app.api.agent.chat.favorites.enums.mode.manual",
});

/**
 * Database enum array for Drizzle
 */
export const ModelSelectionModeDB = [
  "auto",
  "manual",
] as const;

export type ModelSelectionModeType = (typeof ModelSelectionModeDB)[number];

/**
 * Intelligence Level Enum (with "any" option for filters)
 * How smart the model should be
 */
export const {
  enum: IntelligenceLevelFilter,
  options: IntelligenceLevelFilterOptions,
  Value: IntelligenceLevelFilterValue,
} = createEnumOptions({
  any: "app.api.agent.chat.favorites.enums.intelligence.any",
  quick: "app.api.agent.chat.favorites.enums.intelligence.quick",
  smart: "app.api.agent.chat.favorites.enums.intelligence.smart",
  brilliant: "app.api.agent.chat.favorites.enums.intelligence.brilliant",
});

/**
 * Database enum array for Drizzle
 */
export const IntelligenceLevelFilterDB = [
  "any",
  "quick",
  "smart",
  "brilliant",
] as const;

export type IntelligenceLevelFilterType = (typeof IntelligenceLevelFilterDB)[number];

/**
 * Price Level Enum (with "any" option for filters)
 * Maximum price tier for the model
 */
export const {
  enum: PriceLevelFilter,
  options: PriceLevelFilterOptions,
  Value: PriceLevelFilterValue,
} = createEnumOptions({
  any: "app.api.agent.chat.favorites.enums.price.any",
  cheap: "app.api.agent.chat.favorites.enums.price.cheap",
  standard: "app.api.agent.chat.favorites.enums.price.standard",
  premium: "app.api.agent.chat.favorites.enums.price.premium",
});

/**
 * Database enum array for Drizzle
 */
export const PriceLevelFilterDB = [
  "any",
  "cheap",
  "standard",
  "premium",
] as const;

export type PriceLevelFilterType = (typeof PriceLevelFilterDB)[number];

/**
 * Content Level Enum (with "any" option for filters)
 * Content moderation level
 */
export const {
  enum: ContentLevelFilter,
  options: ContentLevelFilterOptions,
  Value: ContentLevelFilterValue,
} = createEnumOptions({
  any: "app.api.agent.chat.favorites.enums.content.any",
  mainstream: "app.api.agent.chat.favorites.enums.content.mainstream",
  open: "app.api.agent.chat.favorites.enums.content.open",
  uncensored: "app.api.agent.chat.favorites.enums.content.uncensored",
});

/**
 * Database enum array for Drizzle
 */
export const ContentLevelFilterDB = [
  "any",
  "mainstream",
  "open",
  "uncensored",
] as const;

export type ContentLevelFilterType = (typeof ContentLevelFilterDB)[number];
