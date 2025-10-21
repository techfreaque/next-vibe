import { translations as nextVibeTranslations } from "../../next-vibe/i18n/de";
import { translations as nextVibeUiTranslations } from "../../next-vibe-ui/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nextVibe: nextVibeTranslations,
  nextVibeUi: nextVibeUiTranslations,
};
