/**
 * Module Scoped Translation
 *
 * This module provides an isolated translation function for the SMS module.
 * It ONLY uses translations from the sms/i18n folder (en, de, pl).
 * It does NOT access the global translation object.
 *
 * @example
 * import { simpleT } from "@/app/api/[locale]/sms/i18n";
 *
 * const { t } = simpleT(locale);
 * t("sms.error.invalid_phone_format");
 * t("sms.error.delivery_failed", { phoneNumber: "+1234567890", error: "Network timeout" });
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
