import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/identity/tracking/engagement/i18n/de").translations,
  pl: () =>
    require("next-vibe/identity/tracking/engagement/i18n/pl").translations,
});

export type TrackingEngagementTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type TrackingEngagementT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
