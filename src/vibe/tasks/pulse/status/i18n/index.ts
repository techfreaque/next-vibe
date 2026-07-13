import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tasks/pulse/status/i18n/de").translations,
  pl: () => require("next-vibe/tasks/pulse/status/i18n/pl").translations,
});

export type PulseStatusTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type PulseStatusT = ReturnType<typeof scopedTranslation.scopedT>["t"];
