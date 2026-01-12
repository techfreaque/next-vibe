/**
 * Favorites Enums
 * All enums use translation keys as values
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { IconKey } from "../../../system/unified-interface/react/icons";

/**
 * Model Selection Mode Enum
 */
export const {
  enum: ModelSelectionMode,
  options: ModelSelectionModeOptions,
  Value: ModelSelectionModeValue,
} = createEnumOptions({
  AUTO: "app.api.agent.chat.favorites.enums.mode.auto",
  MANUAL: "app.api.agent.chat.favorites.enums.mode.manual",
});

export const ModelSelectionModeDB = [
  ModelSelectionMode.AUTO,
  ModelSelectionMode.MANUAL,
] as const;

/**
 * Model Selection Type Enum (for API discriminator)
 * Maps to the selectionType field in objectUnionField
 */
export const {
  enum: ModelSelectionType,
  options: ModelSelectionTypeOptions,
  Value: ModelSelectionTypeValue,
} = createEnumOptions({
  MANUAL: "app.api.agent.chat.favorites.enums.selectionType.manual",
  FILTERS: "app.api.agent.chat.favorites.enums.selectionType.filters",
});

export const ModelSelectionTypeDB = [
  ModelSelectionType.MANUAL,
  ModelSelectionType.FILTERS,
] as const;

/**
 * Intelligence Level Enum (actual model tiers, no ANY)
 * How smart the model should be
 */
export const {
  enum: IntelligenceLevel,
  options: IntelligenceLevelOptions,
  Value: IntelligenceLevelValue,
} = createEnumOptions({
  QUICK: "app.api.agent.chat.favorites.enums.intelligence.quick",
  SMART: "app.api.agent.chat.favorites.enums.intelligence.smart",
  BRILLIANT: "app.api.agent.chat.favorites.enums.intelligence.brilliant",
});

/**
 * Intelligence Level Filter Enum (includes ANY for filtering)
 */
export const {
  enum: IntelligenceLevelFilter,
  options: IntelligenceLevelFilterOptions,
  Value: IntelligenceLevelFilterValue,
} = createEnumOptions({
  ANY: "app.api.agent.chat.favorites.enums.intelligence.any",
  ...IntelligenceLevel,
});

/**
 * Database enum array for Drizzle (uses translation keys)
 */
export const IntelligenceLevelDB = [
  IntelligenceLevel.QUICK,
  IntelligenceLevel.SMART,
  IntelligenceLevel.BRILLIANT,
] as const;

export const IntelligenceLevelFilterDB = [
  IntelligenceLevelFilter.ANY,
  IntelligenceLevelFilter.QUICK,
  IntelligenceLevelFilter.SMART,
  IntelligenceLevelFilter.BRILLIANT,
] as const;

/**
 * Price Level Enum (actual model tiers, no ANY)
 * Maximum price tier for the model
 */
export const {
  enum: PriceLevel,
  options: PriceLevelOptions,
  Value: PriceLevelValue,
} = createEnumOptions({
  CHEAP: "app.api.agent.chat.favorites.enums.price.cheap",
  STANDARD: "app.api.agent.chat.favorites.enums.price.standard",
  PREMIUM: "app.api.agent.chat.favorites.enums.price.premium",
});

/**
 * Price Level Filter Enum (includes ANY for filtering)
 */
export const {
  enum: PriceLevelFilter,
  options: PriceLevelFilterOptions,
  Value: PriceLevelFilterValue,
} = createEnumOptions({
  ANY: "app.api.agent.chat.favorites.enums.price.any",
  ...PriceLevel,
});

/**
 * Database enum array for Drizzle (uses translation keys)
 */
export const PriceLevelDB = [
  PriceLevel.CHEAP,
  PriceLevel.STANDARD,
  PriceLevel.PREMIUM,
] as const;

export const PriceLevelFilterDB = [
  PriceLevelFilter.ANY,
  PriceLevelFilter.CHEAP,
  PriceLevelFilter.STANDARD,
  PriceLevelFilter.PREMIUM,
] as const;

/**
 * Content Level Enum (actual model tiers, no ANY)
 * Content moderation level
 */
export const {
  enum: ContentLevel,
  options: ContentLevelOptions,
  Value: ContentLevelValue,
} = createEnumOptions({
  MAINSTREAM: "app.api.agent.chat.favorites.enums.content.mainstream",
  OPEN: "app.api.agent.chat.favorites.enums.content.open",
  UNCENSORED: "app.api.agent.chat.favorites.enums.content.uncensored",
});

/**
 * Content Level Filter Enum (includes ANY for filtering)
 */
export const {
  enum: ContentLevelFilter,
  options: ContentLevelFilterOptions,
  Value: ContentLevelFilterValue,
} = createEnumOptions({
  ANY: "app.api.agent.chat.favorites.enums.content.any",
  ...ContentLevel,
});

