import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "एंडपॉइंट चुनें...",
    searchEndpoints: "एंडपॉइंट खोजें...",
    value: "{{value}}",
  },
  errors: {
    unknownInputKeys: {
      noneReached:
        "{{toolName}} को उसका कोई भी आर्गुमेंट नहीं मिला। अज्ञात: {{unknownKeys}}। अपेक्षित: {{expectedKeys}}।",
      dropped:
        "{{error}} अज्ञात आर्गुमेंट हटा दिए गए: {{unknownKeys}}। अपेक्षित: {{expectedKeys}}।",
    },
  },
};
