import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/tooling/launchpad/i18n/de").translations,
  pl: () => require("next-vibe/tooling/launchpad/i18n/pl").translations,
});

export type LaunchpadTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type LaunchpadT = ReturnType<typeof scopedTranslation.scopedT>["t"];
