import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    source: {
      public: "पब्लिक (गेस्ट)",
      usersFree: "फ़्री यूज़र",
      paid: "पेड",
      gifted: "उपहार में मिले",
      internal: "आंतरिक (एडमिन)",
      unattributed: "बिना स्रोत (पुराना रिकॉर्ड)",
    },
  },
  post: {
    titleShort: "स्रोत के हिसाब से इस्तेमाल",
    title: "स्रोत के हिसाब से खर्च हुए क्रेडिट",
    description:
      "खर्च हुए क्रेडिट, इस हिसाब से बँटे कि किसने खर्च किए और कौन से क्रेडिट लगे: पब्लिक (गेस्ट), फ़्री यूज़र, पेड, उपहार, आंतरिक, बिना स्रोत। सभी स्रोत जुड़कर कुल खर्च बनते हैं।",
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
      source: {
        label: "स्रोत",
        description:
          "कौन से क्रेडिट गिनने हैं: पब्लिक गेस्ट, साइन-इन फ़्री क्रेडिट, पेड (सब्सक्रिप्शन + पैक), उपहार (एडमिन के दिए), आंतरिक (एडमिन अकाउंट) या बिना स्रोत वाला पुराना रिकॉर्ड",
      },
      result: {
        label: "खर्च हुए क्रेडिट",
        description: "आउटपुट टाइम सीरीज़",
      },
      meta: {
        label: "मेटा",
        description: "नोड एक्ज़ीक्यूशन मेटाडेटा",
      },
    },
    success: {
      title: "स्रोत के हिसाब से क्रेडिट की गणना हुई",
      description: "स्रोत के हिसाब से खर्च की सीरीज़ मिली",
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
