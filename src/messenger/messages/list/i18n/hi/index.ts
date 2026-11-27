import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "ईमेल",
  tags: {
    emails: "ईमेल",
  },
  title: "ईमेल सूची",
  titleShort: "ईमेल लॉग",
  description: "फ़िल्टर और पेजिनेशन के साथ ईमेल की पेज वाली सूची लाएँ",
  container: {
    title: "ईमेल सूची",
    description: "ईमेल सूची के पैरामीटर सेट करें और नतीजे देखें",
  },
  filters: {
    title: "फ़िल्टर",
    description: "ईमेल खोजें और फ़िल्टर करें",
  },
  displayOptions: {
    title: "डिस्प्ले विकल्प",
  },
  fields: {
    dateRange: {
      title: "तारीख़ रेंज",
    },
    page: {
      label: "पेज",
      description: "पेजिनेशन के लिए पेज नंबर",
      placeholder: "पेज नंबर दर्ज करें",
    },
    limit: {
      label: "सीमा",
      description: "प्रति पेज आइटम की संख्या",
      placeholder: "सीमा दर्ज करें",
    },
    search: {
      label: "खोजें",
      description: "विषय, प्राप्तकर्ता या भेजने वाले से ईमेल खोजें",
      placeholder: "ईमेल खोजें...",
    },
    status: {
      label: "स्टेटस",
      description: "ईमेल स्थिति से फ़िल्टर करें",
      placeholder: "स्टेटस चुनें",
    },
    channel: {
      label: "चैनल",
      description: "मैसेज चैनल से फ़िल्टर करें",
    },
    type: {
      label: "टाइप",
      description: "ईमेल प्रकार से फ़िल्टर करें",
      placeholder: "टाइप चुनें",
    },
    sortBy: {
      label: "इसके हिसाब से क्रम",
      description: "जिस फ़ील्ड से सॉर्ट करना है",
      placeholder: "सॉर्ट फ़ील्ड चुनें",
    },
    sortOrder: {
      label: "सॉर्ट क्रम",
      description: "सॉर्ट क्रम की दिशा",
      placeholder: "सॉर्ट क्रम चुनें",
    },
    dateFrom: {
      label: "तारीख़ से",
      description: "इस तारीख़ से ईमेल फ़िल्टर करें",
      placeholder: "शुरुआती तारीख़ चुनें",
    },
    dateTo: {
      label: "तारीख़ तक",
      description: "इस तारीख़ तक के ईमेल फ़िल्टर करें",
      placeholder: "अंतिम तारीख़ चुनें",
    },
  },
  response: {
    emails: {
      title: "ईमेल",
      emptyState: {
        title: "कोई ईमेल नहीं मिला",
        description: "आपके मौजूदा फ़िल्टर से कोई ईमेल मेल नहीं खाता",
      },
      item: {
        title: "ईमेल",
        description: "ईमेल का ब्योरा",
        id: "ID",
        subject: "विषय",
        recipientEmail: "पाने वाले का ईमेल",
        recipientName: "पाने वाले का नाम",
        senderEmail: "भेजने वाले का ईमेल",
        senderName: "भेजने वाले का नाम",
        type: "टाइप",
        status: "स्टेटस",
        channel: "चैनल",
        templateName: "टेंप्लेट का नाम",
        emailProvider: "ईमेल प्रोवाइडर",
        externalId: "बाहरी ID",
        sentAt: "भेजने का समय",
        deliveredAt: "डिलीवर होने का समय",
        openedAt: "खोले जाने का समय",
        clickedAt: "क्लिक का समय",
        retryCount: "रीट्राई की गिनती",
        error: "एरर",
        userId: "यूज़र ID",
        leadId: "लीड ID",
        createdAt: "बनाने का समय",
        updatedAt: "अपडेट का समय",
        emailCore: {
          title: "मुख्य जानकारी",
        },
        emailParties: {
          title: "भेजने वाला और प्राप्तकर्ता",
        },
        emailMetadata: {
          title: "मेटाडेटा",
        },
        emailEngagement: {
          title: "एंगेजमेंट ट्रैकिंग",
        },
        technicalDetails: {
          title: "तकनीकी ब्योरा",
        },
        associatedIds: {
          title: "जुड़ी ID",
        },
        timestamps: {
          title: "टाइमस्टैम्प",
        },
      },
    },
    pagination: {
      title: "पेजिनेशन",
      description: "पेजिनेशन की जानकारी",
      page: "मौजूदा पेज",
      limit: "प्रति पेज आइटम",
      total: "कुल आइटम",
      totalPages: "कुल पेज",
    },
    filters: {
      title: "लागू फ़िल्टर",
      description: "अभी लागू फ़िल्टर",
      status: "स्थिति फ़िल्टर",
      type: "टाइप फ़िल्टर",
      search: "खोज क्वेरी",
      dateFrom: "शुरू की तारीख",
      dateTo: "अंत की तारीख",
    },
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "दिए गए पैरामीटर गलत हैं",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "इस रिसोर्स तक पहुँचने के लिए आपका ऑथेंटिकेटेड होना ज़रूरी है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "आपको इस रिसोर्स तक पहुँचने की अनुमति नहीं है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "माँगा गया रिसोर्स नहीं मिला",
    },
    server: {
      title: "सर्वर एरर",
      description: "इंटरनल सर्वर एरर आया",
      detail_list: "मैसेज लोड नहीं हो पाए: {{error}}",
      detail_get: "मैसेज लोड नहीं हो पाया: {{error}}",
      detail_create: "मैसेज सेव नहीं हो पाया: {{error}}",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर आया",
    },
    unsaved: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "रिक्वेस्ट मौजूदा स्थिति से टकराती है",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर आया",
    },
  },
  success: {
    title: "सफल",
    description: "ईमेल सफलतापूर्वक मिल गए",
  },
  widget: {
    to: "तक",
    retries: "रीट्राई",
    opened: "खोले गए",
    clicked: "क्लिक किए गए",
    stats: "स्टैट्स",
    graphs: "ग्राफ़",
    refresh: "रीफ़्रेश करें",
    searchPlaceholder: "ईमेल खोजें...",
    clearSearch: "क्लियर",
    emptyState: "कोई ईमेल नहीं मिला",
    emptyFiltered: "कोई ईमेल आपके फ़िल्टर से मेल नहीं खाता",
    page: "पेज",
    tabs: {
      all: "सभी",
      sent: "भेजे गए",
      delivered: "पहुँच गया",
      opened: "खोले गए",
      failed: "फ़ेल",
      bounced: "बाउंस हुए",
    },
  },
  enums: {
    status: {
      pending: "पेंडिंग",
      sent: "भेजे गए",
      delivered: "पहुँच गया",
      opened: "खोले गए",
      clicked: "क्लिक किए गए",
      bounced: "बाउंस हुए",
      failed: "फ़ेल",
      unsubscribed: "अनसब्सक्राइब हुए",
    },
    statusFilter: {
      any: "सभी स्टेटस",
    },
    type: {
      transactional: "ट्रांज़ैक्शनल",
      marketing: "मार्केटिंग",
      notification: "नोटिफ़िकेशन",
      system: "सिस्टम",
      leadCampaign: "लीड कैंपेन",
      userCommunication: "यूज़र संवाद",
    },
    typeFilter: {
      any: "सभी प्रकार",
    },
    channel: {
      email: "ईमेल",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "सभी चैनल",
    },
    sortField: {
      subject: "विषय",
      recipientEmail: "पाने वाले का ईमेल",
      recipientName: "पाने वाले का नाम",
      type: "टाइप",
      status: "स्टेटस",
      sentAt: "भेजने का समय",
      createdAt: "बनाने का समय",
    },
    sortOrder: {
      asc: "बढ़ता क्रम",
      desc: "घटता क्रम",
    },
  },
};
