import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/onboarding/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  authentication_required:
    "Authentifizierung ist erforderlich, um auf Onboarding-Funktionen zuzugreifen",
  admin_permission_required:
    "Admin-Berechtigung erforderlich, um Onboarding-Daten anderer Benutzer anzuzeigen",
  payment_processing_failed:
    "Zahlungsverarbeitung für Onboarding fehlgeschlagen",
  payment_url_missing: "Zahlungs-URL fehlt in der Zahlungsantwort",
  consultation_request_failed:
    "Beratungsanfrage konnte nicht übermittelt werden",
  data_fetch_failed: "Onboarding-Daten konnten nicht abgerufen werden",
  data_update_failed: "Onboarding-Daten konnten nicht aktualisiert werden",
  data_fetch_after_update_failed:
    "Aktualisierte Onboarding-Daten konnten nicht abgerufen werden",
  data_creation_failed: "Onboarding-Daten konnten nicht erstellt werden",
  completion_failed: "Onboarding-Abschluss fehlgeschlagen",
  plan_selection_failed: "Plan-Auswahl fehlgeschlagen",
  not_found: "Onboarding-Daten nicht gefunden",
};
