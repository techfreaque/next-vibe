import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    invoice: "invoice",
    lines: "lines",
  },
  post: {
    title: "इनवॉइस की लाइन हटाएँ",
    titleShort: "लाइन हटाएँ",
    description: "ड्राफ़्ट इनवॉइस से एक लाइन आइटम हटाएँ",
    form: {
      title: "लाइन हटाएँ",
      description: "इस लाइन को इनवॉइस से हमेशा के लिए हटाता है",
    },
    response: {
      invoiceId: "इनवॉइस",
      success: "लाइन हटाई गई",
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
        description: "लाइन आइटम नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "इनवॉइस ड्राफ़्ट स्टेटस में नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "लाइन आइटम इनवॉइस से हटा दिया गया",
    },
  },
  lineId: {
    label: "लाइन ID",
    description: "जिस लाइन आइटम को हटाना है उसकी ID",
    placeholder: "लाइन ID डालें",
  },
  widget: {
    lineActions: "कार्रवाइयाँ",
    remove: "हटाएँ",
    removeNamed: "लाइन {{description}} हटाएँ",
    cancel: "रद्द करें",
    lineTotal: "लाइन का कुल",
    back: "वापस",
    submit: "लाइन हटाएँ",
    warning: "यह लाइन आइटम इनवॉइस से हमेशा के लिए हट जाएगा।",
    confirm: "लाइन हटाएँ",
    removed: "लाइन आइटम हटाया गया",
  },
};
