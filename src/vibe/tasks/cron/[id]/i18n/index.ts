import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tasks/cron/[id]/i18n/de").translations,
  pl: () => require("next-vibe/tasks/cron/[id]/i18n/pl").translations,
});

export type CronIdTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CronIdT = ReturnType<typeof scopedTranslation.scopedT>["t"];
