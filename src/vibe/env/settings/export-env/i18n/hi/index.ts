import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम",
  get: {
    title: "प्रोडक्शन Env एक्सपोर्ट करें",
    titleShort: "एनवायरनमेंट एक्सपोर्ट करें",
    description:
      "डिक्रिप्ट की गई वैल्यू, डिप्लॉयमेंट निर्देश और चेकलिस्ट के साथ प्रोडक्शन के लिए तैयार .env फ़ाइल बनाएँ",
    tags: {
      exportEnv: "Env एक्सपोर्ट",
    },
    response: {
      content: {
        title: "Env फ़ाइल की सामग्री",
      },
      filename: {
        title: "फ़ाइल का नाम",
      },
    },
    success: {
      title: "Env एक्सपोर्ट हुआ",
      description: "प्रोडक्शन env फ़ाइल सफलतापूर्वक बनी",
    },
    widget: {
      copy: "क्लिपबोर्ड पर कॉपी करें",
      copied: "कॉपी हो गया!",
      download: ".env.prod डाउनलोड करें",
      instructions: "इस फ़ाइल को अपने सर्वर पर कॉपी करें और ऐप रीस्टार्ट करें।",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "env फ़ाइल नहीं बन सकी",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      notFound: {
        title: "नहीं मिला",
        description: "सेटिंग्स नहीं मिलीं",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
  },
};
