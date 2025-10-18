import type { translations as EnglishUserPasswordTranslations } from "../../en/userPassword";

export const translations: typeof EnglishUserPasswordTranslations = {
  errors: {
    passwords_do_not_match: "Passwörter stimmen nicht überein",
    user_not_found: "Benutzer nicht gefunden",
    incorrect_password: "Aktuelles Passwort ist falsch",
    update_failed: "Passwort-Aktualisierung fehlgeschlagen: {{error}}",
    token_creation_failed:
      "Erstellung des Authentifizierungs-Tokens fehlgeschlagen: {{error}}",
  },
};
