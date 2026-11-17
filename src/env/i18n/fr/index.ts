import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  appDescription:
    "Plateforme d'IA pour la liberté d'expression avec {{modelCount}} modèles. Vous choisissez votre niveau de censure, votre vie privée passe en premier.",
  framework: "NextVibe.dev",
  websiteUrl: "https://unbottled.ai",
  group: {
    name: "Unbottled.ai",
    foundedYear: 2024,
    address: {
      title: "Adresse",
      street: "Bachstrasse 1",
      city: "84359 Simbach am Inn",
      country: "Allemagne",
      addressIn1Line: "Bachstrasse 1, 84359 Simbach am Inn, Allemagne",
    },
    responsiblePerson: {
      name: "Marcus Brandstätter",
    },
    contact: {
      title: "Contact",
      description:
        "Pour toute question concernant cette politique de confidentialité, contactez-nous à l'adresse",
      content:
        "Pour toute question concernant ces conditions d'utilisation, contactez-nous à l'adresse",
    },
  },
  emails: {
    support: "hi@unbottled.ai",
  },
  services: {
    supportLevel: "Support 24h/24, 7j/7",
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
    US: "America/New_York",
    GLOBAL: "UTC",
  },
  selector: {
    country: "Pays",
    language: "Langue",
  },
  error: {
    title: "Une erreur est survenue",
    message:
      "Une erreur inattendue s'est produite. Veuillez actualiser la page.",
    tryAgain: "Réessayer",
    description:
      "Veuillez réessayer ou contacter le support si le problème persiste.",
  },
  countries: {
    global: "International",
    de: "Allemagne",
    pl: "Pologne",
    fr: "France",
    us: "États-Unis",
  },
  languages: {
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
  },
};
