import { translations as setupTranslations } from "../../setup/i18n/pl";
import { translations as vibeTranslations } from "../../vibe/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  setup: setupTranslations,
  vibe: vibeTranslations,
};
