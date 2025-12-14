import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as otherTranslations } from "../../(other)/i18n/de";
import { translations as referralTranslations } from "../../referral/i18n/de";
import { translations as signupTranslations } from "../../signup/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  referral: referralTranslations,
  components: componentsTranslations,
  other: otherTranslations,
  signup: signupTranslations,
  common: {
    appName: "Next Vibe",
    backToHome: "Zurück zur Startseite",
    loading: "Laden...",
    error: {
      title: "Fehler",
    },
    footer: {
      copyright: "© 2024 {{appName}}. Alle Rechte vorbehalten.",
      terms: "Nutzungsbedingungen",
    },
  },
  meta: {
    profile: {
      title: "Benutzerprofil - {{appName}}",
      description: "Verwalten Sie Ihr {{appName}} Konto und Ihre Einstellungen",
      category: "Benutzerkonto",
      imageAlt: "Benutzerprofil",
      keywords: "profil, konto, einstellungen, {{appName}}",
      ogTitle: "Ihr {{appName}} Profil",
      ogDescription: "Verwalten Sie Ihr Konto und Ihre Einstellungen",
      twitterTitle: "Ihr {{appName}} Profil",
      twitterDescription: "Verwalten Sie Ihr Konto und Ihre Einstellungen",
    },
  },
};
