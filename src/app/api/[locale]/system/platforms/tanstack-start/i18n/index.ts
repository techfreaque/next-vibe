import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/platforms/tanstack-start/i18n/de").translations,
  pl: () => require("next-vibe/platforms/tanstack-start/i18n/pl").translations,
});

export type TanstackTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type TanstackT = ReturnType<typeof scopedTranslation.scopedT>["t"];
