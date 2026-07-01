import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/database/i18n/de").translations,
  pl: () => require("next-vibe/database/i18n/pl").translations,
});

export type DbTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type DbT = ReturnType<typeof scopedTranslation.scopedT>["t"];
