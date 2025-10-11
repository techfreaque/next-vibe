import type { translations as enTranslations } from "../en";

import { translations as journeysTranslations  } from "../../journeys/i18n/de";
import { translations as servicesTranslations  } from "../../services/i18n/de";
import { translations as testMailTranslations  } from "../../test-mail/i18n/de";

export const translations: typeof enTranslations = {
  journeys: journeysTranslations,
  services: servicesTranslations,
  testMail: testMailTranslations
} ;