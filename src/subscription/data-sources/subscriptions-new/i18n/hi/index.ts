import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "नए सब्सक्रिप्शन",
    titleShort: "नए सब्स",
    description:
      "हर बकेट में शुरू हुए सब्सक्रिप्शन। अधूरे चेकआउट और एडमिन अकाउंट शामिल नहीं।",
    fields: {
      resolution: {
        label: "रेज़ोल्यूशन",
        description: "गणना की समय-अवधि",
      },
      range: {
        label: "रेंज",
        description: "क्वेरी की समय सीमा",
      },
      lookback: {
        label: "लुकबैक",
        description: "रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      result: {
        label: "नए सब्सक्रिप्शन",
        description: "आउटपुट टाइम सीरीज़",
      },
      meta: {
        label: "मेटा",
        description: "नोड एक्ज़ीक्यूशन मेटाडेटा",
      },
    },
    success: {
      title: "नए सब्सक्रिप्शन की गणना हुई",
      description: "नए सब्सक्रिप्शन की सीरीज़ मिली",
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
        description: "क्वेरी फ़ेल हुई",
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
