import type { goalsTranslations as EnglishGoalsTranslations } from "../../../../en/sections/businessInfo/goals";
import { completionTranslations } from "./completion";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const goalsTranslations: typeof EnglishGoalsTranslations = {
  completion: completionTranslations,
  form: formTranslations,
  get: getTranslations,
  title: "Geschäftsziele",
  description:
    "Was sind Ihre primären Geschäftsziele? Wählen Sie alle zutreffenden aus.",
};
