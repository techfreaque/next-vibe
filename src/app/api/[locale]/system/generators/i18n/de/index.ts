import { translations as endpointTranslations } from "../../endpoint/i18n/de";
import { translations as endpointsTranslations } from "../../endpoints/i18n/de";
import { translations as endpointsIndexTranslations } from "../../endpoints-index/i18n/de";
import { translations as generateAllTranslations } from "../../generate-all/i18n/de";
import { translations as routeHandlersTranslations } from "../../route-handlers/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatoren",
  endpoint: endpointTranslations,
  endpoints: endpointsTranslations,
  endpointsIndex: endpointsIndexTranslations,
  generateAll: generateAllTranslations,
  "route-handlers": routeHandlersTranslations,
};
