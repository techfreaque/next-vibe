import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "अकाउंटिंग अवधियाँ",
    titleShort: "अवधियाँ",
    description: "किसी कंपनी की सभी अकाउंटिंग अवधियों की सूची",
    companyId: {
      label: "कंपनी ID",
      description: "जिस कंपनी की अवधियाँ देखनी हैं",
      placeholder: "कंपनी का UUID डालें",
    },
    response: {
      periods: "अवधियाँ",
      id: "ID",
      name: "नाम",
      startDate: "शुरू",
      endDate: "खत्म",
      status: "स्टेटस",
      closedAt: "बंद हुई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "कंपनी ID गलत है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "अनुमतियाँ कम हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "अवधियाँ लोड नहीं हो सकीं",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई अवधि नहीं मिली",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "अवधियाँ लोड हुईं",
      description: "अकाउंटिंग अवधियाँ मिल गईं",
    },
    widget: {
      loading: "अवधियाँ लोड हो रही हैं...",
      empty: "कोई अकाउंटिंग अवधि नहीं मिली।",
      createButton: "अवधि बनाएँ",
    },
  },
  enums: {
    periodStatus: {
      OPEN: "खुली",
      CLOSED: "बंद",
      LOCKED: "लॉक",
    },
  },
  title: "अवधि सूची",
  description: "अकाउंटिंग अवधियों की सूची",
  category: "चार्ट ऑफ़ अकाउंट्स",
  tag: "अवधि",
};
