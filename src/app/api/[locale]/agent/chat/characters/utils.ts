/**
 * Character Utilities
 * Helper functions for character system
 */

import { ModelUtility, type ModelUtilityValue } from "@/app/api/[locale]/agent/models/enum";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";

import { CharacterCategory, type CharacterCategoryValue } from "./enum";

/**
 * Category configuration with icons and task mapping
 */
export interface CategoryConfig {
  category: typeof CharacterCategoryValue;
  label: typeof CharacterCategoryValue; // Translation key (same as category)
  icon: IconKey;
  task: typeof ModelUtilityValue;
}

/**
 * Centralized category configuration
 * Maps each category to its icon and primary task utility
 */
export const CATEGORY_CONFIG: Record<typeof CharacterCategoryValue, CategoryConfig> = {
  [CharacterCategory.COMPANION]: {
    category: CharacterCategory.COMPANION,
    label: CharacterCategory.COMPANION,
    icon: "heart",
    task: ModelUtility.CHAT,
  },
  [CharacterCategory.ASSISTANT]: {
    category: CharacterCategory.ASSISTANT,
    label: CharacterCategory.ASSISTANT,
    icon: "robot-face",
    task: ModelUtility.CHAT,
  },
  [CharacterCategory.CODING]: {
    category: CharacterCategory.CODING,
    label: CharacterCategory.CODING,
    icon: "code",
    task: ModelUtility.CODING,
  },
  [CharacterCategory.CREATIVE]: {
    category: CharacterCategory.CREATIVE,
    label: CharacterCategory.CREATIVE,
    icon: "artist-palette",
    task: ModelUtility.CREATIVE,
  },
  [CharacterCategory.WRITING]: {
    category: CharacterCategory.WRITING,
    label: CharacterCategory.WRITING,
    icon: "pen-tool",
    task: ModelUtility.CREATIVE,
  },
  [CharacterCategory.ANALYSIS]: {
    category: CharacterCategory.ANALYSIS,
    label: CharacterCategory.ANALYSIS,
    icon: "magnifying-glass-icon",
    task: ModelUtility.ANALYSIS,
  },
  [CharacterCategory.ROLEPLAY]: {
    category: CharacterCategory.ROLEPLAY,
    label: CharacterCategory.ROLEPLAY,
    icon: "game-controller",
    task: ModelUtility.ROLEPLAY,
  },
  [CharacterCategory.EDUCATION]: {
    category: CharacterCategory.EDUCATION,
    label: CharacterCategory.EDUCATION,
    icon: "books",
    task: ModelUtility.REASONING,
  },
  [CharacterCategory.CONTROVERSIAL]: {
    category: CharacterCategory.CONTROVERSIAL,
    label: CharacterCategory.CONTROVERSIAL,
    icon: "fire",
    task: ModelUtility.CHAT,
  },
  [CharacterCategory.CUSTOM]: {
    category: CharacterCategory.CUSTOM,
    label: CharacterCategory.CUSTOM,
    icon: "star",
    task: ModelUtility.CHAT,
  },
};

/**
 * Get the primary task utility for a category
 */
export function categoryToTask(category: typeof CharacterCategoryValue): typeof ModelUtilityValue {
  return CATEGORY_CONFIG[category].task;
}
