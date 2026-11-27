import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    sharing: "शेयरिंग",
  },
  // Top-level keys used across methods
  empty: "", // For hidden/internal fields
  linkId: {
    label: "लिंक ID",
  },
  label: {
    label: "लेबल",
    description: "इस लिंक को पहचानने के लिए वैकल्पिक लेबल",
    placeholder: "इस शेयर लिंक का लेबल लिखें",
  },
  allowPosting: {
    label: "पोस्ट करने दें",
    description: "लिंक वालों को इस थ्रेड में मैसेज पोस्ट करने दें",
  },
  requireAuth: {
    label: "साइन इन ज़रूरी करें",
    description: "लिंक खोलने के लिए यूज़र को साइन इन करना होगा",
  },
  shareLink: {
    label: "लेबल",
    shareUrl: "शेयर URL",
    active: "सक्रिय",
    allowPosting: "पोस्ट करने दें",
    requireAuth: "ऑथ ज़रूरी",
    accessCount: "एक्सेस की गिनती",
    lastAccessedAt: "आखिरी एक्सेस",
    createdAt: "बनाया गया",
    editAction: "एडिट करें",
    deleteAction: "रद्द करें",
  },
  shareLinks: {
    emptyTitle: "कोई शेयर लिंक नहीं",
    emptyDescription: "इस थ्रेड को दूसरों के साथ शेयर करने के लिए शेयर लिंक बनाएँ",
  },
  get: {
    title: "शेयर लिंक देखें",
    titleShort: "शेयर लिंक",
    description: "किसी थ्रेड के सारे शेयर लिंक देखें",
    container: {
      title: "शेयर लिंक",
      description: "इस थ्रेड के सारे शेयर लिंक",
    },
    response: {
      shareLink: {
        title: "शेयर लिंक",
        id: {
          content: "लिंक ID",
        },
        token: {
          content: "शेयर टोकन",
        },
        label: {
          content: "लेबल",
        },
        allowPosting: {
          content: "पोस्ट करने दें",
        },
        requireAuth: {
          content: "ऑथ ज़रूरी",
        },
        active: {
          content: "सक्रिय",
        },
        accessCount: {
          content: "एक्सेस की गिनती",
        },
        lastAccessedAt: {
          content: "आखिरी एक्सेस",
        },
        createdAt: {
          content: "बनाया गया",
        },
        editAction: {
          text: "एडिट करें",
        },
        deleteAction: {
          text: "रद्द करें",
        },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर सही नहीं हैं",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "शेयर लिंक देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको ये शेयर लिंक देखने की अनुमति नहीं है",
      },
      removed: {
        title: "हटाया गया या रिव्यू में",
        description: "इस शेयर्ड थ्रेड की रिपोर्ट हुई थी और अब यह उपलब्ध नहीं है।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "थ्रेड या शेयर लिंक नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "शेयर लिंक नहीं मिल सके",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कुछ अनपेक्षित गड़बड़ी हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "यह रिसोर्स बदल चुका है",
      },
    },
    backButton: {
      label: "वापस",
    },
    success: {
      title: "सफल",
      description: "शेयर लिंक मिल गए",
    },
  },
  post: {
    title: "शेयर लिंक बनाएँ",
    titleShort: "शेयर लिंक",
    description: "किसी थ्रेड के लिए नया शेयर लिंक बनाएँ",
    container: {
      title: "नया शेयर लिंक",
      description: "अपना नया शेयर लिंक सेट करें",
    },
    label: {
      label: "लेबल",
      description: "इस लिंक को पहचानने के लिए वैकल्पिक लेबल",
      placeholder: "इस शेयर लिंक का लेबल लिखें",
    },
    allowPosting: {
      label: "पोस्ट करने दें",
      description: "लिंक वालों को इस थ्रेड में मैसेज पोस्ट करने दें",
    },
    requireAuth: {
      label: "साइन इन ज़रूरी करें",
      description: "लिंक खोलने के लिए यूज़र को साइन इन करना होगा",
    },
    response: {
      id: {
        content: "लिंक ID",
      },
      token: {
        content: "शेयर टोकन",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "शेयर लिंक के पैरामीटर सही नहीं हैं",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "शेयर लिंक बनाने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "सिर्फ़ Shared फ़ोल्डर के थ्रेड लिंक से शेयर हो सकते हैं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "थ्रेड नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "शेयर लिंक नहीं बन सका",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कुछ अनपेक्षित गड़बड़ी हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "यह रिसोर्स बदल चुका है",
      },
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "लिंक बनाएँ",
      loadingText: "बन रहा है…",
    },
    success: {
      title: "सफल",
      description: "शेयर लिंक बन गया",
    },
  },
  patch: {
    title: "शेयर लिंक अपडेट करें",
    titleShort: "लिंक अपडेट करें",
    description: "मौजूदा शेयर लिंक अपडेट करें",
    container: {
      title: "शेयर लिंक अपडेट करें",
      description: "शेयर लिंक की सेटिंग्स बदलें",
    },
    linkId: {
      label: "लिंक ID",
      description: "जिस लिंक को अपडेट करना है उसकी ID",
    },
    label: {
      label: "लेबल",
      description: "इस लिंक को पहचानने के लिए वैकल्पिक लेबल",
      placeholder: "इस शेयर लिंक का लेबल लिखें",
    },
    allowPosting: {
      label: "पोस्ट करने दें",
      description: "लिंक वालों को इस थ्रेड में मैसेज पोस्ट करने दें",
    },
    requireAuth: {
      label: "साइन इन ज़रूरी करें",
      description: "लिंक खोलने के लिए यूज़र को साइन इन करना होगा",
    },
    deleteAction: {
      text: "लिंक रद्द करें",
    },
    response: {
      id: {
        content: "लिंक ID",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "अपडेट के पैरामीटर सही नहीं हैं",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "शेयर लिंक अपडेट करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह लिंक अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "शेयर लिंक नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "शेयर लिंक अपडेट नहीं हो सका",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कुछ अनपेक्षित गड़बड़ी हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "यह रिसोर्स बदल चुका है",
      },
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "बदलाव सेव करें",
      loadingText: "सेव हो रहा है…",
    },
    success: {
      title: "सफल",
      description: "शेयर लिंक अपडेट हो गया",
    },
  },
  delete: {
    title: "शेयर लिंक रद्द करें",
    titleShort: "लिंक रद्द करें",
    description: "चालू शेयर लिंक रद्द करें",
    container: {
      title: "शेयर लिंक रद्द करें",
      description: "इससे लिंक हमेशा के लिए बंद हो जाएगा",
    },
    linkId: {
      label: "लिंक ID",
      description: "जिस लिंक को रद्द करना है उसकी ID",
    },
    response: {
      id: {
        content: "लिंक ID",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "लिंक ID सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "शेयर लिंक रद्द करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह लिंक रद्द करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "शेयर लिंक नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "शेयर लिंक रद्द नहीं हो सका",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कुछ अनपेक्षित गड़बड़ी हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "यह रिसोर्स बदल चुका है",
      },
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "लिंक रद्द करें",
      loadingText: "रद्द हो रहा है…",
    },
    success: {
      title: "सफल",
      description: "शेयर लिंक रद्द हो गया",
    },
  },
  widget: {
    shareDialog: {
      title: "शेयर करें",
      copyLink: "लिंक कॉपी करें",
    },
    visibility: {
      publicTitle: "लिंक वाला कोई भी देख सकता है",
      publicDescription: "थ्रेड Shared फ़ोल्डर में है, लिंक चालू है।",
      privateTitle: "प्राइवेट",
      privateDescription: "इस थ्रेड को सिर्फ़ आप खोल सकते हैं।",
      makePublic: "पब्लिक करें",
      makePrivate: "प्राइवेट करें",
      toggling: "सेव हो रहा है...",
    },
    emailShare: {
      placeholder: "ईमेल से इनवाइट करें",
      send: "भेजें",
    },
    common: {
      close: "हो गया",
    },
  },
};
