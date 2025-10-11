import type { translations as enTranslations } from "../en";

import { translations as confirmTranslations } from "../../confirm/i18n/de";
import { translations as requestTranslations } from "../../request/i18n/de";
import { translations as validateTranslations } from "../../validate/i18n/de";

export const translations: typeof enTranslations = {
  confirm: confirmTranslations,
  request: requestTranslations,
  validate: validateTranslations,
};
