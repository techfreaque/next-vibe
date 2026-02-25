/**
 * Module Scoped Translation for Claude Code
 *
 * Isolated translation function for the claude-code module.
 * Uses ONLY translations from the claude-code/i18n folder (en, de, pl).
 */

import { createScopedTranslation } from "@/i18n/core/scoped-translation";

import { translations as deTranslations } from "./de";
import { translations as enTranslations } from "./en";
import { translations as plTranslations } from "./pl";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: deTranslations,
  pl: plTranslations,
});

export type ClaudeCodeTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ClaudeCodeT = ReturnType<typeof scopedTranslation.scopedT>["t"];
