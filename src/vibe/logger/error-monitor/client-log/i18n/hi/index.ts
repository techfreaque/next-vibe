import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम",

  enums: {
    level: {
      error: "एरर",
      warn: "चेतावनी",
    },
  },

  post: {
    title: "क्लाइंट एरर रिपोर्ट करें",
    titleShort: "एरर लॉग करें",
    description: "ब्राउज़र की कोई एरर या चेतावनी एरर लॉग में सेव करें।",
    tags: {
      monitoring: "मॉनिटरिंग",
    },
    fields: {
      level: {
        label: "स्तर",
        description: "लॉग स्तर: error या warn",
      },
      message: {
        label: "संदेश",
        description: "एरर संदेश",
        placeholder: "कुछ गड़बड़ हुई",
      },
      metadata: {
        label: "मेटाडेटा",
        description: "अतिरिक्त संरचित संदर्भ",
      },
    },
    response: {
      ok: {
        title: "स्वीकृत",
      },
    },
    success: {
      title: "लॉग हुआ",
      description: "क्लाइंट एरर सेव हुई",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस नहीं मिला",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      server: {
        title: "सर्वर एरर",
        description: "एरर लॉग सेव नहीं हो सका",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        titleChanges: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव हुआ",
      },
    },
  },
};
