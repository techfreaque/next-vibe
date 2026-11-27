import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटाबेस ऑपरेशन",

  tag: "sql",
  post: {
    title: "SQL चलाएँ",
    titleShort: "SQL चलाएँ",
    description: "डेटाबेस पर SQL क्वेरी चलाएँ",
    form: {
      title: "SQL क्वेरी कॉन्फ़िगरेशन",
      description: "SQL क्वेरी पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "क्वेरी रिस्पॉन्स",
      description: "SQL क्वेरी एक्ज़ीक्यूशन के नतीजे",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "SQL चलाने के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत SQL क्वेरी या पैरामीटर",
      },
      server: {
        title: "सर्वर एरर",
        description: "SQL चलाते समय इंटरनल सर्वर एरर",
      },
      internal: {
        title: "इंटरनल एरर",
        description: "SQL क्वेरी चलना फ़ेल हुआ",
      },
      database: {
        title: "डेटाबेस एरर",
        description: "क्वेरी चलाते समय डेटाबेस एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "SQL चलाते समय कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "SQL चलाते समय नेटवर्क एरर",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "SQL चलाने के लिए पर्याप्त अनुमति नहीं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "SQL रिसोर्स नहीं मिले",
      },
      conflict: {
        title: "टकराव",
        description: "SQL टकराव मिला",
      },
    },
    success: {
      title: "क्वेरी चल गई",
      description: "SQL क्वेरी सफलतापूर्वक चली",
    },
  },
  fields: {
    query: {
      title: "SQL क्वेरी",
      description: "चलाने वाली SQL क्वेरी",
    },
    queryFile: {
      title: "क्वेरी फ़ाइल का पाथ",
      description: "चलाने वाली SQL फ़ाइल का पाथ",
      placeholder: "/path/to/query.sql",
    },
    dryRun: {
      title: "ड्राई रन",
      description: "चलाए बिना क्वेरी का प्रीव्यू देखें",
    },
    verbose: {
      title: "विस्तृत आउटपुट",
      description: "क्वेरी की विस्तृत जानकारी दिखाएँ",
    },
    limit: {
      title: "रो की सीमा",
      description: "लौटाई जाने वाली रो की अधिकतम संख्या (1-1000)",
    },
    success: {
      title: "सफलता स्टेटस",
    },
    output: {
      title: "आउटपुट",
    },
    results: {
      title: "क्वेरी के नतीजे",
    },
    rowCount: {
      title: "रो की गिनती",
    },
    queryType: {
      title: "क्वेरी का प्रकार",
    },
  },
};
