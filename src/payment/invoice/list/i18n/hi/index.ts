import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    invoice: "invoice",
  },
  get: {
    title: "कस्टमर इनवॉइस",
    titleShort: "कस्टमर इनवॉइस",
    description:
      "दस्तावेज़ नंबर, इनवॉइस ID या कस्टमर ID से इनवॉइस खोजें, और कंपनी या स्टेटस से फ़िल्टर करें।",
    form: {
      title: "इनवॉइस फ़िल्टर",
      description: "इनवॉइस लिस्ट फ़िल्टर करें",
    },
    response: {
      customerName: "कस्टमर",
      total: "कुल",
      invoices: "इनवॉइस",
      id: "इनवॉइस ID",
      invoiceSequenceNumber: "इनवॉइस नंबर",
      customerId: "कस्टमर ID",
      currency: "करेंसी",
      status: "स्टेटस",
      amount: "रकम",
      dueDate: "देय तारीख",
      notes: "नोट्स",
      lineCount: "लाइन की गिनती",
      amountPaid: "चुकाई गई रकम",
      amountDue: "देय रकम",
      isOverdue: "बकाया",
      createdAt: "बनाने का समय",
      updatedAt: "अपडेट का समय",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़िल्टर पैरामीटर गलत हैं",
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
        description: "इस कंपनी के मेंबर होना ज़रूरी है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कंपनी नहीं मिली",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "इनवॉइस लिस्ट मिल गई",
    },
  },
  enums: {
    invoiceStatus: {
      draft: "ड्राफ़्ट",
      open: "खुला",
      paid: "चुकाया गया",
      void: "वॉइड",
      uncollectible: "वसूली नामुमकिन",
    },
  },
  companyId: {
    label: "कंपनी ID",
    description: "इस कंपनी के इनवॉइस फ़िल्टर करें",
    placeholder: "कंपनी ID डालें",
  },
  search: {
    label: "दस्तावेज़ खोजें",
    description: "इनवॉइस नंबर, कस्टमर के नाम या ID से खोजें।",
    placeholder: "इनवॉइस नंबर या कस्टमर",
  },
  status: {
    label: "स्टेटस",
    description: "इनवॉइस स्टेटस से फ़िल्टर करें, या बकाया बैलेंस वाले ओवरड्यू इनवॉइस दिखाएँ।",
    placeholder: "सभी स्टेटस",
  },
  customerId: {
    label: "कस्टमर ID",
    description: "कस्टमर से फ़िल्टर करें",
    placeholder: "कस्टमर ID डालें",
  },
  page: {
    label: "पेज",
    description: "पेज नंबर",
  },
  pageSize: {
    label: "पेज साइज़",
    description: "प्रति पेज नतीजे",
  },
  widget: {
    creditNote: "क्रेडिट नोट",
    creditable: "क्रेडिट करने के लिए इनवॉइस चुनें",
    noCreditable: "किसी इनवॉइस पर क्रेडिट उपलब्ध नहीं है।",
    filters: "फ़िल्टर",
    partlyPaid: "आंशिक रूप से चुकाया",
    pageCount: "कुल पेज",
    title: "कस्टमर इनवॉइस",
    newInvoice: "नया इनवॉइस",
    loading: "इनवॉइस लोड हो रहे हैं...",
    noInvoices: "अभी कोई इनवॉइस नहीं।",
    noInvoicesHint: "शुरू करने के लिए अपना पहला इनवॉइस बनाइए।",
    overdue: "बकाया",
    due: "देय",
    lines: "lines",
    line: "line",
    view: "देखें",
    back: "वापस",
    empty: {
      title: "अभी कोई इनवॉइस नहीं।",
      hint: "शुरू करने के लिए अपना पहला इनवॉइस बनाइए।",
      cta: "नया इनवॉइस",
    },
    status: {
      draft: "ड्राफ़्ट",
      open: "खुला",
      paid: "चुकाया गया",
      void: "वॉइड",
      uncollectible: "वसूली नामुमकिन",
    },
  },
};
