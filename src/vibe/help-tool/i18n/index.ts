import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/help-tool/i18n/de").translations,
  pl: () => require("next-vibe/help-tool/i18n/pl").translations,
});

export type HelpTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type HelpT = ReturnType<typeof scopedTranslation.scopedT>["t"];
