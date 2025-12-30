import { translations as lintTranslations } from "../../lint/i18n/en";
import { translations as oxlintTranslations } from "../../oxlint/i18n/en";
import { translations as typecheckTranslations } from "../../typecheck/i18n/en";
import { translations as vibeCheckTranslations } from "../../vibe-check/i18n/en";

export const translations = {
  oxlint: oxlintTranslations,
  lint: lintTranslations,
  typecheck: typecheckTranslations,
  vibeCheck: vibeCheckTranslations,
  codeQuality: {
    noIssues: "No code quality issues found",
  },
};
