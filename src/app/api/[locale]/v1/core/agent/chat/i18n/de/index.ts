import { translations as aiStreamTranslations } from "../../ai-stream/i18n/de";
import { translations as basicStreamTranslations } from "../../basic-stream/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  aiStream: aiStreamTranslations,
  basicStream: basicStreamTranslations,
};
