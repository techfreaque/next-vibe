import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "payment",
    bill: "bill",
    ap: "accounts-payable",
  },
  get: {
    title: "सप्लायर बिल",
    titleShort: "सप्लायर बिल",
    description:
      "बिल नंबर, सप्लायर के नाम या बिल ID से अकाउंट्स पेएबल खोजें, और कंपनी या स्टेटस से फ़िल्टर करें।",
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़िल्टर पैरामीटर जाँचें",
      },
      unauthorized: {
        title: "साइन इन नहीं हैं",
        description: "बिल देखने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आप इस कंपनी के मेंबर नहीं हैं",
      },
      conflict: { title: "टकराव", description: "डेटा टकराव" },
      server: { title: "सर्वर एरर", description: "बिल लोड नहीं हो सके" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      network: { title: "नेटवर्क एरर", description: "अपना कनेक्शन जाँचें" },
      notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: { title: "बिल लोड हो गए", description: "सप्लायर बिल मिल गए" },
    response: {
      totalCount: "कुल",
      id: "ID",
      supplierName: "सप्लायर",
      billNumber: "बिल #",
      billDate: "बिल तारीख",
      dueDate: "देय तारीख",
      currency: "करेंसी",
      billTotal: "रकम",
      status: "स्टेटस",
      createdAt: "बनाया गया",
    },
  },
  companyId: {
    label: "कंपनी",
    description: "कंपनी से फ़िल्टर करें",
    placeholder: "कंपनी UUID",
  },
  search: {
    label: "दस्तावेज़ खोजें",
    description:
      "बिल नंबर, सप्लायर के नाम या बिल ID से अकाउंट्स पेएबल खोजें, और कंपनी या स्टेटस से फ़िल्टर करें।",
    placeholder: "बिल नंबर या सप्लायर",
  },
  status: {
    label: "स्टेटस",
    description: "बिल स्टेटस से फ़िल्टर करें",
    placeholder: "कोई भी स्टेटस",
  },
  page: { label: "पेज", description: "पेज नंबर" },
  pageSize: { label: "प्रति पेज", description: "प्रति पेज नतीजे" },
  enums: {
    billStatus: {
      DRAFT: "ड्राफ़्ट",
      RECEIVED: "प्राप्त",
      APPROVED: "मंज़ूर",
      PAID: "चुकाया गया",
      DISPUTED: "विवादित",
    },
  },
  widget: {
    filters: "फ़िल्टर",
    pageCount: "कुल पेज",
    back: "वापस",
    title: "सप्लायर बिल",
    newBill: "बिल दर्ज करें",
    loading: "बिल लोड हो रहे हैं...",
    empty: {
      title: "कोई सप्लायर बिल नहीं",
      hint: "सप्लायर से इनवॉइस मिले तो बिल दर्ज करें।",
      cta: "बिल दर्ज करें",
    },
    company: {
      select: "कंपनी चुनें",
      selected: "कंपनी चुनी गई",
    },
    due: "देय",
    overdue: "बकाया",
    view: "देखें",
  },
};
