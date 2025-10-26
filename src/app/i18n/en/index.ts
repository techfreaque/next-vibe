import { translations as packagesTranslations } from "../../../packages/i18n/en";
import { translations as appTranslations } from "../../[locale]/i18n/en";
import { translations as apiTranslations } from "../../api/i18n/en";

export const translations = {
  appName: "unbottled.ai",
  api: apiTranslations,
  packages: packagesTranslations,
  i18n: {
    common: {
      calendar: {
        timezone: {
          zones: {
            PL: "Europe/Warsaw",
            DE: "Europe/Berlin",
            global: "UTC",
          },
        },
      },
    },
  },
  error: {
    api: {
      form: {
        errors: {
          validation_failed: "Form validation failed",
          network_failure: "Network request failed",
        },
      },
      store: {
        errors: {
          validation_failed: "Validation failed",
          request_failed: "Request failed",
          mutation_failed: "Mutation failed",
          unexpected_failure: "Unexpected error occurred",
          refetch_failed: "Failed to refetch data",
        },
        status: {
          loading_data: "Loading data...",
          cached_data: "Using cached data",
          success: "Success",
          mutation_pending: "Mutation pending...",
          mutation_success: "Mutation successful",
        },
      },
    },
  },
  // we spread [locale] translations to avoid it in the translation key
  ...appTranslations,
};
