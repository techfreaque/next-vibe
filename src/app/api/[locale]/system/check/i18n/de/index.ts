import { translations as lintTranslations } from "../../lint/i18n/de";
import { translations as oxlintTranslations } from "../../oxlint/i18n/de";
import { translations as typecheckTranslations } from "../../typecheck/i18n/de";
import { translations as vibeCheckTranslations } from "../../vibe-check/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  oxlint: oxlintTranslations,
  lint: lintTranslations,
  typecheck: typecheckTranslations,
  vibeCheck: vibeCheckTranslations,
  codeQuality: {
    noIssues: "Keine Codequalitätsprobleme gefunden",
  },
};
