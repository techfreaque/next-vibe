// oxlint-disable oxlint-plugin-boilerplate/i18n-pattern -- root UI package i18n, not an endpoint translation scope
import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const uiScopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type UITranslationKey =
  (typeof uiScopedTranslation)["ScopedTranslationKey"];
export type UIT = ReturnType<typeof uiScopedTranslation.scopedT>["t"];
