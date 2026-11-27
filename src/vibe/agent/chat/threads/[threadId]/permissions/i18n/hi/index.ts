import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    threads: "थ्रेड",
    permissions: "परमिशन",
  },
  enums: {
    userRole: {
      public: "पब्लिक",
      customer: "कस्टमर",
      partnerAdmin: "पार्टनर एडमिन",
      partnerEmployee: "पार्टनर एम्प्लॉई",
      admin: "एडमिन",
    },
  },
  dialog: {
    title: "थ्रेड परमिशन: {{threadTitle}}",
  },
  get: {
    title: "थ्रेड परमिशन देखें",
    titleShort: "थ्रेड एक्सेस",
    description: "किसी थ्रेड के मॉडरेटर की सूची देखें",
    container: {
      title: "थ्रेड परमिशन",
      description: "थ्रेड एक्सेस परमिशन देखें और मैनेज करें",
    },
    threadId: {
      label: "थ्रेड ID",
      description: "थ्रेड की यूनिक ID",
    },
    response: {
      title: "थ्रेड परमिशन",
      rolesView: {
        label: "देखने वाले रोल",
        description: "जो रोल यह थ्रेड देख सकते हैं",
      },
      rolesEdit: {
        label: "एडिट वाले रोल",
        description: "जो रोल थ्रेड की सेटिंग्स बदल सकते हैं",
      },
      rolesPost: {
        label: "पोस्ट वाले रोल",
        description: "जो रोल मैसेज पोस्ट कर सकते हैं",
      },
      rolesModerate: {
        label: "मॉडरेट वाले रोल",
        description: "जो रोल कंटेंट मॉडरेट कर सकते हैं",
      },
      rolesAdmin: {
        label: "एडमिन रोल",
        description: "पूरे एडमिन एक्सेस वाले रोल",
      },
      moderatorIds: {
        title: "मॉडरेटर ID",
        description: "इस थ्रेड को मॉडरेट कर सकने वाले यूज़र ID की सूची",
        content: "यूज़र ID",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया डेटा सही नहीं है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "थ्रेड परमिशन लाते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "थ्रेड परमिशन देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको इस थ्रेड की परमिशन देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "यह थ्रेड नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "थ्रेड परमिशन लाते समय गड़बड़ी हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान गड़बड़ी हुई",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "मौजूदा स्टेट से टकराव हुआ",
      },
    },
    backButton: {
      label: "वापस",
    },
    success: {
      title: "सफल",
      description: "थ्रेड परमिशन मिल गईं",
    },
  },
  patch: {
    title: "थ्रेड परमिशन अपडेट करें",
    titleShort: "थ्रेड एक्सेस",
    description: "किसी थ्रेड के मॉडरेटर की सूची अपडेट करें",
    container: {
      title: "थ्रेड परमिशन अपडेट करें",
      description: "थ्रेड एक्सेस परमिशन बदलें",
    },
    threadId: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड को अपडेट करना है उसकी यूनिक ID",
    },
    rolesView: {
      label: "देखने वाले रोल",
      description: "जो रोल यह थ्रेड देख सकते हैं",
    },
    rolesEdit: {
      label: "एडिट वाले रोल",
      description: "जो रोल थ्रेड की सेटिंग्स बदल सकते हैं",
    },
    rolesPost: {
      label: "पोस्ट वाले रोल",
      description: "जो रोल मैसेज पोस्ट कर सकते हैं",
    },
    rolesModerate: {
      label: "मॉडरेट वाले रोल",
      description: "जो रोल कंटेंट मॉडरेट कर सकते हैं",
    },
    rolesAdmin: {
      label: "एडमिन रोल",
      description: "पूरे एडमिन एक्सेस वाले रोल",
    },
    permissions: {
      title: "परमिशन अपडेट",
      moderatorIds: {
        label: "मॉडरेटर ID",
        description: "इस थ्रेड को मॉडरेट कर सकने वाले यूज़र ID की सूची",
      },
    },
    response: {
      title: "अपडेट की गई परमिशन",
      rolesView: {
        label: "देखने वाले रोल",
        description: "जो रोल यह थ्रेड देख सकते हैं",
      },
      rolesEdit: {
        label: "एडिट वाले रोल",
        description: "जो रोल थ्रेड की सेटिंग्स बदल सकते हैं",
      },
      rolesPost: {
        label: "पोस्ट वाले रोल",
        description: "जो रोल मैसेज पोस्ट कर सकते हैं",
      },
      rolesModerate: {
        label: "मॉडरेट वाले रोल",
        description: "जो रोल कंटेंट मॉडरेट कर सकते हैं",
      },
      rolesAdmin: {
        label: "एडमिन रोल",
        description: "पूरे एडमिन एक्सेस वाले रोल",
      },
      message: {
        content: "थ्रेड परमिशन अपडेट हो गईं",
      },
      moderatorIds: {
        title: "मौजूदा मॉडरेटर",
        description: "इस थ्रेड के मॉडरेटर की अपडेट की गई सूची",
        content: "यूज़र ID",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिए गए मॉडरेटर ID सही नहीं हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "थ्रेड परमिशन अपडेट करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "थ्रेड परमिशन अपडेट करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको इस थ्रेड की परमिशन अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "यह थ्रेड नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "थ्रेड परमिशन अपडेट करते समय गड़बड़ी हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान गड़बड़ी हुई",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "मौजूदा स्टेट से टकराव हुआ",
      },
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "परमिशन सेव करें",
      loadingText: "सेव हो रहा है…",
    },
    success: {
      title: "सफल",
      description: "थ्रेड परमिशन अपडेट हो गईं",
    },
  },
};
