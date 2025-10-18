import type { translations as EnglishResetTranslations } from "../../en/auth/reset";

export const translations: typeof EnglishResetTranslations = {
  errors: {
    user_not_found: "Benutzer nicht gefunden",
    confirmation_failed: "Passwort-Reset-Bestätigung fehlgeschlagen",
    token_lookup_failed: "Fehler beim Suchen des Reset-Tokens",
    token_validation_failed: "Fehler bei der Validierung des Reset-Tokens",
    user_lookup_failed: "Fehler beim Suchen des Benutzers für Reset",
    token_deletion_failed: "Fehler beim Löschen des Reset-Tokens",
    user_deletion_failed: "Fehler beim Löschen der Benutzer-Reset-Tokens",
    token_invalid: "Ungültiger Reset-Token",
    token_verification_failed: "Fehler bei der Verifizierung des Reset-Tokens",
    token_creation_failed: "Fehler beim Erstellen des Reset-Tokens",
    password_update_failed: "Fehler beim Aktualisieren des Passworts",
    password_reset_failed: "Fehler beim Zurücksetzen des Passworts",
    request_failed: "Fehler bei der Verarbeitung der Reset-Anfrage",
    token_expired: "Reset-Token ist abgelaufen",
    email_mismatch: "E-Mail stimmt nicht mit Reset-Token überein",
  },
};
