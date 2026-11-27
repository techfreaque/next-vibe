import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "फ़ीचर के हिसाब से इस्तेमाल",
    title: "फ़ीचर के साथ क्रेडिट इस्तेमाल",
    description: "फ़ीचर टैग के साथ क्रेडिट इस्तेमाल के ट्रांज़ैक्शन, हर रेज़ोल्यूशन बकेट में",
    fields: {
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-अवधि" },
      range: { label: "रेंज", description: "क्वेरी की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      result: {
        label: "फ़ीचर के साथ क्रेडिट इस्तेमाल",
        description: "आउटपुट टाइम सीरीज़",
      },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन मेटाडेटा" },
    },
    success: {
      title: "फ़ीचर के साथ क्रेडिट इस्तेमाल की गणना हो गई",
      description: "फ़ीचर के साथ क्रेडिट इस्तेमाल की सीरीज़ लौटाई गई",
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
