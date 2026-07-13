import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tasks/cron/bulk/i18n/de").translations,
  pl: () => require("next-vibe/tasks/cron/bulk/i18n/pl").translations,
});

export type CronBulkTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CronBulkT = ReturnType<typeof scopedTranslation.scopedT>["t"];
