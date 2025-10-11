import type { journeysTranslations as EnglishJourneysTranslations } from "../../../../../en/sections/email/leads/journeys";
import { personalTranslations } from "./personal";
import { resultsTranslations } from "./results";
import { urgencyTranslations } from "./urgency";

export const journeysTranslations: typeof EnglishJourneysTranslations = {
  personal: personalTranslations,
  results: resultsTranslations,
  urgency: urgencyTranslations,
};
