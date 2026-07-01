import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/tooling/generators/route-handlers/i18n/de").translations,
  pl: () =>
    require("next-vibe/tooling/generators/route-handlers/i18n/pl").translations,
});

export type GeneratorsRouteHandlersTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type GeneratorsRouteHandlersT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
