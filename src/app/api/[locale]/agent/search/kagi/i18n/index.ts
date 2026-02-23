import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as deTranslations } from "./de";
import { translations as enTranslations } from "./en";
import { translations as plTranslations } from "./pl";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: deTranslations,
  pl: plTranslations,
});

export type KagiTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type KagiT = ReturnType<typeof scopedTranslation.scopedT>["t"];
