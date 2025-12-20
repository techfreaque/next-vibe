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

import type { TranslationKey } from "@/i18n/core/static-types";

import { ModelUtility } from "../types";
import type { IconComponent } from "./icons";

export interface ModelUtilityConfig {
  id: ModelUtility;
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
export const MODEL_UTILITIES: Record<ModelUtility, ModelUtilityConfig> = {
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
