import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "विंडो मैक्स",
    titleShort: "विंडो मैक्स",
    description: "रोलिंग विंडो मैक्सिमम: तय विंडो की सबसे ऊँची वैल्यू ट्रैक करता है",
    fields: {
      source: { label: "सोर्स", description: "इनपुट टाइम सीरीज़" },
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-अवधि" },
      range: { label: "रेंज", description: "गणना की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "वॉर्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      size: {
        label: "विंडो साइज़",
        description: "रोलिंग विंडो में पीरियड की संख्या (1–500)",
      },
      result: { label: "विंडो मैक्स", description: "आउटपुट टाइम सीरीज़" },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन मेटाडेटा" },
    },
    success: {
      title: "विंडो मैक्स की गणना हो गई",
      description: "विंडो मैक्सिमम सीरीज़ लौटाई गई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "विंडो मैक्स की गणना फ़ेल हुई",
      },
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
