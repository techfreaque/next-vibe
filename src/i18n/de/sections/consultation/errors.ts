import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/consultation/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  user_not_found: "Benutzer mit ID nicht gefunden: {{userId}}",
  database_error: "Datenbankfehler während {{operation}} aufgetreten",
  submission_failed: "Fehler beim Einreichen der Beratungsanfrage",
  update_failed: "Fehler beim Aktualisieren der Beratung",
  not_found: "Beratung nicht gefunden",
  onboarding_failed: "Fehler beim Erstellen der Onboarding-Beratung",
  authentication_required:
    "Authentifizierung ist erforderlich, um eine Beratung anzufordern",
};
