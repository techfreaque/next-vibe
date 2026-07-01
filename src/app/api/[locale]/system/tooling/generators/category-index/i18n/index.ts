import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/tooling/generators/category-index/i18n/de").translations,
  pl: () =>
    require("next-vibe/tooling/generators/category-index/i18n/pl").translations,
});

export type GeneratorsCategoryIndexTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type GeneratorsCategoryIndexT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
