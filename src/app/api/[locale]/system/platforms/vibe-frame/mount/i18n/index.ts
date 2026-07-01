import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/platforms/vibe-frame/mount/i18n/de").translations,
  pl: () =>
    require("next-vibe/platforms/vibe-frame/mount/i18n/pl").translations,
});

export type VibeFrameMountTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type VibeFrameMountT = ReturnType<typeof scopedTranslation.scopedT>["t"];
