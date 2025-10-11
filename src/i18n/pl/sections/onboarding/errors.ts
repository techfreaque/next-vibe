import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/onboarding/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  authentication_required:
    "Uwierzytelnianie jest wymagane, aby uzyskać dostęp do funkcji wdrożenia",
  admin_permission_required:
    "Wymagane uprawnienia administratora, aby wyświetlić dane wdrożenia innego użytkownika",
  payment_processing_failed:
    "Nie udało się przetworzyć płatności dla wdrożenia",
  payment_url_missing: "Brak URL płatności w odpowiedzi płatności",
  consultation_request_failed: "Nie udało się przesłać żądania konsultacji",
  data_fetch_failed: "Nie udało się pobrać danych wdrożenia",
  data_update_failed: "Nie udało się zaktualizować danych wdrożenia",
  data_fetch_after_update_failed:
    "Nie udało się pobrać zaktualizowanych danych wdrożenia",
  data_creation_failed: "Nie udało się utworzyć danych wdrożenia",
  completion_failed: "Ukończenie wdrożenia nie powiodło się",
  plan_selection_failed: "Wybór planu nie powiódł się",
  not_found: "Nie znaleziono danych wdrożenia",
};
