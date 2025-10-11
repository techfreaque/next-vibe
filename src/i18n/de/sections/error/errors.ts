import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/error/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  invalid_locale: "Ungültige Sprache",
  invalid_url_parameters: "Ungültige URL-Parameter: {{message}}",
  invalid_request_data: "Ungültige Anfragedaten: {{message}}",
  internal_server_error: "Interner Serverfehler: {{error}}",
  unknown: "Ein unbekannter Fehler ist aufgetreten",
  unauthorized: "Unbefugter Zugriff",
};
