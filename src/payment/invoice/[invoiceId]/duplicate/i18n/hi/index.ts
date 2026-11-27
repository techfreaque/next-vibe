import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
  },
  post: {
    title: "इनवॉइस की कॉपी बनाएँ",
    titleShort: "इनवॉइस की कॉपी बनाएँ",
    description:
      "मौजूदा इनवॉइस को नए DRAFT में क्लोन करें। सभी लाइन आइटम, ग्राहक, कंपनी और मुद्रा कॉपी होती हैं। नया इनवॉइस नंबर और आज की तारीख मिलती है।",
    form: {
      title: "इनवॉइस की कॉपी बनाएँ",
      description: "इससे एक नया ड्राफ़्ट इनवॉइस बनाता है",
    },
    response: {
      success: "इनवॉइस की कॉपी बनी",
      message: "स्टेटस मैसेज",
      invoice: {
        title: "नया इनवॉइस",
        subtitle: "कॉपी किया हुआ ड्राफ़्ट इनवॉइस",
        id: "इनवॉइस",
        companyId: "कंपनी",
        customerId: "ग्राहक",
        invoiceSequenceNumber: "इनवॉइस नंबर",
        currency: "मुद्रा",
        status: "स्टेटस",
        dueDate: "देय तारीख",
        notes: "नोट्स",
        amount: "राशि",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इनवॉइस नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "इनवॉइस की कॉपी नए ड्राफ़्ट के रूप में बनी",
    },
  },
  invoiceId: {
    label: "इनवॉइस",
    description: "जिस इनवॉइस की कॉपी बनानी है उसकी ID",
    placeholder: "इनवॉइस ID डालें",
  },
  widget: {
    duplicate: "कॉपी बनाएँ",
    cancel: "रद्द करें",
    loading: "इनवॉइस लोड हो रहा है",
    total: "कुल",
    duplicateNote:
      "उसी ग्राहक, मुद्रा और लाइनों के साथ नया ड्राफ़्ट बनता है। जारी करने पर उसे अपना नंबर मिलता है।",
    back: "वापस",
    submit: "इनवॉइस की कॉपी बनाएँ",
    duplicated: "इनवॉइस की कॉपी बनी",
    invoiceNumber: "इनवॉइस #",
    viewDuplicate: "कॉपी खोलें",
  },
};
