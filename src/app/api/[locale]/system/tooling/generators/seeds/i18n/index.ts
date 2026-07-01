import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tooling/generators/seeds/i18n/de").translations,
  pl: () => require("next-vibe/tooling/generators/seeds/i18n/pl").translations,
});

export type GeneratorsSeedsTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type GeneratorsSeedsT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
