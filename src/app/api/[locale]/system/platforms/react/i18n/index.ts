import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/platforms/react/i18n/de").translations,
  pl: () => require("next-vibe/platforms/react/i18n/pl").translations,
});

export type ReactTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ReactT = ReturnType<typeof scopedTranslation.scopedT>["t"];
