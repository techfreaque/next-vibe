import { translations as endpointsTranslations } from "../../endpoints/i18n/pl";
import { translations as generateAllTranslations } from "../../generate-all/i18n/pl";
import { translations as generateTrpcRouterTranslations } from "../../generate-trpc-router/i18n/pl";
import { translations as seedsTranslations } from "../../seeds/i18n/pl";
import { translations as taskIndexTranslations } from "../../task-index/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatory",
  endpoints: endpointsTranslations,
  generateAll: generateAllTranslations,
  generateTrpcRouter: generateTrpcRouterTranslations,
  seeds: seedsTranslations,
  taskIndex: taskIndexTranslations,
};
