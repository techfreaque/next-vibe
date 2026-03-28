/**
 * SMS Module Scoped Translation
 *
 * This module provides an isolated translation function for the SMS module.
 * It ONLY uses translations from the sms/i18n folder (en, de, pl).
 * It does NOT access the global translation object.
 *
 * @example
 * import { smsScopedT } from "@/app/api/[locale]/sms/i18n";
 *
 * const { t } = smsScopedT(locale);
 * t("sms.error.invalid_phone_format");
 * t("sms.error.delivery_failed", { phoneNumber: "+1234567890", error: "Network timeout" });
 */

import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

// Create an isolated translation function that ONLY uses SMS module translations
// EN translations are used as the source of truth for type safety
export const { scopedT: smsScopedT, ScopedTranslationKey: SmsTranslationKey } =
  createScopedTranslation({
    en: enTranslations,
    de: () => require("./de").translations,
    pl: () => require("./pl").translations,
  });

export type SmsT = ReturnType<typeof smsScopedT>["t"];
