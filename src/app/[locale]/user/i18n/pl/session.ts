import type { translations as EnglishSessionTranslations } from "../../en/session";

export const translations: typeof EnglishSessionTranslations = {
  errors: {
    session_not_found: "Sesja nie została znaleziona",
    expired: "Sesja wygasła",
    session_lookup_failed: "Nie udało się wyszukać sesji: {{error}}",
    expired_sessions_delete_failed:
      "Nie udało się usunąć wygasłych sesji: {{error}}",
    user_sessions_delete_failed:
      "Nie udało się usunąć sesji użytkownika: {{error}}",
    session_creation_failed: "Nie udało się utworzyć sesji",
    session_creation_database_error:
      "Błąd bazy danych podczas tworzenia sesji: {{error}}",
  },
};
