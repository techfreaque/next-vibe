import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
  fr: () => require("./fr").translations,
  it: () => require("./it").translations,
  es: () => require("./es").translations,
  sk: () => require("./sk").translations,
  hi: () => require("./hi").translations,
});

export type WhopCatalogTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type WhopCatalogT = ReturnType<typeof scopedTranslation.scopedT>["t"];
