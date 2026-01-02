import { translations as journeysTranslations } from "../../journeys/i18n/pl";
import { translations as servicesTranslations } from "../../services/i18n/pl";
import { translations as testMailTranslations } from "../../test-mail/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    logoPart1: "Next",
    logoPart2: "Vibe",
  },
  email: {
    template: {
      tagline: "Twórz lepsze produkty szybciej",
    },
  },
  emailJourneys: {
    components: {
      footer: {
        copyright: "© 2024 {{appName}}. Wszelkie prawa zastrzeżone.",
        helpText: "Jeśli masz pytania, skontaktuj się z nami pod adresem {{config.emails.support}}",
        unsubscribeText: "Nie chcesz otrzymywać tych wiadomości?",
        unsubscribeLink: "Wypisz się",
      },
      socialProof: {
        quotePrefix: "„",
        quoteSuffix: "201D",
        attribution: "— Imię klienta, Firma",
      },
    },
  },
  journeys: journeysTranslations,
  services: servicesTranslations,
  testMail: testMailTranslations,
};
