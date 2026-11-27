import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटाबेस ऑपरेशन",

  tag: "seed",
  post: {
    title: "डेटाबेस सीड",
    titleShort: "DB सीड करें",
    description: "डेटाबेस में डेटा सीड करें",
    form: {
      title: "सीड कॉन्फ़िगरेशन",
      description: "सीडिंग पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "सीड रिस्पॉन्स",
      description: "डेटाबेस सीडिंग ऑपरेशन के नतीजे",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "डेटाबेस सीडिंग के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत सीड पैरामीटर दिए गए",
      },
      server: {
        title: "सर्वर एरर",
        description: "सीडिंग के दौरान इंटरनल सर्वर एरर",
        detail: "डेटाबेस सीडिंग फ़ेल हुई: {{error}}",
      },
      internal: {
        title: "इंटरनल एरर",
        description: "डेटाबेस सीडिंग ऑपरेशन फ़ेल हुआ",
      },
      database: {
        title: "डेटाबेस एरर",
        description: "सीडिंग के दौरान डेटाबेस एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "सीडिंग के दौरान कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सीडिंग के दौरान नेटवर्क एरर",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "डेटाबेस सीडिंग के लिए पर्याप्त अनुमति नहीं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "सीड रिसोर्स नहीं मिले",
      },
      conflict: {
        title: "टकराव",
        description: "सीडिंग के दौरान डेटा टकराव मिला",
      },
    },
    success: {
      title: "डेटाबेस सीड हो गया",
      description: "डेटाबेस सीडिंग सफलतापूर्वक पूरी हुई",
    },
  },
  fields: {
    environment: {
      title: "एनवायरनमेंट",
      description: "टारगेट सीड एनवायरनमेंट (dev, test, prod)",
    },
    success: {
      title: "सफलता स्टेटस",
    },
    seedsExecuted: {
      title: "चलाए गए सीड",
    },
    collections: {
      title: "सीड कलेक्शन",
      item: {
        title: "कलेक्शन",
      },
      name: {
        title: "कलेक्शन का नाम",
      },
      status: {
        title: "स्टेटस",
      },
      recordsCreated: {
        title: "बने रिकॉर्ड",
      },
    },
    totalRecords: {
      title: "कुल रिकॉर्ड",
    },
    duration: {
      title: "अवधि (ms)",
    },
  },
};
