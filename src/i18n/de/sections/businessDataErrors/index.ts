import type { businessDataErrorsTranslations as EnglishBusinessDataErrorsTranslations } from "../../../en/sections/businessDataErrors";
import { businessDataTranslations } from "./businessData";
import { businessDataRootTranslations } from "./businessDataRoot";

export const translations: typeof EnglishBusinessDataErrorsTranslations = {
  businessData: businessDataTranslations,
  businessDataRoot: businessDataRootTranslations,
};
