import type { journeysTranslations as EnglishJourneysTranslations } from "../../../../../en/sections/emailJourneys/leads/journeys";
import { personalTranslations } from "./personal";
import { personalPracticalTranslations } from "./personalPractical";
import { personalResultsTranslations } from "./personalResults";
import { resultsTranslations } from "./results";

export const journeysTranslations: typeof EnglishJourneysTranslations = {
  personal: personalTranslations,
  personalPractical: personalPracticalTranslations,
  personalResults: personalResultsTranslations,
  results: resultsTranslations,
};
