/**
 * Module Scoped Translation for Claude Code
 *
 * Isolated translation function for the claude-code module.
 * Uses ONLY translations from the claude-code/i18n folder (en, de, pl).
 */

import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type ClaudeCodeTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ClaudeCodeT = ReturnType<typeof scopedTranslation.scopedT>["t"];
