import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "ग्राफ़ कॉन्फ़िग चलाएँ",
    titleShort: "रन कॉन्फ़िग",
    description: "बिना सेव किए ग्राफ़ के इनलाइन कॉन्फ़िग से ग्राफ़ चलाएँ",
    fields: {
      config: {
        label: "ग्राफ़ कॉन्फ़िग",
        description: "इनलाइन ग्राफ़ कॉन्फ़िगरेशन (नोड, एज, ट्रिगर)",
      },
      rangeFrom: {
        label: "से",
        description: "रेंज की शुरुआत (ISO datetime)",
      },
      rangeTo: {
        label: "तक",
        description: "रेंज का अंत (ISO datetime)",
      },
    },
    response: {
      nodeCount: "चलाए गए नोड",
      errorCount: "एरर",
      errors: "एरर का ब्योरा",
    },
    success: {
      title: "कॉन्फ़िग चला",
      description: "ग्राफ़ कॉन्फ़िग सफलतापूर्वक चला",
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
        description: "ग्राफ़ एक्ज़ीक्यूशन फ़ेल हुआ",
        detail: "ग्राफ़ एक्ज़ीक्यूशन फ़ेल हुआ: {{error}}",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "ग्राफ़ कॉन्फ़िग या पैरामीटर गलत हैं",
        detail: "ग्राफ़ कॉन्फ़िग गलत है: {{error}}",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "रिसोर्स टकराव",
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
