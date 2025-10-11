import type { audienceTranslations as EnglishAudienceTranslations } from "../../../../en/sections/businessInfo/audience";
import { completionTranslations } from "./completion";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const audienceTranslations: typeof EnglishAudienceTranslations = {
  completion: completionTranslations,
  form: formTranslations,
  get: getTranslations,
  title: "Zielgruppe",
  description: "Definieren Sie Ihre idealen Kunden und Ihren Zielmarkt.",
};
