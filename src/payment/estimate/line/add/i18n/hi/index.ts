import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एस्टिमेट",
  tags: { payment: "payment", estimate: "estimate", lines: "lines" },
  post: {
    title: "एस्टिमेट लाइन जोड़ें",
    titleShort: "लाइन जोड़ें",
    description: "एस्टिमेट में एक लाइन आइटम जोड़ें",
    form: {
      title: "एस्टिमेट लाइन जोड़ें",
      description: "इस एस्टिमेट में कोई प्रोडक्ट या सेवा जोड़ें",
    },
    response: {
      success: "सफल",
      message: "स्थिति का संदेश",
      line: {
        currency: "करेंसी",
        title: "लाइन आइटम",
        subtitle: "जोड़ी गई लाइन का ब्योरा",
        id: "लाइन ID",
        estimateId: "एस्टिमेट ID",
        lineDescription: "विवरण",
        productId: "प्रोडक्ट ID",
        quantity: "मात्रा",
        unitPrice: "यूनिट कीमत",
        taxRate: "टैक्स दर",
        taxAmount: "टैक्स रकम",
        lineTotal: "लाइन कुल",
        sortOrder: "क्रम",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "लाइन आइटम का ब्योरा जाँचें",
      },
      server: { title: "सर्वर एरर", description: "आंतरिक सर्वर एरर" },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: { title: "मना है", description: "एक्सेस नहीं मिला" },
      notFound: { title: "नहीं मिला", description: "एस्टिमेट नहीं मिला" },
      conflict: {
        title: "टकराव",
        description: "लाइन जोड़ने के लिए एस्टिमेट DRAFT स्थिति में होना चाहिए",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      title: "लाइन जुड़ी",
      description: "लाइन आइटम एस्टिमेट में जुड़ गया",
    },
  },
  estimateId: {
    label: "एस्टिमेट ID",
    description: "जिस एस्टिमेट में लाइन जोड़नी है",
    placeholder: "एस्टिमेट UUID",
  },
  description: {
    label: "विवरण",
    description: "प्रोडक्ट या सेवा का विवरण",
    placeholder: "जैसे वेब डेवलपमेंट - 10 घंटे",
  },
  productId: {
    label: "प्रोडक्ट ID",
    description: "वैकल्पिक प्रोडक्ट रेफ़रेंस",
    placeholder: "प्रोडक्ट UUID",
  },
  quantity: {
    label: "मात्रा",
    description: "यूनिट की संख्या",
    placeholder: "1",
  },
  unitPrice: {
    label: "यूनिट कीमत",
    description: "प्रति यूनिट कीमत (टैक्स छोड़कर)",
    placeholder: "0.00",
  },
  taxRate: {
    label: "टैक्स दर",
    description: "दशमलव में टैक्स दर (जैसे 23% के लिए 0.23)",
    placeholder: "0.23",
  },
  widget: {
    searchProduct: "प्रोडक्ट खोजें",
    searchPlaceholder: "प्रोडक्ट का नाम या SKU...",
    searchButton: "खोजें",
    clearProduct: "साफ़ करें",
    noProductResults: "कोई प्रोडक्ट नहीं मिला।",
    orManual: "या ख़ुद दर्ज करें",
    multiplier: "×",
    taxLabel: "tax",
    linePreview: "लाइन कुल",
    addAnotherLine: "एक और लाइन जोड़ें",
    viewEstimate: "एस्टिमेट पर वापस",
    submit: "लाइन जोड़ें",
  },
};
