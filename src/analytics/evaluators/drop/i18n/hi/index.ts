import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "तेज़ गिरावट",
    titleShort: "गिरावट",
    description: "तब चलता है जब कोई मान अपने ही ट्रेलिंग औसत से तेज़ी से नीचे गिरे",
    fields: {
      source: { label: "स्रोत", description: "इनपुट टाइम सीरीज़" },
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-सीमा" },
      range: { label: "रेंज", description: "मूल्यांकन की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "वार्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      window: {
        label: "ट्रेलिंग बार",
        description: "बेसलाइन औसत बनाने के लिए पिछले कितने बार",
      },
      dropPct: {
        label: "गिरावट",
        description:
          "बेसलाइन × (1 − drop) से नीचे जाने पर चलता है। 0.5 = 50% गिरावट",
      },
      minBaseline: {
        label: "न्यूनतम बेसलाइन",
        description: "वे बार छोड़ दें जिनकी बेसलाइन इससे कम है (डेटा बहुत कम)",
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
      title: "गिरावट का मूल्यांकन हुआ",
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
        description: "गिरावट का मूल्यांकन फ़ेल हुआ",
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
