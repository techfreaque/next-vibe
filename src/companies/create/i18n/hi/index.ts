import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "व्यक्तिगत",
    },
    companyMemberRole: {
      owner: "ओनर",
      admin: "एडमिन",
      member: "मेंबर",
      accountant: "अकाउंटेंट",
      viewer: "व्यूअर",
    },
  },
  tags: {
    companies: "कंपनियाँ",
    create: "बनाएँ",
  },
  post: {
    title: "कंपनी बनाएँ",
    titleShort: "नई कंपनी",
    description: "नई कंपनी रजिस्टर करें। आप अपने आप उसके ओनर बन जाते हैं।",
    name: {
      label: "कंपनी का नाम",
      description: "कंपनी का कानूनी नाम",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "कंपनी का टाइप",
      description: "बिज़नेस मॉडल (B2B, B2C या व्यक्तिगत)",
      placeholder: "टाइप चुनें",
    },
    vatNumber: {
      label: "VAT नंबर",
      description: "टैक्स के लिए VAT पहचान नंबर",
      placeholder: "DE123456789",
    },
    country: {
      label: "देश",
      description: "वो देश जहाँ कंपनी रजिस्टर है",
      placeholder: "देश चुनें",
    },
    currency: {
      label: "डिफ़ॉल्ट करेंसी",
      description: "इनवॉइसिंग की मुख्य करेंसी",
      placeholder: "EUR",
    },
    email: {
      label: "कंपनी का ईमेल",
      description: "मुख्य बिज़नेस ईमेल पता",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "कंपनी का फ़ोन",
      description: "मुख्य बिज़नेस फ़ोन नंबर",
      placeholder: "+43 1 234 5678",
    },
    website: {
      label: "वेबसाइट",
      description: "कंपनी की वेबसाइट URL",
      placeholder: "https://company.com",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़ॉर्म की फ़ील्ड जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन नहीं हैं",
        description: "कंपनी बनाने के लिए साइन इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपके पास कंपनी बनाने की अनुमति नहीं है",
      },
      conflict: {
        title: "पहले से मौजूद",
        description: "इस नाम की कंपनी पहले से मौजूद है",
      },
      server: {
        title: "सर्वर एरर",
        description: "रिक्वेस्ट फ़ेल हुई। दोबारा कोशिश करें।",
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
      title: "कंपनी बन गई",
      description: "आपकी कंपनी तैयार है। शुरू करने के लिए मेंबर जोड़ें।",
    },
    response: {
      id: "कंपनी ID",
      name: "कंपनी का नाम",
    },
    widget: {
      setupAccounting: "अकाउंटिंग सेट अप करें",
      viewCompany: "कंपनी देखें",
      back: "लिस्ट पर वापस",
    },
  },
};
