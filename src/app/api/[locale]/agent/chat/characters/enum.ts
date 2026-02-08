/**
 * Character Enums
 * Centralized enum definitions for character system using localized enum pattern
 */

import {
  Brain,
  Code,
  Eye,
  FileText,
  Image,
  Lightbulb,
  MessageSquare,
  ShieldOff,
  Sparkles,
  Theater,
  Zap,
} from "next-vibe-ui/ui/icons";

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { IconComponent } from "@/packages/next-vibe-ui/web/lib/helper";

import { ModelUtility, type ModelUtilityValue } from "../../models/enum";

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
  CHARACTER_BASED:
    "app.api.agent.chat.favorites.enums.selectionType.characterBased",
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
 * Database enum array for Drizzle (uses translation keys)
 */
export const IntelligenceLevelDB = [
  IntelligenceLevel.QUICK,
  IntelligenceLevel.SMART,
  IntelligenceLevel.BRILLIANT,
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
 * Database enum array for Drizzle (uses translation keys)
 */
export const PriceLevelDB = [
  PriceLevel.CHEAP,
  PriceLevel.STANDARD,
  PriceLevel.PREMIUM,
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
 * Database enum array for Drizzle
 */
export const ContentLevelDB = [
  ContentLevel.MAINSTREAM,
  ContentLevel.OPEN,
  ContentLevel.UNCENSORED,
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
 * Database enum array for Drizzle
 */
export const SpeedLevelDB = [
  SpeedLevel.FAST,
  SpeedLevel.BALANCED,
  SpeedLevel.THOROUGH,
] as const;

/**
 * Model Sort Field Enum
 */
export const {
  enum: ModelSortField,
  options: ModelSortFieldOptions,
  Value: ModelSortFieldValue,
} = createEnumOptions({
  INTELLIGENCE: "app.api.agent.chat.favorites.modelSelection.sort.intelligence",
  PRICE: "app.api.agent.chat.favorites.modelSelection.sort.price",
  SPEED: "app.api.agent.chat.favorites.modelSelection.sort.speed",
  CONTENT: "app.api.agent.chat.favorites.modelSelection.sort.content",
});

export const ModelSortFieldDB = [
  ModelSortField.INTELLIGENCE,
  ModelSortField.PRICE,
  ModelSortField.SPEED,
  ModelSortField.CONTENT,
] as const;

/**
 * Model Sort Direction Enum
 */
export const {
  enum: ModelSortDirection,
  options: ModelSortDirectionOptions,
  Value: ModelSortDirectionValue,
} = createEnumOptions({
  ASC: "app.api.agent.chat.favorites.modelSelection.sortDirection.asc",
  DESC: "app.api.agent.chat.favorites.modelSelection.sortDirection.desc",
});

export const ModelSortDirectionDB = [
  ModelSortDirection.ASC,
  ModelSortDirection.DESC,
] as const;

interface TierDisplayConfig<T extends string> {
  value: T;
  label: TranslationKey;
  icon: IconKey;
  description?: TranslationKey;
}

export const INTELLIGENCE_DISPLAY: TierDisplayConfig<
  typeof IntelligenceLevelValue
>[] = [
  {
    value: IntelligenceLevel.QUICK,
    label: "app.chat.tiers.intelligence.quick",
    icon: "zap",
    description: "app.chat.tiers.intelligence.quickDesc",
  },
  {
    value: IntelligenceLevel.SMART,
    label: "app.chat.tiers.intelligence.smart",
    icon: "lightbulb",
    description: "app.chat.tiers.intelligence.smartDesc",
  },
  {
    value: IntelligenceLevel.BRILLIANT,
    label: "app.chat.tiers.intelligence.brilliant",
    icon: "sparkles",
    description: "app.chat.tiers.intelligence.brilliantDesc",
  },
];

export const PRICE_DISPLAY: TierDisplayConfig<typeof PriceLevelValue>[] = [
  {
    value: PriceLevel.CHEAP,
    label: "app.chat.tiers.price.cheap",
    icon: "coins",
    description: "app.chat.tiers.price.cheapDesc",
  },
  {
    value: PriceLevel.STANDARD,
    label: "app.chat.tiers.price.standard",
    icon: "coins",
    description: "app.chat.tiers.price.standardDesc",
  },
  {
    value: PriceLevel.PREMIUM,
    label: "app.chat.tiers.price.premium",
    icon: "crown",
    description: "app.chat.tiers.price.premiumDesc",
  },
];

export const CONTENT_DISPLAY: TierDisplayConfig<typeof ContentLevelValue>[] = [
  {
    value: ContentLevel.MAINSTREAM,
    label: "app.chat.tiers.content.mainstream",
    icon: "home",
    description: "app.chat.tiers.content.mainstreamDesc",
  },
  {
    value: ContentLevel.OPEN,
    label: "app.chat.tiers.content.open",
    icon: "log-out",
    description: "app.chat.tiers.content.openDesc",
  },
  {
    value: ContentLevel.UNCENSORED,
    label: "app.chat.tiers.content.uncensored",
    icon: "shield-off",
    description: "app.chat.tiers.content.uncensoredDesc",
  },
];

export const SPEED_DISPLAY: TierDisplayConfig<typeof SpeedLevelValue>[] = [
  {
    value: SpeedLevel.FAST,
    label: "app.chat.tiers.speed.fast",
    icon: "zap",
    description: "app.chat.tiers.speed.fastDesc",
  },
  {
    value: SpeedLevel.BALANCED,
    label: "app.chat.tiers.speed.balanced",
    icon: "scale",
    description: "app.chat.tiers.speed.balancedDesc",
  },
  {
    value: SpeedLevel.THOROUGH,
    label: "app.chat.tiers.speed.thorough",
    icon: "microscope",
    description: "app.chat.tiers.speed.thoroughDesc",
  },
];

/**
 * Character Category Enum
 * User-facing task categories for characters
 */
export const {
  enum: CharacterCategory,
  options: CharacterCategoryOptions,
  Value: CharacterCategoryValue,
} = createEnumOptions({
  COMPANION: "app.api.agent.chat.characters.enums.category.companion",
  ASSISTANT: "app.api.agent.chat.characters.enums.category.assistant",
  CODING: "app.api.agent.chat.characters.enums.category.coding",
  CREATIVE: "app.api.agent.chat.characters.enums.category.creative",
  WRITING: "app.api.agent.chat.characters.enums.category.writing",
  ANALYSIS: "app.api.agent.chat.characters.enums.category.analysis",
  ROLEPLAY: "app.api.agent.chat.characters.enums.category.roleplay",
  EDUCATION: "app.api.agent.chat.characters.enums.category.education",
  CONTROVERSIAL: "app.api.agent.chat.characters.enums.category.controversial",
});

/**
 * Database enum array for Drizzle
 */
export const CharacterCategoryDB = [
  CharacterCategory.COMPANION,
  CharacterCategory.ASSISTANT,
  CharacterCategory.CODING,
  CharacterCategory.CREATIVE,
  CharacterCategory.WRITING,
  CharacterCategory.ANALYSIS,
  CharacterCategory.ROLEPLAY,
  CharacterCategory.EDUCATION,
  CharacterCategory.CONTROVERSIAL,
] as const;

/**
 * Character Ownership Type Enum
 * Who owns/controls the character
 */
export const {
  enum: CharacterOwnershipType,
  options: CharacterOwnershipTypeOptions,
  Value: CharacterOwnershipTypeValue,
} = createEnumOptions({
  SYSTEM: "app.api.agent.chat.characters.enums.ownershipType.system",
  USER: "app.api.agent.chat.characters.enums.ownershipType.user",
  PUBLIC: "app.api.agent.chat.characters.enums.ownershipType.public",
});

/**
 * Database enum array for Drizzle
 */
export const CharacterOwnershipTypeDB = [
  CharacterOwnershipType.SYSTEM,
  CharacterOwnershipType.USER,
  CharacterOwnershipType.PUBLIC,
] as const;

/**
 * Category configuration with icons and task mapping
 */
export interface CategoryConfig {
  category: typeof CharacterCategoryValue;
  label: typeof CharacterCategoryValue; // Translation key (same as category)
  icon: IconKey;
  task: typeof ModelUtilityValue;
  order: number;
}

/**
 * Centralized category configuration
 * Maps each category to its icon and primary task utility
 */
export const CATEGORY_CONFIG: Record<
  typeof CharacterCategoryValue,
  CategoryConfig
> = {
  [CharacterCategory.COMPANION]: {
    category: CharacterCategory.COMPANION,
    label: CharacterCategory.COMPANION,
    icon: "heart",
    task: ModelUtility.CHAT,
    order: 0,
  },
  [CharacterCategory.ASSISTANT]: {
    category: CharacterCategory.ASSISTANT,
    label: CharacterCategory.ASSISTANT,
    icon: "robot-face",
    task: ModelUtility.CHAT,
    order: 1,
  },
  [CharacterCategory.CODING]: {
    category: CharacterCategory.CODING,
    label: CharacterCategory.CODING,
    icon: "code",
    task: ModelUtility.CODING,
    order: 2,
  },
  [CharacterCategory.CREATIVE]: {
    category: CharacterCategory.CREATIVE,
    label: CharacterCategory.CREATIVE,
    icon: "artist-palette",
    task: ModelUtility.CREATIVE,
    order: 4,
  },
  [CharacterCategory.WRITING]: {
    category: CharacterCategory.WRITING,
    label: CharacterCategory.WRITING,
    icon: "pen-tool",
    task: ModelUtility.CREATIVE,
    order: 3,
  },
  [CharacterCategory.ANALYSIS]: {
    category: CharacterCategory.ANALYSIS,
    label: CharacterCategory.ANALYSIS,
    icon: "magnifying-glass-icon",
    task: ModelUtility.ANALYSIS,
    order: 5,
  },
  [CharacterCategory.ROLEPLAY]: {
    category: CharacterCategory.ROLEPLAY,
    label: CharacterCategory.ROLEPLAY,
    icon: "game-controller",
    task: ModelUtility.ROLEPLAY,
    order: 7,
  },
  [CharacterCategory.EDUCATION]: {
    category: CharacterCategory.EDUCATION,
    label: CharacterCategory.EDUCATION,
    icon: "books",
    task: ModelUtility.REASONING,
    order: 6,
  },
  [CharacterCategory.CONTROVERSIAL]: {
    category: CharacterCategory.CONTROVERSIAL,
    label: CharacterCategory.CONTROVERSIAL,
    icon: "fire",
    task: ModelUtility.CHAT,
    order: 8,
  },
};

/**
 * Category options with icons for UI
 * Generated from centralized category configuration
 */
export const CategoryOptions = CharacterCategoryOptions.map((option) => {
  const config = CATEGORY_CONFIG[option.value];
  return {
    ...option,
    icon: config.icon,
  };
});

/**
 * Get the primary task utility for a category
 */
export function categoryToTask(
  category: typeof CharacterCategoryValue,
): typeof ModelUtilityValue {
  return CATEGORY_CONFIG[category].task;
}

export interface ModelUtilityConfig {
  id: typeof ModelUtilityValue;
  titleKey: TranslationKey;
  icon: IconComponent;
  order: number;
  /** Whether this is a content-related utility (vs core capability) */
  isContentRelated?: boolean;
}

/**
 * Configuration for model utility categories
 * Used for grouping models by their primary use cases
 */
export const MODEL_UTILITIES: Record<
  typeof ModelUtilityValue,
  ModelUtilityConfig
> = {
  // Core capabilities
  [ModelUtility.CHAT]: {
    id: ModelUtility.CHAT,
    titleKey: "app.chat.modelUtilities.chat",
    icon: MessageSquare,
    order: 0,
  },
  [ModelUtility.CODING]: {
    id: ModelUtility.CODING,
    titleKey: "app.chat.modelUtilities.coding",
    icon: Code,
    order: 1,
  },
  [ModelUtility.CREATIVE]: {
    id: ModelUtility.CREATIVE,
    titleKey: "app.chat.modelUtilities.creative",
    icon: Sparkles,
    order: 2,
  },
  [ModelUtility.ANALYSIS]: {
    id: ModelUtility.ANALYSIS,
    titleKey: "app.chat.modelUtilities.analysis",
    icon: FileText,
    order: 3,
  },
  [ModelUtility.REASONING]: {
    id: ModelUtility.REASONING,
    titleKey: "app.chat.modelUtilities.reasoning",
    icon: Brain,
    order: 4,
  },
  [ModelUtility.ROLEPLAY]: {
    id: ModelUtility.ROLEPLAY,
    titleKey: "app.chat.modelUtilities.roleplay",
    icon: Theater,
    order: 5,
  },

  // Performance traits
  [ModelUtility.FAST]: {
    id: ModelUtility.FAST,
    titleKey: "app.chat.modelUtilities.fast",
    icon: Zap,
    order: 10,
  },
  [ModelUtility.SMART]: {
    id: ModelUtility.SMART,
    titleKey: "app.chat.modelUtilities.smart",
    icon: Lightbulb,
    order: 11,
  },
  [ModelUtility.VISION]: {
    id: ModelUtility.VISION,
    titleKey: "app.chat.modelUtilities.vision",
    icon: Eye,
    order: 12,
  },
  [ModelUtility.IMAGE_GEN]: {
    id: ModelUtility.IMAGE_GEN,
    titleKey: "app.chat.modelUtilities.imageGen",
    icon: Image,
    order: 13,
  },

  // Content handling - these are typically hidden from main UI
  [ModelUtility.UNCENSORED]: {
    id: ModelUtility.UNCENSORED,
    titleKey: "app.chat.modelUtilities.uncensored",
    icon: ShieldOff,
    order: 20,
    isContentRelated: true,
  },
  [ModelUtility.POLITICAL_LEFT]: {
    id: ModelUtility.POLITICAL_LEFT,
    titleKey: "app.chat.modelUtilities.politicalLeft",
    icon: MessageSquare,
    order: 21,
    isContentRelated: true,
  },
  [ModelUtility.POLITICAL_RIGHT]: {
    id: ModelUtility.POLITICAL_RIGHT,
    titleKey: "app.chat.modelUtilities.politicalRight",
    icon: MessageSquare,
    order: 22,
    isContentRelated: true,
  },
  [ModelUtility.CONTROVERSIAL]: {
    id: ModelUtility.CONTROVERSIAL,
    titleKey: "app.chat.modelUtilities.controversial",
    icon: MessageSquare,
    order: 23,
    isContentRelated: true,
  },
  [ModelUtility.ADULT_IMPLIED]: {
    id: ModelUtility.ADULT_IMPLIED,
    titleKey: "app.chat.modelUtilities.adultImplied",
    icon: MessageSquare,
    order: 24,
    isContentRelated: true,
  },
  [ModelUtility.ADULT_EXPLICIT]: {
    id: ModelUtility.ADULT_EXPLICIT,
    titleKey: "app.chat.modelUtilities.adultExplicit",
    icon: MessageSquare,
    order: 25,
    isContentRelated: true,
  },
  [ModelUtility.VIOLENCE]: {
    id: ModelUtility.VIOLENCE,
    titleKey: "app.chat.modelUtilities.violence",
    icon: MessageSquare,
    order: 26,
    isContentRelated: true,
  },
  [ModelUtility.HARMFUL]: {
    id: ModelUtility.HARMFUL,
    titleKey: "app.chat.modelUtilities.harmful",
    icon: MessageSquare,
    order: 27,
    isContentRelated: true,
  },
  [ModelUtility.ILLEGAL_INFO]: {
    id: ModelUtility.ILLEGAL_INFO,
    titleKey: "app.chat.modelUtilities.illegalInfo",
    icon: MessageSquare,
    order: 28,
    isContentRelated: true,
  },
  [ModelUtility.MEDICAL_ADVICE]: {
    id: ModelUtility.MEDICAL_ADVICE,
    titleKey: "app.chat.modelUtilities.medicalAdvice",
    icon: MessageSquare,
    order: 29,
    isContentRelated: true,
  },
  [ModelUtility.OFFENSIVE_LANGUAGE]: {
    id: ModelUtility.OFFENSIVE_LANGUAGE,
    titleKey: "app.chat.modelUtilities.offensiveLanguage",
    icon: MessageSquare,
    order: 30,
    isContentRelated: true,
  },
  [ModelUtility.ROLEPLAY_DARK]: {
    id: ModelUtility.ROLEPLAY_DARK,
    titleKey: "app.chat.modelUtilities.roleplayDark",
    icon: Theater,
    order: 31,
    isContentRelated: true,
  },
  [ModelUtility.CONSPIRACY]: {
    id: ModelUtility.CONSPIRACY,
    titleKey: "app.chat.modelUtilities.conspiracy",
    icon: MessageSquare,
    order: 32,
    isContentRelated: true,
  },

  // Meta
  [ModelUtility.LEGACY]: {
    id: ModelUtility.LEGACY,
    titleKey: "app.chat.modelUtilities.legacy",
    icon: Image,
    order: 100,
  },
};
