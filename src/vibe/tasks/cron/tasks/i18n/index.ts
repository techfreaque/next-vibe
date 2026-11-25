import { createScopedTranslation } from "../../../../core/i18n/core/scoped-translation";
import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
  fr: () => require("./fr").translations,
  it: () => require("./it").translations,
  es: () => require("./es").translations,
  sk: () => require("./sk").translations,
});

export type CronTasksTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CronTasksT = ReturnType<typeof scopedTranslation.scopedT>["t"];
