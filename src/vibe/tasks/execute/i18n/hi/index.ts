import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "टास्क एक्ज़ीक्यूशन",
  tags: {
    execute: "चलाएँ",
  },
  errors: {
    executeTask: "टास्क चलाना फ़ेल हुआ",
    forbidden: "आपको यह टास्क चलाने की अनुमति नहीं है",
    alreadyRunning: "टास्क पहले से चल रहा है",
    notFound: "टास्क {{taskId}} नहीं मिला",
  },
  post: {
    title: "टास्क चलाएँ",
    titleShort: "टास्क चलाएँ",
    description: "ID से एक टास्क ट्रिगर करें और नतीजा तुरंत पाएँ",
    container: {
      title: "टास्क एक्ज़ीक्यूशन",
      description: "किसी ख़ास टास्क को चलाएँ और उसके नतीजे का इंतज़ार करें",
    },
    fields: {
      taskId: {
        label: "टास्क key",
        description: "चलाए जाने वाले टास्क की ID",
      },
      success: {
        title: "सफल",
      },
      message: {
        title: "संदेश",
      },
    },
    response: {
      taskId: "टास्क ID",
      taskName: "टास्क का नाम",
      executedAt: "चलाने का समय",
      duration: "अवधि (ms)",
      status: "स्थिति",
      output: "आउटपुट",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      internal: {
        title: "आंतरिक एरर",
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
        description: "आपको यह टास्क चलाने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "टास्क नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "टास्क पहले से चल रहा है",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
    },
    submitButton: {
      label: "टास्क चलाएँ",
      loadingText: "चल रहा है...",
    },
    success: {
      title: "सफल",
      description: "टास्क सफलतापूर्वक चला",
    },
  },
};
