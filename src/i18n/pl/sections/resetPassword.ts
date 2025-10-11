import type { resetPasswordTranslations as EnglishResetPasswordTranslations } from "../../en/sections/resetPassword";

export const resetPasswordTranslations: typeof EnglishResetPasswordTranslations =
  {
    errors: {
      reset_failed: "Nie udało się zresetować hasła: {{error}}",
      token_creation_failed:
        "Nie udało się utworzyć tokenu resetowania: {{error}}",
      token_invalid: "Nieprawidłowy token resetowania",
      token_expired: "Token resetowania wygasł",
    },
  };
