import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronBuild: "Electron बिल्ड",
  },
  post: {
    title: "Electron ऐप बिल्ड करें",
    titleShort: "Electron बिल्ड करें",
    description:
      "bun से main/preload कंपाइल करें, vibe build चलाएँ, फिर electron-builder से पैकेज करें",
    form: {
      title: "Electron बिल्ड कॉन्फ़िगरेशन",
      description: "Electron बिल्ड के पैरामीटर सेट करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "बिल्ड रिस्पॉन्स डेटा",
    },
    fields: {
      viBuild: {
        title: "vibe build चलाएँ",
        description: "पैकेज करने से पहले vibe build (Next.js + माइग्रेशन) चलाएँ",
      },
      generate: {
        title: "एंडपॉइंट जनरेट करें",
        description: "बिल्ड से पहले एंडपॉइंट इंडेक्स दोबारा बनाएँ",
      },
      platform: {
        title: "टारगेट प्लेटफ़ॉर्म",
        description: "किस प्लेटफ़ॉर्म के लिए पैकेज करना है",
        options: {
          current: "मौजूदा OS",
          linux: "Linux",
          mac: "macOS",
          win: "विंडो",
          all: "सभी प्लेटफ़ॉर्म",
        },
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
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
        viBuildFailed: "vibe build फ़ेल हुआ: {{error}}",
        compileFailed: "Electron कंपाइलेशन फ़ेल हुआ: {{error}}",
        builderFailed: "electron-builder फ़ेल हुआ: {{error}}",
        buildFailed: "Electron बिल्ड फ़ेल हुआ: {{error}}",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "Electron ऐप सफलतापूर्वक बिल्ड हुआ",
    },
  },
};
