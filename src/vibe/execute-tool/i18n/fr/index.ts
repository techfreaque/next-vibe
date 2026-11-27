import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Sélectionner un endpoint...",
    searchEndpoints: "Rechercher des endpoints...",
    value: "{{value}}",
  },
  errors: {
    unknownInputKeys: {
      noneReached:
        "{{toolName}} n'a reçu aucun de ses arguments. Inconnus : {{unknownKeys}}. Attendus : {{expectedKeys}}.",
      dropped:
        "{{error}} Arguments inconnus ignorés : {{unknownKeys}}. Attendus : {{expectedKeys}}.",
    },
  },
};
