import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "JSON पाथ",
    titleShort: "JSON पाथ",
    description: "देखा गया मान या कोई संख्यात्मक मेटाडेटा फ़ील्ड निकालें।",
    fields: {
      source: {
        label: "स्रोत",
        description: "इनपुट टाइम सीरीज़",
      },
      path: {
        label: "पाथ",
        description: "value या meta.close जैसा मेटाडेटा पाथ डालें।",
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
      result: {
        label: "नतीजा",
        description: "आउटपुट टाइम सीरीज़",
      },
      meta: {
        label: "मेटा",
        description: "नोड एक्ज़ीक्यूशन मेटाडेटा",
      },
    },
    success: {
      title: "JSON पाथ चला",
      description: "नतीजे की सीरीज़ मिली",
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
        description: "JSON पाथ की गणना फ़ेल हुई",
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
