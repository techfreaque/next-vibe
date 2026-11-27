import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र एड्रेस",
  tag: "addresses",

  list: {
    title: "बिलिंग एड्रेस",
    titleShort: "मेरे एड्रेस",
    description: "अपने सेव किए एड्रेस देखें",
    response: {
      addresses: "एड्रेस",
    },
    widget: {
      back: "वापस",
      addAddress: "एड्रेस जोड़ें",
      edit: "एडिट करें",
      delete: "हटाएँ",
      billing: "बिलिंग",
      delivery: "डिलीवरी",
      empty: "कोई एड्रेस सेव नहीं है",
      emptyHint: "एक सेव करें, चेकआउट पर बार-बार टाइप नहीं करना पड़ेगा।",
      emptyCta: "अपना पहला एड्रेस जोड़ें",
      loading: "एड्रेस लोड हो रहे हैं…",
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "अमान्य रिक्वेस्ट" },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "प्रतिबंधित", description: "एक्सेस प्रतिबंधित है" },
      notFound: { title: "नहीं मिला", description: "कोई एड्रेस नहीं मिला" },
      conflict: { title: "टकराव", description: "डेटा में टकराव" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      internal: {
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर",
        detail: "आपके एड्रेस लोड नहीं हो सके: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
    },
    success: { title: "सफल", description: "एड्रेस मिल गए" },
  },

  create: {
    title: "एड्रेस जोड़ें",
    titleShort: "एड्रेस जोड़ें",
    description: "अपने अकाउंट में नया एड्रेस सेव करें",
    fields: {
      label: {
        label: "लेबल",
        description: "इस एड्रेस को नाम दें (जैसे घर, ऑफ़िस)",
        placeholder: "घर",
      },
      fullName: {
        label: "पूरा नाम",
        description: "इस एड्रेस के लिए संपर्क का नाम",
        placeholder: "Jane Doe",
      },
      company: {
        label: "कंपनी",
        description: "कंपनी का नाम (वैकल्पिक)",
        placeholder: "Acme Corp",
      },
      phone: {
        label: "फ़ोन",
        description: "संपर्क का फ़ोन नंबर",
        placeholder: "+1 555 000 0000",
      },
      vatNumber: {
        label: "VAT नंबर",
        description: "EU VAT रजिस्ट्रेशन नंबर",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "टैक्स ID",
        description: "राष्ट्रीय टैक्स आइडेंटिफ़ायर",
        placeholder: "123-45-6789",
      },
      addressLine1: {
        label: "एड्रेस लाइन 1",
        description: "सड़क और नंबर",
        placeholder: "123 Main St",
      },
      addressLine2: {
        label: "एड्रेस लाइन 2",
        description: "अपार्टमेंट, सुइट, यूनिट (वैकल्पिक)",
        placeholder: "Suite 4B",
      },
      city: { label: "शहर", description: "शहर", placeholder: "Berlin" },
      region: {
        label: "राज्य / क्षेत्र",
        description: "राज्य या क्षेत्र (वैकल्पिक)",
        placeholder: "Bayern",
      },
      postalCode: {
        label: "पिन कोड",
        description: "ZIP या पिन कोड",
        placeholder: "10115",
      },
      country: {
        label: "देश",
        description: "ISO 3166-1 alpha-2 देश कोड",
        placeholder: "DE",
      },
      isDefaultBilling: {
        label: "डिफ़ॉल्ट बिलिंग",
        description: "डिफ़ॉल्ट बिलिंग एड्रेस के रूप में इस्तेमाल करें",
      },
      isDefaultDelivery: {
        label: "डिफ़ॉल्ट डिलीवरी",
        description: "डिफ़ॉल्ट डिलीवरी एड्रेस के रूप में इस्तेमाल करें",
      },
    },
    response: {
      id: "एड्रेस ID",
      label: "लेबल",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "ज़रूरी फ़ील्ड जाँचें",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "प्रतिबंधित", description: "एक्सेस प्रतिबंधित है" },
      notFound: { title: "नहीं मिला", description: "यूज़र नहीं मिला" },
      conflict: { title: "टकराव", description: "डेटा में टकराव" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      internal: {
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर",
        detail: "एड्रेस सेव नहीं हो सका: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
    },
    success: {
      title: "एड्रेस सेव हो गया",
      description: "एड्रेस आपके अकाउंट में जुड़ गया",
    },
    widget: {
      saved: "एड्रेस सेव हो गया।",
      backToAddresses: "एड्रेस पर वापस जाएँ",
    },
  },
};
