import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "फ़ील्ड पिक",
    titleShort: "फ़ील्ड पिक",
    description: "हर ऑब्ज़र्वेशन से कोई न्यूमेरिक मेटाडेटा फ़ील्ड निकालें।",
    fields: {
      source: { label: "सोर्स", description: "इनपुट टाइम सीरीज़" },
      field: {
        label: "फ़ील्ड",
        description: "मेटाडेटा फ़ील्ड का नाम, जैसे close।",
      },
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-अवधि" },
      range: { label: "रेंज", description: "गणना की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "वॉर्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      result: { label: "नतीजा", description: "आउटपुट टाइम सीरीज़" },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन मेटाडेटा" },
    },
    success: {
      title: "फ़ील्ड पिक चल गया",
      description: "नतीजे की सीरीज़ लौटाई गई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "फ़ील्ड पिक की गणना फ़ेल हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      conflict: { title: "टकराव", description: "टकराव" },
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
