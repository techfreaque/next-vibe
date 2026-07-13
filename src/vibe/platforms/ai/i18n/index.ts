import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/platforms/ai/i18n/de").translations,
  pl: () => require("next-vibe/platforms/ai/i18n/pl").translations,
});

export type AiTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type AiT = ReturnType<typeof scopedTranslation.scopedT>["t"];
