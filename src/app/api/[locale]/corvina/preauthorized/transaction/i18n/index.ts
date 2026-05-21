import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type PreauthorizedTransactionTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type PreauthorizedTransactionT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
