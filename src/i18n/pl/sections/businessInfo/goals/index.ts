import type { goalsTranslations as EnglishGoalsTranslations } from "../../../../en/sections/businessInfo/goals";
import { completionTranslations } from "./completion";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const goalsTranslations: typeof EnglishGoalsTranslations = {
  completion: completionTranslations,
  form: formTranslations,
  get: getTranslations,
  title: "Cele biznesowe",
  description: "Zdefiniuj swoje cele biznesowe i strategię rozwoju.",
};
