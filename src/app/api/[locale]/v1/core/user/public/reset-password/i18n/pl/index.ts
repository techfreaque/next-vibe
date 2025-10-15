import { translations as confirmTranslations } from "../../confirm/i18n/pl";
import { translations as requestTranslations } from "../../request/i18n/pl";
import { translations as validateTranslations } from "../../validate/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: confirmTranslations,
  request: requestTranslations,
  validate: validateTranslations,
};
