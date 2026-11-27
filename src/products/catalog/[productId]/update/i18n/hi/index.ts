import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    productType: {
      service: "सर्विस",
      physical: "फ़िज़िकल",
      digital: "डिजिटल",
    },
  },
  tags: {
    products: "प्रोडक्ट",
    catalog: "कैटलॉग",
    update: "अपडेट",
  },
  patch: {
    title: "प्रोडक्ट अपडेट करें",
    titleShort: "प्रोडक्ट अपडेट करें",
    description: "मौजूदा कैटलॉग प्रोडक्ट के फ़ील्ड अपडेट करें।",
    productId: {
      label: "प्रोडक्ट ID",
      description: "जिस प्रोडक्ट को अपडेट करना है उसकी ID",
    },
    name: {
      label: "प्रोडक्ट का नाम",
      description: "प्रोडक्ट का नया नाम",
      placeholder: "वेब डिज़ाइन पैकेज",
    },
    productDescription: {
      label: "विवरण",
      description: "प्रोडक्ट का नया विवरण",
      placeholder: "5 पेज तक की पूरी वेबसाइट डिज़ाइन",
    },
    sku: {
      label: "SKU",
      description: "नया स्टॉक कीपिंग यूनिट कोड",
      placeholder: "WD-001",
    },
    type: {
      label: "प्रोडक्ट की किस्म",
      description: "प्रोडक्ट की नई किस्म",
      placeholder: "किस्म चुनें",
    },
    unit: {
      label: "यूनिट",
      description: "नई बिलिंग यूनिट",
      placeholder: "घंटा",
    },
    basePrice: {
      label: "बेस कीमत",
      description: "नई बेस कीमत",
      placeholder: "150.00",
    },
    currency: {
      label: "करेंसी",
      description: "नया 3 अक्षर का ISO करेंसी कोड",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "डिफ़ॉल्ट टैक्स दर",
      description: "दशमलव में नई डिफ़ॉल्ट टैक्स दर",
      placeholder: "0.19",
    },
    categoryId: {
      label: "कैटेगरी",
      description: "प्रोडक्ट की नई कैटेगरी",
    },
    imageUrl: {
      label: "इमेज URL",
      description: "प्रोडक्ट इमेज का नया URL",
      placeholder: "https://example.com/product.jpg",
    },
    isActive: {
      label: "सक्रिय",
      description: "प्रोडक्ट कैटलॉग में उपलब्ध है या नहीं",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़ील्ड जाँचें और फिर कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "प्रोडक्ट अपडेट करने के लिए साइन इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह प्रोडक्ट अपडेट करने की अनुमति नहीं है",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
      server: {
        title: "सर्वर एरर",
        description: "हमारी तरफ़ कुछ गड़बड़ हुई। फिर कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "कनेक्शन जाँचें और फिर कोशिश करें",
      },
      notFound: {
        title: "नहीं मिला",
        description: "प्रोडक्ट नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "प्रोडक्ट अपडेट हुआ",
      description: "प्रोडक्ट का ब्योरा सेव हो गया।",
    },
    response: {
      id: "प्रोडक्ट ID",
      name: "प्रोडक्ट का नाम",
    },
    widget: {
      catalogCompany: "कैटलॉग कंपनी",
      billingCadence: "बिलिंग अंतराल",
      oneTime: "एक बार की खरीद",
      personalCatalog: "निजी कैटलॉग",
      companyUnavailable: "कंपनी का नाम उपलब्ध नहीं",
      couldNotLoad: "प्रोडक्ट लोड नहीं हो सका।",
      retry: "फिर कोशिश करें",
      backToList: "प्रोडक्ट पर वापस",
      back: "वापस",
    },
  },
};
