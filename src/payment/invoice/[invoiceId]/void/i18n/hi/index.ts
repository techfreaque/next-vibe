import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
  },
  post: {
    title: "इनवॉइस वॉइड करें",
    titleShort: "इनवॉइस वॉइड करें",
    description:
      "ड्राफ़्ट या खुला इनवॉइस रद्द करें। चुकाए गए इनवॉइस वॉइड नहीं हो सकते। जर्नल एंट्री हो तो वो रिवर्स हो जाती है।",
    form: {
      title: "इनवॉइस वॉइड करें",
      description: "ये कार्रवाई वापस नहीं हो सकती।",
    },
    response: {
      success: "इनवॉइस वॉइड हो गया",
      message: "स्टेटस मैसेज",
    },
    errors: {
      appliedPayments: "जिस इनवॉइस पर पेमेंट या क्रेडिट लगे हों, वो वॉइड नहीं हो सकता।",
      reversalPosting: "वॉइड करने से पहले मूल पोस्टिंग और खुली अकाउंटिंग अवधि जाँच लें।",
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत पैरामीटर",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इनवॉइस नहीं मिला",
      },
      conflict: {
        title: "वॉइड नहीं हो सकता",
        description: "चुकाए गए इनवॉइस वॉइड नहीं हो सकते",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "इनवॉइस सफलतापूर्वक वॉइड हो गया",
    },
  },
  invoiceId: {
    label: "इनवॉइस ID",
    description: "वॉइड करने वाले इनवॉइस की ID",
    placeholder: "इनवॉइस ID डालें",
  },
  widget: {
    invoice: "इनवॉइस",
    total: "इनवॉइस का योग",
    customer: "कस्टमर",
    openInvoice: "इनवॉइस खोलें",
    retry: "दोबारा कोशिश करें",
    loading: "इनवॉइस लोड हो रहा है…",
    unavailable: "इनवॉइस उपलब्ध नहीं",
    reversal: "आज की तारीख वाला रिवर्सल बकाया रिसीवेबल साफ़ कर देता है।",
    cancelOnly: "इनवॉइस रद्द हो जाएगा।",
    ineligible:
      "सिर्फ़ ड्राफ़्ट या बिना चुकाया, बिना लागू किया इनवॉइस वॉइड हो सकता है।",
    back: "वापस",
    submit: "इनवॉइस वॉइड करें",
    warning: "ये कार्रवाई वापस नहीं हो सकती। इनवॉइस हमेशा के लिए रद्द हो जाएगा।",
    confirm: "इनवॉइस वॉइड करें",
    voided: "इनवॉइस वॉइड हो गया",
    backToList: "इनवॉइस पर वापस",
  },
};
