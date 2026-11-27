import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "सब्सक्रिप्शन",
    company: "कंपनी",
    list: "सूची",
  },
  get: {
    title: "मालिक के सब्सक्रिप्शन",
    titleShort: "मालिक के सब्सक्रिप्शन",
    description: "कंपनी के मालिक का अपना सब्सक्रिप्शन देखें।",
    companyId: {
      label: "कंपनी ID",
      description: "जिस कंपनी के सब्सक्रिप्शन सूचीबद्ध करने हैं",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कंपनी ID गलत है",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "कंपनी के सब्सक्रिप्शन देखने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस अस्वीकृत",
        description: "आपके पास इस कंपनी के सब्सक्रिप्शन का एक्सेस नहीं है",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव",
      },
      server: {
        title: "सर्वर एरर",
        description: "कुछ गड़बड़ हुई। दोबारा कोशिश करें",
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
      title: "सब्सक्रिप्शन लोड हुए",
      description: "कंपनी के सब्सक्रिप्शन मिल गए",
    },
  },
};
