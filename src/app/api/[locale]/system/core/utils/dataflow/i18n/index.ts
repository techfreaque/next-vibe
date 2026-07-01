/**
 * Vibe Sense - Scoped Translation
 */

import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/core/utils/dataflow/i18n/de").translations,
  pl: () => require("next-vibe/core/utils/dataflow/i18n/pl").translations,
});

export type VibeSenseTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type VibeSenseT = ReturnType<typeof scopedTranslation.scopedT>["t"];
