import type { loginTranslations as EnglishLoginTranslations } from "../../en/sections/login";

export const loginTranslations: typeof EnglishLoginTranslations = {
  errors: {
    account_locked: "Konto zablokowane z powodu zbyt wielu nieudanych prób",
    invalid_credentials: "Nieprawidłowy e-mail lub hasło",
    two_factor_required: "Wymagane uwierzytelnianie dwuskładnikowe",
    auth_error: "Błąd uwierzytelniania: {{error}}",
    user_not_found: "Użytkownik nie został znaleziony",
    session_creation_failed: "Nie udało się utworzyć sesji: {{error}}",
  },
  dontHaveAccount: "Nie masz konta?",
};
