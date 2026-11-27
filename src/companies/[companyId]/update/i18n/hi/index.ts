import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "व्यक्तिगत",
    },
    companyMemberRole: {
      owner: "मालिक",
      admin: "एडमिन",
      member: "सदस्य",
      accountant: "अकाउंटेंट",
      viewer: "दर्शक",
    },
  },
  tags: {
    companies: "कंपनियाँ",
    update: "अपडेट",
    management: "प्रबंधन",
  },
  patch: {
    title: "कंपनी अपडेट करें",
    titleShort: "कंपनी अपडेट करें",
    description: "कंपनी का ब्योरा एडिट करें। एडमिन या मालिक रोल ज़रूरी है।",
    companyId: {
      label: "कंपनी ID",
      description: "जिस कंपनी को अपडेट करना है",
    },
    name: {
      label: "कंपनी का नाम",
      description: "कंपनी का कानूनी नाम",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "कंपनी की किस्म",
      description: "बिज़नेस मॉडल",
      placeholder: "किस्म चुनें",
    },
    vatNumber: {
      label: "VAT नंबर",
      description: "VAT पहचान संख्या",
      placeholder: "DE123456789",
    },
    country: {
      label: "देश",
      description: "पंजीकरण का देश",
      placeholder: "DE",
    },
    currency: {
      label: "डिफ़ॉल्ट करेंसी",
      description: "मुख्य इनवॉइसिंग करेंसी",
      placeholder: "EUR",
    },
    email: {
      label: "कंपनी का ईमेल",
      description: "मुख्य बिज़नेस ईमेल",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "कंपनी का फ़ोन",
      description: "मुख्य बिज़नेस फ़ोन",
      placeholder: "+43 1 234 5678",
    },
    website: {
      label: "वेबसाइट",
      description: "कंपनी की वेबसाइट URL",
      placeholder: "https://company.com",
    },
    errors: {
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "कंपनी का ब्योरा अपडेट करने के लिए साइन इन करें",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़ॉर्म जाँचें और फिर कोशिश करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "कंपनी का ब्योरा अपडेट करने के लिए एडमिन या मालिक रोल ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "कनेक्शन जाँचें और फिर कोशिश करें",
      },
      notFound: {
        title: "कंपनी नहीं मिली",
        description: "यह कंपनी मौजूद नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "कंपनी अपडेट हुई",
      description: "कंपनी का ब्योरा सफलतापूर्वक सेव हुआ",
    },
    response: {
      id: "कंपनी ID",
      name: "कंपनी का नाम",
    },
    widget: {
      back: "वापस",
      successLabel: "कंपनी अपडेट हुई",
      viewCompany: "कंपनी देखें",
    },
  },
};
