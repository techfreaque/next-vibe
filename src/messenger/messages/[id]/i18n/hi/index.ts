import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "ईमेल",
  tags: {
    emails: "ईमेल",
  },
  title: "ईमेल ब्योरा",
  titleShort: "ईमेल ब्योरा",
  description: "यूनिक पहचान से एक ईमेल लाएँ",
  container: {
    title: "ईमेल का ब्योरा",
    description: "किसी ख़ास ईमेल की विस्तृत जानकारी देखें",
  },
  fields: {
    id: {
      label: "ईमेल ID",
      description: "लाए जाने वाले ईमेल की यूनिक पहचान",
    },
  },
  response: {
    email: {
      title: "ईमेल का ब्योरा",
      description: "माँगे गए ईमेल की पूरी जानकारी",
      id: "ईमेल ID",
      subject: "विषय",
      recipientEmail: "प्राप्तकर्ता का ईमेल",
      recipientName: "पाने वाले का नाम",
      senderEmail: "भेजने वाले का ईमेल",
      senderName: "भेजने वाले का नाम",
      type: "ईमेल प्रकार",
      status: "स्टेटस",
      templateName: "टेंप्लेट का नाम",
      emailProvider: "ईमेल प्रोवाइडर",
      externalId: "बाहरी ID",
      sentAt: "भेजने का समय",
      deliveredAt: "डिलीवर होने का समय",
      openedAt: "खोले जाने का समय",
      clickedAt: "क्लिक का समय",
      retryCount: "रीट्राई की गिनती",
      error: "एरर मैसेज",
      userId: "यूज़र ID",
      leadId: "लीड ID",
      createdAt: "बनाने का समय",
      updatedAt: "अपडेट का समय",
    },
  },
  get: {
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दी गई ईमेल ID गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ईमेल का ब्योरा देखने के लिए आपका ऑथेंटिकेटेड होना ज़रूरी है",
      },
      not_found: {
        title: "ईमेल नहीं मिला",
        description: "बताई गई ID का कोई ईमेल नहीं मिला",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपको यह ईमेल देखने की अनुमति नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "ईमेल लाते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
    },
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "दी गई ईमेल ID गलत है",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "ईमेल का ब्योरा देखने के लिए आपका ऑथेंटिकेटेड होना ज़रूरी है",
    },
    notFound: {
      title: "ईमेल नहीं मिला",
      description: "बताई गई ID का कोई ईमेल नहीं मिला",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "आपको यह ईमेल देखने की अनुमति नहीं है",
    },
    server: {
      title: "सर्वर एरर",
      description: "ईमेल लाते समय आंतरिक सर्वर एरर हुई",
    },
    conflict: {
      title: "टकराव एरर",
      description: "ईमेल रिक्वेस्ट प्रोसेस करते समय टकराव हुआ",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "ईमेल लाते समय नेटवर्क एरर हुई",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "कुछ बदलाव सेव नहीं हुए हैं",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर आया",
    },
  },
  success: {
    title: "ईमेल मिल गया",
    description: "ईमेल का ब्योरा सफलतापूर्वक मिल गया",
  },
  widget: {
    parties: "पक्ष",
    to: "तक",
    from: "से",
    timestamps: "टाइमस्टैंप",
    sentAt: "भेजने का समय",
    deliveredAt: "डिलीवर होने का समय",
    openedAt: "खोले जाने का समय",
    clickedAt: "क्लिक का समय",
    technical: "तकनीकी ब्योरा",
    template: "टेंप्लेट",
    provider: "प्रोवाइडर",
    externalId: "बाहरी ID",
    retryCount: "रीट्राई की गिनती",
    error: "एरर",
    associations: "संबंध",
    lead: "लीड",
    user: "यूज़र",
    notFound: "ईमेल नहीं मिला",
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
    type: {
      transactional: "ट्रांज़ैक्शनल",
      marketing: "मार्केटिंग",
      notification: "नोटिफ़िकेशन",
      system: "सिस्टम",
      leadCampaign: "लीड कैंपेन",
      userCommunication: "यूज़र संवाद",
    },
    provider: {
      resend: "दोबारा भेजें",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "अन्य",
    },
  },
};
