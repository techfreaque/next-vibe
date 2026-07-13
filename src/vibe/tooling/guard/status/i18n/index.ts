import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tooling/guard/status/i18n/de").translations,
  pl: () => require("next-vibe/tooling/guard/status/i18n/pl").translations,
});

export type GuardStatusTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type GuardStatusT = ReturnType<typeof scopedTranslation.scopedT>["t"];
