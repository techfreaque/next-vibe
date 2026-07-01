import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/platforms/next-app/i18n/de").translations,
  pl: () => require("next-vibe/platforms/next-app/i18n/pl").translations,
});

export type NextAppTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type NextAppT = ReturnType<typeof scopedTranslation.scopedT>["t"];
