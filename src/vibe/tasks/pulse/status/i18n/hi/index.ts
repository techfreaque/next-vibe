import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "पल्स स्टेटस",
  tags: {
    status: "स्टेटस",
  },
  get: {
    title: "पल्स स्टेटस",
    titleShort: "पल्स स्टेटस",
    description: "पल्स रन और उनकी सफलता दर देखें।",
    container: {
      title: "पल्स हेल्थ स्टेटस",
      description: "पल्स एक्ज़ीक्यूशन की सेहत और आँकड़े देखें",
    },
    widget: {
      refresh: "रीफ़्रेश",
      noData: "अभी कोई रन नहीं",
    },
    fields: {
      status: {
        title: "स्टेटस",
        label: "पल्स स्टेटस",
        description: "पल्स की मौजूदा सेहत",
      },
      lastPulseAt: {
        title: "आख़िरी पल्स का समय",
        label: "आख़िरी पल्स",
        description: "आख़िरी पल्स एक्ज़ीक्यूशन का टाइमस्टैम्प",
      },
      successRate: {
        title: "सफलता दर",
        label: "सफलता दर",
        description: "सफल पल्स एक्ज़ीक्यूशन का प्रतिशत",
      },
      totalExecutions: {
        title: "कुल एक्ज़ीक्यूशन",
        label: "कुल एक्ज़ीक्यूशन",
        description: "पल्स एक्ज़ीक्यूशन की कुल संख्या",
      },
    },
    examples: {
      basic: {
        title: "बेसिक स्टेटस रिक्वेस्ट",
      },
      success: {
        title: "सफल स्टेटस रिस्पॉन्स",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
    },
    success: {
      title: "सफल",
      description: "काम सफलतापूर्वक पूरा हुआ",
    },
  },
};
