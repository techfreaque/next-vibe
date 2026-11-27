import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "अकाउंट निष्क्रिय करें",
    titleShort: "निष्क्रिय करें",
    description:
      "अकाउंट को सॉफ़्ट-निष्क्रिय करें। सिस्टम अकाउंट या पोस्ट की गई जर्नल एंट्री लाइन वाले अकाउंट निष्क्रिय नहीं हो सकते।",
    accountId: {
      label: "अकाउंट",
      description: "जिस अकाउंट को निष्क्रिय करना है",
      placeholder: "अकाउंट चुनें",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "अकाउंट ID गलत है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "सिस्टम अकाउंट निष्क्रिय नहीं हो सकते",
      },
      server: {
        title: "सर्वर एरर",
        description: "अकाउंट निष्क्रिय नहीं हो सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      conflict: {
        title: "ट्रांज़ैक्शन मौजूद हैं",
        description: "जर्नल एंट्री लाइन वाला अकाउंट निष्क्रिय नहीं हो सकता",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक पहुँच नहीं हो सकी",
      },
      notFound: {
        title: "नहीं मिला",
        description: "अकाउंट नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "अकाउंट निष्क्रिय हुआ",
      description: "अकाउंट अब निष्क्रिय है",
    },
    widget: {
      confirmWarning:
        "यह अकाउंट निष्क्रिय हो जाएगा। पोस्ट किए ट्रांज़ैक्शन वाले अकाउंट के लिए यह कार्रवाई पलटी नहीं जा सकती।",
      doneLabel: "हो गया",
      confirmTitle: "अकाउंट निष्क्रिय करें?",
      confirmDescription:
        "यह अकाउंट निष्क्रिय हो जाएगा और नई जर्नल एंट्री में इस्तेमाल नहीं हो सकेगा। मौजूदा एंट्री पर कोई असर नहीं।",
      confirmButton: "हाँ, निष्क्रिय करें",
      cancelButton: "रद्द करें",
    },
  },
  title: "अकाउंट निष्क्रिय करें",
  description: "अकाउंट को सॉफ़्ट-निष्क्रिय करें",
  category: "चार्ट ऑफ़ अकाउंट्स",
  tag: "अकाउंट",
};
