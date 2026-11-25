import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  appDescription:
    "AI platforma pre slobodu prejavu s {{modelCount}} modelmi. O filtrovaní rozhoduješ ty. Súkromie chránime už pri návrhu služby.",
  framework: "NextVibe.dev",
  websiteUrl: "https://unbottled.ai",
  group: {
    name: "Unbottled.ai",
    foundedYear: 2024,
    address: {
      title: "Adresa",
      street: "Bachstrasse 1",
      city: "84359 Simbach am Inn",
      country: "Nemecko",
      addressIn1Line: "Bachstrasse 1, 84359 Simbach am Inn, Nemecko",
    },
    responsiblePerson: {
      name: "Marcus Brandstätter",
    },
    contact: {
      title: "Kontakt",
      description:
        "S otázkami o týchto zásadách ochrany osobných údajov sa na nás obráťte na adrese",
      content:
        "S otázkami o týchto podmienkach používania sa na nás obráťte na adrese",
    },
  },
  emails: {
    support: "hi@unbottled.ai",
  },
  services: {
    supportLevel: "Podpora 24/7",
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
    SK: "Europe/Bratislava",
    US: "America/New_York",
    GLOBAL: "UTC",
  },
  error: {
    title: "Niečo sa pokazilo",
    message: "Nastala neočakávaná chyba. Prosím, obnovte stránku.",
    tryAgain: "Skúsiť znova",
    description: "Skúste znova. Ak problém pretrváva, obráťte sa na podporu.",
  },
  countries: {
    ...regionalCountryNames("sk"),
    global: "Celosvetové",
    de: "Nemecko",
    pl: "Poľsko",
    fr: "Francúzsko",
    us: "Spojené štáty",
    it: "Taliansko",
    es: "Španielsko",
  },
  languages: {
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    fr: "Francúzština",
    it: "Taliančina",
    es: "Španielčina",
    sk: "Slovenčina",
  },
};
