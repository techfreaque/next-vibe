import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "ग्राफ़ ट्रिगर करें",
    titleShort: "ग्राफ़ ट्रिगर करें",
    description: "ऑन-डिमांड ग्राफ़ एक्ज़ीक्यूशन हाथ से ट्रिगर करें",
    fields: {
      id: { label: "ग्राफ़ ID", description: "ग्राफ़ का UUID" },
      rangeFrom: { label: "से", description: "रेंज की शुरुआत (ISO तारीख़)" },
      rangeTo: { label: "तक", description: "रेंज का अंत (ISO तारीख़)" },
    },
    response: {
      nodeCount: "चलाए गए नोड",
      errorCount: "एरर",
    },
    widget: {
      nodesExecuted: "चलाए गए नोड",
      errors: "एरर",
      errorDetails: "एरर का ब्योरा",
      nodeLabel: "नोड",
    },
    success: {
      title: "ग्राफ़ चल गया",
      description: "ग्राफ़ सफलतापूर्वक चला",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "ग्राफ़ का एक्ज़ीक्यूशन फ़ेल हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "गलत पैरामीटर",
      },
      notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
      conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
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
