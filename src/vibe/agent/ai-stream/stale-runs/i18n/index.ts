import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type StaleRunReaperTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type StaleRunReaperT = ReturnType<typeof scopedTranslation.scopedT>["t"];
