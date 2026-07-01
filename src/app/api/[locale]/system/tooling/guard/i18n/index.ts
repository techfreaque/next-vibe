import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tooling/guard/i18n/de").translations,
  pl: () => require("next-vibe/tooling/guard/i18n/pl").translations,
});

export type GuardTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type GuardT = ReturnType<typeof scopedTranslation.scopedT>["t"];
