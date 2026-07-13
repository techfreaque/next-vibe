import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tooling/check/config/i18n/de").translations,
  pl: () => require("next-vibe/tooling/check/config/i18n/pl").translations,
});

export type CheckConfigTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CheckConfigT = ReturnType<typeof scopedTranslation.scopedT>["t"];
