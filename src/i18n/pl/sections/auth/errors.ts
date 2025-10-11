import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/auth/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  jwt_signing_failed: "Nie udało się utworzyć tokenu uwierzytelniania",
  token_expired: "Token uwierzytelniania wygasł",
  invalid_token_signature: "Nieprawidłowy podpis tokenu uwierzytelniania",
  token_verification_failed:
    "Nie udało się zweryfikować tokenu uwierzytelniania: {{error}}",
  missing_token: "Brak tokenu uwierzytelniania",
  session_retrieval_failed: "Nie udało się pobrać informacji o sesji",
  cookie_set_failed: "Nie udało się ustawić plików cookie uwierzytelniania",
  cookie_clear_failed: "Nie udało się wyczyścić plików cookie uwierzytelniania",
  jwt_payload_missing_id: "Ładunek JWT nie zawiera ID użytkownika",
  invalid_session: "Sesja jest nieprawidłowa lub wygasła",
  missing_request_context: "Brak kontekstu żądania",
  unsupported_platform: "Platforma nie jest obsługiwana",
  email_send_failed: "Wysyłanie e-maila nie powiodło się",
  validation_failed: "Walidacja nie powiodła się",
};
