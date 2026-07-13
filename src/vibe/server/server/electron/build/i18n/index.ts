import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/server/server/electron/build/i18n/de").translations,
  pl: () => require("next-vibe/server/server/electron/build/i18n/pl").translations,
});

export type ElectronBuildTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ElectronBuildT = ReturnType<typeof scopedTranslation.scopedT>["t"];
