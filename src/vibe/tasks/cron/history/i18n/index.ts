import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tasks/cron/history/i18n/de").translations,
  pl: () => require("next-vibe/tasks/cron/history/i18n/pl").translations,
});

export type CronHistoryTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CronHistoryT = ReturnType<typeof scopedTranslation.scopedT>["t"];
