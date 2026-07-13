import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/server/server/health/i18n/de").translations,
  pl: () => require("next-vibe/server/server/health/i18n/pl").translations,
});

export type ServerHealthTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ServerHealthT = ReturnType<typeof scopedTranslation.scopedT>["t"];
