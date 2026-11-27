import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एस्टिमेट",
  tags: {
    payment: "payment",
    estimate: "estimate",
    list: "list",
  },
  get: {
    title: "सेल्स एस्टिमेट",
    titleShort: "सेल्स एस्टिमेट",
    description:
      "रेफ़रेंस, ग्राहक, ईमेल, शीर्षक या एस्टिमेट ID से एस्टिमेट खोजें, और कंपनी या स्थिति से फ़िल्टर करें।",
    form: {
      title: "एस्टिमेट फ़िल्टर",
      description: "एस्टिमेट फ़िल्टर और पेज करें",
    },
    response: {
      totalCount: "कुल गिनती",
      id: "एस्टिमेट ID",
      estimateNumber: "एस्टिमेट नंबर",
      status: "स्थिति",
      customerId: "ग्राहक ID",
      customerName: "ग्राहक का नाम",
      currency: "करेंसी",
      total: "कुल",
      validUntil: "मान्य तारीख़",
      lineCount: "लाइनों की संख्या",
      createdAt: "बनाया गया",
      updatedAt: "अपडेट किया गया",
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
      server: { title: "सर्वर एरर", description: "आंतरिक सर्वर एरर" },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: { title: "मना है", description: "एक्सेस नहीं मिला" },
      notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
      conflict: { title: "टकराव", description: "टकराव हो गया" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      title: "सफल",
      description: "एस्टिमेट मिल गए",
    },
  },
  enums: {
    estimateStatus: {
      DRAFT: "ड्राफ़्ट",
      SENT: "भेजा गया",
      ACCEPTED: "स्वीकृत",
      DECLINED: "अस्वीकृत",
      EXPIRED: "समाप्त",
      CONVERTED: "बदला गया",
    },
  },
  companyId: {
    label: "कंपनी ID",
    description: "कंपनी से फ़िल्टर करें",
    placeholder: "कंपनी ID दर्ज करें",
  },
  search: {
    label: "दस्तावेज़ खोजें",
    description:
      "रेफ़रेंस, ग्राहक, ईमेल, शीर्षक या एस्टिमेट ID से एस्टिमेट खोजें, और कंपनी या स्थिति से फ़िल्टर करें।",
    placeholder: "एस्टिमेट नंबर, ग्राहक या शीर्षक",
  },
  status: {
    label: "स्थिति",
    description: "स्थिति से फ़िल्टर करें",
    placeholder: "सभी स्थितियाँ",
  },
  customerId: {
    label: "ग्राहक ID",
    description: "ग्राहक से फ़िल्टर करें",
    placeholder: "ग्राहक ID दर्ज करें",
  },
  page: {
    label: "पेज",
    description: "पेज नंबर",
  },
  pageSize: {
    label: "पेज का आकार",
    description: "प्रति पेज आइटम",
  },
  widget: {
    filters: "फ़िल्टर",
    pageCount: "कुल पेज",
    back: "वापस",
    title: "सेल्स एस्टिमेट",
    newEstimate: "नया एस्टिमेट",
    loading: "एस्टिमेट लोड हो रहे हैं...",
    noEstimates: "अभी कोई एस्टिमेट नहीं।",
    noEstimatesHint: "शुरू करने के लिए अपना पहला एस्टिमेट बनाएँ।",
    empty: {
      title: "अभी कोई एस्टिमेट नहीं।",
      hint: "शुरू करने के लिए अपना पहला एस्टिमेट बनाएँ।",
      cta: "नया एस्टिमेट",
    },
    valid: "मान्य",
    lines: "lines",
    line: "line",
    view: "देखें",
    status: {
      draft: "ड्राफ़्ट",
      sent: "भेजा गया",
      accepted: "स्वीकृत",
      declined: "अस्वीकृत",
      expired: "समाप्त",
      converted: "बदला गया",
    },
  },
};
