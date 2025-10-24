import { translations as aiToolTranslations } from "../../ai-tool/i18n/pl";
import { translations as cliTranslations } from "../../cli/i18n/pl";
import { translations as reactTranslations } from "../../react/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  aiTool: aiToolTranslations,
  cli: cliTranslations,
  react: reactTranslations,
};
