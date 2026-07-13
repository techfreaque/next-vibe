import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/server/server/rebuild/i18n/de").translations,
  pl: () => require("next-vibe/server/server/rebuild/i18n/pl").translations,
});

export type RebuildTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type RebuildT = ReturnType<typeof scopedTranslation.scopedT>["t"];
