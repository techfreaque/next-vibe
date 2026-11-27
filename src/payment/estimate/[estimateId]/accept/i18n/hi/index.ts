import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एस्टिमेट",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "एस्टिमेट स्वीकार करें",
    titleShort: "एस्टिमेट स्वीकार करें",
    description: "एस्टिमेट को कस्टमर की ओर से स्वीकार चिह्नित करें",
    form: {
      title: "एस्टिमेट स्वीकार करें",
      description: "एस्टिमेट को कस्टमर की ओर से स्वीकार चिह्नित करें",
    },
    response: { success: "सफल", message: "स्टेटस मैसेज" },
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
      title: "सफल",
      description: "एस्टिमेट को कस्टमर की ओर से स्वीकार चिह्नित करें",
    },
  },
  estimateId: {
    label: "एस्टिमेट ID",
    description: "जिस एस्टिमेट पर कार्रवाई करनी है",
  },
  widget: {
    cancel: "रद्द करें",
    loading: "एस्टिमेट लोड हो रहा है",
    unavailable: "सिर्फ़ भेजे गए एस्टिमेट स्वीकार किए जा सकते हैं।",
    total: "कुल",
    back: "वापस",
    submit: "एस्टिमेट स्वीकार करें",
    accepted: "एस्टिमेट स्वीकार चिह्नित हो गया।",
    confirmMessage: "इससे एस्टिमेट कस्टमर की ओर से स्वीकार चिह्नित हो जाएगा।",
  },
};
