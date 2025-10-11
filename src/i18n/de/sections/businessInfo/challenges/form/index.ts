import type { formTranslations as EnglishFormTranslations } from "../../../../../en/sections/businessInfo/challenges/form";
import { categoriesTranslations } from "./categories";
import { constraintsTranslations } from "./constraints";
import { currentTranslations } from "./current";
import { errorTranslations } from "./error";
import { fieldsTranslations } from "./fields";
import { getTranslations } from "./get";
import { impactTranslations } from "./impact";
import { sectionsTranslations } from "./sections";
import { submitTranslations } from "./submit";
import { successTranslations } from "./success";
import { supportTranslations } from "./support";
import { validationTranslations } from "./validation";

export const formTranslations: typeof EnglishFormTranslations = {
  categories: categoriesTranslations,
  constraints: constraintsTranslations,
  current: currentTranslations,
  error: errorTranslations,
  fields: fieldsTranslations,
  get: getTranslations,
  impact: impactTranslations,
  sections: sectionsTranslations,
  submit: submitTranslations,
  success: successTranslations,
  support: supportTranslations,
  validation: validationTranslations,
  title: "Geschäftliche Herausforderungen",
  description:
    "Identifizieren Sie aktuelle Hindernisse und Bereiche, in denen Sie Unterstützung benötigen Sie.",
};
