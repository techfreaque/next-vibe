import type { templateErrorsTranslations as EnglishTemplateErrorsTranslations } from "../../../en/sections/templateErrors";
import { templateTranslations } from "./template";
import { templateApiTranslations } from "./templateApi";
import { templateSubRouteTranslations } from "./templateSubRoute";

export const templateErrorsTranslations: typeof EnglishTemplateErrorsTranslations =
  {
    template: templateTranslations,
    templateApi: templateApiTranslations,
    templateSubRoute: templateSubRouteTranslations,
  };
