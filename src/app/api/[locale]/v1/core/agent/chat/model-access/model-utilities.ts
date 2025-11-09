import {
  Code,
  FileText,
  Image,
  MessageSquare,
  Sparkles,
  Lightbulb,
  Zap,
} from 'next-vibe-ui/ui/icons';

import type { TranslationKey } from "@/i18n/core/static-types";

import type { IconComponent } from "./icons";

/**
 * Model utility categories for grouping models by use case
 */
export enum ModelUtility {
  UNCENSORED = "uncensored",
  CHAT = "chat",
  SMART = "smart",
  CODING = "coding",
  CREATIVE = "creative",
  ANALYSIS = "analysis",
  FAST = "fast",
  VISION = "vision",
  IMAGE_GEN = "imageGen",
}

export interface ModelUtilityConfig {
  id: ModelUtility;
  titleKey: TranslationKey;
  icon: IconComponent;
  order: number;
}

/**
 * Configuration for model utility categories
 * Used for grouping models by their primary use cases
 */
export const MODEL_UTILITIES: Record<ModelUtility, ModelUtilityConfig> = {
  [ModelUtility.UNCENSORED]: {
    id: ModelUtility.UNCENSORED,
    titleKey: "app.chat.modelUtilities.uncensored",
    icon: Image,
    order: 0,
  },
  [ModelUtility.FAST]: {
    id: ModelUtility.FAST,
    titleKey: "app.chat.modelUtilities.fast",
    icon: Zap,
    order: 1,
  },
  [ModelUtility.CHAT]: {
    id: ModelUtility.CHAT,
    titleKey: "app.chat.modelUtilities.chat",
    icon: MessageSquare,
    order: 2,
  },
  [ModelUtility.SMART]: {
    id: ModelUtility.SMART,
    titleKey: "app.chat.modelUtilities.smart",
    icon: Lightbulb,
    order: 3,
  },
  [ModelUtility.CODING]: {
    id: ModelUtility.CODING,
    titleKey: "app.chat.modelUtilities.coding",
    icon: Code,
    order: 4,
  },
  [ModelUtility.CREATIVE]: {
    id: ModelUtility.CREATIVE,
    titleKey: "app.chat.modelUtilities.creative",
    icon: Sparkles,
    order: 5,
  },
  [ModelUtility.ANALYSIS]: {
    id: ModelUtility.ANALYSIS,
    titleKey: "app.chat.modelUtilities.analysis",
    icon: FileText,
    order: 6,
  },
  [ModelUtility.VISION]: {
    id: ModelUtility.VISION,
    titleKey: "app.chat.modelUtilities.vision",
    icon: Image,
    order: 7,
  },
  [ModelUtility.IMAGE_GEN]: {
    id: ModelUtility.IMAGE_GEN,
    titleKey: "app.chat.modelUtilities.imageGen",
    icon: Image,
    order: 8,
  },
};

/**
 * Get utility config by ID
 */
export function getModelUtility(id: ModelUtility): ModelUtilityConfig {
  return MODEL_UTILITIES[id];
}

/**
 * Get all utilities sorted by order
 */
export function getAllUtilities(): ModelUtilityConfig[] {
  return Object.values(MODEL_UTILITIES).toSorted((a, b) => a.order - b.order);
}
