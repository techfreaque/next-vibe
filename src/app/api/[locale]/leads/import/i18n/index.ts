import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type LeadsImportTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type LeadsImportT = ReturnType<typeof scopedTranslation.scopedT>["t"];

// Aliases for backward-compatibility with import/ module consumers
export type ImportTranslationKey = LeadsImportTranslationKey;
export type ImportT = LeadsImportT;
