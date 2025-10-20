import { translations as authTranslations } from "../../auth/i18n/pl";
import { translations as privateTranslations } from "../../private/i18n/pl";
import { translations as publicTranslations } from "../../public/i18n/pl";
import { translations as searchTranslations } from "../../search/i18n/pl";
import { translations as sessionCleanupTranslations } from "../../session-cleanup/i18n/pl";
import { translations as userRolesTranslations } from "../../user-roles/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  "category": "Zarządzanie Użytkownikami",
  "auth": authTranslations,
  "private": privateTranslations,
  "public": publicTranslations,
  "search": searchTranslations,
  "session-cleanup": sessionCleanupTranslations,
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
    locale_required: "Locale jest wymagane",
    auth_required: "Wymagana autoryzacja",
    auth_retrieval_failed: "Nie udało się pobrać autoryzacji",
    not_found: "Użytkownik nie znaleziony",
    roles_lookup_failed: "Nie udało się pobrać ról użytkownika",
    id_lookup_failed: "Nie udało się znaleźć użytkownika po ID",
    email_lookup_failed: "Nie udało się znaleźć użytkownika po e-mailu",
    email_check_failed: "Sprawdzenie e-maila nie powiodło się",
    email_duplicate_check_failed:
      "Sprawdzenie duplikatu e-maila nie powiodło się",
    search_failed: "Wyszukiwanie użytkowników nie powiodło się",
    email_already_in_use: "Adres e-mail jest już używany",
    creation_failed: "Nie udało się utworzyć użytkownika",
    no_data_returned: "Brak danych zwróconych z bazy danych",
    password_hashing_failed: "Hashowanie hasła nie powiodło się",
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
};
