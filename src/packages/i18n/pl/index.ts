import type { translations as enTranslations } from "../en";
import { translations as nextVibeTranslations } from "../../next-vibe/i18n/pl";
import { translations as nextVibeUiTranslations } from "../../next-vibe-ui/i18n/pl";

export const translations: typeof enTranslations = {
  nextVibe: nextVibeTranslations,
  nextVibeUi: nextVibeUiTranslations,
};
