import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  appDescription:
    "Piattaforma di IA per la libertà di espressione con {{modelCount}} modelli. Scegli tu il livello di censura. La tua privacy viene prima.",
  framework: "NextVibe.dev",
  websiteUrl: "https://unbottled.ai",
  group: {
    name: "Unbottled.ai",
    foundedYear: 2024,
    address: {
      title: "Indirizzo",
      street: "Bachstrasse 1",
      city: "84359 Simbach am Inn",
      country: "Germania",
      addressIn1Line: "Bachstrasse 1, 84359 Simbach am Inn, Germania",
    },
    responsiblePerson: {
      name: "Marcus Brandstätter",
    },
    contact: {
      title: "Contatti",
      description:
        "Per domande sulla nostra informativa sulla privacy, scrivici a",
      content: "Per domande sulle condizioni di servizio, scrivici a",
    },
  },
  emails: {
    support: "hi@unbottled.ai",
  },
  services: {
    supportLevel: "Assistenza 24 ore su 24, 7 giorni su 7",
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
    title: "Qualcosa è andato storto",
    message: "Si è verificato un errore imprevisto. Aggiorna la pagina.",
    tryAgain: "Riprova",
    description: "Riprova. Se il problema persiste, contatta l’assistenza.",
  },
  countries: {
    ...regionalCountryNames("it"),
    global: "Globale",
    de: "Germania",
    pl: "Polonia",
    fr: "Francia",
    us: "Stati Uniti",
    it: "Italia",
    es: "Spagna",
  },
  languages: {
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
    it: "Italiano",
    es: "Spagnolo",
    sk: "Slovacco",
  },
};
