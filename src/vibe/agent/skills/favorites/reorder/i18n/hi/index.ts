import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    favorites: "पसंदीदा",
  },
  post: {
    title: "पसंदीदा का क्रम बदलें",
    titleShort: "क्रम बदलें",
    description: "अपने पसंदीदा कॉन्फ़िगरेशन का क्रम अपडेट करें",
    positions: {
      label: "पोज़िशन",
    },
    errors: {
      validation: {
        title: "गलत क्रम",
        description: "अपने क्रम की सेटिंग्स जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "कनेक्शन एरर",
        description: "नया क्रम सेव नहीं हो सका। दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "अपने पसंदीदा का क्रम बदलने के लिए साइन इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं है",
        description: "आपको पसंदीदा का क्रम बदलने की अनुमति नहीं है",
      },
      notFound: {
        title: "पसंदीदा नहीं मिले",
        description: "क्रम बदलने के लिए आपके पसंदीदा नहीं मिले",
      },
      server: {
        title: "कुछ गड़बड़ हो गई",
        description: "आपका नया क्रम सेव नहीं हो सका। दोबारा कोशिश करें",
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
        title: "क्रम में टकराव",
        description: "क्रम बदल गया है। रीफ़्रेश करें और दोबारा कोशिश करें",
      },
    },
    success: {
      title: "क्रम सेव हो गया",
      description: "आपके पसंदीदा का क्रम सफलतापूर्वक बदल गया",
    },
  },
};
