/**
 * Module Scoped Translation for Coding Agent
 */

import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type CodingAgentTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type CodingAgentT = ReturnType<typeof scopedTranslation.scopedT>["t"];
