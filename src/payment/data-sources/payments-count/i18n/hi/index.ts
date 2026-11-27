import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "चुकाए गए पेमेंट",
    titleShort: "चुकाए गए पेमेंट",
    description:
      "हर बकेट में वसूले गए पेमेंट: पैक, नए सब्सक्रिप्शन और रिन्यूअल। सफल या बाद में रिफ़ंड हुए, एडमिन अकाउंट छोड़कर।",
    fields: {
      resolution: {
        label: "रेज़ोल्यूशन",
        description: "गणना की समय-सीमा",
      },
      range: {
        label: "रेंज",
        description: "क्वेरी की समय-सीमा",
      },
      lookback: {
        label: "लुकबैक",
        description: "रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      result: {
        label: "चुकाए गए पेमेंट",
        description: "आउटपुट टाइम सीरीज़",
      },
      meta: {
        label: "मेटा",
        description: "नोड एक्ज़ीक्यूशन का मेटाडेटा",
      },
    },
    success: {
      title: "चुकाए गए पेमेंट की गणना हो गई",
      description: "चुकाए गए पेमेंट की सीरीज़ लौटा दी गई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "क्वेरी फ़ेल हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
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
