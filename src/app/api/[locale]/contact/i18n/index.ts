/**
 * Module Scoped Translation
 *
 * This module provides an isolated translation function for the contact module.
 * It ONLY uses translations from the contact/i18n folder (en, de, pl).
 * It does NOT access the global translation object.
 *
 * @example
 * import { contactScopedT } from "@/app/api/[locale]/contact/i18n";
 *
 * const { t } = contactScopedT(locale);
 * t("contact.error.invalid_email");
 */

import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

// Create an isolated translation function that ONLY uses contact module translations
// EN translations are used as the source of truth for type safety
export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

// Export the scopedT function for backward compatibility
export const contactScopedT = scopedTranslation.scopedT;

// Export the translation key type using the helper
export type ContactTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ContactT = ReturnType<typeof scopedTranslation.scopedT>["t"];
