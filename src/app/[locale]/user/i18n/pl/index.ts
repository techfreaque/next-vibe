import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  auth: {
    passwordStrength: {
      requirement: {
        minLength: {
          icon: "check",
          text: "Co najmniej 8 znaków",
        },
        lowercase: {
          icon: "check",
          text: "Zawiera małą literę",
        },
        uppercase: {
          icon: "check",
          text: "Zawiera wielką literę",
        },
        number: {
          icon: "check",
          text: "Zawiera cyfrę",
        },
        special: {
          icon: "check",
          text: "Zawiera znak specjalny",
        },
      },
    },
  },
  common: {
    appName: "Next Vibe",
    backToHome: "Powrót do strony głównej",
    loading: "Ładowanie...",
    error: {
      title: "Błąd",
    },
    footer: {
      copyright: "© 2024 {{appName}}. Wszelkie prawa zastrzeżone.",
      terms: "Warunki korzystania z usługi",
    },
  },
  meta: {
    profile: {
      title: "Profil użytkownika - {{appName}}",
      description: "Zarządzaj swoim kontem {{appName}} i preferencjami",
      category: "Konto użytkownika",
      imageAlt: "Profil użytkownika",
      keywords: "profil, konto, ustawienia, {{appName}}",
      ogTitle: "Twój profil {{appName}}",
      ogDescription: "Zarządzaj swoim kontem i preferencjami",
      twitterTitle: "Twój profil {{appName}}",
      twitterDescription: "Zarządzaj swoim kontem i preferencjami",
    },
  },
};
