import type { statusTranslations as EnglishStatusTranslations } from "../../../../en/sections/onboardingErrors/status";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const statusTranslations: typeof EnglishStatusTranslations = {
  form: formTranslations,
  get: getTranslations,
};
