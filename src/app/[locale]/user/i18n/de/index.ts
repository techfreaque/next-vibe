import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as otherTranslations } from "../../(other)/i18n/de";
import { translations as authTranslations } from "../../auth/i18n/de";
import { translations as signupTranslations } from "../../signup/i18n/de";
import { translations as userTranslations } from "../../user/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  auth: authTranslations,
  components: componentsTranslations,
  other: otherTranslations,
  signup: signupTranslations,
  user: userTranslations,
  common: {
    appName: "Next Vibe",
    backToHome: "Zurück zur Startseite",
    loading: "Laden...",
    error: {
      title: "Fehler",
    },
    footer: {
      copyright: "© 2024 Next Vibe. Alle Rechte vorbehalten.",
      terms: "Nutzungsbedingungen",
    },
  },
  meta: {
    profile: {
      title: "Benutzerprofil - Next Vibe",
      description: "Verwalten Sie Ihr Next Vibe Konto und Ihre Einstellungen",
      category: "Benutzerkonto",
      imageAlt: "Benutzerprofil",
      keywords: "profil, konto, einstellungen, next vibe",
      ogTitle: "Ihr Next Vibe Profil",
      ogDescription: "Verwalten Sie Ihr Konto und Ihre Einstellungen",
      twitterTitle: "Ihr Next Vibe Profil",
      twitterDescription: "Verwalten Sie Ihr Konto und Ihre Einstellungen",
    },
  },
};
