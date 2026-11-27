import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Seleccione el punto final...",
    searchEndpoints: "Buscar puntos finales...",
    value: "{{value}}",
  },
  errors: {
    unknownInputKeys: {
      noneReached:
        "{{toolName}} no recibió ninguno de sus argumentos. Desconocidos: {{unknownKeys}}. Esperados: {{expectedKeys}}.",
      dropped:
        "{{error}} Se descartaron argumentos desconocidos: {{unknownKeys}}. Esperados: {{expectedKeys}}.",
    },
  },
};
