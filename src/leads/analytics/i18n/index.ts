import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

/**
 * Shared vocabulary of the lead analytics reports (acquisition, funnel, abuse)
 * and the lead list drill-down filters. Endpoints spread these translations at
 * the root of their own i18n so the shared field labels resolve in their scope.
 */
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

export type LeadAnalyticsTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type LeadAnalyticsT = ReturnType<typeof scopedTranslation.scopedT>["t"];
