/**
 * Shared constants for form field widgets
 */

import type { RequiredFieldTheme } from "@/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types";

/**
 * Default theme for required fields
 */
export const DEFAULT_THEME: RequiredFieldTheme = {
  style: "highlight",
  showAllRequired: true,
  requiredColor: "blue",
  completedColor: "green",
  descriptionStyle: "tooltip",
  optionalColor: "none",
};

export function getTheme(
  theme: undefined | Partial<RequiredFieldTheme>,
): RequiredFieldTheme {
  return { ...DEFAULT_THEME, ...theme };
}

/**
 * Prefix for option keys to ensure uniqueness
 */
export const OPTION_KEY_PREFIX = "option-";
