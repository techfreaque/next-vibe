import type { errorsTranslations as EnglishErrorsTranslations } from "../../../../en/sections/auth/signup/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  title: "Rejestracja nie powiodła się",
  unknown: "Wystąpił nieznany błąd",
  email_in_use:
    "Ten email jest już zarejestrowany. Użyj innego emaila lub zaloguj się.",
  password_mismatch:
    "Hasła nie pasują do siebie. Upewnij się, że hasła są identyczne.",
  invalid_data:
    "Niektóre informacje są nieprawidłowe. Sprawdź swoje dane i spróbuj ponownie.",
  network_error: "Błąd sieci. Sprawdź swoje połączenie i spróbuj ponownie.",
  email_check_failed:
    "Nie mogliśmy teraz sprawdzić Twojego adresu email. Spróbuj ponownie później lub skontaktuj się z pomocą techniczną, jeśli problem będzie się powtarzał.",
  creation_failed:
    "Nie mogliśmy utworzyć Twojego konta z powodu problemu technicznego. Spróbuj ponownie później lub skontaktuj się z pomocą techniczną.",
  loginAfterRegister:
    "Twoje konto zostało utworzone, ale nie mogliśmy Cię automatycznie zalogować. Spróbuj zalogować się ręcznie.",
  unexpected:
    "Wystąpił nieoczekiwany błąd podczas rejestracji. Spróbuj ponownie lub skontaktuj się z pomocą techniczną, jeśli problem będzie się powtarzał.",
  passwordMismatch: "Hasła nie pasują do siebie",
  emailExists: "Konto z tym emailem już istnieje",
};
