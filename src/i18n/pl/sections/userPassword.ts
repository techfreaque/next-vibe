import type { userPasswordTranslations as EnglishUserPasswordTranslations } from "../../en/sections/userPassword";

export const userPasswordTranslations: typeof EnglishUserPasswordTranslations =
  {
    errors: {
      passwords_do_not_match: "Hasła nie są zgodne",
      user_not_found: "Użytkownik nie został znaleziony",
      incorrect_password: "Aktualne hasło jest nieprawidłowe",
      update_failed: "Nie udało się zaktualizować hasła: {{error}}",
      token_creation_failed:
        "Nie udało się utworzyć tokenu uwierzytelniającego: {{error}}",
    },
  };
