import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "../../../i18n/en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("../../../i18n/de").translations,
  pl: () => require("../../../i18n/pl").translations,
});

export type DeployPreviewTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type DeployPreviewT = ReturnType<typeof scopedTranslation.scopedT>["t"];
