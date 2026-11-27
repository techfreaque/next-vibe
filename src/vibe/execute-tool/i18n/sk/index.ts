import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Vybrať koncový bod…",
    searchEndpoints: "Hľadať koncové body…",
    value: "{{value}}",
  },
  errors: {
    unknownInputKeys: {
      noneReached:
        "{{toolName}} nedostal žiadny zo svojich argumentov. Neznáme: {{unknownKeys}}. Očakávané: {{expectedKeys}}.",
      dropped:
        "{{error}} Neznáme argumenty boli zahodené: {{unknownKeys}}. Očakávané: {{expectedKeys}}.",
    },
  },
};
