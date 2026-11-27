import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "प्रोडक्ट",
    category: "कैटेगरी",
    create: "बनाएँ",
  },
  post: {
    title: "कैटेगरी बनाएँ",
    titleShort: "कैटेगरी बनाएँ",
    description: "अपने कैटलॉग के प्रोडक्ट व्यवस्थित करने के लिए कैटेगरी जोड़ें।",
    name: {
      label: "कैटेगरी का नाम",
      description: "प्रोडक्ट कैटेगरी का नाम",
      placeholder: "डिज़ाइन सर्विस",
    },
    companyId: {
      label: "कंपनी",
      description: "इस कैटेगरी को किसी कंपनी से जोड़ें",
    },
    parentId: {
      label: "पैरेंट कैटेगरी",
      description: "पदानुक्रम के लिए वैकल्पिक पैरेंट कैटेगरी",
    },
    sortOrder: {
      label: "सॉर्ट क्रम",
      description: "दिखाने का क्रम: छोटे नंबर पहले आते हैं",
      placeholder: "0",
    },
    errors: {
      validation: {
        title: "फ़ॉर्म जाँचें",
        description: "फ़ॉर्म की फ़ील्ड जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन नहीं हैं",
        description: "कैटेगरी बनाने के लिए साइन इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपके पास ये कैटेगरी बनाने की अनुमति नहीं है",
      },
      conflict: {
        title: "पहले से मौजूद है",
        description: "इस नाम की कैटेगरी पहले से है",
      },
      server: {
        title: "सर्वर एरर",
        description: "हमारी तरफ़ कुछ गलत हो गया। दोबारा कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "कैटेगरी बन गई",
      description: "आपकी प्रोडक्ट कैटेगरी तैयार है।",
    },
    response: {
      id: "कैटेगरी ID",
      name: "कैटेगरी का नाम",
    },
    widget: {
      backToList: "कैटेगरी देखें",
      back: "वापस",
    },
  },
};
