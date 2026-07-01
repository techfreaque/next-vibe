import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/env/settings/i18n/de").translations,
  pl: () => require("next-vibe/env/settings/i18n/pl").translations,
});

export type SystemSettingsTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type SystemSettingsT = ReturnType<typeof scopedTranslation.scopedT>["t"];
