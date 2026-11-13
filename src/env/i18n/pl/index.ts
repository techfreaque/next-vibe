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
    linkedinUrl: "https://linkedin.com/company/unbottled",
  },
  timezone: {
    PL: "Europe/Warsaw",
    DE: "Europe/Berlin",
    US: "America/New_York",
    GLOBAL: "UTC",
  },
  selector: {
    country: "Country",
    language: "Language",
  },
  error: {
    title: "Something went wrong",
    message: "An unexpected error occurred. Please refresh the page.",
    tryAgain: "Try Again",
    description: "Please try again or contact support if the problem persists.",
  },
  countries: {
    global: "Global",
    de: "Germany",
    pl: "Poland",
    us: "United States",
  },
  languages: {
    en: "English",
    de: "German",
    pl: "Polish",
  },
};
