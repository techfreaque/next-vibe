import { createScopedTranslation } from "../../../core/i18n/core/scoped-translation";
import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/ui/i18n/de").translations,
  pl: () => require("next-vibe/ui/i18n/pl").translations,
});

export type UITranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];
export type UIT = ReturnType<typeof scopedTranslation.scopedT>["t"];
