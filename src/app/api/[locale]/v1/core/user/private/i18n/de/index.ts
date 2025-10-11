import { translations as logoutTranslations } from "../../logout/i18n/de";
import { translations as meTranslations } from "../../me/i18n/de";
import { translations as sessionTranslations } from "../../session/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  logout: logoutTranslations,
  me: meTranslations,
  session: sessionTranslations,
};
