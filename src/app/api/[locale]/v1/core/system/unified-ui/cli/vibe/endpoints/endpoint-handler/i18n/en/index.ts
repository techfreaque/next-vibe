import { translations as nextTranslations } from "../../next/i18n/en";

export const translations = {
  next: nextTranslations,
  debug: {
    authenticatedUser: "Endpoint Handler: Authenticated user",
  },
  error: {
    errors: {
      invalid_request_data: "Invalid request data",
      invalid_url_parameters: "Invalid URL parameters",
      unknown_validation_error: "Unknown validation error",
    },
    form_validation_failed: "Form validation failed",
    general: {
      internal_server_error: "Internal server error",
    },
    unauthorized: "Unauthorized access",
    forbidden: "Forbidden access",
    errorTypes: {
      invalid_response_error: "Invalid response error",
      internal_error: "Internal error",
    },
  },
};
