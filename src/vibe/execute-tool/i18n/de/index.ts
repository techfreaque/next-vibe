import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Endpunkt auswählen...",
    searchEndpoints: "Endpunkte suchen...",
    value: "{{value}}",
  },
  errors: {
    unknownInputKeys: {
      noneReached:
        "{{toolName}} hat keines seiner Argumente erhalten. Unbekannt: {{unknownKeys}}. Erwartet: {{expectedKeys}}.",
      dropped:
        "{{error}} Unbekannte Argumente wurden verworfen: {{unknownKeys}}. Erwartet: {{expectedKeys}}.",
    },
  },
};
