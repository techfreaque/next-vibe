import type { businessTranslations as EnglishBusinessTranslations } from "../../../../en/sections/businessInfo/business";
import { completionTranslations } from "./completion";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const businessTranslations: typeof EnglishBusinessTranslations = {
  completion: completionTranslations,
  form: formTranslations,
  get: getTranslations,
  title: "Unternehmensinformationen",
  description:
    "Geben Sie Details über Ihr Unternehmen und Ihre Geschäftstätigkeit an.",
};
