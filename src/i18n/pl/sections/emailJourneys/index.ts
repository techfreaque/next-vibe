import type { emailJourneysTranslations as EnglishEmailJourneysTranslations } from "../../../en/sections/emailJourneys";
import { componentsTranslations } from "./components";
import { leadsTranslations } from "./leads";
import { servicesTranslations } from "./services";

export const emailJourneysTranslations: typeof EnglishEmailJourneysTranslations =
  {
    components: componentsTranslations,
    leads: leadsTranslations,
    services: servicesTranslations,
  };
