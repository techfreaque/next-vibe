import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/core/setup/uninstall/i18n/de").translations,
  pl: () => require("next-vibe/core/setup/uninstall/i18n/pl").translations,
});

export type SetupUninstallTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type SetupUninstallT = ReturnType<typeof scopedTranslation.scopedT>["t"];
