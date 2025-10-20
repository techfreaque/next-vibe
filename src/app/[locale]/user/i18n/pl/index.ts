import { translations as componentsTranslations } from "../../_components/i18n/pl";
import { translations as otherTranslations } from "../../(other)/i18n/pl";
import { translations as authTranslations } from "../../auth/i18n/pl";
import { translations as signupTranslations } from "../../signup/i18n/pl";
import { translations as userTranslations } from "../../user/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  auth: authTranslations,
  components: componentsTranslations,
  other: otherTranslations,
  signup: signupTranslations,
  user: userTranslations,
  common: {
    appName: "Next Vibe",
    backToHome: "Powrót do strony głównej",
    loading: "Ładowanie...",
    error: {
      title: "Błąd",
    },
    footer: {
      copyright: "© 2024 Next Vibe. Wszelkie prawa zastrzeżone.",
      terms: "Warunki korzystania z usługi",
    },
  },
  meta: {
    profile: {
      title: "Profil użytkownika - Next Vibe",
      description: "Zarządzaj swoim kontem Next Vibe i preferencjami",
      category: "Konto użytkownika",
      imageAlt: "Profil użytkownika",
      keywords: "profil, konto, ustawienia, next vibe",
      ogTitle: "Twój profil Next Vibe",
      ogDescription: "Zarządzaj swoim kontem i preferencjami",
      twitterTitle: "Twój profil Next Vibe",
      twitterDescription: "Zarządzaj swoim kontem i preferencjami",
    },
  },
};
