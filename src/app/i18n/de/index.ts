import { translations as appTranslations } from "../../[locale]/i18n/de";
import { translations as apiTranslations } from "../../api/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  api: apiTranslations,
  ...appTranslations,
  error: {
    unauthorized: "Unberechtigter Zugriff",
    form_validation_failed: "Formularvalidierung fehlgeschlagen",
    errorTypes: {
      invalid_response_error: "Ungültiges Antwortformat",
      internal_error: "Interner Serverfehler",
    },
    errors: {
      invalid_request_data: "Ungültiges Anfragedatenformat",
      invalid_url_parameters: "Ungültige URL-Parameter",
    },
    general: {
      internal_server_error: "Interner Serverfehler aufgetreten",
    },
  },
};
