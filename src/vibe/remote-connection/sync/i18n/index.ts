import { createScopedTranslation } from "../../../core/i18n/core/scoped-translation";
import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
  fr: () => require("./fr").translations,
});

export type RemoteSyncTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type RemoteSyncT = ReturnType<typeof scopedTranslation.scopedT>["t"];
