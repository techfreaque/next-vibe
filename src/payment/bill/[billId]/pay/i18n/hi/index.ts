import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "पेमेंट", bill: "बिल", ap: "देय खाता" },
  post: {
    title: "बिल चुकाएँ",
    titleShort: "बिल चुकाएँ",
    description: "मंज़ूर बिल को चुकाया चिह्नित करें और पेमेंट जर्नल एंट्री पोस्ट करें",
    billId: { label: "बिल", description: "जिस बिल को चुकाया चिह्नित करना है" },
    errors: {
      approvalPosting: "पेमेंट से पहले इस बिल की पोस्ट की हुई मंज़ूरी एंट्री चाहिए।",
      paymentAccount: "इस कंपनी का सक्रिय बैंक या कैश अकाउंट चुनें।",
      paymentPosting: "पेमेंट की तारीख़, कंपनी की करेंसी और पोस्टिंग अकाउंट जाँचें।",
      validation: { title: "वैलिडेशन एरर", description: "इनपुट गलत है" },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "बिल चुकाने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "अकाउंटेंट या एडमिन भूमिका ज़रूरी है",
      },
      conflict: {
        title: "बिल चुकाया नहीं जा सकता",
        description: "सिर्फ़ मंज़ूर बिल ही चुकाए चिह्नित हो सकते हैं।",
      },
      server: {
        title: "सर्वर एरर",
        description: "पेमेंट दर्ज नहीं हो सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      network: { title: "नेटवर्क एरर", description: "अपना कनेक्शन जाँचें" },
      notFound: {
        title: "बिल नहीं मिला",
        description: "यह बिल मौजूद नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: { title: "बिल चुकाया गया", description: "बिल चुकाया चिह्नित हुआ" },
    response: {
      status: "स्टेटस",
      paidAt: "चुकाने का समय",
    },
    widget: {
      back: "वापस",
      details: "पेमेंट का ब्योरा",
      loadingBill: "बिल लोड हो रहा है…",
      retry: "फिर कोशिश करें",
      submit: "चुकाया चिह्नित करें",
      paymentRecorded: "पेमेंट दर्ज हो गया",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "ड्राफ़्ट",
      RECEIVED: "प्राप्त",
      APPROVED: "मंज़ूर",
      PAID: "चुकाया",
      DISPUTED: "विवादित",
    },
  },
  accountNodeId: {
    label: "बैंक या कैश अकाउंट",
    description: "डिफ़ॉल्ट पेमेंट अकाउंट के लिए खाली छोड़ें।",
  },
  paidAt: {
    label: "पेमेंट की तारीख़",
    description: "पेमेंट किस तारीख़ को हुआ",
    placeholder: "2024-01-31",
  },
};
