import { translations as nextTranslations } from "../../next/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  next: nextTranslations,
  debug: {
    authenticatedUser: "Endpoint Handler: Uwierzytelniony użytkownik",
  },
  error: {
    errors: {
      invalid_request_data: "Nieprawidłowe dane żądania",
      invalid_url_parameters: "Nieprawidłowe parametry URL",
      unknown_validation_error: "Nieznany błąd walidacji",
    },
    form_validation_failed: "Walidacja formularza nie powiodła się",
    general: {
      internal_server_error: "Wewnętrzny błąd serwera",
    },
    unauthorized: "Nieautoryzowany dostęp",
    forbidden: "Zabroniony dostęp",
    errorTypes: {
      invalid_response_error: "Nieprawidłowy błąd odpowiedzi",
      internal_error: "Błąd wewnętrzny",
    },
  },
};
