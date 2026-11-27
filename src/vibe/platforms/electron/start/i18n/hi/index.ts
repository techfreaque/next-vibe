import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronStart: "Electron शुरू",
  },
  post: {
    title: "Electron ऐप शुरू करें",
    titleShort: "Electron शुरू करें",
    description:
      "main/preload कंपाइल करें और Electron डेस्कटॉप विंडो खोलें (डेव मोड, पैकेजिंग नहीं)",
    form: {
      title: "Electron शुरू करने का कॉन्फ़िगरेशन",
      description: "कॉन्फ़िगर करें कि Electron ऐप कैसे शुरू हो",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "शुरू करने का रिस्पॉन्स डेटा",
    },
    fields: {
      port: {
        title: "पोर्ट",
        description: "vibe सर्वर जिस पोर्ट पर चलता है (डिफ़ॉल्ट: 3000)",
      },
      vibeStart: {
        title: "vibe start चलाएँ",
        description: "विंडो खोलने से पहले बैकग्राउंड में vibe start चलाएँ",
      },
      success: {
        title: "सफल",
      },
      output: {
        title: "आउटपुट",
      },
      duration: {
        title: "अवधि (ms)",
      },
      errors: {
        title: "एरर",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
        compileFailed: "Electron कंपाइलेशन फ़ेल हुआ: {{error}}",
        startFailed: "Electron शुरू होना फ़ेल हुआ: {{error}}",
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
    },
    success: {
      title: "सफल",
      description: "Electron ऐप शुरू हुआ",
    },
  },
};
