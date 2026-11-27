import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "लीड प्रबंधन",
  tags: {
    leads: "लीड",
    search: "सर्च",
  },
  get: {
    title: "लीड सर्च करें",
    titleShort: "ईमेल या नाम से खोजें",
    description: "फ़िल्टर और पेजिनेशन के साथ लीड सर्च करें",
    form: {
      title: "लीड सर्च फ़ॉर्म",
      description: "लीड खोजने के लिए सर्च मापदंड डालें",
    },
    search: {
      label: "सर्च क्वेरी",
      description: "ईमेल, बिज़नेस नाम या नोट्स से लीड छाँटने का शब्द",
      placeholder: "सर्च शब्द डालें...",
    },
    status: {
      label: "स्टेटस फ़िल्टर",
      description: "स्टेटस से लीड छाँटें",
    },
    limit: {
      label: "नतीजों की सीमा",
      description: "लौटाए जाने वाले नतीजों की अधिकतम संख्या (1-100)",
    },
    offset: {
      label: "नतीजों का ऑफ़सेट",
      description: "पेजिनेशन के लिए छोड़े जाने वाले नतीजों की संख्या",
    },
    response: {
      title: "सर्च नतीजे",
      description: "लीड डेटा के साथ पेजों में बँटे सर्च नतीजे",
      leads: {
        title: "लीड",
        item: "लीड",
      },
      total: "कुल नतीजे",
      hasMore: "और नतीजे हैं",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लीड सर्च करने के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "सर्च पैरामीटर गलत दिए गए",
      },
      server: {
        title: "सर्वर एरर",
        description: "लीड सर्च करते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "लीड सर्च करते समय अज्ञात एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "लीड सर्च करते समय नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "लीड सर्च का एक्सेस प्रतिबंधित है",
      },
      notFound: {
        title: "कोई नतीजा नहीं",
        description: "सर्च मापदंड से कोई लीड नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "सर्च फ़ॉर्म में कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "लीड सर्च करते समय डेटा में टकराव हुआ",
      },
    },
    success: {
      title: "सर्च पूरा",
      description: "लीड सर्च सफलतापूर्वक पूरा हुआ",
    },
  },
  widget: {
    unnamedLead: "बिना नाम का लीड",
    previous: "पिछला",
    next: "अगला",
    page: "पेज {{page}} / {{pages}}",
    title: "लीड सर्च करें",
    filterLabel: "फ़िल्टर:",
    clearFilter: "साफ़ करें",
    noResultsTitle: "कोई नतीजा नहीं मिला",
    noResultsSubtitle: "ईमेल, बिज़नेस नाम या फ़ोन से सर्च करें",
    createLead: "लीड बनाएँ",
    noLeadsMatchFilter: "चुने फ़िल्टर से कोई लीड नहीं मिला।",
    clearFilters: "फ़िल्टर साफ़ करें",
    loadMore: "और लोड करें",
    openRateSuffix: "% ओपन",
    noEmails: "कोई ईमेल नहीं",
    converted: "कन्वर्ट हुए",
    emailsSentSuffix: "भेजे",
    copyEmailTitle: "ईमेल कॉपी करें",
    editLeadTitle: "लीड एडिट करें",
    deleteLeadTitle: "लीड हटाएँ",
    statusNew: "नया",
    statusPending: "लंबित",
    statusCampaign: "कैंपेन",
    statusWebUser: "वेब यूज़र",
    statusNewsletter: "न्यूज़लेटर",
    statusInContact: "संपर्क में",
    statusSignedUp: "साइन अप किया",
    statusSubscribed: "सब्सक्राइब किया",
    statusUnsub: "अनसब",
    statusBounced: "बाउंस",
    statusInvalid: "अमान्य",
  },
  enums: {
    leadStatus: {
      new: "नया",
      pending: "लंबित",
      campaignRunning: "कैंपेन चल रहा",
      websiteUser: "वेबसाइट यूज़र",
      newsletterSubscriber: "न्यूज़लेटर सब्सक्राइबर",
      inContact: "संपर्क में",
      signedUp: "साइन अप किया",
      subscriptionConfirmed: "सब्सक्रिप्शन कन्फ़र्म",
      unsubscribed: "अनसब्सक्राइब",
      bounced: "बाउंस",
      invalid: "अमान्य",
    },
  },
};
