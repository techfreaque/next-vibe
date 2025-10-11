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
  title: "Cele biznesowe",
  description: "Zdefiniuj swoje cele biznesowe i strategię rozwoju.",
};
