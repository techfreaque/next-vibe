import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम",
  get: {
    title: "सीक्रेट key बनाएँ",
    titleShort: "key बनाएँ",
    description: "क्रिप्टोग्राफ़िक रूप से सुरक्षित 64 अक्षर की रैंडम hex key बनाएँ",
    tags: {
      generateKey: "key बनाएँ",
    },
    response: {
      key: {
        title: "बनी हुई key",
      },
    },
    success: {
      title: "key बन गई",
      description: "सुरक्षित key सफलतापूर्वक बनी",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      server: {
        title: "सर्वर एरर",
        description: "key बन नहीं सकी",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
    },
  },
};
