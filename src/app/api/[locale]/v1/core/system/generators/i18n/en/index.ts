import { translations as endpointTranslations } from "../../endpoint/i18n/en";
import { translations as endpointsTranslations } from "../../endpoints/i18n/en";
import { translations as generateAllTranslations } from "../../generate-all/i18n/en";
import { translations as generateTrpcRouterTranslations } from "../../generate-trpc-router/i18n/en";
import { translations as routeHandlersTranslations } from "../../route-handlers/i18n/en";
import { translations as seedsTranslations } from "../../seeds/i18n/en";
import { translations as taskIndexTranslations } from "../../task-index/i18n/en";

export const translations = {
  category: "Generators",
  endpoint: endpointTranslations,
  endpoints: endpointsTranslations,
  generateAll: generateAllTranslations,
  generateTrpcRouter: generateTrpcRouterTranslations,
  "route-handlers": routeHandlersTranslations,  // Use kebab-case to match folder name
  seeds: seedsTranslations,
  taskIndex: taskIndexTranslations,
};
