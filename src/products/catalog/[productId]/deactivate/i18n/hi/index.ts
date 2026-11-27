import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "प्रोडक्ट",
    catalog: "कैटलॉग",
    deactivate: "निष्क्रिय करें",
  },
  post: {
    title: "प्रोडक्ट निष्क्रिय करें",
    titleShort: "निष्क्रिय करें",
    description:
      "कैटलॉग के प्रोडक्ट को निष्क्रिय चिह्नित करके सॉफ़्ट-डिलीट करें। प्रोडक्ट का डेटा बना रहता है।",
    productId: {
      label: "प्रोडक्ट",
      description: "जिस प्रोडक्ट को निष्क्रिय करना है उसकी ID",
    },
    errors: {
      validation: {
        title: "रिक्वेस्ट जाँचें",
        description: "प्रोडक्ट ID जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "प्रोडक्ट निष्क्रिय करने के लिए साइन इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपको यह प्रोडक्ट निष्क्रिय करने की अनुमति नहीं है",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
      server: {
        title: "सर्वर एरर",
        description: "हमारी तरफ़ कुछ गड़बड़ हुई। दोबारा कोशिश करें।",
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
        title: "प्रोडक्ट नहीं मिला",
        description: "प्रोडक्ट नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "प्रोडक्ट निष्क्रिय हुआ",
      description: "प्रोडक्ट सक्रिय कैटलॉग से हटा दिया गया।",
    },
    response: {
      id: "प्रोडक्ट",
      isActive: "सक्रिय",
    },
    widget: {
      backToList: "प्रोडक्ट पर वापस",
      cancel: "रद्द करें",
      back: "वापस",
      warning:
        "इससे प्रोडक्ट निष्क्रिय होगा और सक्रिय कैटलॉग से हट जाएगा। डेटा बना रहेगा।",
    },
  },
};
