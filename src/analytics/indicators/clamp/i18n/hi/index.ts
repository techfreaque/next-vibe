import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "क्लैंप",
    titleShort: "क्लैंप",
    description: "वैल्यू को [min, max] सीमा में बाँधें: आउटलायर काट देता है",
    fields: {
      source: {
        label: "सोर्स",
        description: "इनपुट टाइम सीरीज़",
      },
      resolution: {
        label: "रेज़ोल्यूशन",
        description: "कंप्यूटेशन की समय-सीमा",
      },
      range: {
        label: "रेंज",
        description: "कंप्यूट करने की समय सीमा",
      },
      lookback: {
        label: "लुकबैक",
        description: "वार्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      min: {
        label: "न्यूनतम",
        description: "न्यूनतम वैल्यू (निचली सीमा)",
      },
      max: {
        label: "अधिकतम",
        description: "अधिकतम वैल्यू (ऊपरी सीमा)",
      },
      result: {
        label: "क्लैंप की हुई",
        description: "आउटपुट टाइम सीरीज़",
      },
      meta: {
        label: "मेटा",
        description: "नोड एक्ज़ीक्यूशन का मेटाडेटा",
      },
    },
    success: {
      title: "क्लैंप की गणना हो गई",
      description: "क्लैंप की हुई सीरीज़ लौटाई गई",
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
        description: "क्लैंप की गणना फ़ेल हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
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
        title: "बिना सेव बदलाव",
        description: "पहले बदलाव सेव करें",
      },
    },
  },
};
