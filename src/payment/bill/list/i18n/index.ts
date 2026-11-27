import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
  fr: () => require("./fr").translations,
  it: () => require("./it").translations,
  sk: () => require("./sk").translations,
  hi: () => require("./hi").translations,
  es: () => require("./es").translations,
});

export type BillListTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type BillListT = ReturnType<typeof scopedTranslation.scopedT>["t"];
