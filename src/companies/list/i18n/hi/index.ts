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
    list: "सूची",
  },
  get: {
    title: "कंपनियाँ",
    titleShort: "कंपनी डायरेक्टरी",
    description: "कंपनी सदस्यताएँ देखें। प्लेटफ़ॉर्म एडमिन पूरी डायरेक्टरी खोल सकते हैं।",
    includeAll: {
      label: "सभी कंपनियाँ",
      description:
        "वे कंपनियाँ भी शामिल करें जिनके आप सदस्य नहीं हैं। सिर्फ़ प्लेटफ़ॉर्म एडमिन।",
    },
    page: {
      label: "पेज",
      description: "पेज नंबर (1 से शुरू)",
    },
    pageSize: {
      label: "प्रति पेज",
      description: "प्रति पेज नतीजे (अधिकतम 100)",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट गलत है",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "अपनी कंपनियाँ देखने के लिए साइन इन करें",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव",
      },
      server: {
        title: "सर्वर एरर",
        description: "कुछ गड़बड़ हुई, फिर कोशिश करें",
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
        title: "नहीं मिला",
        description: "कोई कंपनी नहीं मिली",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "कंपनियाँ लोड हुईं",
      description: "कंपनी की सूची मिल गई",
    },
    widget: {
      noMembership: "कोई सदस्यता नहीं",
      back: "वापस",
      loading: "कंपनियाँ लोड हो रही हैं...",
      title: "कंपनियाँ",
      create: "नई कंपनी",
      previous: "पिछला",
      next: "अगला",
      total: "companies",
      totalSingular: "company",
      inactive: "निष्क्रिय",
      empty: {
        title: "अभी कोई कंपनी नहीं",
        hint: "अपनी अकाउंटिंग, इनवॉइसिंग और टीम मैनेज करने के लिए कंपनी बनाएँ।",
        cta: "अपनी पहली कंपनी बनाएँ",
      },
    },
    response: {
      total: "कुल",
      id: "ID",
      name: "नाम",
      type: "प्रकार",
      role: "आपका रोल",
      isActive: "सक्रिय",
      country: "देश",
      currency: "करेंसी",
      email: "ईमेल",
      createdAt: "बनाया गया",
    },
  },
};
