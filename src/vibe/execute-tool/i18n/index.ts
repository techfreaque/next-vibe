import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/execute-tool/i18n/de").translations,
  pl: () => require("next-vibe/execute-tool/i18n/pl").translations,
});

export type ExecuteToolTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ExecuteToolT = ReturnType<typeof scopedTranslation.scopedT>["t"];
