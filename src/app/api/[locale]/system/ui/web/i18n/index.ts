// oxlint-disable oxlint-plugin-boilerplate/i18n-pattern -- root UI package i18n, not an endpoint translation scope
import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const uiScopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/ui/i18n/de").translations,
  pl: () => require("next-vibe/ui/i18n/pl").translations,
});

export type UITranslationKey =
  (typeof uiScopedTranslation)["ScopedTranslationKey"];
export type UIT = ReturnType<typeof uiScopedTranslation.scopedT>["t"];
