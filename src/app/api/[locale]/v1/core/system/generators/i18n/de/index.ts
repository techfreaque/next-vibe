import { translations as endpointsTranslations } from "../../endpoints/i18n/de";
import { translations as generateAllTranslations } from "../../generate-all/i18n/de";
import { translations as generateTrpcRouterTranslations } from "../../generate-trpc-router/i18n/de";
import { translations as seedsTranslations } from "../../seeds/i18n/de";
import { translations as taskIndexTranslations } from "../../task-index/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  endpoints: endpointsTranslations,
};
