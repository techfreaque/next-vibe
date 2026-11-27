import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "Bollinger Bands",
    titleShort: "Bollinger",
    description: "Bollinger Bands: स्टैंडर्ड डेविएशन से ऊपरी, मध्य (SMA) और निचला बैंड",
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
      period: {
        label: "अवधि",
        description: "अवधियों की संख्या (2-200)",
      },
      stdDev: {
        label: "स्टैंडर्ड डेविएशन गुणक",
        description: "स्टैंडर्ड डेविएशन का गुणक (0.1-5)",
      },
      upper: {
        label: "ऊपरी बैंड",
        description: "ऊपरी Bollinger Band टाइम सीरीज़",
      },
      middle: {
        label: "मध्य बैंड",
        description: "मध्य बैंड (SMA) टाइम सीरीज़",
      },
      lower: {
        label: "निचला बैंड",
        description: "निचली Bollinger Band टाइम सीरीज़",
      },
      meta: {
        label: "मेटा",
        description: "नोड एक्ज़ीक्यूशन का मेटाडेटा",
      },
    },
    success: {
      title: "Bollinger Bands की गणना हो गई",
      description: "ऊपरी, मध्य और निचली बैंड सीरीज़ लौटाई गईं",
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
        description: "Bollinger Bands की गणना फ़ेल हुई",
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
