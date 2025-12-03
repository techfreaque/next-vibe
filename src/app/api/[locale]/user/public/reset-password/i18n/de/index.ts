import { translations as confirmTranslations } from "../../confirm/i18n/de";
import { translations as requestTranslations } from "../../request/i18n/de";
import { translations as validateTranslations } from "../../validate/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: confirmTranslations,
  request: requestTranslations,
  validate: validateTranslations,
  errors: {
    tokenValidationFailed: "Token-Validierung fehlgeschlagen",
    userLookupFailed: "Benutzer konnte nicht gefunden werden",
    tokenDeletionFailed: "Token konnte nicht gelöscht werden",
    userDeletionFailed: "Benutzer konnte nicht gelöscht werden",
    resetFailed: "Passwort-Zurücksetzung fehlgeschlagen",
    tokenCreationFailed: "Reset-Token konnte nicht erstellt werden",
    noDataReturned: "Keine Daten von der Datenbank zurückgegeben",
    tokenInvalid: "Reset-Token ist ungültig",
    tokenExpired: "Reset-Token ist abgelaufen",
    tokenVerificationFailed: "Token-Verifizierung fehlgeschlagen",
    userNotFound: "Benutzer nicht gefunden",
    passwordUpdateFailed: "Passwort konnte nicht aktualisiert werden",
    passwordResetFailed: "Passwort-Zurücksetzung fehlgeschlagen",
    requestFailed: "Reset-Anfrage fehlgeschlagen",
    emailMismatch: "E-Mail stimmt nicht überein",
    confirmationFailed: "Passwort-Zurücksetzungsbestätigung fehlgeschlagen",
  },
};
