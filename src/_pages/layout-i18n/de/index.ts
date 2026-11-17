import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    defaultTitle: "unbottled.ai - Unzensierter KI-Chat",
    category: "KI-Chat-Plattform",
    description:
      "Erleben Sie wirklich unzensierte KI-Gespräche mit {{modelCount}} Modellen. Keine Filter, keine Einschränkungen, nur ehrliche KI.",
    imageAlt: "unbottled.ai - Unzensierte KI-Chat-Plattform",
    keywords:
      "unzensierte KI, KI-Chat, GPT-4, Claude, Gemini, KI-Modelle, keine Filter, ehrliche KI, KI-Gespräche",
  },
  structuredData: {
    app: {
      description:
        "KI-Chat mit {{modelCount}} Modellen von {{providerCount}} Laboren: Mainstream, offen und unzensiert. Du wählst die Filterstufe pro Chat. Bezahlt wird pro Nutzung mit Credits. Open Source und selbst hostbar.",
      freeOffer:
        "{{guest}} Gratis-Credits im Monat ohne Konto, {{signedIn}} mit kostenlosem Konto, {{max}} mit kostenlosem Konto und Newsletter. Keine Karte nötig.",
      yearlyName: "Jahresabo",
      yearlyDescription:
        "{{subCredits}} Credits pro Monat, jährliche Abrechnung",
    },
    pricing: {
      name: "{{appName}} Tarife und Credits",
      description:
        "Gratis-Credits jeden Monat, ein Abo oder ein einmaliges Credit-Paket. Ein Guthaben für {{modelCount}} Chat-Modelle plus Bild-, Video-, Musik- und Stimmmodelle.",
    },
    organization: {
      types: {
        organization: "Organisation",
        contactPoint: "Kontaktpunkt",
      },
      contactPoint: {
        contactType: "Kundendienst",
      },
    },
  },
  constants: {
    languages: {
      en: "Englisch",
      de: "Deutsch",
      pl: "Polnisch",
      fr: "Französisch",
    },
  },
};
