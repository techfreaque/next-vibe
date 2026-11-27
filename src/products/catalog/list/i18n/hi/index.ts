import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "प्रोडक्ट",
    catalog: "कैटलॉग",
    list: "लिस्ट",
  },
  enums: {
    productType: {
      service: "सर्विस",
      physical: "फ़िज़िकल",
      digital: "डिजिटल",
    },
  },
  get: {
    title: "प्रोडक्ट",
    titleShort: "प्रोडक्ट",
    description:
      "अपने कैटलॉग के सभी प्रोडक्ट पाएँ। कंपनी, कैटेगरी, टाइप या एक्टिव स्टेटस से फ़िल्टर करें।",
    companyId: {
      label: "कंपनी ID",
      description: "इस कंपनी के प्रोडक्ट फ़िल्टर करें",
    },
    categoryId: {
      label: "कैटेगरी ID",
      description: "इस कैटेगरी के प्रोडक्ट फ़िल्टर करें",
    },
    type: {
      label: "प्रोडक्ट टाइप",
      description: "सर्विस, फ़िज़िकल या डिजिटल से फ़िल्टर करें",
      placeholder: "सभी टाइप",
    },
    isActive: {
      label: "सिर्फ़ एक्टिव",
      description: "सिर्फ़ एक्टिव प्रोडक्ट दिखाएँ",
    },
    page: {
      label: "पेज",
      description: "पेज नंबर (1 से शुरू)",
    },
    pageSize: {
      label: "प्रति पेज",
      description: "प्रति पेज नतीजे (ज़्यादा से ज़्यादा 100)",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़िल्टर पैरामीटर जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन नहीं हैं",
        description: "कैटलॉग देखने के लिए साइन इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपके पास ये कैटलॉग देखने की अनुमति नहीं है",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
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
        description: "कोई प्रोडक्ट नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "प्रोडक्ट मिल गए",
      description: "आपके कैटलॉग के प्रोडक्ट नीचे लिस्टेड हैं।",
    },
    response: {
      id: "प्रोडक्ट ID",
      name: "प्रोडक्ट का नाम",
      type: "टाइप",
      sku: "SKU",
      basePrice: "बेस प्राइस",
      currency: "करेंसी",
      unit: "यूनिट",
      isActive: "एक्टिव",
      isSubscription: "सब्सक्रिप्शन",
      billingInterval: "बिलिंग अंतराल",
      categoryId: "कैटेगरी",
      createdAt: "बनाया गया",
      total: "कुल",
    },
    widget: {
      checkout: "प्लेटफ़ॉर्म चेकआउट ऑफ़र",
      checkoutHint:
        "वो प्लान और पैक देखें जो प्लेटफ़ॉर्म चेकआउट इस मार्केट की कीमतों पर बेचता है। किसी बिक्री को बही-खातों से जोड़ने के लिए नीचे से कंपनी का प्रोडक्ट चुनें और उसका प्रोसेसर ऑफ़र कॉन्फ़िगर करें।",
      checkoutReference: "चेकआउट रेफ़रेंस",
      checkoutCredits: "शामिल क्रेडिट",
      oneTime: "एकमुश्त कीमत",
      searchPage: "नाम या SKU से खोजें",
      noMatches: "इस पेज पर कोई मेल खाता प्रोडक्ट नहीं",
      retry: "दोबारा कोशिश करें",
      previous: "पिछला",
      next: "अगला",
      status: "स्टेटस",
      addProduct: "प्रोडक्ट जोड़ें",
      active: "एक्टिव",
      inactive: "निष्क्रिय",
      empty: "कोई प्रोडक्ट नहीं मिला। फ़िल्टर बदलें या नया प्रोडक्ट जोड़ें।",
      columnProduct: "प्रोडक्ट",
      columnTypePrice: "टाइप / कीमत / स्टेटस",
      filterLoad: "लोड करें",
      filterAllTypes: "सभी टाइप",
      filterActiveOnly: "सिर्फ़ एक्टिव",
      filterAllStatus: "सभी स्टेटस",
      recurring: "रिकरिंग",
      billingMonthly: "मासिक",
      billingYearly: "सालाना",
      navCategories: "कैटेगरी",
      navTaxRates: "टैक्स दरें",
      back: "वापस",
      count: "{{count}} प्रोडक्ट",
      columnSku: "SKU",
      columnPrice: "कीमत",
      emptyTitle: "अभी कोई प्रोडक्ट नहीं",
      emptyMessage:
        "आप जो प्रोडक्ट और सर्विस बेचते हैं वो यहाँ रहते हैं। इनवॉइस, POS और खरीद इन्हें कीमत, यूनिट और VAT के साथ उठा लेते हैं।",
      clearFilters: "फ़िल्टर साफ़ करें",
    },
  },
};
