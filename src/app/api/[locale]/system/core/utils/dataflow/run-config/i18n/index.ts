import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/core/utils/dataflow/run-config/i18n/de").translations,
  pl: () =>
    require("next-vibe/core/utils/dataflow/run-config/i18n/pl").translations,
});

export type VibeSenseRunConfigT = ReturnType<
  typeof scopedTranslation.scopedT
>["t"];
