import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटाबेस कार्रवाइयाँ",
  tag: "database",
  post: {
    title: "डेटाबेस पिंग",
    titleShort: "DB पिंग",
    description: "डेटाबेस की कनेक्टिविटी और सेहत जाँचें",
    form: {
      title: "पिंग कॉन्फ़िगरेशन",
      description: "डेटाबेस पिंग के पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "पिंग रिस्पॉन्स डेटा",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "डेटाबेस कार्रवाइयों के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "पिंग रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "डेटाबेस पिंग करते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "डेटाबेस पिंग के दौरान कोई अज्ञात एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "डेटाबेस से कनेक्ट करते समय नेटवर्क एरर हुई",
        detail: "डेटाबेस पिंग फ़ेल हुआ: {{error}}",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित: अनुमतियाँ कम हैं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "डेटाबेस रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "कार्रवाई के दौरान डेटा में टकराव हुआ",
      },
    },
    success: {
      title: "डेटाबेस पिंग सफल",
      description: "डेटाबेस से सफलतापूर्वक कनेक्ट हुआ",
    },
  },
  fields: {
    silent: {
      title: "साइलेंट मोड",
      description: "आउटपुट मैसेज के बिना पिंग चलाएँ",
    },
    keepConnectionOpen: {
      title: "कनेक्शन खुला रखें",
      description: "पिंग के बाद डेटाबेस कनेक्शन खुला रखें",
    },
    success: {
      title: "सफलता स्टेटस",
      content: "सफल",
    },
    isAccessible: {
      title: "डेटाबेस उपलब्ध",
      content: "उपलब्ध",
    },
    output: {
      title: "आउटपुट मैसेज",
      content: "आउटपुट",
    },
    connectionInfo: {
      title: "कनेक्शन की जानकारी",
      totalConnections: {
        content: "कुल कनेक्शन",
      },
      idleConnections: {
        content: "निष्क्रिय कनेक्शन",
      },
      waitingClients: {
        content: "इंतज़ार करते क्लाइंट",
      },
    },
  },
  status: {
    success: "सफल",
    failed: "फ़ेल",
    timeout: "टाइमआउट",
    error: "एरर",
  },
  connectionType: {
    primary: "Primary",
    replica: "Replica",
    cache: "Cache",
  },
};
