import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "स्क्रिप्ट इवैल्यूएटर",
    titleShort: "स्क्रिप्ट इवैल",
    description: "यूज़र के दिए फ़ंक्शन बॉडी से सैंडबॉक्स में कस्टम मूल्यांकन",
    fields: {
      source: { label: "सोर्स", description: "इनपुट टाइम सीरीज़" },
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-अवधि" },
      range: { label: "रेंज", description: "मूल्यांकन की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "वॉर्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      fn: {
        label: "फ़ंक्शन",
        description: "फ़ंक्शन बॉडी: inputs ऐरे लेता है, SignalEvent[] लौटाता है",
      },
      signals: { label: "सिग्नल", description: "आउटपुट सिग्नल इवेंट" },
    },
    success: {
      title: "स्क्रिप्ट का मूल्यांकन हो गया",
      description: "सिग्नल इवेंट लौटाए गए",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "स्क्रिप्ट का मूल्यांकन फ़ेल हुआ",
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
