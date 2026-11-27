import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
    permissions: "परमिशन",
  },
  get: {
    title: "फ़ोल्डर की परमिशन देखें",
    titleShort: "फ़ोल्डर एक्सेस",
    description: "किसी फ़ोल्डर के मॉडरेटर की सूची पाएँ",
    noData: "कोई डेटा नहीं है",
    edit: "एडिट करें",
    about: "परमिशन के बारे में",
    inheritFromParent: "पैरेंट से मिलता है",
    container: {
      title: "फ़ोल्डर की परमिशन",
      description: "फ़ोल्डर एक्सेस की परमिशन देखें और मैनेज करें",
    },
    id: {
      label: "फ़ोल्डर ID",
      description: "फ़ोल्डर की यूनिक पहचान",
    },
    response: {
      title: "फ़ोल्डर की परमिशन",
      rolesView: {
        label: "देखने वाले रोल",
        description: "जो रोल यह फ़ोल्डर देख सकते हैं",
      },
      rolesManage: {
        label: "मैनेज करने वाले रोल",
        description: "जो रोल फ़ोल्डर सेटिंग्स मैनेज कर सकते हैं",
      },
      rolesCreateThread: {
        label: "थ्रेड बनाने वाले रोल",
        description: "जो रोल इस फ़ोल्डर में थ्रेड बना सकते हैं",
      },
      rolesPost: {
        label: "पोस्ट करने वाले रोल",
        description: "जो रोल मैसेज पोस्ट कर सकते हैं",
      },
      rolesModerate: {
        label: "मॉडरेट करने वाले रोल",
        description: "जो रोल कंटेंट मॉडरेट कर सकते हैं",
      },
      rolesAdmin: {
        label: "एडमिन रोल",
        description: "जिन रोल के पास पूरा एडमिन एक्सेस है",
      },
      moderatorIds: {
        title: "मॉडरेटर ID",
        description: "इस फ़ोल्डर को मॉडरेट कर सकने वाले यूज़र की ID की सूची",
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
        description: "फ़ोल्डर की परमिशन लाते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर की परमिशन देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास इस फ़ोल्डर की परमिशन देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर की परमिशन लाते समय एरर आया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आया",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "मौजूदा स्थिति से टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "फ़ोल्डर की परमिशन मिल गई",
    },
    backButton: { label: "वापस" },
  },
  enums: {
    userRole: {
      public: "पब्लिक",
      customer: "कस्टमर",
      partnerAdmin: "पार्टनर एडमिन",
      partnerEmployee: "पार्टनर कर्मचारी",
      admin: "एडमिन",
    },
  },
  patch: {
    title: "फ़ोल्डर की परमिशन अपडेट करें",
    titleShort: "फ़ोल्डर एक्सेस",
    description: "किसी फ़ोल्डर के मॉडरेटर की सूची अपडेट करें",
    container: {
      title: "फ़ोल्डर की परमिशन अपडेट करें",
      description: "फ़ोल्डर एक्सेस की परमिशन बदलें",
    },
    id: {
      label: "फ़ोल्डर ID",
      description: "जो फ़ोल्डर अपडेट करना है उसकी यूनिक पहचान",
    },
    rolesView: {
      label: "देखने वाले रोल",
      description: "जो रोल यह फ़ोल्डर देख सकते हैं",
    },
    rolesManage: {
      label: "मैनेज करने वाले रोल",
      description: "जो रोल फ़ोल्डर सेटिंग्स मैनेज कर सकते हैं",
    },
    rolesCreateThread: {
      label: "थ्रेड बनाने वाले रोल",
      description: "जो रोल इस फ़ोल्डर में थ्रेड बना सकते हैं",
    },
    rolesPost: {
      label: "पोस्ट करने वाले रोल",
      description: "जो रोल मैसेज पोस्ट कर सकते हैं",
    },
    rolesModerate: {
      label: "मॉडरेट करने वाले रोल",
      description: "जो रोल कंटेंट मॉडरेट कर सकते हैं",
    },
    rolesAdmin: {
      label: "एडमिन रोल",
      description: "जिन रोल के पास पूरा एडमिन एक्सेस है",
    },
    permissions: {
      title: "परमिशन अपडेट",
      moderatorIds: {
        label: "मॉडरेटर ID",
        description: "इस फ़ोल्डर को मॉडरेट कर सकने वाले यूज़र की ID की सूची",
      },
    },
    response: {
      title: "अपडेट की गई परमिशन",
      rolesView: {
        label: "देखने वाले रोल",
        description: "जो रोल यह फ़ोल्डर देख सकते हैं",
      },
      rolesManage: {
        label: "मैनेज करने वाले रोल",
        description: "जो रोल फ़ोल्डर सेटिंग्स मैनेज कर सकते हैं",
      },
      rolesCreateThread: {
        label: "थ्रेड बनाने वाले रोल",
        description: "जो रोल इस फ़ोल्डर में थ्रेड बना सकते हैं",
      },
      rolesPost: {
        label: "पोस्ट करने वाले रोल",
        description: "जो रोल मैसेज पोस्ट कर सकते हैं",
      },
      rolesModerate: {
        label: "मॉडरेट करने वाले रोल",
        description: "जो रोल कंटेंट मॉडरेट कर सकते हैं",
      },
      rolesAdmin: {
        label: "एडमिन रोल",
        description: "जिन रोल के पास पूरा एडमिन एक्सेस है",
      },
      message: {
        content: "फ़ोल्डर की परमिशन अपडेट हो गई",
      },
      moderatorIds: {
        title: "मौजूदा मॉडरेटर",
        description: "इस फ़ोल्डर के मॉडरेटर की अपडेट की गई सूची",
        content: "यूज़र ID",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दी गई मॉडरेटर ID सही नहीं हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "फ़ोल्डर की परमिशन अपडेट करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर की परमिशन अपडेट करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास इस फ़ोल्डर की परमिशन अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर की परमिशन अपडेट करते समय एरर आया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आया",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "मौजूदा स्थिति से टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "फ़ोल्डर की परमिशन अपडेट हो गई",
    },
    backButton: { label: "वापस" },
    submitButton: { label: "परमिशन अपडेट करें", loadingText: "अपडेट हो रहा है..." },
  },
};
