import { translations as aiTranslations } from "../../ai/i18n/pl";
import { translations as cliTranslations } from "../../cli/i18n/pl";
import { translations as mcpTranslations } from "../../mcp/i18n/pl";
import { translations as reactTranslations } from "../../react/i18n/pl-index";
import { translations as reactNativeTranslations } from "../../react-native/i18n/pl";
import { translations as tasksTranslations } from "../../tasks/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ai: aiTranslations,
  cli: cliTranslations,
  mcp: mcpTranslations,
  react: reactTranslations,
  reactNative: reactNativeTranslations,
  tasks: tasksTranslations,
};
