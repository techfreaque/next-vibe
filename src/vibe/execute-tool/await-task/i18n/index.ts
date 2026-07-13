import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/execute-tool/await-task/i18n/de").translations,
  pl: () => require("next-vibe/execute-tool/await-task/i18n/pl").translations,
});

export type AwaitTaskTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type AwaitTaskT = ReturnType<typeof scopedTranslation.scopedT>["t"];
