import { translations as journeysTranslations } from "../../journeys/i18n/de";
import { translations as servicesTranslations } from "../../services/i18n/de";
import { translations as testMailTranslations } from "../../test-mail/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    logoPart1: "Next",
    logoPart2: "Vibe",
  },
  email: {
    template: {
      tagline: "Bessere Produkte schneller entwickeln",
    },
  },
  emailJourneys: {
    components: {
      footer: {
        copyright: "© 2024 {{config.appName}}. Alle Rechte vorbehalten.",
        helpText:
          "Bei Fragen kontaktieren Sie uns bitte unter {{config.emails.support}}",
        unsubscribeText: "Möchten Sie diese E-Mails nicht mehr erhalten?",
        unsubscribeLink: "Abmelden",
      },
      socialProof: {
        quotePrefix: "„",
        quoteSuffix: "201D",
        attribution: "— Kundenname, Unternehmen",
      },
    },
  },
  journeys: journeysTranslations,
  services: servicesTranslations,
  testMail: testMailTranslations,
};
