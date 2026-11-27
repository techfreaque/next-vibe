import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    messageType: {
      all: "सभी टाइप",
      system: "सिस्टम",
      transactional: "ट्रांज़ैक्शनल",
      notification: "नोटिफ़िकेशन",
      marketing: "मार्केटिंग",
      leadCampaign: "लीड कैंपेन",
      userCommunication: "यूज़र मैसेज",
    },
  },
  post: {
    title: "भेजे मैसेज",
    titleShort: "भेजे मैसेज",
    description: "हर रेज़ोल्यूशन बकेट में भेजे गए आउटबाउंड मैसेज",
    fields: {
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-अवधि" },
      range: { label: "रेंज", description: "क्वेरी की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      messageType: {
        label: "मैसेज टाइप",
        description: "सभी भेजे मैसेज गिनें या सिर्फ़ एक टाइप",
      },
      result: { label: "भेजे मैसेज", description: "आउटपुट टाइम सीरीज़" },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन मेटाडेटा" },
    },
    success: {
      title: "भेजे मैसेज की गणना हो गई",
      description: "भेजे मैसेज की सीरीज़ लौटाई गई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
      server: { title: "सर्वर एरर", description: "क्वेरी फ़ेल हुई" },
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
