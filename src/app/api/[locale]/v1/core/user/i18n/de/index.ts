import { translations as authTranslations } from "../../auth/i18n/de";
import { translations as privateTranslations } from "../../private/i18n/de";
import { translations as publicTranslations } from "../../public/i18n/de";
import { translations as searchTranslations } from "../../search/i18n/de";
import { translations as sessionCleanupTranslations } from "../../session-cleanup/i18n/de";
import { translations as userRolesTranslations } from "../../user-roles/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzerverwaltung",
  auth: authTranslations,
  private: privateTranslations,
  public: publicTranslations,
  search: searchTranslations,
  "session-cleanup": sessionCleanupTranslations,
  userRoles: userRolesTranslations,
  profileVisibility: {
    public: "Öffentlich",
    private: "Privat",
    contactsOnly: "Nur Kontakte",
  },
  contactMethods: {
    email: "E-Mail",
    phone: "Telefon",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "Hell",
    dark: "Dunkel",
    system: "System",
  },
  userDetailLevel: {
    minimal: "Minimal",
    standard: "Standard",
    complete: "Vollständig",
  },
  language: {
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
  },
  timezone: {
    utc: "UTC",
    america_new_york: "Amerika/New_York",
    america_los_angeles: "Amerika/Los_Angeles",
    europe_london: "Europa/London",
    europe_berlin: "Europa/Berlin",
    europe_warsaw: "Europa/Warschau",
    asia_tokyo: "Asien/Tokio",
    australia_sydney: "Australien/Sydney",
  },
  errors: {
    emailAlreadyInUse: "E-Mail-Adresse wird bereits verwendet",
  },
  notifications: {
    profileUpdated: {
      title: "Profil aktualisiert",
      description: "Ihr Profil wurde erfolgreich aktualisiert",
    },
    updateFailed: {
      title: "Aktualisierung fehlgeschlagen",
      description:
        "Ihr Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.",
    },
  },
};
