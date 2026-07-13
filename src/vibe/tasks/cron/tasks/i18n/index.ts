import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tasks/cron/tasks/i18n/de").translations,
  pl: () => require("next-vibe/tasks/cron/tasks/i18n/pl").translations,
});

export type CronTasksTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CronTasksT = ReturnType<typeof scopedTranslation.scopedT>["t"];
