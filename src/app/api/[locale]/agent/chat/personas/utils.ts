/**
 * Persona Utilities
 * Helper functions for persona system
 */

import type { IconKey } from "../model-access/icons";
import { ModelUtility } from "../types";
import { PersonaCategory, type PersonaCategoryValue } from "./enum";

/**
 * Category configuration with icons and task mapping
 */
export interface CategoryConfig {
  category: typeof PersonaCategoryValue;
  label: typeof PersonaCategoryValue; // Translation key (same as category)
  icon: IconKey;
  task: ModelUtility;
}

/**
 * Centralized category configuration
 * Maps each category to its icon and primary task utility
 */
export const CATEGORY_CONFIG: Record<
  typeof PersonaCategoryValue,
  CategoryConfig
> = {
  [PersonaCategory.COMPANION]: {
    category: PersonaCategory.COMPANION,
    label: PersonaCategory.COMPANION,
    icon: "heart",
    task: ModelUtility.CHAT,
  },
  [PersonaCategory.ASSISTANT]: {
    category: PersonaCategory.ASSISTANT,
    label: PersonaCategory.ASSISTANT,
    icon: "robot-face",
    task: ModelUtility.CHAT,
  },
  [PersonaCategory.CODING]: {
    category: PersonaCategory.CODING,
    label: PersonaCategory.CODING,
    icon: "code",
    task: ModelUtility.CODING,
  },
  [PersonaCategory.CREATIVE]: {
    category: PersonaCategory.CREATIVE,
    label: PersonaCategory.CREATIVE,
    icon: "artist-palette",
    task: ModelUtility.CREATIVE,
  },
  [PersonaCategory.WRITING]: {
    category: PersonaCategory.WRITING,
    label: PersonaCategory.WRITING,
    icon: "pen-tool",
    task: ModelUtility.CREATIVE,
  },
  [PersonaCategory.ANALYSIS]: {
    category: PersonaCategory.ANALYSIS,
    label: PersonaCategory.ANALYSIS,
    icon: "magnifying-glass-icon",
    task: ModelUtility.ANALYSIS,
  },
  [PersonaCategory.ROLEPLAY]: {
    category: PersonaCategory.ROLEPLAY,
    label: PersonaCategory.ROLEPLAY,
    icon: "game-controller",
    task: ModelUtility.ROLEPLAY,
  },
  [PersonaCategory.EDUCATION]: {
    category: PersonaCategory.EDUCATION,
    label: PersonaCategory.EDUCATION,
    icon: "books",
    task: ModelUtility.REASONING,
  },
  [PersonaCategory.CONTROVERSIAL]: {
    category: PersonaCategory.CONTROVERSIAL,
    label: PersonaCategory.CONTROVERSIAL,
    icon: "fire",
    task: ModelUtility.CHAT,
  },
  [PersonaCategory.CUSTOM]: {
    category: PersonaCategory.CUSTOM,
    label: PersonaCategory.CUSTOM,
    icon: "star",
    task: ModelUtility.CHAT,
  },
};

/**
 * Get the primary task utility for a category
 */
export function categoryToTask(
  category: typeof PersonaCategoryValue,
): ModelUtility {
  return CATEGORY_CONFIG[category].task;
}

