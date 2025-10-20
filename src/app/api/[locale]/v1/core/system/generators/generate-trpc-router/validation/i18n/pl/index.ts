import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt końcowy API",
  tags: {
    validation: "Validation",
  },
  errors: {
    executionFailed: {
      title: "Walidacja TRPC nie powiodła się",
    },
  },
};
