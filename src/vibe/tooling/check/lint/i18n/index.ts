import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tooling/check/lint/i18n/de").translations,
  pl: () => require("next-vibe/tooling/check/lint/i18n/pl").translations,
});

export type CheckLintTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CheckLintT = ReturnType<typeof scopedTranslation.scopedT>["t"];
