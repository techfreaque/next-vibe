import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/tooling/generators/generate-trpc-router/validation/i18n/de")
      .translations,
  pl: () =>
    require("next-vibe/tooling/generators/generate-trpc-router/validation/i18n/pl")
      .translations,
});

export type TrpcValidationTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type TrpcValidationT = ReturnType<typeof scopedTranslation.scopedT>["t"];
