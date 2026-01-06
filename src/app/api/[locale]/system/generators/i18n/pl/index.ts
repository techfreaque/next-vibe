import { translations as emailTemplatesTranslations } from "../../email-templates/i18n/pl";
import { translations as endpointTranslations } from "../../endpoint/i18n/pl";
import { translations as endpointsTranslations } from "../../endpoints/i18n/pl";
import { translations as endpointsIndexTranslations } from "../../endpoints-index/i18n/pl";
import { translations as generateAllTranslations } from "../../generate-all/i18n/pl";
import { translations as routeHandlersTranslations } from "../../route-handlers/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatory",
  emailTemplates: emailTemplatesTranslations,
  endpoint: endpointTranslations,
  endpoints: endpointsTranslations,
  endpointsIndex: endpointsIndexTranslations,
  generateAll: generateAllTranslations,
  "route-handlers": routeHandlersTranslations,
};
