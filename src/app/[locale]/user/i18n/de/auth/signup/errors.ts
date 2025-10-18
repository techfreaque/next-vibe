import type { translations as EnglishErrorsTranslations } from "../../../en/auth/signup/errors";

export const translations: typeof EnglishErrorsTranslations = {
  title: "Registrierung fehlgeschlagen",
  unknown: "Ein unbekannter Fehler ist aufgetreten",
  email_in_use:
    "Diese E-Mail ist bereits registriert. Bitte verwenden Sie eine andere E-Mail oder melden Sie sich an.",
  password_mismatch:
    "Passwörter stimmen nicht überein. Bitte stellen Sie sicher, dass Ihre Passwörter übereinstimmen.",
  invalid_data:
    "Einige Informationen sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  network_error:
    "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
  email_check_failed:
    "Wir konnten Ihre E-Mail-Adresse gerade nicht überprüfen. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support, falls das Problem weiterhin besteht.",
  creation_failed:
    "Wir konnten Ihr Konto aufgrund eines technischen Problems nicht erstellen. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.",
  loginAfterRegister:
    "Ihr Konto wurde erstellt, aber wir konnten Sie nicht automatisch anmelden. Bitte versuchen Sie, sich manuell anzumelden.",
  unexpected:
    "Ein unerwarteter Fehler ist während der Registrierung aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, falls das Problem weiterhin besteht.",
  passwordMismatch: "Passwörter stimmen nicht überein",
  emailExists: "Ein Konto mit dieser E-Mail existiert bereits",
};
