import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type CampaignStatsTranslationKey = Parameters<
  ReturnType<typeof scopedTranslation.scopedT>["t"]
>[0];

export type CampaignStatsT = ReturnType<typeof scopedTranslation.scopedT>["t"];
