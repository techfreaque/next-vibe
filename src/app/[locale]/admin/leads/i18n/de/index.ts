import type { translations as enTranslations } from "../en";
import { translations as leadsTranslations } from "./leads";
import { translations as leadsErrorsTranslations } from "./leadsErrors";

export const translations: typeof enTranslations = {
  leads: leadsTranslations,
  leadsErrors: leadsErrorsTranslations,
};
