import { translations as aiToolTranslations } from "../../ai-tool/i18n/de";
import { translations as cliTranslations } from "../../cli/i18n/de";
import { translations as reactTranslations } from "../../react/i18n/de";
import { translations as reactNativeTranslations } from "../../react-native/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  aiTool: aiToolTranslations,
  cli: cliTranslations,
  react: reactTranslations,
  reactNative: reactNativeTranslations,
};
