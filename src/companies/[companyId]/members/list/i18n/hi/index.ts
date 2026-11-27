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
    members: "सदस्य",
    list: "सूची",
  },
  get: {
    title: "टीम के सदस्य",
    titleShort: "टीम के सदस्य",
    description: "इस कंपनी के सभी सदस्यों की सूची",
    companyId: {
      label: "कंपनी ID",
      description: "जिस कंपनी के सदस्य देखने हैं",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कंपनी ID गलत है",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "कंपनी के सदस्य देखने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस अस्वीकृत",
        description: "आप इस कंपनी के सदस्य नहीं हैं",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव",
      },
      server: {
        title: "सर्वर एरर",
        description: "कुछ गड़बड़ हुई। दोबारा कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
      },
      notFound: {
        title: "कंपनी नहीं मिली",
        description: "यह कंपनी मौजूद नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सदस्य लोड हुए",
      description: "सदस्यों की सूची मिल गई",
    },
    response: {
      id: "सदस्य ID",
      userId: "यूज़र ID",
      email: "ईमेल",
      name: "नाम",
      role: "भूमिका",
      isActive: "सक्रिय",
      joinedAt: "जुड़े",
    },
    widget: {
      back: "वापस",
      loading: "सदस्य लोड हो रहे हैं...",
      title: "टीम के सदस्य",
      memberSingular: "सदस्य",
      memberPlural: "सदस्य",
      invite: "सदस्य को आमंत्रित करें",
      updateRole: "भूमिका बदलें",
      remove: "हटाएँ",
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      empty: {
        title: "अभी कोई टीम सदस्य नहीं",
        hint: "इस कंपनी की अकाउंटिंग और संचालन में साथ काम करने के लिए सहकर्मियों को आमंत्रित करें।",
        cta: "पहले सदस्य को आमंत्रित करें",
      },
    },
  },
};
