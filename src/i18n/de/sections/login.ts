import type { loginTranslations as EnglishLoginTranslations } from "../../en/sections/login";

export const loginTranslations: typeof EnglishLoginTranslations = {
  errors: {
    account_locked:
      "Konto gesperrt aufgrund zu vieler fehlgeschlagener Anmeldeversuche",
    invalid_credentials: "Ungültige E-Mail-Adresse oder falsches Passwort",
    two_factor_required: "Zwei-Faktor-Authentifizierung erforderlich",
    auth_error: "Authentifizierungsfehler: {{error}}",
    user_not_found: "Benutzer nicht gefunden",
    session_creation_failed: "Sitzung konnte nicht erstellt werden: {{error}}",
  },
  dontHaveAccount: "Sie haben noch kein Konto?",
};
