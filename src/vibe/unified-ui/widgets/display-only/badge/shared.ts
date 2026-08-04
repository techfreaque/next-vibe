/**
 * Badge Widget Shared Logic
 * Platform-agnostic data extraction and processing for badge widget
 */

import type z from "zod";

import type { TranslatedKeyType } from "../../../../core/i18n/core/scoped-translation";
import type { TParams } from "../../../../core/i18n/core/static-types";
import type { BadgeEnumOption, BadgeWidgetSchema } from "./types";

/**
 * Find matching enum option label for a value
 */
export function findEnumLabel<TKey extends string>(
  value: z.output<BadgeWidgetSchema>,
  enumOptions: BadgeEnumOption<TKey>[],
  t: (key: TKey, params?: TParams) => TranslatedKeyType,
): string | null {
  for (const option of enumOptions) {
    if (option.value === value) {
      return t(option.label);
    }
  }

  return null;
}
