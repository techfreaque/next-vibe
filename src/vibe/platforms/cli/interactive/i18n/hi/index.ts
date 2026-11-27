import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  capture: {
    title: "इंटरैक्टिव फ़्रेम कैप्चर करें",
    titleShort: "फ़्रेम कैप्चर",
    description: "चल रहे vibe इंटरैक्टिव सेशन का मौजूदा रेंडर किया फ़्रेम पढ़ें",
    form: {
      fields: {
        pid: {
          label: "सेशन PID",
          description: "इंटरैक्टिव सेशन का PID। न दें तो अपने आप पता लगाया जाता है।",
        },
      },
    },
    response: {
      fields: {
        content: "फ़्रेम की सामग्री",
        logs: "एरर लॉग",
        pid: "सेशन PID",
      },
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
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित",
      },
      notFound: {
        title: "कोई सेशन नहीं",
        description: "कोई सक्रिय इंटरैक्टिव सेशन नहीं मिला",
        noSession:
          "कोई इंटरैक्टिव सेशन नहीं चल रहा। शुरू करें: vibe <alias> -i --agent-control",
        deadSession: "सेशन PID {{pid}} अब नहीं चल रहा।",
        frameNotFound:
          "सेशन {{pid}} का अभी कोई रेंडर किया फ़्रेम नहीं है। थोड़ा रुककर फिर कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      conflict: {
        title: "टकराव",
        description: "सेशन टकराव",
      },
    },
    success: {
      title: "फ़्रेम कैप्चर हुआ",
      description: "मौजूदा फ़्रेम सफलतापूर्वक मिल गया",
    },
  },
  sendKeys: {
    title: "इंटरैक्टिव सेशन को कीज़ भेजें",
    titleShort: "कीज़ भेजें",
    description: "चल रहे vibe इंटरैक्टिव सेशन में कीस्ट्रोक डालें और अपडेट हुआ फ़्रेम लौटाएँ",
    form: {
      fields: {
        keys: {
          label: "कीज़",
          description:
            "भेजने की की: Enter, Tab, Escape, Up, Down, Left, Right, Backspace, Space, या सीधा टेक्स्ट",
        },
        pid: {
          label: "सेशन PID",
          description: "इंटरैक्टिव सेशन का PID। न दें तो अपने आप पता लगाया जाता है।",
        },
        waitMs: {
          label: "इंतज़ार (ms)",
          description:
            "कीज़ डालने के बाद फ़्रेम पढ़ने से पहले इंतज़ार के मिलीसेकंड। डिफ़ॉल्ट 500।",
        },
      },
    },
    response: {
      fields: {
        content: "फ़्रेम की सामग्री",
        logs: "एरर लॉग",
        pid: "सेशन PID",
      },
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
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित",
      },
      notFound: {
        title: "कोई सेशन नहीं",
        description: "कोई सक्रिय इंटरैक्टिव सेशन नहीं मिला",
        noSession:
          "कोई इंटरैक्टिव सेशन नहीं चल रहा। शुरू करें: vibe <alias> -i --agent-control",
        deadSession: "सेशन PID {{pid}} अब नहीं चल रहा।",
        keysNotFound: "सेशन {{pid}} अभी कीज़ नहीं ले रहा। थोड़ा रुककर फिर कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      conflict: {
        title: "टकराव",
        description: "सेशन टकराव",
      },
    },
    success: {
      title: "कीज़ भेजी गईं",
      description: "कीस्ट्रोक भेजे गए और फ़्रेम अपडेट हुआ",
    },
  },
};
