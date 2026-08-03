// oxlint-disable oxlint-plugin-boilerplate/i18n-pattern -- framework-owned i18n scope, not a scoped translation file
import { createScopedTranslation } from "../core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type VibeTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];
