import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/newsletter/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  subscription_failed: "Newsletter-Abonnement fehlgeschlagen",
  email_already_exists: "Diese E-Mail hat unseren Newsletter bereits abonniert",
  invalid_email: "Bitte geben Sie eine gültige E-Mail-Adresse an",
  database_error:
    "Ein Datenbankfehler ist bei der Verarbeitung Ihrer Anfrage aufgetreten",
  unsubscribe_failed: "Abmeldung vom Newsletter fehlgeschlagen",
  preferences_update_failed:
    "Newsletter-Einstellungen konnten nicht aktualisiert werden",
  campaign_creation_failed: "Newsletter-Kampagne konnte nicht erstellt werden",
  campaign_sending_failed: "Newsletter-Kampagne konnte nicht gesendet werden",
  confirmation_failed: "Newsletter-Abonnement konnte nicht bestätigt werden",
  confirmation_token_invalid:
    "Das Bestätigungstoken ist ungültig oder abgelaufen",
  email_generation_failed: "E-Mail konnte nicht generiert werden",
  subscription_not_found:
    "Wir konnten kein Newsletter-Abonnement für diese E-Mail finden",
  subscription_check_failed:
    "Newsletter-Abonnement-Status konnte nicht überprüft werden",
  already_subscribed: "Diese E-Mail hat unseren Newsletter bereits abonniert",
  status_check_failed:
    "Newsletter-Abonnement-Status konnte nicht überprüft werden",
};
