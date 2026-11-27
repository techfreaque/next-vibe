import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र एड्रेस",
  tag: "addresses",

  widget: {
    chooseAddress: "सेव किया एड्रेस चुनें",
    addressUnavailable: "एड्रेस उपलब्ध नहीं",
    saveChanges: "बदलाव सेव करें",
    reviewDeletion: "हटाना रिव्यू करें",
    confirmDeletion: "क्या {{label}} को अपने सेव किए एड्रेस से हटाना है?",
    cancel: "रद्द करें",
  },

  update: {
    title: "एड्रेस अपडेट करें",
    titleShort: "एड्रेस अपडेट करें",
    description: "सेव किया एड्रेस एडिट करें",
    fields: {
      addressId: { label: "एड्रेस ID", description: "अपडेट किया जाने वाला एड्रेस" },
      label: {
        label: "लेबल",
        description: "इस एड्रेस को नाम दें",
        placeholder: "घर",
      },
      fullName: {
        label: "पूरा नाम",
        description: "संपर्क का नाम",
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
      updated: "अपडेट किया गया",
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
      forbidden: {
        title: "प्रतिबंधित",
        description: "यह एड्रेस आपका नहीं है",
      },
      notFound: { title: "नहीं मिला", description: "एड्रेस नहीं मिला" },
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
        detail: "एड्रेस अपडेट नहीं हो सका: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
    },
    success: {
      title: "एड्रेस अपडेट हो गया",
      description: "एड्रेस सफलतापूर्वक सेव हो गया",
    },
    widget: {
      updated: "एड्रेस अपडेट हो गया।",
      backToAddresses: "एड्रेस पर वापस जाएँ",
    },
  },

  delete: {
    title: "एड्रेस हटाएँ",
    titleShort: "एड्रेस हटाएँ",
    description: "अपने अकाउंट से सेव किया एड्रेस हटाएँ",
    fields: {
      addressId: { label: "एड्रेस ID", description: "हटाया जाने वाला एड्रेस" },
    },
    response: {
      deleted: "हटाया गया",
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "अमान्य रिक्वेस्ट" },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "यह एड्रेस आपका नहीं है",
      },
      notFound: { title: "नहीं मिला", description: "एड्रेस नहीं मिला" },
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
        detail: "एड्रेस हटाया नहीं जा सका: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
    },
    success: {
      title: "एड्रेस हट गया",
      description: "एड्रेस आपके अकाउंट से हटा दिया गया",
    },
    widget: {
      deleted: "एड्रेस हट गया।",
      backToAddresses: "एड्रेस पर वापस जाएँ",
    },
  },
};
