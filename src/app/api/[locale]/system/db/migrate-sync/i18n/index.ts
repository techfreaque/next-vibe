import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as deTranslations } from "./de";
import { translations as enTranslations } from "./en";
import { translations as plTranslations } from "./pl";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: deTranslations,
  pl: plTranslations,
});

export type MigrateSyncTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type MigrateSyncT = ReturnType<typeof scopedTranslation.scopedT>["t"];
