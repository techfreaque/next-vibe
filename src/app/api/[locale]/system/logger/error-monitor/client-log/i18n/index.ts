import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/logger/error-monitor/client-log/i18n/de").translations,
  pl: () =>
    require("next-vibe/logger/error-monitor/client-log/i18n/pl").translations,
});

export type ClientLogTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ClientLogT = ReturnType<typeof scopedTranslation.scopedT>["t"];
