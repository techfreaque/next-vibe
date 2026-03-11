import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type BounceProcessorConfigTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type BounceProcessorConfigT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
