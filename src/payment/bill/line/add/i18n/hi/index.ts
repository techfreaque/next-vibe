import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "पेमेंट", bill: "बिल", ap: "देय खाता" },
  post: {
    title: "बिल लाइन जोड़ें",
    titleShort: "लाइन जोड़ें",
    description: "ड्राफ़्ट सप्लायर बिल में खर्च की एक लाइन आइटम जोड़ें",
    form: {
      title: "नई बिल लाइन",
      description: "खर्च का ब्योरा भरें",
    },
    errors: {
      evidenceReview: "आवंटन बदलने से पहले मूल सप्लायर दस्तावेज़ देखें।",
      validation: {
        title: "वैलिडेशन एरर",
        description: "सभी फ़ील्ड जाँचें",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "बिल लाइन जोड़ने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "अकाउंटेंट या एडमिन भूमिका ज़रूरी है",
      },
      conflict: {
        title: "बिल एडिट नहीं हो सकता",
        description: "सिर्फ़ DRAFT बिल में लाइन जोड़ी जा सकती है",
      },
      server: { title: "सर्वर एरर", description: "लाइन नहीं जोड़ी जा सकी" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      network: { title: "नेटवर्क एरर", description: "अपना कनेक्शन जाँचें" },
      notFound: {
        title: "बिल नहीं मिला",
        description: "यह बिल मौजूद नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "लाइन जुड़ गई",
      description: "खर्च की लाइन बिल में जुड़ गई",
    },
    response: {
      success: "सफल",
      message: "संदेश",
      line: {
        currency: "करेंसी",
        title: "लाइन का ब्योरा",
        subtitle: "जोड़ी गई लाइन आइटम",
        id: "लाइन ID",
        billId: "बिल ID",
        lineDescription: "विवरण",
        productId: "प्रोडक्ट ID",
        quantity: "मात्रा",
        unitPrice: "यूनिट कीमत",
        taxRate: "टैक्स दर",
        taxAmount: "टैक्स राशि",
        lineTotal: "लाइन कुल",
        expenseAccountId: "खर्च अकाउंट",
        sortOrder: "क्रम",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
      },
    },
  },
  billId: {
    label: "बिल ID",
    description: "जिस बिल में यह लाइन जोड़नी है",
    placeholder: "बिल UUID",
  },
  description: {
    label: "विवरण",
    description: "क्या खरीदा गया",
    placeholder: "ऑफ़िस का सामान",
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
    description: "प्रति यूनिट कीमत",
    placeholder: "100.00",
  },
  taxRate: {
    label: "टैक्स दर",
    description: "VAT/टैक्स दर (0-1, जैसे 19% के लिए 0.19)",
    placeholder: "0.19",
  },
  expenseAccountId: {
    label: "खर्च अकाउंट",
    description: "यह किस खर्च अकाउंट में पोस्ट होगा",
    placeholder: "खर्च अकाउंट चुनें",
  },
  widget: {
    submit: "लाइन जोड़ें",
    searchProduct: "प्रोडक्ट खोजें",
    searchPlaceholder: "प्रोडक्ट का नाम या SKU…",
    searchButton: "खोजें",
    clearProduct: "हटाएँ",
    noProductResults: "कोई प्रोडक्ट नहीं मिला।",
    orManual: "या खुद भरें",
    multiplier: "×",
    taxLabel: "टैक्स",
    linePreview: "लाइन कुल (प्रीव्यू)",
    addAnotherLine: "एक और लाइन जोड़ें",
    viewBill: "बिल देखें",
  },
};
