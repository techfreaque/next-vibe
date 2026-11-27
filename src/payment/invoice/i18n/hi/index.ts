import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    invoice: "invoice",
    transactions: "transactions",
  },
  defaultItem: "इनवॉइस आइटम",
  success: {
    created: "इनवॉइस सफलतापूर्वक बन गया",
  },
  post: {
    title: "Stripe इनवॉइस बनाएँ",
    titleShort: "Stripe इनवॉइस",
    description: "ग्राहक के लिए Stripe इनवॉइस बनाएँ",
    form: {
      title: "इनवॉइस का ब्योरा",
      description: "राशि, मुद्रा और देय तारीख डालें",
    },
    response: {
      success: "इनवॉइस सफलतापूर्वक बन गया",
      message: "स्टेटस मैसेज",
      invoice: {
        title: "इनवॉइस का ब्योरा",
        description: "बने इनवॉइस की जानकारी",
        id: "इनवॉइस ID",
        userId: "यूज़र ID",
        stripeInvoiceId: "Stripe इनवॉइस ID",
        invoiceNumber: "इनवॉइस नंबर",
        amount: "राशि",
        currency: "मुद्रा",
        status: "स्टेटस",
        invoiceUrl: "इनवॉइस URL",
        invoicePdf: "इनवॉइस PDF",
        dueDate: "देय तारीख",
        paidAt: "भुगतान की तारीख",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      server: {
        detail: "इनवॉइस नहीं बन सका: {{error}}",
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
        noStripeCustomer: "आपके अकाउंट का कोई Stripe कस्टमर रिकॉर्ड नहीं है",
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "काम सफलतापूर्वक पूरा हुआ",
    },
    widget: {
      back: "वापस",
    },
  },
  customerId: {
    label: "ग्राहक",
    description: "वह अकाउंट चुनें जो Stripe कस्टमर से जुड़ा है।",
    placeholder: "ग्राहक खोजें",
  },
  amount: {
    label: "राशि",
    description: "इनवॉइस राशि",
    placeholder: "राशि डालें",
  },
  currency: {
    label: "मुद्रा",
    description: "मुद्रा कोड",
    placeholder: "मुद्रा चुनें",
    usd: "अमेरिकी डॉलर (USD)",
    eur: "यूरो (EUR)",
    pln: "पोलिश ज़्लोटी (PLN)",
  },
  description: {
    label: "विवरण",
    description: "इनवॉइस का विवरण",
    placeholder: "विवरण डालें",
  },
  dueDate: {
    label: "देय तारीख",
    description: "भुगतान की देय तारीख",
    placeholder: "देय तारीख चुनें",
  },
  metadata: {
    label: "मेटाडेटा",
    description: "अतिरिक्त मेटाडेटा",
    placeholder: "मेटाडेटा JSON में डालें",
  },
};
