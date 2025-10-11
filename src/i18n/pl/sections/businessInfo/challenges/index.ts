import type { challengesTranslations as EnglishChallengesTranslations } from "../../../../en/sections/businessInfo/challenges";
import { completionTranslations } from "./completion";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const challengesTranslations: typeof EnglishChallengesTranslations = {
  completion: completionTranslations,
  form: formTranslations,
  get: getTranslations,
  title: "Wyzwania Biznesowe",
  description:
    "Zidentyfikuj główne wyzwania i przeszkody w Twojej działalności.",
};
