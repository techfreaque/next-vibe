import { translations as authTranslations } from "../../auth/i18n/pl";
import { translations as privateTranslations } from "../../private/i18n/pl";
import { translations as publicTranslations } from "../../public/i18n/pl";
import { translations as searchTranslations } from "../../search/i18n/pl";
import { translations as userRolesTranslations } from "../../user-roles/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  "category": "Zarządzanie Użytkownikami",
  "auth": authTranslations,
  "private": privateTranslations,
  "public": publicTranslations,
  "search": searchTranslations,
  "userRoles": userRolesTranslations,
  "profileVisibility": {
    public: "Publiczny",
    private: "Prywatny",
    contactsOnly: "Tylko kontakty",
  },
  "contactMethods": {
    email: "E-mail",
    phone: "Telefon",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  "theme": {
    light: "Jasny",
    dark: "Ciemny",
    system: "Systemowy",
  },
  "userDetailLevel": {
    minimal: "Minimalny",
    standard: "Standardowy",
    complete: "Pełny",
  },
  "language": {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
  },
  "timezone": {
    utc: "UTC",
    america_new_york: "Ameryka/Nowy_Jork",
    america_los_angeles: "Ameryka/Los_Angeles",
    europe_london: "Europa/Londyn",
    europe_berlin: "Europa/Berlin",
    europe_warsaw: "Europa/Warszawa",
    asia_tokyo: "Azja/Tokio",
    australia_sydney: "Australia/Sydney",
  },
  "errors": {
    emailAlreadyInUse: "Adres e-mail jest już używany",
  },
  "notifications": {
    profileUpdated: {
      title: "Profil zaktualizowany",
      description: "Twój profil został pomyślnie zaktualizowany",
    },
    updateFailed: {
      title: "Aktualizacja nie powiodła się",
      description: "Nie udało się zaktualizować profilu. Spróbuj ponownie.",
    },
  },
  "session-cleanup": {
    errors: {
      execution_failed: {
        title: "Wykonanie nie powiodło się",
        description: "Wykonanie czyszczenia sesji nie powiodło się",
      },
      invalid_batch_size: {
        title: "Nieprawidłowy rozmiar partii",
        description: "Parametr rozmiaru partii jest nieprawidłowy",
      },
      invalid_session_retention: {
        title: "Nieprawidłowe przechowywanie sesji",
        description: "Parametr przechowywania sesji jest nieprawidłowy",
      },
      invalid_token_retention: {
        title: "Nieprawidłowe przechowywanie tokenów",
        description: "Parametr przechowywania tokenów jest nieprawidłowy",
      },
      partial_failure: {
        title: "Częściowa awaria",
        description: "Czyszczenie sesji częściowo nie powiodło się",
      },
      validation_failed: {
        title: "Walidacja nie powiodła się",
        description: "Walidacja czyszczenia sesji nie powiodła się",
      },
      unknown_error: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas czyszczenia sesji",
      },
    },
  },
};
