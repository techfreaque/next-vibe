import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "कोटेशन",
  tags: {
    payment: "payment",
    estimate: "estimate",
    lines: "lines",
  },
  post: {
    title: "कोटेशन की लाइन हटाएँ",
    titleShort: "लाइन हटाएँ",
    description: "ड्राफ़्ट कोटेशन से एक लाइन आइटम हटाएँ",
    form: {
      title: "कोटेशन की लाइन हटाएँ",
      description: "इस लाइन आइटम को कोटेशन से हटाएँ",
    },
    response: {
      estimateId: "कोटेशन",
      success: "सफल",
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
        description: "आंतरिक सर्वर एरर",
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
        description: "एक्सेस अस्वीकृत",
      },
      notFound: {
        title: "नहीं मिला",
        description: "लाइन आइटम नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "लाइन हटाने के लिए कोटेशन DRAFT स्टेटस में होना चाहिए",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "लाइन हटाई गई",
      description: "लाइन आइटम कोटेशन से हटा दिया गया",
    },
  },
  lineId: {
    label: "लाइन ID",
    description: "जिस लाइन आइटम को हटाना है",
  },
  widget: {
    lineTotal: "लाइन का कुल",
    back: "वापस",
    submit: "लाइन हटाएँ",
    removed: "लाइन आइटम कोटेशन से हटा दिया गया।",
    confirmTitle: "यह लाइन आइटम हटाएँ?",
    confirmDescription:
      "यह लाइन आइटम कोटेशन से हमेशा के लिए हट जाएगा। कुल दोबारा गिने जाएँगे।",
    confirmButton: "हटाएँ",
    cancelButton: "रद्द करें",
  },
};
