import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tasks/unified-runner/i18n/de").translations,
  pl: () => require("next-vibe/tasks/unified-runner/i18n/pl").translations,
});

export type TasksUnifiedRunnerTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type TasksUnifiedRunnerT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
