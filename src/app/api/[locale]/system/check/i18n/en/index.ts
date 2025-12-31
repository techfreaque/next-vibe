import { translations as configCreateTranslations } from "../../config/create/i18n/en";
import { translations as lintTranslations } from "../../lint/i18n/en";
import { translations as oxlintTranslations } from "../../oxlint/i18n/en";
import { translations as testTranslations } from "../../testing/test/i18n/en";
import { translations as typecheckTranslations } from "../../typecheck/i18n/en";
import { translations as vibeCheckTranslations } from "../../vibe-check/i18n/en";

export const translations = {
  oxlint: oxlintTranslations,
  lint: lintTranslations,
  testing: {
    test: testTranslations,
  },
  typecheck: typecheckTranslations,
  vibeCheck: vibeCheckTranslations,
  config: {
    create: configCreateTranslations,
  },
  codeQuality: {
    noIssues: "No code quality issues found",
  },
};
