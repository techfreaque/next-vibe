import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एस्टिमेट",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "एस्टिमेट की कॉपी बनाएँ",
    titleShort: "एस्टिमेट की कॉपी बनाएँ",
    description: "इस एस्टिमेट को नए ड्राफ़्ट में क्लोन करें",
    form: {
      title: "एस्टिमेट की कॉपी बनाएँ",
      description: "इस एस्टिमेट को नए ड्राफ़्ट में क्लोन करें",
    },
    response: {
      success: "सफल",
      message: "स्टेटस मैसेज",
      newEstimateId: "नया एस्टिमेट",
      estimateNumber: "नया एस्टिमेट नंबर",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत पैरामीटर",
      },
      server: { title: "सर्वर एरर", description: "इंटरनल सर्वर एरर" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
      notFound: { title: "नहीं मिला", description: "एस्टिमेट नहीं मिला" },
      conflict: {
        title: "टकराव",
        description: "मौजूदा स्टेटस में ये कार्रवाई नहीं हो सकती",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "एस्टिमेट की कॉपी बन गई",
      description: "एक नया ड्राफ़्ट एस्टिमेट बन गया है",
    },
  },
  estimateId: {
    label: "एस्टिमेट ID",
    description: "जिस एस्टिमेट की कॉपी बनानी है",
  },
  widget: {
    cancel: "रद्द करें",
    loading: "एस्टिमेट लोड हो रहा है",
    total: "कुल",
    created: "उन्हीं लाइनों के साथ ड्राफ़्ट {{number}} बन गया।",
    back: "वापस",
    submit: "एस्टिमेट की कॉपी बनाएँ",
    viewDuplicate: "कॉपी खोलें",
    duplicateNote: "उन्हीं लाइनों और ब्योरे के साथ एक नया ड्राफ़्ट एस्टिमेट बनेगा।",
  },
};
