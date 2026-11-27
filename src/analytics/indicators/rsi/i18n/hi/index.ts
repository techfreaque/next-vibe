import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "RSI",
    titleShort: "RSI",
    description: "रिलेटिव स्ट्रेंथ इंडेक्स: 0 से 100 के पैमाने पर मोमेंटम नापता है",
    fields: {
      source: {
        label: "स्रोत",
        description: "इनपुट टाइम सीरीज़",
      },
      resolution: {
        label: "रेज़ोल्यूशन",
        description: "गणना की समय-अवधि",
      },
      range: {
        label: "रेंज",
        description: "गणना की समय सीमा",
      },
      lookback: {
        label: "लुकबैक",
        description: "वार्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      period: {
        label: "अवधि",
        description: "अवधियों की संख्या (2 से 100)",
      },
      result: {
        label: "RSI",
        description: "आउटपुट टाइम सीरीज़",
      },
      meta: {
        label: "मेटा",
        description: "नोड एक्ज़ीक्यूशन मेटाडेटा",
      },
    },
    success: {
      title: "RSI की गणना हुई",
      description: "RSI सीरीज़ मिली",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "RSI की गणना फ़ेल हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले बदलाव सेव करें",
      },
    },
  },
};
