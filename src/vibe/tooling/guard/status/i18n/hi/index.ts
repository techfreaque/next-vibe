import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "गार्ड",
  post: {
    title: "गार्ड स्थिति",
    titleShort: "गार्ड स्थिति",
    description: "गार्ड एनवायरनमेंट की स्थिति जाँचें",
    tag: "स्थिति",
    container: {
      title: "गार्ड स्थिति कॉन्फ़िगरेशन",
      description: "स्थिति जाँच के पैरामीटर सेट करें",
    },
    fields: {
      projectPath: {
        title: "प्रोजेक्ट पाथ",
        description: "गार्ड प्रोजेक्ट का पाथ",
        placeholder: "/path/to/project",
      },
      guardId: {
        title: "गार्ड ID",
        description: "गार्ड की यूनिक पहचान",
        placeholder: "guard-123",
      },
      username: {
        title: "यूज़रनेम",
      },
      status: {
        title: "स्थिति",
      },
      createdAt: {
        title: "बनने का समय",
      },
      securityLevel: {
        title: "सिक्योरिटी स्तर",
      },
      isolationMethod: {
        title: "आइसोलेशन का तरीक़ा",
      },
      isRunning: {
        title: "चल रहा है",
      },
      userHome: {
        title: "यूज़र होम",
      },
      listAll: {
        title: "सभी गार्ड की सूची",
        description: "सभी गार्ड एनवायरनमेंट की सूची",
      },
      success: {
        title: "सफल",
      },
      output: {
        title: "आउटपुट",
      },
      guards: {
        title: "गार्ड",
      },
      totalGuards: {
        title: "कुल गार्ड",
      },
      activeGuards: {
        title: "सक्रिय गार्ड",
      },
    },
    form: {
      title: "स्थिति कॉन्फ़िगरेशन",
      description: "स्थिति के पैरामीटर सेट करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "स्थिति रिस्पॉन्स डेटा",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव हुआ",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      statusFailed: "गार्ड की स्थिति जाँचते समय आंतरिक एरर: {{detail}}",
    },
    success: {
      title: "सफल",
      description: "कार्रवाई सफलतापूर्वक पूरी हुई",
    },
  },
};
