import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  appDescription:
    "Plataforma de IA para la libertad de expresión con {{modelCount}} modelos. Tú decides el nivel de censura. Tu privacidad es lo primero.",
  framework: "NextVibe.dev",
  websiteUrl: "https://unbottled.ai",
  group: {
    name: "Unbottled.ai",
    foundedYear: 2024,
    address: {
      title: "Dirección",
      street: "Bachstrasse 1",
      city: "84359 Simbach am Inn",
      country: "Alemania",
      addressIn1Line: "Bachstrasse 1, 84359 Simbach am Inn, Alemania",
    },
    responsiblePerson: {
      name: "Marcus Brandstätter",
    },
    contact: {
      title: "Contacto",
      description:
        "Si tienes dudas sobre nuestra política de privacidad, escríbenos a",
      content:
        "Si tienes dudas sobre nuestras condiciones del servicio, escríbenos a",
    },
  },
  emails: {
    support: "hi@unbottled.ai",
  },
  services: {
    supportLevel: "Soporte las 24 horas, todos los días",
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
  selector: {
    country: "País",
    language: "Idioma",
  },
  error: {
    title: "Algo salió mal",
    message: "Ocurrió un error inesperado. Actualiza la página.",
    tryAgain: "Volver a intentar",
    description:
      "Vuelve a intentarlo. Si el problema continúa, contacta a soporte.",
  },
  countries: {
    ...regionalCountryNames("es"),
    global: "Global",
    de: "Alemania",
    pl: "Polonia",
    fr: "Francia",
    us: "Estados Unidos",
    it: "Italia",
    es: "España",
  },
  languages: {
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    fr: "Francés",
    it: "Italiano",
    es: "Español",
  },
};
