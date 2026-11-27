import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "वेबसाइट यूज़र",
    title: "लीड वेबसाइट यूज़र",
    description: "हर टाइम बकेट में वेबसाइट यूज़र स्टेटस वाली लीड की गिनती",
    fields: {
      resolution: { label: "रेज़ोल्यूशन", description: "कंप्यूटेशन की समय-सीमा" },
      range: { label: "रेंज", description: "क्वेरी की समय सीमा" },
      lookback: { label: "लुकबैक", description: "रेंज शुरू होने से पहले के अतिरिक्त बार" },
      result: { label: "वेबसाइट यूज़र", description: "आउटपुट टाइम सीरीज़" },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन का मेटाडेटा" },
    },
    success: {
      title: "वेबसाइट यूज़र का डेटा",
      description: "वेबसाइट यूज़र की सीरीज़ लौटाई गई",
    },
    errors: {
      unauthorized: { title: "अनधिकृत", description: "ऑथेंटिकेशन ज़रूरी है" },
      forbidden: { title: "प्रतिबंधित", description: "एडमिन एक्सेस ज़रूरी है" },
      server: { title: "सर्वर एरर", description: "क्वेरी फ़ेल हुई" },
      unknown: { title: "अज्ञात एरर", description: "कुछ अनपेक्षित हुआ" },
      validation: { title: "वैलिडेशन फ़ेल", description: "रिक्वेस्ट पैरामीटर गलत हैं" },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      conflict: { title: "टकराव", description: "टकराव" },
      network: { title: "नेटवर्क एरर", description: "नेटवर्क रिक्वेस्ट फ़ेल हुई" },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "पहले बदलाव सेव करें",
      },
    },
  },
};
