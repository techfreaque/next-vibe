import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/server/server/build/i18n/de").translations,
  pl: () => require("next-vibe/server/server/build/i18n/pl").translations,
});

export type ServerBuildTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ServerBuildT = ReturnType<typeof scopedTranslation.scopedT>["t"];
