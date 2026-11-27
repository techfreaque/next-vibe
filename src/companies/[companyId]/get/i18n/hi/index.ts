import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "व्यक्ति",
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
    get: "लाएँ",
  },
  get: {
    title: "कंपनी का ब्योरा",
    titleShort: "कंपनी",
    description: "कंपनी की जानकारी देखें",
    companyId: {
      label: "कंपनी ID",
      description: "जो कंपनी देखनी है",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कंपनी ID गलत है",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "कंपनी का ब्योरा देखने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आप इस कंपनी के सदस्य नहीं हैं",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव",
      },
      server: {
        title: "सर्वर एरर",
        description: "रिक्वेस्ट फ़ेल हुई। फिर कोशिश करें।",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
      },
      notFound: {
        title: "कंपनी नहीं मिली",
        description: "यह कंपनी मौजूद नहीं है या आपका एक्सेस चला गया है",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "कंपनी लोड हुई",
      description: "कंपनी का ब्योरा मिल गया",
    },
    widget: {
      address: "पता",
      activeMembers: "सक्रिय सदस्य",
      backToList: "कंपनियाँ",
      type: "ग्राहक का प्रकार",
      loadFailed: "यह कंपनी लोड नहीं हो सकी",
      retry: "फिर कोशिश करें",
      related: "इस कंपनी में काम करें",
      setupAccounting: "अकाउंटिंग सेट अप करें",
      back: "वापस",
      loading: "कंपनी लोड हो रही है...",
      edit: "एडिट करें",
      members: "सदस्य",
      invite: "सदस्य को आमंत्रित करें",
      chartOfAccounts: "चार्ट ऑफ़ अकाउंट्स",
      viewInvoices: "इनवॉइस देखें",
      viewTerminals: "POS टर्मिनल देखें",
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      country: "देश",
      currency: "करेंसी",
      vatNumber: "VAT नंबर",
      taxId: "टैक्स ID",
      email: "ईमेल",
      phone: "फ़ोन",
      website: "वेबसाइट",
      createdAt: "बनाया गया",
      actions: "कार्रवाइयाँ",
      modules: {
        accounting: {
          label: "अकाउंटिंग",
        },
        invoices: {
          label: "इनवॉइस",
        },
        estimates: {
          label: "एस्टिमेट",
        },
        bills: {
          label: "बिल",
        },
        pos: {
          label: "पॉइंट ऑफ़ सेल",
        },
        purchasing: {
          label: "ख़रीद",
        },
        inventory: {
          label: "इन्वेंट्री",
        },
        team: {
          label: "टीम",
        },
      },
    },
  },
};
