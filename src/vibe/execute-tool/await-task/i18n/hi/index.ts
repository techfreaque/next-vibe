import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    awaitTask: "टास्क का इंतज़ार",
  },
  post: {
    title: "टास्क का इंतज़ार",
    titleShort: "टास्क का इंतज़ार",
    description:
      "भेजे गए बैकग्राउंड टास्क का इंतज़ार करें। पहले से पूरा हो तो तुरंत लौटता है, वरना टास्क खत्म होने तक AI स्ट्रीम रोक देता है।",
    fields: {
      taskId: {
        label: "टास्क ID",
        description: "execute-tool का लौटाया टास्क ID (detach या wakeUp मोड)।",
      },
      status: {
        title: "स्टेटस",
        description: "टास्क का मौजूदा स्टेटस।",
      },
      result: {
        title: "नतीजा",
        description: "टूल का आउटपुट (पूरा होने पर मौजूद)।",
      },
      waiting: {
        title: "इंतज़ार में",
        description: "स्ट्रीम टास्क के इंतज़ार में रुकी हो तो true।",
      },
      originalToolName: {
        title: "टूल",
        description: "जो टूल भेजा गया।",
      },
      originalArgs: {
        title: "आर्ग्युमेंट",
        description: "भेजे गए टूल के इनपुट आर्ग्युमेंट।",
      },
    },
    dynamicTitle: "इंतज़ार: {{toolName}}",
    widget: {
      noToolName: "टूल का नाम उपलब्ध नहीं।",
      resolving: "टूल तय हो रहा है...",
      unknownTool: "अज्ञात टूल: {{toolName}}",
    },
    status: {
      waiting: "इंतज़ार में",
      complete: "पूरा",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "taskId गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "टास्क पर वेटर रजिस्टर नहीं हो सका",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपको इस टास्क का इंतज़ार करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "टास्क नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुई",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टास्क की स्थिति में टकराव",
      },
    },
    success: {
      title: "हो गया",
      description: "टास्क पूरा हुआ",
    },
  },
};
