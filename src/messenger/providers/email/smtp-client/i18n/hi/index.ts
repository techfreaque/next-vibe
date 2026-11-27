import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "SMTP क्लाइंट",
  category: "ईमेल सर्विस",
  components: {
    email: {
      tagline: "अभिव्यक्ति की आज़ादी वाला AI प्लेटफ़ॉर्म",
      footer: {
        needHelp: "मदद चाहिए?",
        helpText: "मदद चाहिए? हमें यहाँ संपर्क करें:",
        unsubscribeText: "ये ईमेल नहीं चाहिए?",
        unsubscribeLink: "अनसब्सक्राइब करें",
        copyright: "© {{currentYear}} {{appName}}। सर्वाधिकार सुरक्षित।",
        visitWebsite: "वेबसाइट पर जाएँ",
        allRightsReserved: "© {{currentYear}} {{appName}}। सर्वाधिकार सुरक्षित।",
        feedbackHook: "कुछ कहना है? जवाब दें। हम सच में पढ़ते हैं।",
        feedbackBody:
          "बग बताएँ, फ़ीचर माँगें, या बताएँ क्या कमी है। काम के फ़ीडबैक पर आपको {{credits}} क्रेडिट मिलते हैं। यानी पूरा महीना हमारी तरफ़ से।",
        feedbackLink: "फ़ीडबैक के साथ जवाब दें →",
        footerSeparator: " · ",
        legalOperator: "{{companyName}} का संचालन {{owner}} करते हैं, {{address}}।",
        legalContact: "संपर्क",
        legalNotice: "क़ानूनी सूचना",
      },
    },
    post: {
      title: "कंपोनेंट",
      description: "कंपोनेंट एंडपॉइंट",
      form: {
        title: "कंपोनेंट कॉन्फ़िगरेशन",
        description: "कंपोनेंट पैरामीटर सेट करें",
      },
      response: {
        title: "रिस्पॉन्स",
        description: "कंपोनेंट रिस्पॉन्स डेटा",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कोई अनजान एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुई",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस मना है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा टकराव हुआ",
        },
      },
      success: {
        title: "सफल",
        description: "कार्रवाई सफलतापूर्वक पूरी हुई",
      },
    },
  },
  emailSending: {
    email: {
      defaultSenderName: "सिस्टम",
      errors: {
        sending_failed: "{{recipient}} को ईमेल भेजना फ़ेल हुआ: {{error}}",
        invalid_locale:
          "{{recipient}} को नहीं भेज सकते: '{{locale}}' सही लोकेल नहीं है",
      },
    },
  },
  emailHandling: {
    email: {
      errors: {
        rendering_failed: "ईमेल टेंप्लेट रेंडर करना फ़ेल हुआ: {{error}}",
        send_failed: "ईमेल भेजना फ़ेल हुआ: {{error}}",
        email_failed_subject: "ईमेल फ़ेल",
        unknown_recipient: "अनजान प्राप्तकर्ता",
        unknown_sender: "सिस्टम",
        email_render_exception: "ईमेल रेंडरिंग में अपवाद आया",
        batch_send_failed: "बैच ईमेल भेजना फ़ेल हुआ",
        batch_send_failed_item: "बैच भेजना फ़ेल हुआ: {{error}}",
        batch_send_failed_all: "बैच ईमेल भेजना फ़ेल हुआ: {{errors}}",
      },
    },
  },
  sending: {
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "SMTP भेजने की कार्रवाइयों के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "SMTP सर्वर पर एरर आई",
        detail: "SMTP भेजना फ़ेल हुआ: {{error}}",
        detail_account: "{{accountName}} ({{accountId}}) पर SMTP फ़ेल: {{error}}",
        detail_attempt:
          "SMTP अकाउंट {{accountId}} प्रयास {{attempt}} पर फ़ेल हुआ: {{error}}",
        detail_exhausted: "SMTP अकाउंट {{accountId}} के सभी रीट्राई ख़त्म हो गए",
      },
      rejected: {
        title: "{{recipient}} को ईमेल अस्वीकृत हुआ: {{reason}}",
        defaultReason: "सर्वर ने ईमेल अस्वीकार किया",
      },
      no_recipients: {
        title: "{{recipient}} के लिए कोई प्राप्तकर्ता स्वीकार नहीं हुआ",
        defaultReason: "कोई प्राप्तकर्ता स्वीकार नहीं हुआ",
      },
      rate_limit: {
        title:
          "{{accountName}} पर घंटे की रेट लिमिट पूरी हुई: {{current}}/{{limit}} भेजे, {{remainingCapacity}} बाक़ी",
      },
      capacity: {
        title: "क्षमता की जाँच फ़ेल हुई: {{error}}",
      },
      no_account: {
        title: "कोई SMTP अकाउंट उपलब्ध नहीं",
        detail_criteria:
          "{{campaignType}} / {{journeyVariant}} / {{campaignStage}} / {{country}} / {{language}} के लिए कोई SMTP अकाउंट नहीं",
        detail_campaign: "कैंपेन प्रकार {{campaignType}} के लिए कोई SMTP अकाउंट नहीं",
        detail_account: "SMTP अकाउंट {{accountId}} नहीं मिला",
      },
    },
  },
  emailMetadata: {
    errors: {
      server: {
        title: "ईमेल मेटाडेटा सर्वर एरर",
        description: "ईमेल मेटाडेटा स्टोर करना फ़ेल हुआ",
        detail_store: "{{recipient}} का मेटाडेटा स्टोर नहीं हो सका: {{error}}",
        detail_engagement:
          "मैसेज {{emailId}} का एंगेजमेंट अपडेट नहीं हो सका: {{error}}",
      },
    },
  },
  enums: {
    status: {
      active: "सक्रिय",
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
    statusFilter: {
      all: "सभी स्थितियाँ",
    },
    healthStatus: {
      healthy: "स्वस्थ",
      degraded: "कमज़ोर",
      unhealthy: "अस्वस्थ",
      unknown: "अनजान",
    },
    healthStatusFilter: {
      all: "सभी हेल्थ स्थितियाँ",
    },
    sortField: {
      name: "नाम",
      status: "स्थिति",
      createdAt: "बनने का समय",
      updatedAt: "अपडेट होने का समय",
      priority: "प्राथमिकता",
      totalEmailsSent: "कुल भेजे ईमेल",
      lastUsedAt: "आख़िरी इस्तेमाल",
    },
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
    campaignTypeFilter: {
      all: "सभी कैंपेन प्रकार",
    },
    selectionRuleSortField: {
      name: "नाम",
      priority: "प्राथमिकता",
      campaignType: "कैंपेन का प्रकार",
      journeyVariant: "जर्नी वेरिएंट",
      campaignStage: "कैंपेन चरण",
      country: "देश",
      language: "भाषा",
      createdAt: "बनने का समय",
      updatedAt: "अपडेट होने का समय",
      emailsSent: "भेजे गए ईमेल",
      successRate: "सफलता दर",
      lastUsedAt: "आख़िरी इस्तेमाल",
    },
    selectionRuleStatusFilter: {
      all: "सभी",
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      default: "डिफ़ॉल्ट",
      failover: "फ़ेलओवर",
    },
    loadBalancingStrategy: {
      roundRobin: "राउंड रॉबिन",
      weighted: "वेटेड",
      priority: "प्राथमिकता",
      leastUsed: "सबसे कम इस्तेमाल",
    },
    testResult: {
      success: "सफल",
      authFailed: "ऑथेंटिकेशन फ़ेल",
      connectionFailed: "कनेक्शन फ़ेल",
      timeout: "टाइमआउट",
      unknownError: "अनजान एरर",
    },
  },
};
