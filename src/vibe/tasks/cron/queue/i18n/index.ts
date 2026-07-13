import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tasks/cron/queue/i18n/de").translations,
  pl: () => require("next-vibe/tasks/cron/queue/i18n/pl").translations,
});

export type CronQueueTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CronQueueT = ReturnType<typeof scopedTranslation.scopedT>["t"];
