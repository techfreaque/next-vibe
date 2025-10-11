import { translations as idTranslations } from "../../[id]/i18n/de";
import { translations as newTranslations } from "../../new/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  new: newTranslations,
};
