import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type CreatorTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CreatorT = ReturnType<typeof scopedTranslation.scopedT>["t"];
