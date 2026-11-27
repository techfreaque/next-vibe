import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "मैसेंजर अकाउंट",
  tag: "messenger-accounts",
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
      active: "सक्रिय",
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
      unhealthy: "अस्वस्थ",
      unknown: "अज्ञात",
    },
    healthStatusFilter: {
      any: "सभी हेल्थ स्टेटस",
    },
    securityType: {
      none: "कोई नहीं",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: {
      plain: "सादा",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
    },
    sortField: {
      name: "नाम",
      channel: "चैनल",
      provider: "प्रोवाइडर",
      status: "स्टेटस",
      priority: "प्राथमिकता",
      messagesSentTotal: "भेजे गए मैसेज",
      lastUsedAt: "आख़िरी इस्तेमाल",
      createdAt: "बनाया गया",
    },
    sortOrder: {
      asc: "बढ़ते क्रम में",
      desc: "घटते क्रम में",
    },
    campaignType: {
      leadCampaign: "लीड कैंपेन",
      newsletter: "न्यूज़लेटर",
      signupNurture: "साइन-अप नर्चर",
      retention: "रिटेंशन",
      winback: "विनबैक",
      transactional: "ट्रांज़ैक्शनल",
      notification: "नोटिफ़िकेशन",
      system: "सिस्टम",
    },
    campaignTypeFilter: {
      all: "सभी कैंपेन",
    },
    loadBalancingStrategy: {
      roundRobin: "राउंड रॉबिन",
      weighted: "भारित",
      priority: "प्राथमिकता",
      leastUsed: "सबसे कम इस्तेमाल",
    },
  },
};
