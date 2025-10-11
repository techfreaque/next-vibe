import type { formTranslations as EnglishFormTranslations } from "../../../../../en/sections/businessInfo/goals/form";
import { errorTranslations } from "./error";
import { fieldsTranslations } from "./fields";
import { getTranslations } from "./get";
import { optionsTranslations } from "./options";
import { sectionsTranslations } from "./sections";
import { submitTranslations } from "./submit";
import { successTranslations } from "./success";
import { validationTranslations } from "./validation";

export const formTranslations: typeof EnglishFormTranslations = {
  error: errorTranslations,
  fields: fieldsTranslations,
  get: getTranslations,
  options: optionsTranslations,
  sections: sectionsTranslations,
  submit: submitTranslations,
  success: successTranslations,
  validation: validationTranslations,
  title: "Geschäftsziele & Objektive",
  description:
    "Definieren Sie Ihre Geschäftsziele, um uns zu helfen, eine zielgerichtete Strategie für Ihren Erfolg zu erstellen.",
};
