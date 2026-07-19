import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type LeadsListTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type LeadsListT = ReturnType<typeof scopedTranslation.scopedT>["t"];
