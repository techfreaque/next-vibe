import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("next-vibe/identity/roles/i18n/de").translations,
  pl: () => require("next-vibe/identity/roles/i18n/pl").translations,
});

export type UserRoleTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type UserRoleT = ReturnType<typeof scopedTranslation.scopedT>["t"];
