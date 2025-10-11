import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/consultation/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  user_not_found: "Nie znaleziono użytkownika o ID: {{userId}}",
  database_error: "Wystąpił błąd bazy danych podczas {{operation}}",
  submission_failed: "Nie udało się przesłać żądania konsultacji",
  update_failed: "Nie udało się zaktualizować konsultacji",
  not_found: "Konsultacja nie została znaleziona",
  onboarding_failed: "Nie udało się utworzyć konsultacji wdrożeniowej",
  authentication_required:
    "Uwierzytelnienie jest wymagane do żądania konsultacji",
};
