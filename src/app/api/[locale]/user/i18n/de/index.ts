import { translations as authTranslations } from "../../auth/i18n/de";
import { translations as userRolesTranslations } from "../../user-roles/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzerverwaltung",
  auth: authTranslations,
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
    locale_required: "Locale ist erforderlich",
    auth_required: "Authentifizierung ist erforderlich",
    auth_retrieval_failed: "Authentifizierung konnte nicht abgerufen werden",
    not_found: "Benutzer nicht gefunden",
    roles_lookup_failed: "Benutzerrollen konnten nicht abgerufen werden",
    roles_batch_fetch_failed: "Batch-Abruf der Benutzerrollen fehlgeschlagen",
    id_lookup_failed: "Benutzer konnte nicht über ID gefunden werden",
    email_lookup_failed: "Benutzer konnte nicht über E-Mail gefunden werden",
    email_check_failed: "E-Mail-Prüfung fehlgeschlagen",
    email_duplicate_check_failed: "Duplikat-E-Mail-Prüfung fehlgeschlagen",
    search_failed: "Benutzersuche fehlgeschlagen",
    email_already_in_use: "E-Mail-Adresse wird bereits verwendet",
    creation_failed: "Benutzer konnte nicht erstellt werden",
    no_data_returned: "Keine Daten von der Datenbank zurückgegeben",
    password_hashing_failed: "Passwort-Hashing fehlgeschlagen",
    not_implemented_on_native:
      "Diese Funktion ist in React Native nicht implementiert",
    count_failed: "Fehler beim Abrufen der Benutzeranzahl: {{error}}",
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
