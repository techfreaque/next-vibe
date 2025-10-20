import { translations as appTranslations } from "../../[locale]/i18n/en";
import { translations as apiTranslations } from "../../api/i18n/en";

export const translations = {
  appName: "unbottled.ai",
  api: apiTranslations,
  // we spread [locale] translations to avoid it in the translation key
  ...appTranslations,
  error: {
    unauthorized: "Unauthorized access",
    form_validation_failed: "Form validation failed",
    errorTypes: {
      invalid_response_error: "Invalid response format",
      internal_error: "Internal server error",
    },
    errors: {
      invalid_request_data: "Invalid request data format",
      invalid_url_parameters: "Invalid URL parameters",
    },
    general: {
      internal_server_error: "Internal server error occurred",
    },
    api: {
      http_error: "HTTP error occurred",
      validation_error: "Response validation failed",
      internal_error: "Internal API error",
    },
  },
};
