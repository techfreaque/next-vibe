import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "पेमेंट",
    invoice: "इनवॉइस",
  },
  post: {
    title: "पेमेंट दर्ज करें",
    titleShort: "पेमेंट दर्ज करें",
    description:
      "इनवॉइस के विरुद्ध मैन्युअल पेमेंट दर्ज करें। पूरा चुक जाए तो उसे चुकाया चिह्नित कर देता है।",
    form: {
      title: "पेमेंट दर्ज करें",
      description: "इस इनवॉइस के विरुद्ध दर्ज करने के लिए पेमेंट का ब्योरा भरें",
    },
    response: {
      success: "पेमेंट दर्ज हो गया",
      message: "स्टेटस संदेश",
    },
    errors: {
      receiptKeyConflict: "यह रसीद key पहले से किसी दूसरे पेमेंट की है।",
      paymentPrecision: "दशमलव के अधिकतम दो अंकों वाली धनात्मक राशि डालें।",
      paymentStatus: "पेमेंट सिर्फ़ धनात्मक राशि के साथ खुले इनवॉइस के विरुद्ध दर्ज करें।",
      overpayment: "पेमेंट इनवॉइस के बकाये से ज़्यादा है।",
      fullPayment: "कंपनी के बिना इनवॉइस के लिए पूरी बची राशि डालें।",
      issuancePosting:
        "पेमेंट से पहले इनवॉइस का कुल से मेल खाता पोस्ट किया प्राप्य चाहिए।",
      paymentAccount: "इस कंपनी का सक्रिय बैंक या कैश अकाउंट चुनें।",
      paymentPosting: "पेमेंट की तारीख़, कंपनी की करेंसी और पोस्टिंग अकाउंट जाँचें।",
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
        title: "पेमेंट एक्सेस ज़रूरी",
        description: "पेमेंट दर्ज करने से पहले इस इनवॉइस को मैनेज करने की अनुमति चाहिए।",
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
    success: {
      title: "सफल",
      description: "मैन्युअल पेमेंट दर्ज हो गया",
    },
  },
  enums: {
    manualPaymentMethod: {
      cash: "कैश",
      bankTransfer: "बैंक ट्रांसफ़र",
      other: "अन्य",
    },
  },
  invoiceId: {
    label: "इनवॉइस ID",
    description: "जिस इनवॉइस के विरुद्ध पेमेंट दर्ज करना है उसकी ID",
    placeholder: "इनवॉइस ID डालें",
  },
  amount: {
    label: "चुकाई गई राशि",
    description: "मिली हुई राशि",
    placeholder: "0.00",
  },
  method: {
    label: "पेमेंट का तरीका",
    description: "पेमेंट कैसे मिला",
    placeholder: "तरीका चुनें",
  },
  paidAt: {
    label: "पेमेंट की तारीख़",
    description: "पेमेंट कब मिला",
    placeholder: "तारीख़ चुनें",
  },
  receiptKey: {
    label: "रसीद key",
    description:
      "इसी पेमेंट को दोबारा कोशिश करने के लिए वही key इस्तेमाल करें। दूसरी रसीद के लिए नई key।",
  },
  accountNodeId: {
    label: "पेमेंट अकाउंट",
    description: "वह बैंक या कैश अकाउंट चुनें जिसमें पेमेंट आया।",
    placeholder: "अकाउंट चुनें",
    automatic: "डिफ़ॉल्ट अकाउंट इस्तेमाल करें",
  },
  widget: {
    backToInvoices: "इनवॉइस पर वापस",
    retryInvoice: "फिर कोशिश करें",
    loadingInvoice: "इनवॉइस एक्सेस जाँचा जा रहा है…",
    details: "पेमेंट का ब्योरा",
    back: "वापस",
    submit: "पेमेंट दर्ज करें",
    paymentRecorded: "पेमेंट सफलतापूर्वक दर्ज हुआ।",
    viewInvoice: "इनवॉइस देखें",
    amountDue: "{{amount}} बाकी",
    notOpenTitle: "यह इनवॉइस खुला नहीं है",
    notOpenMessage:
      "पेमेंट सिर्फ़ जारी, बिना चुकाए इनवॉइस पर लिए जाते हैं। पहले इनवॉइस जारी करें, या सही वाला खोलें।",
  },
};
