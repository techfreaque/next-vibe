import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  appDescription:
    "KI-Plattform für freie Rede mit {{modelCount}} Modellen. Zensur nach deinen Regeln, Datenschutz von Grund auf.",
  framework: "NextVibe.dev",
  websiteUrl: "https://unbottled.ai",
  group: {
    name: "Unbottled.ai",
    legalStatus: "Privatperson, alleiniger Betreiber von unbottled.ai",
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
    linkedinUrl: "https://linkedin.com/company/unbottled",
    facebookUrl: "https://facebook.com/unbottled",
    instagramUrl: "https://instagram.com/unbottled",
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
