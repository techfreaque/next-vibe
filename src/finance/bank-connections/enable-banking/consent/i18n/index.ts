import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  es: () => require("./es").translations,
  fr: () => require("./fr").translations,
  it: () => require("./it").translations,
  pl: () => require("./pl").translations,
  sk: () => require("./sk").translations,
});
