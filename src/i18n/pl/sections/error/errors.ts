import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/error/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  invalid_locale: "Nieprawidłowe ustawienia regionalne",
  invalid_url_parameters: "Nieprawidłowe parametry URL: {{message}}",
  invalid_request_data: "Nieprawidłowe dane żądania: {{message}}",
  internal_server_error: "Wewnętrzny błąd serwera: {{error}}",
  unknown: "Wystąpił nieznany błąd",
  unauthorized: "Nieautoryzowany dostęp",
};
