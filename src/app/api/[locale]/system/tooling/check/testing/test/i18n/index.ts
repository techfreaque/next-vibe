import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/tooling/check/testing/test/i18n/de").translations,
  pl: () =>
    require("next-vibe/tooling/check/testing/test/i18n/pl").translations,
});

export type TestingTestTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type TestingTestT = ReturnType<typeof scopedTranslation.scopedT>["t"];
