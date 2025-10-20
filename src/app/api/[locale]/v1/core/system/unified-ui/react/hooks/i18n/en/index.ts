import { translations as endpointTranslations } from "../../endpoint/i18n/en";
import { translations as mutationFormTranslations } from "../../mutation-form/i18n/en";
import { translations as queryTranslations } from "../../query/i18n/en";
import { translations as queryFormTranslations } from "../../query-form/i18n/en";
import { translations as storeTranslations } from "../../store/i18n/en";

export const translations = {
  endpoint: endpointTranslations,
  mutationForm: mutationFormTranslations,
  queryForm: queryFormTranslations,
  query: queryTranslations,
  store: storeTranslations,
  apiUtils: {
    errors: {
      http_error: {
        title: "HTTP Error",
        description: "Failed to communicate with the server",
      },
      validation_error: {
        title: "Validation Error",
        description: "The server response could not be validated",
      },
      internal_error: {
        title: "Internal Error",
        description: "An unexpected error occurred",
      },
      auth_required: {
        title: "Authentication Required",
        description: "You must be logged in to perform this action",
      },
    },
  },
};
