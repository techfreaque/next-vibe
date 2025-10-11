import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/auth/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  jwt_signing_failed: "Fehler beim Erstellen des Authentifizierungs-Tokens",
  token_expired: "Authentifizierungs-Token ist abgelaufen",
  invalid_token_signature: "Ungültige Authentifizierungs-Token-Signatur",
  token_verification_failed:
    "Fehler bei der Verifizierung des Authentifizierungs-Tokens: {{error}}",
  missing_token: "Authentifizierungs-Token fehlt",
  session_retrieval_failed: "Fehler beim Abrufen der Session-Informationen",
  cookie_set_failed: "Fehler beim Setzen der Authentifizierungs-Cookies",
  cookie_clear_failed: "Fehler beim Löschen der Authentifizierungs-Cookies",
  jwt_payload_missing_id: "JWT-Payload fehlt die Benutzer-ID",
  invalid_session: "Die Session ist ungültig oder abgelaufen",
  missing_request_context: "Request-Kontext fehlt",
  unsupported_platform: "Plattform wird nicht unterstützt",
  email_send_failed: "E-Mail-Versand fehlgeschlagen",
  validation_failed: "Validierung fehlgeschlagen",
};
