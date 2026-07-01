import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/identity/attribution/i18n/de").translations,
  pl: () => require("next-vibe/identity/attribution/i18n/pl").translations,
});

export type IpMatchLinkingTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type IpMatchLinkingT = ReturnType<typeof scopedTranslation.scopedT>["t"];
