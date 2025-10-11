import type { challengesTranslations as EnglishChallengesTranslations } from "../../../../en/sections/businessInfo/challenges";
import { completionTranslations } from "./completion";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const challengesTranslations: typeof EnglishChallengesTranslations = {
  completion: completionTranslations,
  form: formTranslations,
  get: getTranslations,
  title: "Geschäftliche Herausforderungen",
  description:
    "Identifizieren Sie aktuelle Hindernisse und Bereiche, in denen Sie Unterstützung benötigen Sie.",
};
