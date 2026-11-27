import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    favorites: "पसंदीदा",
  },
  post: {
    title: "पसंदीदा हटाएँ",
    titleShort: "हटाएँ",
    description: "कई पसंदीदा एक साथ हटाएँ",
    ids: {
      label: "पसंदीदा की ID",
    },
    errors: {
      validation: {
        title: "गलत रिक्वेस्ट",
        description: "जो हटा रहे हैं उसे जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "कनेक्शन एरर",
        description: "पसंदीदा हटाए नहीं जा सके। दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "अपने पसंदीदा हटाने के लिए साइन इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं है",
        description: "आपको ये पसंदीदा हटाने की अनुमति नहीं है",
      },
      notFound: {
        title: "पसंदीदा नहीं मिले",
        description: "हटाने के लिए पसंदीदा नहीं मिले",
      },
      server: {
        title: "कुछ गड़बड़ हो गई",
        description: "आपके पसंदीदा हटाए नहीं जा सके। दोबारा कोशिश करें",
      },
      unknown: {
        title: "अनपेक्षित एरर",
        description: "कुछ अनपेक्षित हो गया। दोबारा कोशिश करें",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव अभी सेव नहीं हुए हैं",
      },
      conflict: {
        title: "हटाने में टकराव",
        description: "ये पसंदीदा बदल गए हैं। रीफ़्रेश करें और दोबारा कोशिश करें",
      },
    },
    success: {
      title: "पसंदीदा हटा दिए",
      description: "चुने हुए पसंदीदा हटा दिए गए हैं",
    },
  },
};
