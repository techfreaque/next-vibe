import type { translations as EnglishSessionTranslations } from "../../en/session";

export const translations: typeof EnglishSessionTranslations = {
  errors: {
    session_not_found: "Sitzung nicht gefunden",
    expired: "Sitzung ist abgelaufen",
    session_lookup_failed: "Sitzungssuche fehlgeschlagen: {{error}}",
    expired_sessions_delete_failed:
      "Löschen abgelaufener Sitzungen fehlgeschlagen: {{error}}",
    user_sessions_delete_failed:
      "Löschen der Benutzersitzungen fehlgeschlagen: {{error}}",
    session_creation_failed: "Sitzungserstellung fehlgeschlagen",
    session_creation_database_error:
      "Datenbankfehler beim Erstellen der Sitzung: {{error}}",
  },
};
