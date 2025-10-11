import type { competitorsTranslations as EnglishCompetitorsTranslations } from "../../../../en/sections/businessInfo/competitors";
import { completionTranslations } from "./completion";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const competitorsTranslations: typeof EnglishCompetitorsTranslations = {
  completion: completionTranslations,
  form: formTranslations,
  get: getTranslations,
  title: "Analiza Konkurencji",
  description: "Przeanalizuj swoją konkurencję i pozycję na rynku.",
};
