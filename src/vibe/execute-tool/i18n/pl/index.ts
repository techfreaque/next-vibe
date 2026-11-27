import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Wybierz endpoint...",
    searchEndpoints: "Szukaj endpointów...",
    value: "{{value}}",
  },
  errors: {
    unknownInputKeys: {
      noneReached:
        "{{toolName}} nie dostał żadnego ze swoich argumentów. Nieznane: {{unknownKeys}}. Oczekiwane: {{expectedKeys}}.",
      dropped:
        "{{error}} Nieznane argumenty zostały pominięte: {{unknownKeys}}. Oczekiwane: {{expectedKeys}}.",
    },
  },
};
