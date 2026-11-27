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
    members: "सदस्य",
    invite: "आमंत्रित करें",
  },
  post: {
    title: "सदस्य को आमंत्रित करें",
    titleShort: "सदस्य को आमंत्रित करें",
    description: "ईमेल से किसी रजिस्टर्ड यूज़र को कंपनी में आमंत्रित करें",
    companyId: {
      label: "कंपनी ID",
      description: "जिस कंपनी में यूज़र को आमंत्रित करना है",
    },
    email: {
      label: "यूज़र का ईमेल",
      description: "आमंत्रित किए जाने वाले रजिस्टर्ड यूज़र का ईमेल",
      placeholder: "colleague@company.com",
    },
    role: {
      label: "रोल",
      description: "नए सदस्य को दिया जाने वाला रोल",
      placeholder: "रोल चुनें",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "ईमेल जाँचें और फिर कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "सदस्य आमंत्रित करने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "सदस्य आमंत्रित करने के लिए एडमिन या मालिक का रोल चाहिए",
      },
      conflict: {
        title: "पहले से सदस्य",
        description: "यह यूज़र पहले से इस कंपनी का सदस्य है",
      },
      server: {
        title: "सर्वर एरर",
        description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
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
        title: "यूज़र नहीं मिला",
        description: "इस ईमेल का कोई रजिस्टर्ड यूज़र नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सदस्य आमंत्रित हुआ",
      description: "यूज़र को कंपनी में जोड़ दिया गया है",
    },
    response: {
      memberId: "सदस्य ID",
      userId: "यूज़र ID",
      role: "रोल",
    },
    widget: {
      back: "सदस्यों पर वापस",
      invited: "सदस्य आमंत्रित हुआ",
    },
  },
};
