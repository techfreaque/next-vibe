import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "मैसेजिंग",
  },
  title: "मैसेंजर अकाउंट",
  titleShort: "अकाउंट",
  description: "सभी चैनलों के सभी मैसेंजर अकाउंट की लिस्ट",

  fields: {
    channel: {
      label: "चैनल",
      description: "चैनल से फ़िल्टर करें",
    },
    provider: {
      label: "प्रोवाइडर",
      description: "प्रोवाइडर से फ़िल्टर करें",
    },
    status: {
      label: "स्टेटस",
      description: "अकाउंट स्टेटस से फ़िल्टर करें",
    },
    search: {
      label: "खोजें",
      description: "नाम या विवरण से खोजें",
      placeholder: "अकाउंट खोजें...",
    },
    page: {
      label: "पेज",
      description: "पेजिनेशन के लिए पेज नंबर",
    },
    limit: {
      label: "सीमा",
      description: "प्रति पेज अकाउंट की संख्या",
    },
    sortBy: {
      label: "इसके हिसाब से क्रम",
      description: "अकाउंट को फ़ील्ड के हिसाब से क्रम में रखें",
    },
    sortOrder: {
      label: "सॉर्ट क्रम",
      description: "क्रम की दिशा (बढ़ता या घटता)",
    },
  },

  response: {
    account: {
      title: "अकाउंट",
      description: "मैसेंजर अकाउंट का ब्योरा",
      id: "ID",
      name: "नाम",
      channel: "चैनल",
      provider: "प्रोवाइडर",
      status: "स्टेटस",
      healthStatus: "हेल्थ",
      priority: "प्राथमिकता",
      messagesSentTotal: "भेजे मैसेज",
      lastUsedAt: "आख़िरी इस्तेमाल",
      createdAt: "बनाया गया",
      isDefault: "डिफ़ॉल्ट",
      smtpFromEmail: "From ईमेल",
      fromId: "From ID",
    },
    pagination: {
      title: "पेजिनेशन",
      description: "पेजिनेशन की जानकारी",
      page: "पेज",
      limit: "प्रति पेज",
      total: "कुल",
      totalPages: "कुल पेज",
    },
  },

  widget: {
    create: "अकाउंट जोड़ें",
    graphs: "ग्राफ़",
    refresh: "रीफ़्रेश करें",
    emptyState: "कोई मैसेंजर अकाउंट कॉन्फ़िगर नहीं",
    searchPlaceholder: "अकाउंट खोजें...",
    deleteConfirm: "ये अकाउंट हटाएँ?",
    deleteConfirmYes: "हटाएँ",
    deleteConfirmNo: "रद्द करें",
  },

  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "फ़िल्टर पैरामीटर गलत हैं",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "एडमिन एक्सेस ज़रूरी है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "एक्सेस नहीं मिला",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "डेटा टकराव हुआ",
    },
    server: {
      title: "सर्वर एरर",
      description: "अकाउंट नहीं मिल सके",
      detail: "अकाउंट लोड नहीं हो सके: {{error}}",
    },
    networkError: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क संचार फ़ेल हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर आया",
    },
  },

  success: {
    title: "अकाउंट मिल गए",
    description: "मैसेंजर अकाउंट सफलतापूर्वक मिल गए",
  },

  enums: {
    channel: {
      email: "ईमेल",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "सभी चैनल",
    },
    provider: {
      smtp: "SMTP",
      resend: "Resend",
      ses: "Amazon SES",
      mailgun: "Mailgun",
      sendgrid: "SendGrid",
      mailjet: "Mailjet",
      postmark: "Postmark",
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Telegram Bot",
    },
    providerFilter: {
      any: "सभी प्रोवाइडर",
    },
    status: {
      active: "एक्टिव",
      inactive: "निष्क्रिय",
      error: "एरर",
      testing: "टेस्टिंग",
    },
    statusFilter: {
      any: "सभी स्टेटस",
    },
    healthStatus: {
      healthy: "स्वस्थ",
      degraded: "कमज़ोर",
      unhealthy: "ख़राब",
      unknown: "अज्ञात",
    },
    healthStatusFilter: {
      any: "सभी",
    },
    sortField: {
      name: "नाम",
      channel: "चैनल",
      provider: "प्रोवाइडर",
      status: "स्टेटस",
      priority: "प्राथमिकता",
      messagesSentTotal: "भेजे मैसेज",
      lastUsedAt: "आख़िरी इस्तेमाल",
      createdAt: "बनाया गया",
    },
    sortOrder: {
      asc: "बढ़ता क्रम",
      desc: "घटता क्रम",
    },
  },
};
