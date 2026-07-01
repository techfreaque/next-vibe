import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/tooling/generators/prompt-fragments/i18n/de")
      .translations,
  pl: () =>
    require("next-vibe/tooling/generators/prompt-fragments/i18n/pl")
      .translations,
});

export type GeneratorsPromptFragmentsTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type GeneratorsPromptFragmentsT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
