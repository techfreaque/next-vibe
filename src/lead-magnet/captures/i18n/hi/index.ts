import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  list: {
    title: "कैप्चर की गई लीड",
    titleShort: "कैप्चर की गई लीड",
    description: "वे सभी जिन्होंने आपका लीड मैग्नेट फ़ॉर्म भरा",
    tag: "lead-magnet-captures",
    response: {
      items: "लीड",
      total: "कुल",
      page: "पेज",
      pageSize: "पेज का आकार",
    },
    success: {
      title: "लीड लोड हुईं",
      description: "आपकी कैप्चर की गई लीड",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "अपना इनपुट जाँचें",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "जारी रखने के लिए लॉग इन करें",
      },
      forbidden: { title: "मना है", description: "एक्सेस नहीं मिला" },
      notFound: { title: "नहीं मिला", description: "कोई लीड नहीं मिली" },
      conflict: { title: "टकराव", description: "टकराव हो गया" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      internal: {
        title: "सर्वर एरर",
        description: "आंतरिक एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
    },
  },
  widget: {
    empty:
      "अभी कोई सब्सक्राइबर नहीं। अपनी लिस्ट बढ़ाने के लिए अपनी स्किल का पेज शेयर करें।",
    exportCsv: "CSV एक्सपोर्ट करें",
    columns: {
      date: "तारीख़",
      name: "नाम",
      email: "ईमेल",
      status: "स्थिति",
    },
    statusSuccess: "कैप्चर हुआ",
    statusFailed: "फ़ेल",
  },
};
