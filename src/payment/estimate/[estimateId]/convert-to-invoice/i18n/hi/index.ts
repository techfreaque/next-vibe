import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एस्टिमेट",
  tags: { payment: "पेमेंट", estimate: "एस्टिमेट", invoice: "इनवॉइस" },
  post: {
    title: "एस्टिमेट को इनवॉइस में बदलें",
    titleShort: "इनवॉइस में बदलें",
    description: "स्वीकृत एस्टिमेट को ड्राफ़्ट इनवॉइस में बदलें",
    form: {
      title: "इनवॉइस में बदलें",
      description: "इस एस्टिमेट को इनवॉइस में बदलें",
    },
    response: {
      success: "इनवॉइस में बदल गया",
      message: "स्टेटस संदेश",
      invoiceId: "बने इनवॉइस की ID",
    },
    errors: {
      reconcile:
        "सेव किए आइटम और एस्टिमेट का कुल आपस में मेल नहीं खाते। ड्राफ़्ट देखने और सुधारने के लिए एस्टिमेट की डुप्लिकेट बनाएँ।",
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं",
      },
      server: { title: "सर्वर एरर", description: "आंतरिक सर्वर एरर" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: { title: "प्रतिबंधित", description: "एक्सेस नहीं मिला" },
      notFound: { title: "नहीं मिला", description: "एस्टिमेट नहीं मिला" },
      conflict: {
        title: "टकराव",
        description: "बदलने के लिए एस्टिमेट SENT या ACCEPTED स्टेटस में होना चाहिए",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: { title: "सफल", description: "एस्टिमेट इनवॉइस में बदल गया" },
  },
  estimateId: { label: "एस्टिमेट ID", description: "जिस एस्टिमेट को बदलना है" },
  widget: {
    back: "वापस",
    submit: "इनवॉइस में बदलें",
    converted: "इस एस्टिमेट से इनवॉइस बन गया।",
    savedDraftNumber: "ड्राफ़्ट इनवॉइस #{{number}} बन गया",
    savedDraft: "ड्राफ़्ट इनवॉइस बन गया",
    convertedNumber: "एस्टिमेट {{number}} से बदला गया।",
    viewInvoice: "ड्राफ़्ट इनवॉइस खोलें",
    convertNote:
      "वही लाइन आइटम वाला ड्राफ़्ट इनवॉइस बनेगा। एस्टिमेट को बदला हुआ चिह्नित कर दिया जाएगा।",
  },
};
