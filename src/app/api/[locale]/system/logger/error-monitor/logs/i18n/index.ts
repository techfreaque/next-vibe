import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/logger/error-monitor/logs/i18n/de").translations,
  pl: () => require("next-vibe/logger/error-monitor/logs/i18n/pl").translations,
});

export type ErrorLogsTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ErrorLogsT = ReturnType<typeof scopedTranslation.scopedT>["t"];
