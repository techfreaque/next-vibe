import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/database/seed/i18n/de").translations,
  pl: () => require("next-vibe/database/seed/i18n/pl").translations,
});

export type SeedTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type SeedT = ReturnType<typeof scopedTranslation.scopedT>["t"];
