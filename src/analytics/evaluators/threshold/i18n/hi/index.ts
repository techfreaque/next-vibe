import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    op: {
      gt: ">",
      lt: "<",
      gte: ">=",
      lte: "<=",
      eq: "==",
    },
  },
  post: {
    title: "थ्रेशोल्ड",
    titleShort: "थ्रेशोल्ड",
    description: "तब चलता है जब सीरीज़ का मान किसी स्थिरांक से तुलना की शर्त पूरी करे",
    fields: {
      source: { label: "स्रोत", description: "इनपुट टाइम सीरीज़" },
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-सीमा" },
      range: { label: "रेंज", description: "मूल्यांकन की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "वार्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      op: {
        label: "ऑपरेटर",
        description: "तुलना का ऑपरेटर (>, <, >=, <=, ==)",
      },
      value: {
        label: "थ्रेशोल्ड",
        description: "तुलना के लिए स्थिर मान",
      },
      signals: { label: "सिग्नल", description: "आउटपुट सिग्नल इवेंट" },
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "मूल्यांकन करें",
      loadingText: "मूल्यांकन हो रहा है…",
    },
    success: {
      title: "थ्रेशोल्ड का मूल्यांकन हुआ",
      description: "सिग्नल इवेंट लौटा दिए गए",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "थ्रेशोल्ड का मूल्यांकन फ़ेल हुआ",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
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
