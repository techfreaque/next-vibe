import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "मर्ज",
    titleShort: "मर्ज",
    description: "मर्ज: टाइमस्टैंप के हिसाब से मिलाकर दो टाइम सीरीज़ जोड़ता है",
    fields: {
      a: { label: "सीरीज़ A", description: "पहली इनपुट टाइम सीरीज़" },
      b: { label: "सीरीज़ B", description: "दूसरी इनपुट टाइम सीरीज़" },
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-सीमा" },
      range: { label: "रेंज", description: "गणना की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "वार्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      result: { label: "मर्ज की हुई", description: "आउटपुट टाइम सीरीज़ (A + B)" },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन का मेटाडेटा" },
    },
    success: {
      title: "मर्ज की गणना हो गई",
      description: "मर्ज की हुई सीरीज़ लौटा दी गई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "मर्ज की गणना फ़ेल हुई",
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
