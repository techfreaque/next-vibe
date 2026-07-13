import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/database/sql/i18n/de").translations,
  pl: () => require("next-vibe/database/sql/i18n/pl").translations,
});

export type SqlTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type SqlT = ReturnType<typeof scopedTranslation.scopedT>["t"];
