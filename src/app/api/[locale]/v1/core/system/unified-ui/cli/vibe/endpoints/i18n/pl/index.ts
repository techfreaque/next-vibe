import { translations as endpointHandlerTranslations } from "../../endpoint-handler/i18n/pl";
import { translations as renderersTranslations } from "../../renderers/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  endpointHandler: endpointHandlerTranslations,
  renderers: renderersTranslations,
};
