import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/tooling/generators/email-templates/i18n/de")
      .translations,
  pl: () =>
    require("next-vibe/tooling/generators/email-templates/i18n/pl")
      .translations,
});

export type GeneratorsEmailTemplatesTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type GeneratorsEmailTemplatesT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
