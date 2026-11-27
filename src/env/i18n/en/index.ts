import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

export const translations = {
  appName: "unbottled.ai",
  appDescription:
    "Free speech AI platform with {{modelCount}} models. User-controlled censorship and privacy-first design.",
  framework: "NextVibe.dev",
  websiteUrl: "https://unbottled.ai",
  group: {
    name: "Unbottled.ai",
    foundedYear: 2024,
    address: {
      title: "Address",
      street: "Bachstrasse 1",
      city: "84359 Simbach am Inn",
      country: "Germany",
      addressIn1Line: "Bachstrasse 1, 84359 Simbach am Inn, Germany",
    },
    responsiblePerson: {
      name: "Marcus Brandstätter",
    },
    contact: {
      title: "Contact",
      description:
        "If you have any questions about this Privacy Policy, please contact us at",
      content:
        "If you have any questions about these Terms of Service, please contact us at",
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
    SK: "Europe/Bratislava",
    US: "America/New_York",
    GLOBAL: "UTC",
  },
  error: {
    title: "Something went wrong",
    message: "An unexpected error occurred. Please refresh the page.",
    tryAgain: "Try Again",
    description: "Please try again or contact support if the problem persists.",
  },
  countries: {
    ...regionalCountryNames("en"),
    global: "Global",
    de: "Germany",
    pl: "Poland",
    fr: "France",
    us: "United States",
    it: "Italy",
    es: "Spain",
  },
  languages: {
    en: "English",
    de: "German",
    pl: "Polish",
    fr: "French",
    it: "Italian",
    es: "Spanish",
    sk: "Slovak",
    hi: "Hindi",
  },
};
