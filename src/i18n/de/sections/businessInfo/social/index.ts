import type { socialTranslations as EnglishSocialTranslations } from "../../../../en/sections/businessInfo/social";
import { completionTranslations } from "./completion";
import { configurationTranslations } from "./configuration";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const socialTranslations: typeof EnglishSocialTranslations = {
  completion: completionTranslations,
  configuration: configurationTranslations,
  form: formTranslations,
  get: getTranslations,
  title: "Social-Media-Plattformen",
  description: "Konfiguriere Ihre Social-Media-Präsenz und -Strategie.",
  comingSoon: "Social-Media-Formular kommt bald...",
  debugInfo: "Benutzer-ID: {{userId}} | Sprache: {{locale}}",
};
