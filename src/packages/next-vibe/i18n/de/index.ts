import { translations as serverTranslations } from "../../server/i18n/de";
import { translations as sharedTranslations } from "../../shared/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  server: serverTranslations,
  shared: sharedTranslations,
};
