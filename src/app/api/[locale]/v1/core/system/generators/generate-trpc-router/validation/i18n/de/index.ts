import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API Endpunkt",
  tags: {
    validation: "Validation",
  },
  errors: {
    executionFailed: {
      title: "TRPC-Validierung fehlgeschlagen",
    },
  },
};
