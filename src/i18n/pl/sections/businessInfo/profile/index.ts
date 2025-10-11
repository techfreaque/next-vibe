import type { profileTranslations as EnglishProfileTranslations } from "../../../../en/sections/businessInfo/profile";
import { completionTranslations } from "./completion";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const profileTranslations: typeof EnglishProfileTranslations = {
  completion: completionTranslations,
  form: formTranslations,
  get: getTranslations,
  title: "Profil osobisty",
  description:
    "Zarządzaj swoimi danymi osobistymi i informacjami kontaktowymi.",
};
