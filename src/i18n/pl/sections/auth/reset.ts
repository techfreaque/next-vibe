import type { resetTranslations as EnglishResetTranslations } from "../../../en/sections/auth/reset";

export const resetTranslations: typeof EnglishResetTranslations = {
  errors: {
    user_not_found: "Użytkownik nie został znaleziony",
    confirmation_failed: "Potwierdzenie resetowania hasła nie powiodło się",
    token_lookup_failed: "Nie udało się wyszukać tokenu resetującego",
    token_validation_failed: "Nie udało się zwalidować tokenu resetującego",
    user_lookup_failed: "Nie udało się wyszukać użytkownika do resetowania",
    token_deletion_failed: "Nie udało się usunąć tokenu resetującego",
    user_deletion_failed:
      "Nie udało się usunąć tokenów resetujących użytkownika",
    token_invalid: "Nieprawidłowy token resetujący",
    token_verification_failed: "Nie udało się zweryfikować tokenu resetującego",
    token_creation_failed: "Nie udało się utworzyć tokenu resetującego",
    password_update_failed: "Nie udało się zaktualizować hasła",
    password_reset_failed: "Nie udało się zresetować hasła",
    request_failed: "Nie udało się przetworzyć zlecenia resetowania",
    token_expired: "Token resetujący wygasł",
    email_mismatch: "Email nie pasuje do tokenu resetującego",
  },
};
