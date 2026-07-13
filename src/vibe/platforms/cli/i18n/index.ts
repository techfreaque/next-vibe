import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/platforms/cli/i18n/de").translations,
  pl: () => require("next-vibe/platforms/cli/i18n/pl").translations,
});

export type CliTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CliT = ReturnType<typeof scopedTranslation.scopedT>["t"];
