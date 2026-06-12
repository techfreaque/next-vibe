import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type PaymentDashboardTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type PaymentDashboardT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
