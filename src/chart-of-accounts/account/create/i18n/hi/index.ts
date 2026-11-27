import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    accountType: {
      ASSET: "एसेट",
      LIABILITY: "लायबिलिटी",
      EQUITY: "इक्विटी",
      REVENUE: "रेवेन्यू",
      EXPENSE: "ख़र्च",
    },
    accountSubtype: {
      CURRENT_ASSET: "करंट एसेट",
      FIXED_ASSET: "फ़िक्स्ड एसेट",
      BANK: "बैंक",
      CASH: "कैश",
      ACCOUNTS_RECEIVABLE: "अकाउंट्स रिसीवेबल",
      INVENTORY: "इन्वेंटरी",
      PREPAID: "प्रीपेड",
      ACCOUNTS_PAYABLE: "अकाउंट्स पेएबल",
      VAT_PAYABLE: "VAT पेएबल",
      VAT_RECEIVABLE: "VAT रिसीवेबल",
      ACCRUED_LIABILITY: "एक्रुड लायबिलिटी",
      SHORT_TERM_DEBT: "शॉर्ट-टर्म डेट",
      LONG_TERM_DEBT: "लॉन्ग-टर्म डेट",
      SHARE_CAPITAL: "शेयर कैपिटल",
      RETAINED_EARNINGS: "रिटेन्ड अर्निंग्स",
      REVENUE_SALES: "सेल्स रेवेन्यू",
      REVENUE_SERVICE: "सर्विस रेवेन्यू",
      COGS: "कॉस्ट ऑफ़ गुड्स सोल्ड",
      PAYROLL: "पेरोल",
      RENT: "किराया",
      UTILITIES: "यूटिलिटीज़",
      OPEX: "ऑपरेटिंग ख़र्च",
      FINANCIAL_INCOME: "फ़ाइनेंशियल इनकम",
      FINANCIAL_EXPENSE: "फ़ाइनेंशियल ख़र्च",
      TAX_EXPENSE: "टैक्स ख़र्च",
      OTHER: "अन्य",
    },
  },
  post: {
    title: "अकाउंट बनाएँ",
    titleShort: "नया अकाउंट",
    description: "कंपनी के चार्ट ऑफ़ अकाउंट्स में कस्टम अकाउंट जोड़ें",
    companyId: {
      label: "कंपनी",
      description: "वो कंपनी जिसके चार्ट ऑफ़ अकाउंट्स में ये अकाउंट जुड़ेगा",
      placeholder: "कंपनी चुनें",
    },
    code: {
      label: "अकाउंट कोड",
      description: "अकाउंट का यूनिक न्यूमेरिक कोड",
      placeholder: "जैसे 1150",
    },
    name: {
      label: "अकाउंट का नाम",
      description: "अकाउंट का वर्णनात्मक नाम",
      placeholder: "जैसे पेटी कैश",
    },
    type: {
      label: "अकाउंट टाइप",
      description: "टॉप-लेवल अकाउंट वर्गीकरण",
      placeholder: "टाइप चुनें",
    },
    subtype: {
      label: "अकाउंट सबटाइप",
      description: "टाइप के भीतर विस्तृत वर्गीकरण",
      placeholder: "सबटाइप चुनें",
    },
    parentId: {
      label: "पैरेंट अकाउंट",
      description: "रिपोर्ट में इस अकाउंट को किसी दूसरे के नीचे ग्रुप करता है",
      placeholder: "कोई नहीं (टॉप लेवल)",
    },
    response: {
      id: "अकाउंट",
      code: "कोड",
      name: "नाम",
    },
    errors: {
      unauthorized: { title: "अनधिकृत", description: "लॉगिन ज़रूरी है" },
      validation: {
        title: "वैलिडेशन एरर",
        description: "सभी ज़रूरी फ़ील्ड जाँचें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "पर्याप्त अनुमति नहीं",
      },
      server: {
        title: "सर्वर एरर",
        description: "अकाउंट नहीं बन सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      conflict: {
        title: "कोड लिया जा चुका है",
        description: "इस कोड का अकाउंट पहले से मौजूद है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके",
      },
      notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "अकाउंट बन गया",
      description: "अकाउंट जोड़ दिया गया है",
    },
    widget: {
      viewButton: "अकाउंट खोलें",
      addAnotherButton: "एक और अकाउंट जोड़ें",
      back: "वापस",
      save: "अकाउंट बनाएँ",
      sectionAccount: "अकाउंट",
      sectionClassification: "वर्गीकरण",
    },
  },
  title: "अकाउंट बनाएँ",
  description: "कस्टम अकाउंट जोड़ें",
  category: "चार्ट ऑफ़ अकाउंट्स",
  tag: "अकाउंट",
};
