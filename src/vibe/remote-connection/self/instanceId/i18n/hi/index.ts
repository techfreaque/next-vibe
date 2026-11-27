import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंट",
  tags: {
    remoteConnection: "रिमोट कनेक्शन",
  },
  get: {
    title: "इस इंस्टेंस की ID",
    titleShort: "इंस्टेंस ID",
    description: "इस मशीन पर अपने इंस्टेंस की पहचान पढ़ें",
    instanceId: {
      label: "इंस्टेंस ID",
      description: "इस इंस्टेंस की पहचान",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "लॉग इन नहीं है",
        description: "इस इंस्टेंस की ID पढ़ने के लिए लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस अस्वीकृत",
        description: "आपको इस इंस्टेंस की ID पढ़ने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इंस्टेंस की पहचान नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंस्टेंस ID पढ़ते समय एरर हुई",
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
    success: {
      title: "इंस्टेंस ID",
      description: "इस इंस्टेंस की ID मिल गई",
    },
  },
};
