/**
 * Module Scoped Translation
 *
 * Isolated translation function for the support module.
 * Uses translations from the support/i18n folder (en, de, pl).
 */

import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type SupportT = ReturnType<typeof scopedTranslation.scopedT>["t"];
