/**
 * Favorites Enums
 * Type-safe enums for favorites with scoped i18n translation keys.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Variants Mode
 *
 * Per (user, companion) flag stored on every favorite row for that companion:
 * - ALL: the user holds (and wants) every variant of this companion. New
 *   variants introduced later are auto-added to this user.
 * - SOME: the user explicitly picked a subset. New variants are NOT auto-added.
 *
 * Logically per (user, skillId); physically mirrored onto each of that
 * companion's rows so a single-row read is self-describing. All rows for the
 * same (user, skillId) are kept consistent by the create/update paths.
 */
export const {
  enum: VariantsMode,
  options: VariantsModeOptions,
  Value: VariantsModeValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.variantsMode.all",
  SOME: "enums.variantsMode.some",
});

/** Database enum array for Drizzle - explicit, as const */
export const VariantsModeDB = [VariantsMode.ALL, VariantsMode.SOME] as const;
