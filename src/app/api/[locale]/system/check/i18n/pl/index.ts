import { translations as lintTranslations } from "../../lint/i18n/pl";
import { translations as oxlintTranslations } from "../../oxlint/i18n/pl";
import { translations as typecheckTranslations } from "../../typecheck/i18n/pl";
import { translations as vibeCheckTranslations } from "../../vibe-check/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  oxlint: oxlintTranslations,
  lint: lintTranslations,
  typecheck: typecheckTranslations,
  vibeCheck: vibeCheckTranslations,
  codeQuality: {
    noIssues: "Nie znaleziono problemów z jakością kodu",
  },
};
