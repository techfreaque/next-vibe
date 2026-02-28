import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type IdRolesTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type IdRolesT = ReturnType<typeof scopedTranslation.scopedT>["t"];
