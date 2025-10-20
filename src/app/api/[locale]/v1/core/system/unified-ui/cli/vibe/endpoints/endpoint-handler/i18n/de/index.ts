import { translations as nextTranslations } from "../../next/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  next: nextTranslations,
  error: {
    errors: {
      invalid_request_data: "Ungültige Anfragedaten",
      invalid_url_parameters: "Ungültige URL-Parameter",
      unknown_validation_error: "Unbekannter Validierungsfehler",
    },
    form_validation_failed: "Formularvalidierung fehlgeschlagen",
    general: {
      internal_server_error: "Interner Serverfehler",
    },
    unauthorized: "Nicht autorisierter Zugriff",
    forbidden: "Verbotener Zugriff",
    errorTypes: {
      invalid_response_error: "Ungültiger Antwortfehler",
      internal_error: "Interner Fehler",
    },
  },
};
