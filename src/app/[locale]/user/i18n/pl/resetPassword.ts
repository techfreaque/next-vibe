import type { translations as EnglishResetPasswordTranslations } from "../../en/resetPassword";

export const translations: typeof EnglishResetPasswordTranslations = {
  errors: {
    reset_failed: "Nie udało się zresetować hasła: {{error}}",
    token_creation_failed:
      "Nie udało się utworzyć tokenu resetowania: {{error}}",
    token_invalid: "Nieprawidłowy token resetowania",
    token_expired: "Token resetowania wygasł",
  },
};
