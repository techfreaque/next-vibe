import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "अकाउंटिंग अवधि खोलें",
    titleShort: "नई अवधि",
    description: "कंपनी के लिए नई अकाउंटिंग अवधि बनाएँ",
    companyId: {
      label: "कंपनी",
      description: "जिस कंपनी के लिए अवधि खोलनी है",
      placeholder: "कंपनी चुनें",
    },
    name: {
      label: "अवधि का नाम",
      description: "जैसे जनवरी 2026",
      placeholder: "जनवरी 2026",
    },
    startDate: {
      label: "शुरू की तारीख़",
      description: "अवधि की शुरुआती तारीख़",
      placeholder: "",
    },
    endDate: {
      label: "खत्म की तारीख़",
      description: "अवधि की आख़िरी तारीख़",
      placeholder: "",
    },
    response: {
      id: "अवधि ID",
      name: "नाम",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "शुरू/खत्म की तारीख़ जाँचें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "अनुमति पर्याप्त नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "अवधि नहीं बन सकी",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      conflict: {
        title: "ओवरलैप",
        description: "तारीख़ की सीमा मौजूदा अवधि से टकराती है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक पहुँच नहीं हो सकी",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कंपनी नहीं मिली",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "अवधि बन गई",
      description: "अकाउंटिंग अवधि खुल गई",
    },
    widget: {
      viewButton: "अवधि देखें",
      back: "वापस",
    },
  },
  title: "अवधि बनाएँ",
  description: "नई अकाउंटिंग अवधि खोलें",
  category: "चार्ट ऑफ़ अकाउंट्स",
  tag: "अवधि",
};
