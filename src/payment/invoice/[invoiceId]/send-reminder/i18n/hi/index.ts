import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
  },
  post: {
    title: "पेमेंट रिमाइंडर तैयार करें",
    titleShort: "रिमाइंडर तैयार करें",
    description: "मौजूदा बकाया रकम और वैकल्पिक नोट के साथ रिमाइंडर का ड्राफ़्ट बनाएँ।",
    form: {
      title: "रिमाइंडर तैयार करें",
      description: "ड्राफ़्ट भेजने से पहले बकाया राशि देख लें।",
    },
    response: {
      success: "रिमाइंडर ड्राफ़्ट तैयार",
      message: "स्टेटस मैसेज",
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
        title: "देय तारीख नहीं बीती",
        description:
          "ड्राफ़्ट के लिए ऐसा खुला इनवॉइस चाहिए जिसमें बकाया रकम हो और देय तारीख बीत चुकी हो।",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "रिमाइंडर ड्राफ़्ट तैयार",
      description: "इनवॉइस हिस्ट्री में सेव हुआ। रिमाइंडर ग्राहक को भेजने के लिए तैयार है।",
    },
  },
  invoiceId: {
    label: "इनवॉइस ID",
    description: "बकाया इनवॉइस की ID",
    placeholder: "इनवॉइस ID डालें",
  },
  message: {
    label: "कस्टम मैसेज",
    description: "रिमाइंडर में जोड़ने के लिए वैकल्पिक कस्टम मैसेज",
    placeholder: "रिमाइंडर में निजी नोट जोड़ें...",
  },
  widget: {
    copy: "रिमाइंडर कॉपी करें",
    copied: "रिमाइंडर कॉपी हुआ",
    copyFailed: "कॉपी नहीं हुआ। दोबारा कोशिश करें",
    download: "रिमाइंडर डाउनलोड करें",
    subject: "इनवॉइस {{number}} के लिए पेमेंट रिमाइंडर",
    body: "बकाया रकम {{amount}} है। भुगतान की देय तारीख {{date}} थी।",
    back: "वापस",
    submit: "रिमाइंडर तैयार करें",
    reminderSent: "इनवॉइस हिस्ट्री में सेव हुआ। रिमाइंडर ग्राहक को भेजने के लिए तैयार है।",
    viewInvoice: "इनवॉइस देखें",
  },
};
