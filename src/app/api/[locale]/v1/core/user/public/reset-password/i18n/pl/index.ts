import { translations as confirmTranslations } from "../../confirm/i18n/pl";
import { translations as requestTranslations } from "../../request/i18n/pl";
import { translations as validateTranslations } from "../../validate/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: confirmTranslations,
  request: requestTranslations,
  validate: validateTranslations,
  errors: {
    token_validation_failed: "Walidacja tokenu nie powiodła się",
    user_lookup_failed: "Nie udało się znaleźć użytkownika",
    token_deletion_failed: "Nie udało się usunąć tokenu",
    user_deletion_failed: "Nie udało się usunąć użytkownika",
    reset_failed: "Resetowanie hasła nie powiodło się",
    token_creation_failed: "Nie udało się utworzyć tokenu resetowania",
    no_data_returned: "Brak danych zwróconych z bazy danych",
    token_invalid: "Token resetowania jest nieprawidłowy",
    token_expired: "Token resetowania wygasł",
    token_verification_failed: "Weryfikacja tokenu nie powiodła się",
    user_not_found: "Użytkownik nie znaleziony",
    password_update_failed: "Nie udało się zaktualizować hasła",
    password_reset_failed: "Resetowanie hasła nie powiodło się",
    request_failed: "Żądanie resetowania nie powiodło się",
    email_mismatch: "E-mail nie pasuje",
    confirmation_failed: "Potwierdzenie resetowania hasła nie powiodło się",
  },
};
