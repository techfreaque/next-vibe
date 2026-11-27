import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
  },
  title: "फ़ोल्डर बनाएँ",
  titleShort: "नया फ़ोल्डर",
  description: "नया फ़ोल्डर बनाएँ",
  config: {
    folders: {
      private: "प्राइवेट चैट",
      shared: "शेयर्ड चैट",
      public: "पब्लिक चैट",
      incognito: "इनकॉग्निटो चैट",
    },
  },
  sections: {
    folder: {
      title: "फ़ोल्डर की जानकारी",
      description: "फ़ोल्डर की बुनियादी जानकारी",
      rootFolderId: {
        label: "रूट फ़ोल्डर",
        description: "रूट फ़ोल्डर (प्राइवेट, शेयर्ड, पब्लिक, इनकॉग्निटो)",
      },
      name: {
        label: "फ़ोल्डर का नाम",
        description: "फ़ोल्डर का नाम",
      },
      icon: {
        label: "आइकन",
        description: "फ़ोल्डर का आइकन (lucide या si आइकन का नाम)",
      },
      color: {
        label: "रंग",
        description: "अलग पहचान के लिए Hex रंग",
      },
      parentId: {
        label: "पैरेंट फ़ोल्डर",
        description: "नेस्टेड फ़ोल्डर के लिए पैरेंट फ़ोल्डर की ID",
      },
    },
  },
  response: {
    title: "बनाया गया फ़ोल्डर",
    description: "नए बने फ़ोल्डर की जानकारी",
    folder: {
      title: "फ़ोल्डर",
      id: { content: "फ़ोल्डर ID" },
      userId: { content: "यूज़र ID" },
      rootFolderId: { content: "रूट फ़ोल्डर" },
      name: { content: "फ़ोल्डर का नाम" },
      icon: { content: "आइकन" },
      color: { content: "रंग" },
      parentId: { content: "पैरेंट फ़ोल्डर ID" },
      expanded: { content: "खुले होने की स्थिति" },
      sortOrder: { content: "क्रम" },
      createdAt: { content: "बनाने का समय" },
      updatedAt: { content: "अपडेट का समय" },
    },
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "फ़ोल्डर का डेटा सही नहीं है",
    },
    unauthorized: {
      title: "अनुमति नहीं",
      description: "फ़ोल्डर बनाने के लिए लॉग इन करें",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "आपके पास फ़ोल्डर बनाने की अनुमति नहीं है",
      incognitoNotAllowed: "इनकॉग्निटो फ़ोल्डर सर्वर पर नहीं बनाए जा सकते",
    },
    notFound: {
      title: "नहीं मिला",
      description: "मांगा गया रिसोर्स नहीं मिला",
    },
    server: {
      title: "सर्वर एरर",
      description: "फ़ोल्डर बनाते समय एरर आया",
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
  backButton: {
    label: "वापस",
  },
  submitButton: {
    label: "फ़ोल्डर बनाएँ",
    loadingText: "बन रहा है...",
  },
  success: {
    title: "सफल",
    description: "फ़ोल्डर बन गया",
  },
};
