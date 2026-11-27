import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "ग्राहक रसीद उलटें",
  description:
    "दर्ज करें कि यह रसीद क्यों सुधारी जा रही है। उसकी मूल एंट्री जर्नल में बनी रहती है।",
  invoiceId: "इनवॉइस रेफ़रेंस",
  entryId: "रसीद पोस्टिंग रेफ़रेंस",
  date: "उलटने की तारीख़",
  reason: "उलटने का कारण",
  reasonPlaceholder: "जैसे, बैंक ने यह पेमेंट लौटा दिया",
  datePlaceholder: "आज",
  viewInvoice: "इनवॉइस देखें",
  reversal: "रिवर्सल एंट्री",
  originalDate: "मूल रसीद की तारीख़",
  receiptAmount: "रसीद की राशि",
  postingStatus: "पोस्टिंग स्टेटस",
  viewReversal: "रिवर्सल एंट्री देखें",
  cancel: "रद्द करें",
  confirmTitle: "यह रसीद रिवर्सल पोस्ट करें?",
  confirm: "रिवर्सल पोस्ट करें",
  success: {
    title: "रसीद उलट दी गई",
    description: "इनवॉइस का बैलेंस अब रिवर्सल दिखाता है।",
  },
  invalidDate: "मूल रसीद की तारीख़ से आज तक की कोई तारीख़ डालें।",
  noPeriod: "इस तारीख़ के लिए कोई खुली अकाउंटिंग अवधि नहीं है।",
  invalidReceipt: "इस इनवॉइस के लिए यह रसीद उलटी नहीं जा सकती।",
  invalidLines: "सेव की गई रसीद लाइनें अधूरी हैं या किसी दूसरी करेंसी या कंपनी की हैं।",
  errors: {
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "पेमेंट पैरामीटर गलत हैं",
    },
    server: {
      title: "सर्वर एरर",
      description: "आंतरिक सर्वर एरर हुआ",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर हुआ",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर हुआ",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "एक्सेस नहीं मिला",
    },
    notFound: {
      title: "नहीं मिला",
      description: "इनवॉइस नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "इनवॉइस पहले ही चुकाया या रद्द हो चुका है",
    },
    unsavedChanges: {
      title: "बिना सेव बदलाव",
      description: "कुछ बदलाव सेव नहीं हुए हैं",
    },
  },
  tags: { payment: "पेमेंट", invoice: "इनवॉइस" },
};
