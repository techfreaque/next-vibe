import { translations as appTranslations } from "../../[locale]/i18n/pl";
import { translations as apiTranslations } from "../../api/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  api: apiTranslations,
  ...appTranslations,
  error: {
    unauthorized: "Nieautoryzowany dostęp",
    form_validation_failed: "Walidacja formularza nie powiodła się",
    errorTypes: {
      invalid_response_error: "Nieprawidłowy format odpowiedzi",
      internal_error: "Wewnętrzny błąd serwera",
    },
    errors: {
      invalid_request_data: "Nieprawidłowy format danych żądania",
      invalid_url_parameters: "Nieprawidłowe parametry URL",
    },
    general: {
      internal_server_error: "Wystąpił wewnętrzny błąd serwera",
    },
  },
};
