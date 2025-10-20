import type { translations as enTranslations } from "../en";
import { translations as webTranslations } from "../../web/i18n/de";

export const translations: typeof enTranslations = {
  web: webTranslations,
};
