import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
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
    title: "फ़ोल्डर अपडेट करें",
    titleShort: "फ़ोल्डर अपडेट करें",
    description: "मौजूदा फ़ोल्डर अपडेट करें",
    container: {
      title: "फ़ोल्डर अपडेट करें",
      description: "फ़ोल्डर की प्रॉपर्टी बदलें",
    },
    id: {
      label: "फ़ोल्डर ID",
      description: "जो फ़ोल्डर अपडेट करना है उसकी यूनिक पहचान",
    },
    sections: {
      updates: {
        title: "फ़ोल्डर के बदलाव",
        description: "जो फ़ील्ड बदलनी हैं",
      },
    },
    name: {
      label: "नाम",
      description: "फ़ोल्डर का नाम",
    },
    icon: {
      label: "आइकन",
      description: "Lucide या Simple Icons आइकन का नाम",
    },
    color: {
      label: "रंग",
      description: "अलग पहचान के लिए Hex रंग कोड",
    },
    parentId: {
      label: "पैरेंट फ़ोल्डर",
      description: "फ़ोल्डर को दूसरे पैरेंट में ले जाएँ (रूट के लिए null)",
    },
    expanded: {
      label: "खुला हुआ",
      description: "UI में फ़ोल्डर खुला है या नहीं",
    },
    sortOrder: {
      label: "क्रम",
      description: "फ़ोल्डर को क्रम में लगाने का क्रम",
    },
    pinned: {
      label: "पिन किया हुआ",
      description: "इस फ़ोल्डर को साइडबार में सबसे ऊपर पिन करें",
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
    response: {
      folder: {
        id: {
          content: "ID",
        },
        updatedAt: {
          content: "अपडेट का समय",
        },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया डेटा सही नहीं है",
        circularReference: "फ़ोल्डर को उसका ही पैरेंट नहीं बनाया जा सकता",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर अपडेट करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह फ़ोल्डर अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर अपडेट करते समय एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "इस नाम का फ़ोल्डर पहले से मौजूद है",
      },
    },
    success: {
      title: "सफल",
      description: "फ़ोल्डर अपडेट हो गया",
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "अपडेट करें",
      loadingText: "अपडेट हो रहा है...",
    },
  },
};
