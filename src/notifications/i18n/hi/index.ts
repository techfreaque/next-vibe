import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "नोटिफ़िकेशन",
  tags: {
    notifications: "notifications",
    list: "list",
    unread: "unread",
    read: "read",
  },
  enums: {
    type: {
      taskComplete: "टास्क पूरा हुआ",
      taskFailed: "टास्क फ़ेल हुआ",
      earning: "कमाई",
      dreamerResult: "Dreamer का नतीजा",
      creditLow: "क्रेडिट कम",
      system: "सिस्टम",
    },
  },
  templates: {
    taskComplete: {
      title: "{{name}} पूरा हुआ",
      body: "आपका बैकग्राउंड टास्क पूरा हो गया। नतीजा खोलें।",
    },
    taskFailed: {
      title: "{{name}} फ़ेल हुआ",
      body: "आपके बैकग्राउंड टास्क में एरर आई। वजह देखने के लिए खोलें।",
    },
    earning: {
      title: "आपने {{amount}} क्रेडिट कमाए",
      body: "एक रेफ़रल कमाई की होल्ड अवधि पूरी हो गई और अब खर्च की जा सकती है।",
    },
    dreamerResult: {
      title: "{{name}} का नतीजा आ गया",
      body: "आपका Dreamer रन पूरा हुआ।",
    },
    creditLow: {
      title: "क्रेडिट कम पड़ रहे हैं",
      body: "{{amount}} क्रेडिट बचे हैं। अगला रन रुकने से पहले टॉप अप करें।",
    },
    system: {
      title: "{{name}}",
      body: "",
    },
    fallbackTaskName: "बैकग्राउंड टास्क",
  },
  list: {
    get: {
      title: "नोटिफ़िकेशन",
      titleShort: "नोटिफ़िकेशन",
      description: "आपके पीछे जो भी पूरा हुआ, सब यहाँ। अनपढ़े पहले।",
      emptyTitle: "कुछ नया नहीं",
      emptyHint: "पूरे हुए टास्क और कमाई यहाँ दिखेंगे।",
      markAllRead: "सब पढ़ा हुआ करें",
      unread: "अनपढ़े",
      response: {
        notifications: {
          id: "ID",
          type: "टाइप",
          title: "शीर्षक",
          body: "मैसेज",
          link: "लिंक",
          read: "पढ़ा",
          createdAt: "मिला",
        },
        unreadCount: "अनपढ़े",
      },
      paginationInfo: {
        label: "पेजिनेशन",
      },
    },
  },
  unreadCount: {
    get: {
      title: "अनपढ़े नोटिफ़िकेशन की संख्या",
      titleShort: "अनपढ़े की संख्या",
      description: "कितने नोटिफ़िकेशन आपने अभी नहीं खोले।",
      response: {
        unreadCount: "अनपढ़े नोटिफ़िकेशन",
      },
    },
  },
  read: {
    post: {
      title: "नोटिफ़िकेशन पढ़ा हुआ करें",
      titleShort: "पढ़ा हुआ करें",
      description: "एक नोटिफ़िकेशन या सभी को पढ़ा हुआ करें। id भेजें या all=true।",
      id: {
        label: "नोटिफ़िकेशन ID",
        description: "जिस नोटिफ़िकेशन को पढ़ा हुआ करना है",
      },
      all: {
        label: "सब कुछ पढ़ा हुआ करें",
        description: "पूरी अनपढ़ी सूची साफ़ करें",
      },
      response: {
        updatedCount: "पढ़ा हुआ किया",
      },
      submit: {
        label: "पढ़ा हुआ करें",
        loading: "अपडेट हो रहा है...",
      },
    },
  },
  bell: {
    label: "नोटिफ़िकेशन",
    empty: "आप पूरी तरह अपडेट हैं।",
    markAllRead: "सब पढ़ा हुआ करें",
    viewAll: "सब देखें",
    loading: "लोड हो रहा है...",
    unreadBadge: "{{count}} अनपढ़े नोटिफ़िकेशन",
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "नोटिफ़िकेशन id भेजें, या all=true",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क कनेक्शन एरर",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "अपने नोटिफ़िकेशन देखने के लिए साइन इन करें",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "एक्सेस प्रतिबंधित",
    },
    notFound: {
      title: "नहीं मिला",
      description: "नोटिफ़िकेशन नहीं मिला",
    },
    server: {
      title: "सर्वर एरर",
      description: "आंतरिक सर्वर एरर हुई",
    },
    serverError: {
      title: "सर्वर एरर",
      description: "आंतरिक सर्वर एरर हुई",
      detail: "हमारी तरफ़ कुछ टूट गया: {{error}}",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर हुई",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "नोटिफ़िकेशन की स्थिति में टकराव",
    },
    idOrAllRequired: "नोटिफ़िकेशन id भेजें, या all=true।",
  },
  success: {
    title: "सफल",
    description: "काम सफलतापूर्वक पूरा हुआ",
  },
};
