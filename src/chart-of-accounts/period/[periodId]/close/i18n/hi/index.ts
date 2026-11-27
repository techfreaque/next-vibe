import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "पीरियड बंद करें",
    titleShort: "पीरियड बंद करें",
    description:
      "अकाउंटिंग पीरियड बंद करें। पीरियड में कोई DRAFT जर्नल एंट्री नहीं होनी चाहिए।",
    periodId: {
      label: "पीरियड ID",
      description: "बंद करने वाला पीरियड",
      placeholder: "पीरियड UUID",
    },
    errors: {
      unauthorized: { title: "अनधिकृत", description: "लॉगिन ज़रूरी है" },
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत पीरियड ID",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "पीरियड बंद करने के लिए Accountant रोल चाहिए",
      },
      server: { title: "सर्वर एरर", description: "पीरियड बंद नहीं हो सका" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      conflict: {
        title: "ड्राफ़्ट एंट्री मौजूद हैं",
        description: "बंद करने से पहले सभी जर्नल एंट्री पोस्ट होनी चाहिए",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके",
      },
      notFound: { title: "नहीं मिला", description: "पीरियड नहीं मिला" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "पीरियड बंद हो गया",
      description: "अकाउंटिंग पीरियड बंद हो गया है",
    },
    widget: {
      closeNamed: "{{name}} बंद करें",
      draftCount: "ड्राफ़्ट जर्नल एंट्री",
      closedLabel: "बंद",
      failedLabel: "फ़ेल",
      confirmTitle: "अकाउंटिंग पीरियड बंद करें?",
      confirmDescription:
        "पीरियड बंद करना स्थायी है। बंद पीरियड में कोई नई जर्नल एंट्री पोस्ट नहीं हो सकती।",
      confirmButton: "हाँ, पीरियड बंद करें",
      cancelButton: "रद्द करें",
    },
  },
  title: "पीरियड बंद करें",
  description: "अकाउंटिंग पीरियड बंद करें",
  category: "चार्ट ऑफ़ अकाउंट्स",
  tag: "अवधि",
};
