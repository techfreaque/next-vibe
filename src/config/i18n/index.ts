import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const configScopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});
export type ConfigTranslationKey =
  (typeof configScopedTranslation)["ScopedTranslationKey"];

export type ConfigT = ReturnType<typeof configScopedTranslation.scopedT>["t"];
