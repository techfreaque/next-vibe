import type { resetPasswordTranslations as EnglishResetPasswordTranslations } from "../../en/sections/resetPassword";

export const resetPasswordTranslations: typeof EnglishResetPasswordTranslations =
  {
    errors: {
      reset_failed: "Passwort zurücksetzen fehlgeschlagen: {{error}}",
      token_creation_failed:
        "Erstellen des Reset-Tokens fehlgeschlagen: {{error}}",
      token_invalid: "Ungültiger Reset-Token",
      token_expired: "Reset-Token ist abgelaufen",
    },
  };
