import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "क्रॉसओवर",
    titleShort: "क्रॉसओवर",
    description: "तब फ़ायर होता है जब सीरीज़ A सीरीज़ B के ऊपर पार करती है",
    fields: {
      seriesA: {
        label: "सीरीज़ A",
        description: "पहली इनपुट टाइम सीरीज़",
      },
      seriesB: {
        label: "सीरीज़ B",
        description: "दूसरी इनपुट टाइम सीरीज़",
      },
      resolution: {
        label: "रेज़ोल्यूशन",
        description: "कंप्यूटेशन की समय-सीमा",
      },
      range: {
        label: "रेंज",
        description: "जाँचने की समय सीमा",
      },
      lookback: {
        label: "लुकबैक",
        description: "वार्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      signals: {
        label: "सिग्नल",
        description: "आउटपुट सिग्नल इवेंट",
      },
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "जाँचें",
      loadingText: "जाँच हो रही है…",
    },
    success: {
      title: "क्रॉसओवर जाँचा गया",
      description: "सिग्नल इवेंट लौटाए गए",
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
        description: "क्रॉसओवर की जाँच फ़ेल हुई",
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
