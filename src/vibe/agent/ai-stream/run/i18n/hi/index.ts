// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/hi";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "endpoint चुनें...",
    searchEndpoints: "endpoints खोजें...",
    value: "{{value}}",
    selectEndpointHint: "पैरामीटर कॉन्फ़िगर करने के लिए कोई endpoint चुनें।",
    resolvingEndpoint: "endpoint खोजा जा रहा है...",
    preCallsDescription:
      "प्रॉम्प्ट से पहले चलाए गए टूल कॉल। नतीजे कॉन्टेक्स्ट के रूप में डाले जाते हैं।",
    addPreCall: "प्री-कॉल जोड़ें",
    preCalls: "प्री-कॉल",
    instructions: "निर्देश",
    instructionsTooltip: "सिस्टम निर्देश ओवरराइड",
    preCallsTooltip: "प्री-कॉल टूल एक्ज़ीक्यूशन",
    more: "और",
    moreTooltip: "एडवांस्ड विकल्प",
    emptyState: {
      title: "शुरू करने के लिए कोई स्किल या फ़ेवरेट चुनें",
      description:
        "नीचे के सिलेक्टर से कोई स्किल चुनें या सेव किया फ़ेवरेट लोड करें। मॉडल अपने आप तय हो जाता है।",
    },
    noResponse: "कोई जवाब नहीं",
    cli: {
      submitting: "…",
      promptPrefix: "› ",
      skillPrefix: "skill ",
      promptHint: "enter: submit  ·  esc: exit  ·  tab: switch field",
      promptPlaceholder: "अपना प्रॉम्प्ट डालें...",
      skillLabel: "skill: {{skill}}",
    },
  },
  models: { names: modelTranslations.names },
};
