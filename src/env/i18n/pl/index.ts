import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  appDescription:
    "Platforma AI dla wolności słowa z {{modelCount}} modelami. Ty decydujesz o cenzurze, prywatność od podstaw.",
  framework: "NextVibe.dev",
  websiteUrl: "https://unbottled.ai",
  group: {
    name: "Unbottled.ai",
    foundedYear: 2024,
    address: {
      title: "Adres",
      street: "Bachstrasse 1",
      city: "84359 Simbach am Inn",
      country: "Niemcy",
      addressIn1Line: "Bachstrasse 1, 84359 Simbach am Inn, Niemcy",
    },
    responsiblePerson: {
      name: "Marcus Brandstätter",
    },
    contact: {
      title: "Kontakt",
      description:
        "Jeśli masz pytania dotyczące tej Polityki prywatności, napisz do nas na adres",
      content:
        "Jeśli masz pytania dotyczące tych Warunków korzystania z usługi, napisz do nas na adres",
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
    title: "Coś poszło nie tak",
    message: "Wystąpił nieoczekiwany błąd. Odśwież stronę.",
    tryAgain: "Spróbuj ponownie",
    description:
      "Spróbuj jeszcze raz albo napisz do supportu, jeśli problem nie znika.",
  },
  countries: {
    ...regionalCountryNames("pl"),
    global: "Globalnie",
    de: "Niemcy",
    pl: "Polska",
    fr: "Francja",
    us: "Stany Zjednoczone",
    it: "Włochy",
    es: "Hiszpania",
  },
  languages: {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
    fr: "Francuski",
    it: "Włoski",
    es: "Hiszpański",
  },
};
