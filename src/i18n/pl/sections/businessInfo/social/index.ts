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
  title: "Media Społecznościowe",
  description: "Zarządzaj swoją obecnością w mediach społecznościowych.",
  comingSoon: "Formularz mediów społecznościowych już wkrótce...",
  debugInfo: "ID użytkownika: {{userId}} | Lokalizacja: {{locale}}",
};
