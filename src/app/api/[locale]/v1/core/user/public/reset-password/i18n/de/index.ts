import { translations as confirmTranslations } from "../../confirm/i18n/de";
import { translations as requestTranslations } from "../../request/i18n/de";
import { translations as validateTranslations } from "../../validate/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: confirmTranslations,
  request: requestTranslations,
  validate: validateTranslations,
  errors: {
    token_validation_failed: "Token-Validierung fehlgeschlagen",
    user_lookup_failed: "Benutzer konnte nicht gefunden werden",
    token_deletion_failed: "Token konnte nicht gelöscht werden",
    user_deletion_failed: "Benutzer konnte nicht gelöscht werden",
    reset_failed: "Passwort-Zurücksetzung fehlgeschlagen",
    token_creation_failed: "Reset-Token konnte nicht erstellt werden",
    no_data_returned: "Keine Daten von der Datenbank zurückgegeben",
    token_invalid: "Reset-Token ist ungültig",
    token_expired: "Reset-Token ist abgelaufen",
    token_verification_failed: "Token-Verifizierung fehlgeschlagen",
    user_not_found: "Benutzer nicht gefunden",
    password_update_failed: "Passwort konnte nicht aktualisiert werden",
    password_reset_failed: "Passwort-Zurücksetzung fehlgeschlagen",
    request_failed: "Reset-Anfrage fehlgeschlagen",
    email_mismatch: "E-Mail stimmt nicht überein",
    confirmation_failed: "Passwort-Zurücksetzungsbestätigung fehlgeschlagen",
  },
};
