import type { formTranslations as EnglishFormTranslations } from "../../../../../en/sections/businessInfo/audience/form";
import { errorTranslations } from "./error";
import { fieldsTranslations } from "./fields";
import { getTranslations } from "./get";
import { sectionsTranslations } from "./sections";
import { submitTranslations } from "./submit";
import { successTranslations } from "./success";
import { validationTranslations } from "./validation";

export const formTranslations: typeof EnglishFormTranslations = {
  error: errorTranslations,
  fields: fieldsTranslations,
  get: getTranslations,
  sections: sectionsTranslations,
  submit: submitTranslations,
  success: successTranslations,
  validation: validationTranslations,
  title: "Zielgruppe",
  description: "Definieren Sie Ihre idealen Kunden und Ihren Zielmarkt.",
};
