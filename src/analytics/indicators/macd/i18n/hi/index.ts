import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "MACD",
    titleShort: "MACD",
    description:
      "Moving Average Convergence Divergence: ट्रेंड फ़ॉलो करने वाला मोमेंटम इंडिकेटर",
    fields: {
      source: { label: "स्रोत", description: "इनपुट टाइम सीरीज़" },
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-सीमा" },
      range: { label: "रेंज", description: "गणना की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "वार्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      fastPeriod: {
        label: "फ़ास्ट अवधि",
        description: "फ़ास्ट EMA अवधि (1–100)",
      },
      slowPeriod: {
        label: "स्लो अवधि",
        description: "स्लो EMA अवधि (1–200)",
      },
      signalPeriod: {
        label: "सिग्नल अवधि",
        description: "सिग्नल लाइन EMA अवधि (1–50)",
      },
      macd: { label: "MACD", description: "MACD लाइन (फ़ास्ट EMA − स्लो EMA)" },
      signal: {
        label: "सिग्नल",
        description: "सिग्नल लाइन (MACD लाइन का EMA)",
      },
      histogram: {
        label: "हिस्टोग्राम",
        description: "हिस्टोग्राम (MACD − सिग्नल)",
      },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन का मेटाडेटा" },
    },
    success: {
      title: "MACD की गणना हो गई",
      description: "MACD, सिग्नल और हिस्टोग्राम सीरीज़ लौटा दी गईं",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "MACD की गणना फ़ेल हुई",
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
