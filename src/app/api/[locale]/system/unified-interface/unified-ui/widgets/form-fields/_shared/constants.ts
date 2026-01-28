/**
 * Shared constants for form field widgets
 */

import type { RequiredFieldTheme } from "@/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types";

/**
 * Default theme for required fields
 */
export const DEFAULT_THEME: RequiredFieldTheme = {
  style: "highlight",
  showAllRequired: false,
  requiredColor: "blue",
  completedColor: "green",
};

/**
 * Prefix for option keys to ensure uniqueness
 */
export const OPTION_KEY_PREFIX = "option-";
