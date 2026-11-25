import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
  fr: () => require("./fr").translations,
  it: () => require("./it").translations,
  sk: () => require("./sk").translations,
  es: () => require("./es").translations,
});

export type InvoiceListTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type InvoiceListT = ReturnType<typeof scopedTranslation.scopedT>["t"];
