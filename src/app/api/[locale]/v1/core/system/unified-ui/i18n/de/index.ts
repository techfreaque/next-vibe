import { translations as aiTranslations } from "../../ai/i18n/de";
import { translations as cliTranslations } from "../../cli/i18n/de";
import { translations as mcpTranslations } from "../../mcp/i18n/de";
import { translations as reactTranslations } from "../../react/i18n/de-index";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ai: aiTranslations,
  cli: cliTranslations,
  mcp: mcpTranslations,
  react: reactTranslations,
};
