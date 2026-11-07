/**
 * Shared constants for form field widgets
 */

import type { RequiredFieldTheme } from "../../../_shared/field-config-types";

/**
 * Default theme for required fields. Plain fields by default — the tinted
 * "highlight" boxes are opt-in per field (`theme: { style: "highlight" }`).
 */
export const DEFAULT_THEME: RequiredFieldTheme = {
  style: "none",
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
