import type { businessDataTranslations as EnglishBusinessDataTranslations } from "../../../../en/sections/businessDataErrors/businessData";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const businessDataTranslations: typeof EnglishBusinessDataTranslations =
  {
    form: formTranslations,
    get: getTranslations,
  };
