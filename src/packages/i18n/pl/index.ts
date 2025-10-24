import { translations as nextVibeTranslations } from "../../next-vibe/i18n/pl";
import { translations as nextVibeUiTranslations } from "../../next-vibe-ui/i18n/pl";
import { translations as reactNativeCompTranslations } from "../../react-native-comp/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nextVibe: nextVibeTranslations,
  nextVibeUi: nextVibeUiTranslations,
  reactNativeComp: reactNativeCompTranslations,
};