/**
 * Database enum array for Drizzle
 */
export const ContentLevelDB = [
  ContentLevel.MAINSTREAM,
  ContentLevel.OPEN,
  ContentLevel.UNCENSORED,
] as const;

export const ContentLevelFilterDB = [
  ContentLevelFilter.ANY,
  ContentLevelFilter.MAINSTREAM,
  ContentLevelFilter.OPEN,
  ContentLevelFilter.UNCENSORED,
] as const;

/**
 * Speed Level Enum (actual model tiers, no ANY)
 * How fast the model should respond
 */
export const {
  enum: SpeedLevel,
  options: SpeedLevelOptions,
  Value: SpeedLevelValue,
} = createEnumOptions({
  FAST: "app.api.agent.chat.favorites.enums.speed.fast",
  BALANCED: "app.api.agent.chat.favorites.enums.speed.balanced",
  THOROUGH: "app.api.agent.chat.favorites.enums.speed.thorough",
});

/**
 * Speed Level Filter Enum (includes ANY for filtering)
 */
export const {
  enum: SpeedLevelFilter,
  options: SpeedLevelFilterOptions,
  Value: SpeedLevelFilterValue,
} = createEnumOptions({
  ANY: "app.api.agent.chat.favorites.enums.speed.any",
  ...SpeedLevel,
});

/**
 * Database enum array for Drizzle
 */
export const SpeedLevelDB = [
  SpeedLevel.FAST,
  SpeedLevel.BALANCED,
  SpeedLevel.THOROUGH,
] as const;

export const SpeedLevelFilterDB = [
  SpeedLevelFilter.ANY,
  SpeedLevelFilter.FAST,
  SpeedLevelFilter.BALANCED,
  SpeedLevelFilter.THOROUGH,
] as const;

interface TierDisplayConfig<T extends string> {
  value: T;
  label: TranslationKey;
  icon: IconKey;
  description?: TranslationKey;
}

export const INTELLIGENCE_DISPLAY: TierDisplayConfig<
  typeof IntelligenceLevelFilterValue
>[] = [
  {
    value: IntelligenceLevelFilter.QUICK,
    label: "app.chat.tiers.intelligence.quick",
    icon: "zap",
    description: "app.chat.tiers.intelligence.quickDesc",
  },
  {
    value: IntelligenceLevelFilter.SMART,
    label: "app.chat.tiers.intelligence.smart",
    icon: "lightbulb",
    description: "app.chat.tiers.intelligence.smartDesc",
  },
  {
    value: IntelligenceLevelFilter.BRILLIANT,
    label: "app.chat.tiers.intelligence.brilliant",
    icon: "sparkles",
    description: "app.chat.tiers.intelligence.brilliantDesc",
  },
];

export const PRICE_DISPLAY: TierDisplayConfig<typeof PriceLevelFilterValue>[] =
  [
    {
      value: PriceLevelFilter.CHEAP,
      label: "app.chat.tiers.price.cheap",
      icon: "coins",
      description: "app.chat.tiers.price.cheapDesc",
    },
    {
      value: PriceLevelFilter.STANDARD,
      label: "app.chat.tiers.price.standard",
      icon: "coins",
      description: "app.chat.tiers.price.standardDesc",
    },
    {
      value: PriceLevelFilter.PREMIUM,
      label: "app.chat.tiers.price.premium",
      icon: "crown",
      description: "app.chat.tiers.price.premiumDesc",
    },
  ];

export const CONTENT_DISPLAY: TierDisplayConfig<
  typeof ContentLevelFilterValue
>[] = [
  {
    value: ContentLevelFilter.MAINSTREAM,
    label: "app.chat.tiers.content.mainstream",
    icon: "home",
    description: "app.chat.tiers.content.mainstreamDesc",
  },
  {
    value: ContentLevelFilter.OPEN,
    label: "app.chat.tiers.content.open",
    icon: "log-out",
    description: "app.chat.tiers.content.openDesc",
  },
  {
    value: ContentLevelFilter.UNCENSORED,
    label: "app.chat.tiers.content.uncensored",
    icon: "shield-off",
    description: "app.chat.tiers.content.uncensoredDesc",
  },
];

export const SPEED_DISPLAY: TierDisplayConfig<typeof SpeedLevelFilterValue>[] =
  [
    {
      value: SpeedLevelFilter.FAST,
      label: "app.chat.tiers.speed.fast",
      icon: "zap",
      description: "app.chat.tiers.speed.fastDesc",
    },
    {
      value: SpeedLevelFilter.BALANCED,
      label: "app.chat.tiers.speed.balanced",
      icon: "scale",
      description: "app.chat.tiers.speed.balancedDesc",
    },
    {
      value: SpeedLevelFilter.THOROUGH,
      label: "app.chat.tiers.speed.thorough",
      icon: "microscope",
      description: "app.chat.tiers.speed.thoroughDesc",
    },
  ];
