import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "प्रोडक्ट",
    category: "कैटेगरी",
    list: "सूची",
  },
  get: {
    title: "कैटेगरी",
    titleShort: "कैटेगरी",
    description: "किसी कंपनी या मालिक की प्रोडक्ट कैटेगरी लाएँ।",
    companyId: {
      label: "कंपनी ID",
      description: "इस कंपनी की कैटेगरी फ़िल्टर करें",
    },
    page: {
      label: "पेज",
      description: "पेज नंबर (1 से शुरू)",
    },
    pageSize: {
      label: "प्रति पेज",
      description: "प्रति पेज नतीजे (अधिकतम 100)",
    },
    errors: {
      validation: {
        title: "फ़ॉर्म जाँचें",
        description: "फ़िल्टर पैरामीटर जाँचें और फिर कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "कैटेगरी देखने के लिए साइन इन करें",
      },
      forbidden: {
        title: "मना है",
        description: "आपको ये कैटेगरी देखने की अनुमति नहीं है",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
      server: {
        title: "सर्वर एरर",
        description: "हमारी तरफ़ कुछ गड़बड़ हुई। फिर कोशिश करें।",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई कैटेगरी नहीं मिली",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "कैटेगरी मिल गईं",
      description: "प्रोडक्ट कैटेगरी नीचे सूचीबद्ध हैं।",
    },
    response: {
      id: "कैटेगरी ID",
      name: "कैटेगरी का नाम",
      parentId: "पैरेंट कैटेगरी",
      sortOrder: "क्रम",
      isActive: "सक्रिय",
      createdAt: "बनाया गया",
      total: "कुल",
    },
    widget: {
      addCategory: "कैटेगरी जोड़ें",
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      emptyTitle: "अभी कोई कैटेगरी नहीं",
      empty: "कैटलॉग तेज़ी से फ़िल्टर करने के लिए प्रोडक्ट को कैटेगरी में बाँटें।",
      back: "वापस",
      count: "{{count}} कैटेगरी",
      columnName: "कैटेगरी",
      columnOrder: "क्रम",
      columnStatus: "स्थिति",
      inParent: "{{parent}} में",
    },
  },
};
