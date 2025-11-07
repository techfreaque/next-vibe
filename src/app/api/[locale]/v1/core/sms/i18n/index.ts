/**
 * SMS Module Scoped Translation
 *
 * This module provides an isolated translation function for the SMS module.
 * It ONLY uses translations from the sms/i18n folder (en, de, pl).
 * It does NOT access the global translation object.
 *
 * @example
 * import { simpleT } from "@/app/api/[locale]/v1/core/sms/i18n";
 *
 * const { t } = simpleT("en-GLOBAL");
 * t("sms.error.invalid_phone_format");
 * t("sms.error.delivery_failed", { phoneNumber: "+1234567890", error: "Network timeout" });
 */

import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as deTranslations } from "./de";
import { translations as enTranslations } from "./en";
import { translations as plTranslations } from "./pl";

// Create an isolated translation function that ONLY uses SMS module translations
// EN translations are used as the source of truth for type safety
export const simpleT = createScopedTranslation({
  en: enTranslations,
  de: deTranslations,
  pl: plTranslations,
});
