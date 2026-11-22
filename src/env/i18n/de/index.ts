import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  appDescription:
    "KI-Plattform für freie Rede mit {{modelCount}} Modellen. Zensur nach deinen Regeln, Datenschutz von Grund auf.",
  framework: "NextVibe.dev",
  websiteUrl: "https://unbottled.ai",
  group: {
    name: "Unbottled.ai",
    foundedYear: 2024,
    address: {
      title: "Adresse",
      street: "Bachstrasse 1",
      city: "84359 Simbach am Inn",
      country: "Deutschland",
      addressIn1Line: "Bachstrasse 1, 84359 Simbach am Inn, Deutschland",
    },
    responsiblePerson: {
      name: "Marcus Brandstätter",
    },
    contact: {
      title: "Kontakt",
      description:
        "Bei Fragen zu dieser Datenschutzerklärung erreichen Sie uns unter",
      content:
        "Bei Fragen zu diesen Nutzungsbedingungen erreichen Sie uns unter",
    },
  },
  emails: {
    support: "hi@unbottled.ai",
  },
  services: {
    supportLevel: "24/7 Support",
  },
  social: {
    twitterHandle: "@unbottled_ai",
    twitterUrl: "https://twitter.com/unbottled_ai",
    discordInvite: "https://discord.gg/hBuA22SzkR",
  },
  timezone: {
    PL: "Europe/Warsaw",
    DE: "Europe/Berlin",
    FR: "Europe/Paris",
    IT: "Europe/Rome",
    ES: "Europe/Madrid",
    US: "America/New_York",
    GLOBAL: "UTC",
  },
  error: {
    title: "Etwas ist schiefgelaufen",
    message:
      "Ein unerwarteter Fehler ist aufgetreten. Bitte lade die Seite neu.",
    tryAgain: "Erneut versuchen",
    description:
      "Versuch es noch einmal oder schreib dem Support, wenn es weiter hakt.",
  },
  countries: {
    ...regionalCountryNames("de"),
    global: "Global",
    de: "Deutschland",
    pl: "Polen",
    fr: "Frankreich",
    us: "Vereinigte Staaten",
    it: "Italien",
    es: "Spanien",
  },
  languages: {
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
    fr: "Französisch",
    it: "Italienisch",
    es: "Spanisch",
  },
};
