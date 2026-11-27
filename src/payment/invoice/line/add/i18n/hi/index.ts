import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    invoice: "invoice",
    lines: "lines",
  },
  post: {
    title: "इनवॉइस लाइन जोड़ें",
    titleShort: "लाइन जोड़ें",
    description: "ड्राफ़्ट इनवॉइस में लाइन आइटम जोड़ें",
    form: {
      title: "लाइन आइटम",
      description: "जोड़ने वाला बिल योग्य आइटम तय करें",
    },
    response: {
      success: "लाइन जुड़ी",
      message: "स्थिति का संदेश",
      line: {
        currency: "करेंसी",
        title: "लाइन का ब्योरा",
        subtitle: "बनी इनवॉइस लाइन",
        id: "लाइन ID",
        invoiceId: "इनवॉइस ID",
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
        description: "लाइन आइटम के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इनवॉइस नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "इनवॉइस ड्राफ़्ट स्थिति में नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      title: "सफल",
      description: "लाइन आइटम इनवॉइस में जुड़ गया",
    },
  },
  invoiceId: {
    label: "इनवॉइस ID",
    description: "जिस ड्राफ़्ट इनवॉइस में यह लाइन जोड़नी है",
    placeholder: "इनवॉइस ID दर्ज करें",
  },
  description: {
    label: "विवरण",
    description: "यह लाइन आइटम क्या दर्शाता है",
    placeholder: "जैसे वेब डेवलपमेंट - 10 घंटे",
  },
  productId: {
    label: "प्रोडक्ट ID",
    description: "वैकल्पिक प्रोडक्ट रेफ़रेंस",
    placeholder: "प्रोडक्ट ID दर्ज करें",
  },
  quantity: {
    label: "मात्रा",
    description: "यूनिट की संख्या",
    placeholder: "1",
  },
  unitPrice: {
    label: "यूनिट कीमत",
    description: "प्रति यूनिट कीमत",
    placeholder: "0.00",
  },
  taxRate: {
    label: "टैक्स दर",
    description: "दशमलव में टैक्स दर (जैसे 23% के लिए 0.23)",
    placeholder: "0.00",
  },
  widget: {
    searchProduct: "प्रोडक्ट कैटलॉग खोजें",
    searchPlaceholder: "नाम या SKU…",
    searchButton: "खोजें",
    clearProduct: "साफ़ करें",
    noProductResults: "कोई मेल नहीं। आइटम का ब्योरा नीचे दर्ज करें।",
    orManual: "या ख़ुद दर्ज करें",
    multiplier: "×",
    taxLabel: "tax",
    linePreview: "लाइन कुल",
    lineAdded: "लाइन जुड़ी",
    addAnotherLine: "एक और लाइन जोड़ें",
    viewInvoice: "इनवॉइस देखें",
    submit: "लाइन जोड़ें",
  },
};
