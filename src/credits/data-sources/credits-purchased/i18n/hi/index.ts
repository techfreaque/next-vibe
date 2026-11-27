import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    kind: {
      paid: "पेड (पैक + सब्सक्रिप्शन)",
      packs: "पेड पैक",
      subscriptions: "सब्सक्रिप्शन क्रेडिट",
      gifted: "गिफ़्ट (एडमिन ग्रांट)",
    },
  },
  post: {
    titleShort: "जारी क्रेडिट",
    title: "जारी क्रेडिट (पेड, गिफ़्ट)",
    description:
      "हर बकेट में वॉलेट में जुड़े क्रेडिट, क्रेडिट में (पैसे में नहीं): असली चेकआउट से पेड पैक और सब्सक्रिप्शन क्रेडिट, या गिफ़्ट किए गए एडमिन ग्रांट (टेस्टर, क्रिएटर, सद्भावना)।",
    fields: {
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-सीमा" },
      range: { label: "रेंज", description: "क्वेरी की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      kind: {
        label: "प्रकार",
        description:
          "कौन से ग्रांट गिनने हैं: पेड पैक + सब्सक्रिप्शन, सिर्फ़ पैक, सिर्फ़ सब्सक्रिप्शन, या गिफ़्ट किए गए एडमिन ग्रांट",
      },
      result: {
        label: "जारी क्रेडिट",
        description: "आउटपुट टाइम सीरीज़",
      },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन का मेटाडेटा" },
    },
    success: {
      title: "ख़रीदे गए क्रेडिट की गणना हो गई",
      description: "ख़रीदे गए क्रेडिट की सीरीज़ लौटा दी गई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      server: { title: "सर्वर एरर", description: "क्वेरी फ़ेल हुई" },
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
