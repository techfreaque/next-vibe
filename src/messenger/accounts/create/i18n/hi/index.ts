import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "मैसेजिंग",
  },
  countries: {
    ...regionalCountryNames("hi"),
    global: "ग्लोबल",
    de: "जर्मनी",
    pl: "पोलैंड",
    fr: "फ़्रांस",
    us: "संयुक्त राज्य अमेरिका",
  },
  languages: {
    it: "इतालवी",
    es: "स्पेनिश",
    sk: "स्लोवाक",
    hi: "हिंदी",
    en: "अंग्रेज़ी",
    de: "जर्मन",
    pl: "पोलिश",
    fr: "फ़्रेंच",
  },
  title: "मैसेंजर अकाउंट बनाएँ",
  titleShort: "नया अकाउंट",
  description: "नया मैसेंजर अकाउंट बनाएँ",

  enums: {
    campaignType: {
      leadCampaign: "लीड कैंपेन",
      newsletter: "न्यूज़लेटर",
      signupNurture: "साइनअप नर्चर",
      retention: "रिटेंशन",
      winback: "विनबैक",
      transactional: "ट्रांज़ैक्शनल",
      notification: "नोटिफ़िकेशन",
      system: "सिस्टम",
    },
    emailJourneyVariant: {
      uncensoredConvert: "अनसेंसर्ड कन्वर्ट",
      sideHustle: "साइड हसल",
      quietRecommendation: "क्वाइट रेकमेंडेशन",
      signupNurture: "साइनअप नर्चर",
      retention: "रिटेंशन",
      winback: "विनबैक",
      newsletterMay2026: "न्यूज़लेटर मई 2026",
      newsletterNov2026: "न्यूज़लेटर नवंबर 2026",
    },
    emailCampaignStage: {
      notStarted: "शुरू नहीं हुआ",
      initial: "शुरुआती",
      followup1: "फ़ॉलो-अप 1",
      followup2: "फ़ॉलो-अप 2",
      followup3: "फ़ॉलो-अप 3",
      nurture: "नर्चर",
      reactivation: "रीएक्टिवेशन",
    },
    channel: {
      email: "ईमेल",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
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
    status: {
      active: "एक्टिव",
      inactive: "निष्क्रिय",
      error: "एरर",
      testing: "टेस्टिंग",
    },
    securityType: {
      none: "कोई नहीं",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
    },
  },

  sections: {
    identity: "अकाउंट पहचान",
    identitySubtitle: "इस अकाउंट का नाम और बुनियादी सेटिंग्स",
    smtp: "SMTP आउटबाउंड",
    smtpSubtitle: "ईमेल भेजने के सर्वर की सेटिंग्स",
    api: "API क्रेडेंशियल",
    apiSubtitle: "प्रोवाइडर API key और एक्सेस टोकन",
    apiSubtitleSms: "प्रोवाइडर API key और सेंडर ID",
    apiSubtitleWhatsapp: "WhatsApp Business API टोकन और फ़ोन नंबर ID",
    apiSubtitleTelegram: "@BotFather से मिला अपना Telegram बॉट टोकन दर्ज करें",
    apiTitleSms: "SMS प्रोवाइडर क्रेडेंशियल",
    apiTitleWhatsapp: "WhatsApp Business क्रेडेंशियल",
    apiTitleTelegram: "बॉट टोकन",
    imap: "IMAP इनबाउंड",
    imapSubtitle: "आने वाले ईमेल पाने और सिंक करने के लिए कॉन्फ़िगर करें (वैकल्पिक)",
    routing: "ईमेल रूटिंग",
    routingSubtitle: "तय करें कि कौन से कैंपेन और जर्नी इस अकाउंट का इस्तेमाल करें",
    toggleHide: "छिपाएँ",
    toggleShow: "दिखाएँ",
  },

  fields: {
    name: {
      label: "अकाउंट का नाम",
      description: "इस अकाउंट का यूनिक नाम",
      placeholder: "जैसे प्राइमरी SMTP, Twilio SMS",
    },
    description: {
      label: "विवरण",
      description: "वैकल्पिक विवरण",
      placeholder: "इस अकाउंट का मक़सद बताएँ",
    },
    channel: {
      label: "चैनल",
      description: "संवाद चैनल",
    },
    provider: {
      label: "प्रोवाइडर",
      description: "इस चैनल का सर्विस प्रोवाइडर",
    },
    status: {
      label: "स्टेटस",
      description: "अकाउंट स्टेटस",
    },
    priority: {
      label: "प्राथमिकता",
      description: "ज़्यादा संख्या = ऊँची प्राथमिकता",
    },
    isDefault: {
      label: "डिफ़ॉल्ट अकाउंट",
      description: "इस चैनल के लिए डिफ़ॉल्ट की तरह इस्तेमाल करें",
    },
    // SMTP outbound
    smtpHost: {
      label: "SMTP होस्ट",
      description: "SMTP सर्वर का होस्टनेम",
      placeholder: "smtp.example.com",
    },
    smtpPort: {
      label: "SMTP पोर्ट",
      description: "SMTP सर्वर का पोर्ट",
      placeholder: "587",
    },
    smtpSecurityType: {
      label: "सिक्योरिटी",
      description: "कनेक्शन सिक्योरिटी का प्रकार",
    },
    smtpUsername: {
      label: "SMTP यूज़रनेम",
      description: "SMTP ऑथेंटिकेशन यूज़रनेम",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "SMTP पासवर्ड",
      description: "SMTP ऑथेंटिकेशन पासवर्ड",
      placeholder: "••••••••",
    },
    smtpFromEmail: {
      label: "From ईमेल",
      description: "भेजने वाले का ईमेल पता",
      placeholder: "noreply@example.com",
    },
    smtpFromName: {
      label: "भेजने वाले का नाम",
      description: "ईमेल क्लाइंट में दिखने वाला भेजने वाले का नाम",
      placeholder: "Unbottled",
    },
    smtpConnectionTimeout: {
      label: "कनेक्शन टाइमआउट",
      description: "कनेक्शन टाइमआउट (मिलीसेकंड में)",
    },
    smtpMaxConnections: {
      label: "अधिकतम कनेक्शन",
      description: "एक साथ अधिकतम कनेक्शन",
    },
    smtpRateLimitPerHour: {
      label: "रेट लिमिट",
      description: "प्रति घंटा अधिकतम ईमेल",
    },
    // API credentials
    apiKey: {
      label: "API Key",
      description: "इस प्रोवाइडर की API key",
      placeholder: "re_xxxxxxxxxxxx",
    },
    apiToken: {
      label: "API टोकन",
      description: "प्राइमरी API टोकन / अकाउंट SID",
      placeholder: "ACxxxxxxxxxxxx",
    },
    apiSecret: {
      label: "API सीक्रेट",
      description: "सेकेंडरी क्रेडेंशियल / ऑथ टोकन",
      placeholder: "••••••••",
    },
    fromId: {
      label: "From ID",
      description: "फ़ोन नंबर, सेंडर ID या बॉट टोकन",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "वेबहुक URL",
      description: "इनबाउंड मैसेज का वेबहुक URL",
      placeholder: "https://example.com/webhook",
    },
    // IMAP inbound
    imapHost: {
      label: "IMAP होस्ट",
      description: "IMAP सर्वर का होस्टनेम",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "IMAP पोर्ट",
      description: "IMAP सर्वर का पोर्ट",
      placeholder: "993",
    },
    imapSecure: {
      label: "IMAP TLS",
      description: "IMAP के लिए TLS/SSL इस्तेमाल करें",
    },
    imapUsername: {
      label: "IMAP यूज़रनेम",
      description: "IMAP ऑथेंटिकेशन यूज़रनेम",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "IMAP पासवर्ड",
      description: "IMAP ऑथेंटिकेशन पासवर्ड",
      placeholder: "••••••••",
    },
    imapAuthMethod: {
      label: "IMAP ऑथ तरीक़ा",
      description: "IMAP ऑथेंटिकेशन का तरीक़ा",
    },
    imapSyncEnabled: {
      label: "सिंक चालू करें",
      description: "ऑटोमैटिक IMAP सिंक चालू करें",
    },
    imapSyncInterval: {
      label: "सिंक अंतराल",
      description: "सेकंड में सिंक अंतराल",
    },
    imapMaxMessages: {
      label: "ज़्यादा से ज़्यादा मैसेज",
      description: "हर फ़ोल्डर में सिंक होने वाले अधिकतम मैसेज",
    },
    // Email routing
    campaignTypes: {
      label: "कैंपेन के प्रकार",
      description: "जिन कैंपेन प्रकारों को यह अकाउंट संभालता है",
      placeholder: "कैंपेन के प्रकार चुनें",
    },
    emailJourneyVariants: {
      label: "जर्नी वेरिएंट",
      description: "ईमेल जर्नी वेरिएंट",
      placeholder: "जर्नी वेरिएंट चुनें",
    },
    emailCampaignStages: {
      label: "कैंपेन चरण",
      description: "कैंपेन चरण",
      placeholder: "चरण चुनें",
    },
    countries: {
      label: "देश",
      description: "टारगेट देश",
      placeholder: "देश चुनें",
    },
    languages: {
      label: "भाषाएँ",
      description: "टारगेट भाषाएँ",
      placeholder: "भाषाएँ चुनें",
    },
    isExactMatch: {
      label: "सटीक मिलान",
      description: "सटीक देश/भाषा मिलान ज़रूरी करें",
    },
    weight: {
      label: "वेट",
      description: "लोड बैलेंसिंग का वज़न",
    },
    isFailover: {
      label: "फ़ेलओवर",
      description: "फ़ेलओवर अकाउंट की तरह इस्तेमाल करें",
    },
    isSystem: {
      label: "प्लेटफ़ॉर्म मेलबॉक्स",
      description:
        "प्लेटफ़ॉर्म का अपना ऑप्स मेलबॉक्स। क्रेडेंशियल env से आते हैं; कैंपेन से बाहर।",
    },
    failoverPriority: {
      label: "फ़ेलओवर प्राथमिकता",
      description: "फ़ेलओवर प्राथमिकता का क्रम",
    },
  },

  response: {
    account: {
      title: "अकाउंट बन गया",
      description: "नए मैसेंजर अकाउंट की जानकारी",
      id: "ID",
      name: "नाम",
      channel: "चैनल",
      provider: "प्रोवाइडर",
      status: "स्टेटस",
      smtpFromEmail: "From ईमेल",
      fromId: "From ID",
      createdAt: "बनाया गया",
      updatedAt: "अपडेट किया गया",
    },
  },

  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "अकाउंट का डेटा गलत है",
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
      title: "नाम में टकराव",
      description: "इस नाम का अकाउंट पहले से मौजूद है",
    },
    server: {
      title: "सर्वर एरर",
      description: "अकाउंट नहीं बन पाया",
      detail: "अकाउंट बनाना फ़ेल हुआ: {{error}}",
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
    title: "अकाउंट बन गया",
    description: "मैसेंजर अकाउंट बन गया",
  },
};
