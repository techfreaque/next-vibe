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
    create: "बनाएँ",
  },
  post: {
    title: "प्रोडक्ट बनाएँ",
    titleShort: "प्रोडक्ट बनाएँ",
    description: "अपने कैटलॉग में कोई प्रोडक्ट या सर्विस जोड़ें।",
    name: {
      label: "प्रोडक्ट का नाम",
      description: "प्रोडक्ट या सर्विस का नाम",
      placeholder: "वेब डिज़ाइन पैकेज",
    },
    productDescription: {
      label: "विवरण",
      description: "प्रोडक्ट या सर्विस में क्या शामिल है, इसका छोटा विवरण",
      placeholder: "5 पेज तक की पूरी वेबसाइट डिज़ाइन",
    },
    sku: {
      label: "SKU",
      description: "स्टॉक कीपिंग यूनिट: आपका आंतरिक प्रोडक्ट कोड",
      placeholder: "WD-001",
    },
    type: {
      label: "प्रोडक्ट टाइप",
      description: "ये सर्विस है, फ़िज़िकल सामान या डिजिटल आइटम",
      placeholder: "टाइप चुनें",
    },
    unit: {
      label: "यूनिट",
      description: "बिलिंग यूनिट (जैसे घंटा, नग, लाइसेंस)",
      placeholder: "घंटा",
    },
    basePrice: {
      label: "बेस प्राइस",
      description: "चुनी हुई करेंसी में डिफ़ॉल्ट कीमत",
      placeholder: "150.00",
    },
    currency: {
      label: "करेंसी",
      description: "3 अक्षर का ISO करेंसी कोड",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "डिफ़ॉल्ट टैक्स दर",
      description: "डिफ़ॉल्ट VAT/टैक्स दर दशमलव में (जैसे 19% के लिए 0.19)",
      placeholder: "0.19",
    },
    companyId: {
      label: "कंपनी",
      description: "इस प्रोडक्ट को किसी कंपनी से जोड़ें",
    },
    categoryId: {
      label: "कैटेगरी",
      description: "प्रोडक्ट कैटेगरी",
    },
    imageUrl: {
      label: "इमेज URL",
      description: "प्रोडक्ट इमेज का URL",
      placeholder: "https://example.com/product.jpg",
    },
    isSubscription: {
      label: "सब्सक्रिप्शन प्रोडक्ट",
      description: "कस्टमर से बार-बार चार्ज लें",
    },
    billingInterval: {
      label: "बिलिंग अंतराल",
      description: "कस्टमर से कितनी बार चार्ज लिया जाता है",
      placeholder: "अंतराल चुनें",
      monthly: "मासिक",
      yearly: "सालाना",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़ॉर्म की फ़ील्ड जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन नहीं हैं",
        description: "प्रोडक्ट बनाने के लिए साइन इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपके पास ये प्रोडक्ट बनाने की अनुमति नहीं है",
      },
      conflict: {
        title: "पहले से मौजूद है",
        description: "इस SKU का प्रोडक्ट पहले से है",
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
      title: "प्रोडक्ट बन गया",
      description: "आपका प्रोडक्ट अब कैटलॉग में है।",
    },
    response: {
      id: "प्रोडक्ट ID",
      name: "प्रोडक्ट का नाम",
    },
    widget: {
      viewProduct: "प्रोडक्ट देखें",
      backToList: "प्रोडक्ट पर वापस",
      back: "वापस",
    },
  },
};
