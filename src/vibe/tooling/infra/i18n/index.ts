import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tooling/infra/i18n/de").translations,
  pl: () => require("next-vibe/tooling/infra/i18n/pl").translations,
});

export type InfraTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type InfraT = ReturnType<typeof scopedTranslation.scopedT>["t"];
