/**
 * Skill Enums
 * Centralized enum definitions for skill system using localized enum pattern
 */

import type { IconComponent } from "next-vibe-ui/lib/helper";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Image } from "next-vibe-ui/ui/icons/Image";
import { Lightbulb } from "next-vibe-ui/ui/icons/Lightbulb";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { ShieldOff } from "next-vibe-ui/ui/icons/ShieldOff";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Theater } from "next-vibe-ui/ui/icons/Theater";
import { Zap } from "next-vibe-ui/ui/icons/Zap";

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { TranslationKey } from "@/i18n/core/static-types";

import { ModelUtility, type ModelUtilityValue } from "../../models/enum";
import type { ModelsTranslationKey } from "../../models/i18n";
import { scopedTranslation as modelsScopedTranslation } from "../../models/i18n";
import { scopedTranslation } from "./i18n";

/**
 * Model Selection Mode Enum
 */
export const {
  enum: ModelSelectionMode,
  options: ModelSelectionModeOptions,
  Value: ModelSelectionModeValue,
} = createEnumOptions(scopedTranslation, {
  AUTO: "enums.mode.auto",
  MANUAL: "enums.mode.manual",
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
} = createEnumOptions(scopedTranslation, {
  CHARACTER_BASED: "enums.selectionType.skillBased",
  MANUAL: "enums.selectionType.manual",
  FILTERS: "enums.selectionType.filters",
} as const);

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
} = createEnumOptions(scopedTranslation, {
  QUICK: "enums.intelligence.quick",
  SMART: "enums.intelligence.smart",
  BRILLIANT: "enums.intelligence.brilliant",
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
} = createEnumOptions(scopedTranslation, {
  CHEAP: "enums.price.cheap",
  STANDARD: "enums.price.standard",
  PREMIUM: "enums.price.premium",
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
} = createEnumOptions(scopedTranslation, {
  MAINSTREAM: "enums.content.mainstream",
  OPEN: "enums.content.open",
  UNCENSORED: "enums.content.uncensored",
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
} = createEnumOptions(scopedTranslation, {
  FAST: "enums.speed.fast",
  BALANCED: "enums.speed.balanced",
  THOROUGH: "enums.speed.thorough",
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
} = createEnumOptions(modelsScopedTranslation, {
  INTELLIGENCE: "sort.intelligence",
  PRICE: "sort.price",
  SPEED: "sort.speed",
  CONTENT: "sort.content",
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
} = createEnumOptions(scopedTranslation, {
  ASC: "modelSelection.sortDirection.asc",
  DESC: "modelSelection.sortDirection.desc",
});

export const ModelSortDirectionDB = [
  ModelSortDirection.ASC,
  ModelSortDirection.DESC,
] as const;

interface TierDisplayConfig<T extends string = string> {
  value: T;
  label: ModelsTranslationKey;
  icon: IconKey;
  description?: ModelsTranslationKey;
}

export const INTELLIGENCE_DISPLAY: TierDisplayConfig<
  typeof IntelligenceLevelValue
>[] = [
  {
    value: IntelligenceLevel.QUICK,
    label: "tiers.intelligence.quick",
    icon: "zap",
    description: "tiers.intelligence.quickDesc",
  },
  {
    value: IntelligenceLevel.SMART,
    label: "tiers.intelligence.smart",
    icon: "lightbulb",
    description: "tiers.intelligence.smartDesc",
  },
  {
    value: IntelligenceLevel.BRILLIANT,
    label: "tiers.intelligence.brilliant",
    icon: "sparkles",
    description: "tiers.intelligence.brilliantDesc",
  },
];

export const PRICE_DISPLAY: TierDisplayConfig<typeof PriceLevelValue>[] = [
  {
    value: PriceLevel.CHEAP,
    label: "tiers.price.cheap",
    icon: "coins",
    description: "tiers.price.cheapDesc",
  },
  {
    value: PriceLevel.STANDARD,
    label: "tiers.price.standard",
    icon: "coins",
    description: "tiers.price.standardDesc",
  },
  {
    value: PriceLevel.PREMIUM,
    label: "tiers.price.premium",
    icon: "crown",
    description: "tiers.price.premiumDesc",
  },
];

export const CONTENT_DISPLAY: TierDisplayConfig<typeof ContentLevelValue>[] = [
  {
    value: ContentLevel.MAINSTREAM,
    label: "tiers.content.mainstream",
    icon: "home",
    description: "tiers.content.mainstreamDesc",
  },
  {
    value: ContentLevel.OPEN,
    label: "tiers.content.open",
    icon: "log-out",
    description: "tiers.content.openDesc",
  },
  {
    value: ContentLevel.UNCENSORED,
    label: "tiers.content.uncensored",
    icon: "shield-off",
    description: "tiers.content.uncensoredDesc",
  },
];

export const SPEED_DISPLAY: TierDisplayConfig<typeof SpeedLevelValue>[] = [
  {
    value: SpeedLevel.FAST,
    label: "tiers.speed.fast",
    icon: "zap",
    description: "tiers.speed.fastDesc",
  },
  {
    value: SpeedLevel.BALANCED,
    label: "tiers.speed.balanced",
    icon: "scale",
    description: "tiers.speed.balancedDesc",
  },
  {
    value: SpeedLevel.THOROUGH,
    label: "tiers.speed.thorough",
    icon: "microscope",
    description: "tiers.speed.thoroughDesc",
  },
];

/**
 * Skill Category Enum
 * User-facing task categories for skills
 */
export const {
  enum: SkillCategory,
  options: SkillCategoryOptions,
  Value: SkillCategoryValue,
} = createEnumOptions(scopedTranslation, {
  COMPANION: "enums.category.companion",
  ASSISTANT: "enums.category.assistant",
  CODING: "enums.category.coding",
  CREATIVE: "enums.category.creative",
  WRITING: "enums.category.writing",
  ANALYSIS: "enums.category.analysis",
  ROLEPLAY: "enums.category.roleplay",
  EDUCATION: "enums.category.education",
  CONTROVERSIAL: "enums.category.controversial",
});

/**
 * Database enum array for Drizzle
 */
export const SkillCategoryDB = [
  SkillCategory.COMPANION,
  SkillCategory.ASSISTANT,
  SkillCategory.CODING,
  SkillCategory.CREATIVE,
  SkillCategory.WRITING,
  SkillCategory.ANALYSIS,
  SkillCategory.ROLEPLAY,
  SkillCategory.EDUCATION,
  SkillCategory.CONTROVERSIAL,
] as const;

/**
 * Skill Type Enum
 * Drives runtime behavior — separate axis from category (which is for display/discovery)
 */
export const {
  enum: SkillType,
  options: SkillTypeOptions,
  Value: SkillTypeValue,
} = createEnumOptions(scopedTranslation, {
  PERSONA: "enums.skillType.persona",
  SPECIALIST: "enums.skillType.specialist",
  TOOL_BUNDLE: "enums.skillType.toolBundle",
});

export const SkillTypeDB = [
  SkillType.PERSONA,
  SkillType.SPECIALIST,
  SkillType.TOOL_BUNDLE,
] as const;

/**
 * Skill Status Enum
 * Publishing workflow: DRAFT = private, PUBLISHED = in public store, UNLISTED = link-only
 */
export const {
  enum: SkillStatus,
  options: SkillStatusOptions,
  Value: SkillStatusValue,
} = createEnumOptions(scopedTranslation, {
  DRAFT: "enums.skillStatus.draft",
  PUBLISHED: "enums.skillStatus.published",
  UNLISTED: "enums.skillStatus.unlisted",
});

export const SkillStatusDB = [
  SkillStatus.DRAFT,
  SkillStatus.PUBLISHED,
  SkillStatus.UNLISTED,
] as const;

/**
 * Skill Ownership Type Enum
 * Who owns/controls the skill
 */
export const {
  enum: SkillOwnershipType,
  options: SkillOwnershipTypeOptions,
  Value: SkillOwnershipTypeValue,
} = createEnumOptions(scopedTranslation, {
  SYSTEM: "enums.ownershipType.system",
  USER: "enums.ownershipType.user",
  PUBLIC: "enums.ownershipType.public",
});

/**
 * Database enum array for Drizzle
 */
export const SkillOwnershipTypeDB = [
  SkillOwnershipType.SYSTEM,
  SkillOwnershipType.USER,
  SkillOwnershipType.PUBLIC,
] as const;

/**
 * Skill Trust Level Enum
 * Reactive trust model: COMMUNITY → VERIFIED (auto-upgraded at vote threshold)
 * SYSTEM skills are always considered trusted (not stored in DB)
 */
export const {
  enum: SkillTrustLevel,
  options: SkillTrustLevelOptions,
  Value: SkillTrustLevelValue,
} = createEnumOptions(scopedTranslation, {
  COMMUNITY: "enums.trustLevel.community",
  VERIFIED: "enums.trustLevel.verified",
});

export const SkillTrustLevelDB = [
  SkillTrustLevel.COMMUNITY,
  SkillTrustLevel.VERIFIED,
] as const;

/**
 * Category configuration with icons and task mapping
 */
export interface CategoryConfig {
  category: typeof SkillCategoryValue;
  label: typeof SkillCategoryValue; // Translation key (same as category)
  icon: IconKey;
  task: typeof ModelUtilityValue;
  order: number;
}

/**
 * Centralized category configuration
 * Maps each category to its icon and primary task utility
 */
export const CATEGORY_CONFIG = {
  [SkillCategory.COMPANION]: {
    category: SkillCategory.COMPANION,
    icon: "heart" as const,
    task: ModelUtility.CHAT,
    order: 0,
  },
  [SkillCategory.ASSISTANT]: {
    category: SkillCategory.ASSISTANT,
    icon: "robot-face" as const,
    task: ModelUtility.CHAT,
    order: 1,
  },
  [SkillCategory.CODING]: {
    category: SkillCategory.CODING,
    icon: "code" as const,
    task: ModelUtility.CODING,
    order: 2,
  },
  [SkillCategory.CREATIVE]: {
    category: SkillCategory.CREATIVE,
    icon: "artist-palette" as const,
    task: ModelUtility.CREATIVE,
    order: 4,
  },
  [SkillCategory.WRITING]: {
    category: SkillCategory.WRITING,
    icon: "pen-tool" as const,
    task: ModelUtility.CREATIVE,
    order: 3,
  },
  [SkillCategory.ANALYSIS]: {
    category: SkillCategory.ANALYSIS,
    icon: "magnifying-glass-icon" as const,
    task: ModelUtility.ANALYSIS,
    order: 5,
  },
  [SkillCategory.ROLEPLAY]: {
    category: SkillCategory.ROLEPLAY,
    icon: "game-controller" as const,
    task: ModelUtility.ROLEPLAY,
    order: 7,
  },
  [SkillCategory.EDUCATION]: {
    category: SkillCategory.EDUCATION,
    icon: "books" as const,
    task: ModelUtility.REASONING,
    order: 6,
  },
  [SkillCategory.CONTROVERSIAL]: {
    category: SkillCategory.CONTROVERSIAL,
    icon: "fire" as const,
    task: ModelUtility.CHAT,
    order: 8,
  },
} as const;

/**
 * Category options with icons for UI
 * Generated from centralized category configuration
 */
export const CategoryOptions = SkillCategoryOptions.map((option) => {
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
  category: typeof SkillCategoryValue,
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
export const MODEL_UTILITIES = {
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
