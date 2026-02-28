import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type ReactHooksTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ReactHooksT = ReturnType<typeof scopedTranslation.scopedT>["t"];
