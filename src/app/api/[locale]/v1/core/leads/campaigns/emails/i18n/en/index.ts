import { translations as journeysTranslations } from "../../journeys/i18n/en";
import { translations as servicesTranslations } from "../../services/i18n/en";
import { translations as testMailTranslations } from "../../test-mail/i18n/en";

export const translations = {
  common: {
    logoPart1: "Next",
    logoPart2: "Vibe",
  },
  email: {
    template: {
      tagline: "Build better products faster",
    },
  },
  emailJourneys: {
    components: {
      footer: {
        copyright: "© 2024 NextVibe. All rights reserved.",
        helpText:
          "If you have any questions, please contact us at support@nextvibe.com",
        unsubscribeText: "Don't want to receive these emails?",
        unsubscribeLink: "Unsubscribe",
      },
      socialProof: {
        quotePrefix: "201C",
        quoteSuffix: "201D",
        attribution: "— Customer Name, Company",
      },
    },
  },
  journeys: journeysTranslations,
  services: servicesTranslations,
  testMail: testMailTranslations,
};
