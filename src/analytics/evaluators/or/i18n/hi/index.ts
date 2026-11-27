import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "OR",
    titleShort: "OR",
    description:
      "किसी दिए टाइमस्टैम्प पर कोई भी इनपुट सिग्नल फ़ायर हो तो फ़ायर होता है",
    fields: {
      signals: {
        label: "सिग्नल स्ट्रीम",
        description: "OR करने के लिए सिग्नल स्ट्रीम की ऐरे",
      },
      result: {
        label: "नतीजा",
        description: "आउटपुट सिग्नल इवेंट",
      },
    },
    success: {
      title: "OR जाँचा गया",
      description: "सिग्नल इवेंट लौटाए गए",
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
        description: "OR की जाँच फ़ेल हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
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
        title: "बिना सेव बदलाव",
        description: "पहले बदलाव सेव करें",
      },
    },
  },
};
