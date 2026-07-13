import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/server/server/i18n/de").translations,
  pl: () => require("next-vibe/server/server/i18n/pl").translations,
});

export type ServerTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ServerT = ReturnType<typeof scopedTranslation.scopedT>["t"];
