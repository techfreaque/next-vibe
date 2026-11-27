import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "सभी कैंपेन रोकें",
  description: "सभी एक्टिव ईमेल कैंपेन बंद करें",
  post: {
    title: "सभी कैंपेन रोकें",
    titleShort: "कैंपेन रोकें",
    description: "सभी एक्टिव ईमेल कैंपेन तुरंत रोकें और पेंडिंग भेजना रद्द करें",
    fields: {
      confirm: {
        label: "रोकने की पुष्टि करें",
        description: "सभी कैंपेन रोकना चाहते हैं तो पुष्टि के लिए टिक करें",
      },
      reason: {
        label: "वजह",
        description: "रोकने की वजह (वैकल्पिक)",
      },
    },
    response: {
      halted: "कैंपेन रोके गए",
      emailsCancelled: "रद्द हुए ईमेल",
    },
    errors: {
      unauthorized: { title: "अनधिकृत", description: "एडमिन होना ज़रूरी है" },
      forbidden: { title: "अनुमति नहीं", description: "अनुमति नहीं" },
      server: {
        title: "सर्वर एरर",
        description: "कैंपेन नहीं रोके जा सके",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "पुष्टि पर टिक होना ज़रूरी है",
      },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      conflict: { title: "टकराव", description: "टकराव" },
      network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव",
      },
    },
    success: {
      title: "कैंपेन रोक दिए गए",
      description: "सभी कैंपेन सफलतापूर्वक रोक दिए गए",
    },
  },
  widget: {
    title: "इमरजेंसी रोक",
    description:
      "सभी एक्टिव ईमेल कैंपेन तुरंत बंद करें। एरर या ज़रूरी समस्या होने पर इस्तेमाल करें।",
    haltButton: "सभी कैंपेन रोकें",
    halting: "रोका जा रहा है...",
    confirmTitle: "सभी कैंपेन रोकें?",
    confirmDescription:
      "इससे सभी एक्टिव ईमेल कैंपेन तुरंत बंद हो जाएँगे और पेंडिंग ईमेल रद्द हो जाएँगे। ये कार्रवाई वापस नहीं हो सकती।",
    confirmButton: "हाँ, सब रोक दें",
    cancelButton: "रद्द करें",
    done: "रोका गया",
  },
};
