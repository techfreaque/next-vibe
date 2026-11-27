import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "लीड",
  tags: {
    leads: "लीड",
    skill: "स्किल",
  },
  patch: {
    title: "स्किल को श्रेय दें",
    titleShort: "स्किल एट्रिब्यूशन",
    description: "दर्ज करें कि इस लीड को कौन सी स्किल लाई (पहले संपर्क का एट्रिब्यूशन)",
    skillId: {
      label: "स्किल",
      description: "कम्युनिटी की कोई प्रकाशित स्किल चुनें।",
    },
    errors: {
      validation: {
        title: "स्किल चुनें",
        description: "कम्युनिटी की कोई प्रकाशित स्किल चुनें।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक पहुँच नहीं हो सकी। फिर कोशिश करें।",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "इसे अपडेट करने के लिए लॉग इन होना ज़रूरी है।",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास इस लीड को अपडेट करने की अनुमति नहीं है।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "लीड नहीं मिली।",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक एरर हुआ। फिर कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ।",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं।",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ।",
      },
    },
    success: {
      title: "स्किल को श्रेय मिला",
      description: "इस लीड के लिए स्किल दर्ज हो गई।",
    },
    skipped: {
      title: "दर्ज नहीं हुई",
      description:
        "विज़िटर की पहली स्किल ही दर्ज रहती है। दूसरी स्किल जाँचनी हो तो नया सेशन शुरू करें।",
    },
    submit: "स्किल को श्रेय दें",
  },
};
