import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Seleziona l'endpoint...",
    searchEndpoints: "Ricerca di punti...",
    value: "{{value}}",
  },
  errors: {
    unknownInputKeys: {
      noneReached:
        "{{toolName}} non ha ricevuto nessuno dei suoi argomenti. Sconosciuti: {{unknownKeys}}. Attesi: {{expectedKeys}}.",
      dropped:
        "{{error}} Argomenti sconosciuti scartati: {{unknownKeys}}. Attesi: {{expectedKeys}}.",
    },
  },
};
