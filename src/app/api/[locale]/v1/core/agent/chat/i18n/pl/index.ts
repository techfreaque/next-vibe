import { translations as aiStreamTranslations } from "../../ai-stream/i18n/pl";
import { translations as basicStreamTranslations } from "../../basic-stream/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  aiStream: aiStreamTranslations,
  basicStream: basicStreamTranslations,
};
