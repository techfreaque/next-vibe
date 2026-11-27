import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "ईमेल",
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
  enums: {
    // SMTP Client Enums
    smtpSecurityType: {
      none: "कोई नहीं",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    smtpAccountStatus: {
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      error: "एरर",
      testing: "टेस्टिंग",
    },
    smtpHealthStatus: {
      healthy: "स्वस्थ",
      degraded: "कमज़ोर",
      unhealthy: "अस्वस्थ",
      unknown: "अज्ञात",
    },
    smtpSortField: {
      name: "नाम",
      status: "स्टेटस",
      createdAt: "बनाने का समय",
      updatedAt: "अपडेट का समय",
      priority: "प्राथमिकता",
      totalEmailsSent: "कुल भेजे ईमेल",
      lastUsedAt: "आख़िरी इस्तेमाल",
    },
    smtpCampaignType: {
      leadCampaign: "लीड कैंपेन",
      newsletter: "न्यूज़लेटर",
      signupNurture: "साइनअप नर्चर",
      retention: "रिटेंशन",
      winback: "विनबैक",
      transactional: "ट्रांज़ैक्शनल",
      notification: "नोटिफ़िकेशन",
      system: "सिस्टम",
    },
    smtpLoadBalancingStrategy: {
      roundRobin: "राउंड रॉबिन",
      weighted: "भारित",
      priority: "प्राथमिकता",
      leastUsed: "सबसे कम इस्तेमाल",
    },
    loadBalancingStrategy: {
      roundRobin: "राउंड रॉबिन",
      weighted: "भारित",
      priority: "प्राथमिकता",
      leastUsed: "सबसे कम इस्तेमाल",
    },
    smtpTestResult: {
      success: "सफल",
      authFailed: "ऑथेंटिकेशन फ़ेल",
      connectionFailed: "कनेक्शन फ़ेल",
      timeout: "टाइमआउट",
      unknownError: "अज्ञात एरर",
    },
    testResult: {
      success: "सफल",
      authFailed: "ऑथेंटिकेशन फ़ेल",
      connectionFailed: "कनेक्शन फ़ेल",
      timeout: "टाइमआउट",
      unknownError: "अज्ञात एरर",
    },
    smtpStatusFilter: {
      any: "कोई भी",
    },
    smtpHealthStatusFilter: {
      any: "कोई भी",
    },
    smtpCampaignTypeFilter: {
      any: "कोई भी",
    },
    smtpSelectionRuleSortField: {
      name: "नाम",
      priority: "प्राथमिकता",
      campaignType: "कैंपेन टाइप",
      journeyVariant: "जर्नी वेरिएंट",
      campaignStage: "कैंपेन चरण",
      country: "देश",
      language: "भाषा",
      createdAt: "बनाने का समय",
      updatedAt: "अपडेट का समय",
      emailsSent: "भेजे गए ईमेल",
      successRate: "सफलता दर",
      lastUsedAt: "आख़िरी इस्तेमाल",
    },
    selectionRuleSortField: {
      name: "नाम",
      priority: "प्राथमिकता",
      campaignType: "कैंपेन टाइप",
      journeyVariant: "जर्नी वेरिएंट",
      campaignStage: "कैंपेन चरण",
      country: "देश",
      language: "भाषा",
      createdAt: "बनाने का समय",
      updatedAt: "अपडेट का समय",
      emailsSent: "भेजे गए ईमेल",
      successRate: "सफलता दर",
      lastUsedAt: "आख़िरी इस्तेमाल",
    },
    smtpSelectionRuleStatusFilter: {
      any: "कोई भी",
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      default: "डिफ़ॉल्ट",
      failover: "फ़ेलओवर",
    },
    selectionRuleStatusFilter: {
      any: "कोई भी",
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      default: "डिफ़ॉल्ट",
      failover: "फ़ेलओवर",
    },
    // Email Messages Enums
    emailStatus: {
      pending: "पेंडिंग",
      sent: "भेजे गए",
      delivered: "पहुँच गया",
      opened: "खोले गए",
      clicked: "क्लिक किए गए",
      bounced: "बाउंस हुए",
      failed: "फ़ेल",
      unsubscribed: "अनसब्सक्राइब हुए",
    },
    emailType: {
      transactional: "ट्रांज़ैक्शनल",
      marketing: "मार्केटिंग",
      notification: "नोटिफ़िकेशन",
      system: "सिस्टम",
      leadCampaign: "लीड कैंपेन",
      userCommunication: "यूज़र संवाद",
    },
    emailProvider: {
      resend: "दोबारा भेजें",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "अन्य",
    },
    emailSortField: {
      subject: "विषय",
      recipientEmail: "प्राप्तकर्ता का ईमेल",
      recipientName: "पाने वाले का नाम",
      type: "टाइप",
      status: "स्टेटस",
      sentAt: "भेजने का समय",
      createdAt: "बनाने का समय",
    },
    emailStatusFilter: {
      any: "कोई भी",
    },
    emailTypeFilter: {
      any: "कोई भी",
    },
    emailRetryRange: {
      noRetries: "बिना रीट्राई",
      oneToTwo: "1-2 रीट्राई",
      threeToFive: "3-5 रीट्राई",
      sixPlus: "6+ रीट्राई",
    },
    // IMAP Client Enums
    imapSyncStatus: {
      pending: "पेंडिंग",
      syncing: "सिंक हो रहा है",
      synced: "सिंक हुआ",
      error: "एरर",
    },
    imapOverallSyncStatus: {
      idle: "निष्क्रिय",
      running: "चल रहा है",
      completed: "पूरा हुआ",
      failed: "फ़ेल",
      cancelled: "रद्द",
    },
    imapSortOrder: {
      asc: "बढ़ता क्रम",
      desc: "घटता क्रम",
    },
    imapAuthMethod: {
      plain: "सादा",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapSpecialUseType: {
      inbox: "इनबॉक्स",
      sent: "भेजे गए",
      drafts: "ड्राफ़्ट",
      trash: "ट्रैश",
      junk: "जंक",
      archive: "आर्काइव",
    },
    imapFolderSortField: {
      name: "नाम",
      displayName: "डिस्प्ले नाम",
      messageCount: "मैसेज की गिनती",
      unseenCount: "अनदेखे की गिनती",
      createdAt: "बनाने का समय",
    },
    imapAccountSortField: {
      name: "नाम",
      email: "ईमेल",
      host: "होस्ट",
      enabled: "चालू",
      lastSyncAt: "आख़िरी सिंक का समय",
      createdAt: "बनाने का समय",
    },
    imapConnectionStatus: {
      disconnected: "डिस्कनेक्टेड",
      connecting: "कनेक्ट हो रहा है",
      connected: "जुड़ा हुआ",
      error: "एरर",
      timeout: "टाइमआउट",
    },
    imapSyncStatusFilter: {
      all: "सभी",
    },
    imapAccountStatusFilter: {
      all: "सभी",
      enabled: "चालू",
      disabled: "बंद",
    },
    imapAccountFilter: {
      all: "सभी",
    },
    imapMessageSortField: {
      subject: "विषय",
      senderName: "भेजने वाले का नाम",
      senderEmail: "भेजने वाले का ईमेल",
      recipientEmail: "प्राप्तकर्ता का ईमेल",
      recipientName: "पाने वाले का नाम",
      isRead: "पढ़ा गया है",
      isFlagged: "फ़्लैग किया है",
      messageSize: "मैसेज साइज़",
      sentAt: "भेजने का समय",
      createdAt: "बनाने का समय",
    },
    imapMessageStatusFilter: {
      all: "सभी",
      read: "पढ़ा",
      unread: "बिना पढ़ा",
      flagged: "फ़्लैग किया",
      unflagged: "बिना फ़्लैग",
      draft: "ड्राफ़्ट",
      deleted: "हटा दिया गया",
      hasAttachments: "अटैचमेंट वाले",
      noAttachments: "अटैचमेंट नहीं",
    },
    imapHealthStatus: {
      healthy: "स्वस्थ",
      warning: "चेतावनी",
      error: "एरर",
      maintenance: "मेंटेनेंस",
    },
    imapPerformanceStatus: {
      good: "अच्छा",
      warning: "चेतावनी",
      error: "एरर",
    },
    bulkMessageAction: {
      markRead: "पढ़ा हुआ चिह्नित करें",
      markUnread: "बिना पढ़ा चिह्नित करें",
      flag: "फ़्लैग करें",
      unflag: "फ़्लैग हटाएँ",
      delete: "हटाएँ",
    },
    imapLoggingLevel: {
      error: "एरर",
      warn: "चेतावनी",
      info: "जानकारी",
      debug: "डीबग",
    },
    // Email Service Enums
    emailServicePriority: {
      low: "लो",
      normal: "सामान्य",
      high: "हाई",
      urgent: "तुरंत",
    },
    emailServiceStatus: {
      idle: "निष्क्रिय",
      processing: "प्रोसेस हो रहा है",
      completed: "पूरा हुआ",
      failed: "फ़ेल",
      retrying: "रीट्राई हो रहा है",
    },
    // SMS Service Enums
    smsProvider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      plivo: "Plivo",
    },
    smsStatus: {
      pending: "पेंडिंग",
      sent: "भेजे गए",
      delivered: "पहुँच गया",
      failed: "फ़ेल",
      rejected: "नामंज़ूर",
      undelivered: "डिलीवर नहीं हुए",
    },
    smsTemplateType: {
      notification: "नोटिफ़िकेशन",
      verification: "वेरिफ़िकेशन",
      marketing: "मार्केटिंग",
      alert: "अलर्ट",
      reminder: "रिमाइंडर",
    },
  },
  errors: {
    no_email: "ईमेल एड्रेस नहीं दिया गया",
    email_generation_failed: "ईमेल नहीं बन पाया",
  },
  email: {
    errors: {
      send: {
        title: "ईमेल भेजना फ़ेल हुआ",
      },
    },
  },
  smsService: {
    title: "SMS सेवा",
    description: "अलग-अलग प्रोवाइडर से SMS भेजें",
    category: "SMS सेवा",
    tag: "SMS सेवा",
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "SMS भेजने की अनुमति आपके पास नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "SMS सेवा तक पहुँच प्रतिबंधित है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "SMS रिक्वेस्ट का डेटा गलत है",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
      },
      conflict: {
        title: "टकराव",
        description: "SMS रिक्वेस्ट मौजूदा डेटा से टकरा रही है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "SMS रिसोर्स नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "SMS भेजते समय नेटवर्क एरर हुआ",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      invalid_phone: {
        title: "फ़ोन नंबर गलत है",
      },
      send: {
        title: "SMS भेजना फ़ेल हुआ",
      },
    },
    send: {
      title: "SMS भेजें",
      description: "प्राप्तकर्ता को SMS भेजें",
      container: {
        title: "SMS कॉन्फ़िगरेशन",
        description: "SMS भेजने के पैरामीटर तय करें",
      },
      to: {
        label: "फ़ोन नंबर",
        description: "प्राप्तकर्ता का फ़ोन नंबर",
        placeholder: "+1234567890",
      },
      message: {
        label: "मैसेज",
        description: "SMS का कंटेंट",
        placeholder: "अपना मैसेज यहाँ लिखें...",
      },
      campaignType: {
        label: "कैंपेन टाइप",
        description: "इस SMS के लिए कैंपेन टाइप चुनें",
        placeholder: "कैंपेन टाइप चुनें",
      },
      leadId: {
        label: "लीड ID",
        description: "जुड़ी लीड की पहचान",
        placeholder: "lead-12345",
      },
      templateName: {
        label: "टेंप्लेट का नाम",
        description: "इस्तेमाल होने वाला SMS टेम्पलेट",
        placeholder: "टेम्पलेट चुनें",
      },
      response: {
        result: {
          title: "SMS रिज़ल्ट",
          description: "SMS भेजने का नतीजा",
          success: "सफल",
          messageId: "मैसेज ID",
          sentAt: "भेजने का समय",
          provider: "प्रोवाइडर",
          cost: "लागत",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "SMS रिक्वेस्ट का डेटा गलत है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "SMS भेजने की अनुमति आपके पास नहीं है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "SMS सेवा तक पहुँच प्रतिबंधित है",
        },
        conflict: {
          title: "टकराव",
          description: "SMS रिक्वेस्ट मौजूदा डेटा से टकरा रही है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "SMS रिसोर्स नहीं मिला",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "SMS भेजते समय नेटवर्क एरर हुआ",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर में अंदरूनी गड़बड़ी हुई",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "SMS भेज दिया गया",
        description: "आपका SMS सफलतापूर्वक भेज दिया गया है",
      },
    },
  },
  sms: {
    errors: {
      invalid_phone: {
        title: "फ़ोन नंबर गलत है",
      },
      send: {
        title: "SMS भेजना फ़ेल हुआ",
      },
    },
  },
  emailService: {
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
            "बग बताएँ, फ़ीचर माँगें, या बताएँ कि क्या कमी है। काम का फ़ीडबैक देने पर {{credits}} क्रेडिट मिलते हैं, यानी पूरा एक महीना हमारी तरफ़ से।",
          feedbackLink: "फ़ीडबैक के साथ जवाब दें →",
          footerSeparator: " · ",
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
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
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
          description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
        },
      },
    },
    emailSending: {
      email: {
        defaultSenderName: "सिस्टम",
        errors: {
          sending_failed: "{{recipient}} को ईमेल भेजना फ़ेल हुआ",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "ईमेल टेम्पलेट रेंडर नहीं हुआ",
          send_failed: "ईमेल भेजना फ़ेल हुआ",
          email_failed_subject: "ईमेल फ़ेल",
          unknown_recipient: "अनजान प्राप्तकर्ता",
          unknown_sender: "सिस्टम",
          email_render_exception: "ईमेल रेंडरिंग में अपवाद आया",
          batch_send_failed: "बैच ईमेल भेजना फ़ेल हुआ",
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
        },
        rejected: {
          title: "ईमेल अस्वीकृत",
          defaultReason: "सर्वर ने ईमेल अस्वीकार किया",
        },
        no_recipients: {
          title: "किसी प्राप्तकर्ता को स्वीकार नहीं किया गया",
          defaultReason: "कोई प्राप्तकर्ता स्वीकार नहीं हुआ",
        },
        rate_limit: {
          title: "रेट लिमिट पार हो गई",
        },
        capacity: {
          title: "कैपेसिटी एरर",
        },
        no_account: {
          title: "कोई SMTP अकाउंट उपलब्ध नहीं",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "ईमेल मेटाडेटा सर्वर एरर",
          description: "ईमेल मेटाडेटा स्टोर करना फ़ेल हुआ",
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
        all: "सभी स्टेटस",
      },
      healthStatus: {
        healthy: "स्वस्थ",
        degraded: "कमज़ोर",
        unhealthy: "अस्वस्थ",
        unknown: "अज्ञात",
      },
      healthStatusFilter: {
        all: "सभी हेल्थ स्टेटस",
      },
      sortField: {
        name: "नाम",
        status: "स्टेटस",
        createdAt: "बनाने का समय",
        updatedAt: "अपडेट का समय",
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
        campaignType: "कैंपेन टाइप",
        journeyVariant: "जर्नी वेरिएंट",
        campaignStage: "कैंपेन चरण",
        country: "देश",
        language: "भाषा",
        createdAt: "बनाने का समय",
        updatedAt: "अपडेट का समय",
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
        weighted: "भारित",
        priority: "प्राथमिकता",
        leastUsed: "सबसे कम इस्तेमाल",
      },
      testResult: {
        success: "सफल",
        authFailed: "ऑथेंटिकेशन फ़ेल",
        connectionFailed: "कनेक्शन फ़ेल",
        timeout: "टाइमआउट",
        unknownError: "अज्ञात एरर",
      },
    },
  },
  imapClient: {
    category: "IMAP क्लाइंट",
    tag: "IMAP क्लाइंट",
    tags: {
      health: "हेल्थ",
      monitoring: "मॉनिटरिंग",
      sync: "सिंक्रोनाइज़ेशन",
      accounts: "अकाउंट",
      folders: "फ़ोल्डर",
      messages: "मैसेज",
      config: "कॉन्फ़िगरेशन",
    },
    messages: {
      tag: "मैसेज",
      id: {
        widget: {
          markRead: "पढ़ा हुआ चिह्नित करें",
          markUnread: "बिना पढ़ा चिह्नित करें",
          flag: "फ़्लैग करें",
          unflag: "फ़्लैग हटाएँ",
        },
      },
      errors: {
        server: { title: "सर्वर एरर" },
        notFound: { title: "मैसेज नहीं मिला" },
        accountNotFound: { title: "अकाउंट नहीं मिला" },
        syncFailed: { title: "सिंक फ़ेल हुआ" },
        syncSuccess: { message: "मैसेज सफलतापूर्वक सिंक हुए" },
        list: {
          get: {
            errors: { server: { title: "मैसेज लिस्ट करते समय सर्वर एरर" } },
          },
        },
      },
    },
    sync: {
      category: "IMAP क्लाइंट",

      title: "IMAP सिंक",
      description: "IMAP सिंक्रनाइज़ेशन सर्विस",
      container: {
        title: "IMAP सिंक कॉन्फ़िगरेशन",
        description: "IMAP सिंक्रनाइज़ेशन पैरामीटर सेट करें",
      },
      accountIds: {
        label: "अकाउंट ID",
        description: "सिंक होने वाली IMAP अकाउंट ID",
        placeholder: "अकाउंट ID कॉमा से अलग करके दर्ज करें",
      },
      force: {
        label: "ज़बरदस्ती सिंक",
        description: "हाल में सिंक हुआ हो तब भी सिंक्रनाइज़ेशन ज़बरदस्ती करें",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "बिना बदलाव किए टेस्ट रन चलाएँ",
      },
      maxMessages: {
        label: "ज़्यादा से ज़्यादा मैसेज",
        description: "हर फ़ोल्डर में सिंक होने वाले अधिकतम मैसेज",
        placeholder: "अधिकतम मैसेज की संख्या दर्ज करें",
      },
      post: {
        title: "सिंक",
        description: "सिंक एंडपॉइंट",
        form: {
          title: "सिंक कॉन्फ़िगरेशन",
          description: "सिंक पैरामीटर सेट करें",
        },
        response: {
          title: "रिस्पॉन्स",
          description: "सिंक रिस्पॉन्स डेटा",
          result: {
            title: "सिंक नतीजे",
            description: "सिंक्रनाइज़ेशन के विस्तृत नतीजे",
            accountsProcessed: "प्रोसेस हुए अकाउंट",
            foldersProcessed: "प्रोसेस हुए फ़ोल्डर",
            messagesProcessed: "प्रोसेस हुए मैसेज",
            messagesAdded: "जुड़े मैसेज",
            messagesUpdated: "अपडेट हुए मैसेज",
            messagesDeleted: "हटे मैसेज",
            duration: "अवधि",
          },
          errors: {
            error: {
              title: "सिंक एरर",
              description: "एरर का ब्योरा",
              code: "एरर कोड",
              message: "एरर मैसेज",
            },
          },
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
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
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
          description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
        },
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
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर आया",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस मना है",
        },
      },
      success: {
        title: "सफल",
        description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
      },
      widget: {
        title: "पूरा IMAP सिंक",
        options: "सिंक विकल्प",
        noAccounts: "कोई IMAP अकाउंट कॉन्फ़िगर नहीं",
        result: "सिंक का नतीजा",
        duration: "अवधि",
        errors: "एरर",
        accountsProcessed: "प्रोसेस हुए अकाउंट",
        foldersProcessed: "प्रोसेस हुए फ़ोल्डर",
        messagesProcessed: "प्रोसेस हुए मैसेज",
        messagesAdded: "जुड़े मैसेज",
        messagesUpdated: "अपडेट हुए मैसेज",
        messagesDeleted: "हटे मैसेज",
        submit: "सिंक शुरू करें",
        submitting: "सिंक हो रहा है...",
      },
    },
    imapErrors: {
      accounts: {
        post: {
          error: {
            duplicate: {
              title: "अकाउंट पहले से मौजूद है",
            },
            server: {
              title: "अकाउंट बनाते समय सर्वर एरर",
            },
          },
        },
        get: {
          error: {
            not_found: {
              title: "अकाउंट नहीं मिला",
            },
            server: {
              title: "अकाउंट पाते समय सर्वर एरर",
            },
          },
        },
        put: {
          error: {
            not_found: {
              title: "अकाउंट नहीं मिला",
            },
            duplicate: {
              title: "इस ईमेल का अकाउंट पहले से मौजूद है",
            },
            server: {
              title: "अकाउंट अपडेट करते समय सर्वर एरर",
            },
          },
        },
        delete: {
          error: {
            not_found: {
              title: "अकाउंट नहीं मिला",
            },
            server: {
              title: "अकाउंट हटाते समय सर्वर एरर",
            },
          },
          success: {
            title: "अकाउंट सफलतापूर्वक हट गया",
          },
        },
      },
      folders: {
        get: {
          error: {
            not_found: {
              title: "फ़ोल्डर नहीं मिला",
            },
            server: {
              title: "फ़ोल्डर पाते समय सर्वर एरर",
            },
          },
        },
        sync: {
          error: {
            missing_account: {
              title: "फ़ोल्डर सिंक के लिए अकाउंट नहीं मिला",
            },
          },
        },
      },
      messages: {
        get: {
          error: {
            not_found: {
              title: "मैसेज नहीं मिला",
            },
            server: {
              title: "मैसेज पाते समय सर्वर एरर",
            },
          },
        },
      },
      connection: {
        failed: "कनेक्शन फ़ेल",
        timeout: {
          title: "कनेक्शन टाइमआउट",
        },
        test: {
          failed: "कनेक्शन टेस्ट फ़ेल हुआ",
        },
        close: {
          failed: "कनेक्शन बंद नहीं हो सका",
        },
        folders: {
          list: {
            failed: "फ़ोल्डर लिस्ट नहीं हो सके",
          },
        },
        messages: {
          list: {
            failed: "मैसेज लिस्ट नहीं हो सके",
          },
        },
      },
      sync: {
        failed: "सिंक फ़ेल हुआ",
        account: {
          failed: "अकाउंट सिंक फ़ेल हुआ",
        },
        folder: {
          failed: "फ़ोल्डर सिंक फ़ेल हुआ",
        },
        message: {
          failed: "मैसेज सिंक फ़ेल हुआ",
        },
        post: {
          error: {
            server: {
              title: "सिंक के दौरान सर्वर एरर",
            },
          },
        },
      },
      validation: {
        account: {
          username: {
            required: "यूज़रनेम ज़रूरी है",
          },
          port: {
            invalid: "गलत पोर्ट नंबर",
          },
          host: {
            invalid: "गलत होस्ट",
          },
        },
      },
    },
    imap: {
      "example.com": "imap.example.com",
      "gmail.com": "imap.gmail.com",
      connection: {
        test: {
          success: "कनेक्शन टेस्ट सफल",
          failed: "कनेक्शन टेस्ट फ़ेल हुआ",
          timeout: "कनेक्शन टेस्ट टाइमआउट",
        },
      },
      sync: {
        messages: {
          accounts: {
            success: "सभी अकाउंट सफलतापूर्वक सिंक हुए",
            successWithErrors: "अकाउंट एरर के साथ सिंक हुए",
          },
          account: {
            success: "अकाउंट सफलतापूर्वक सिंक हुआ",
            successWithErrors: "अकाउंट एरर के साथ सिंक हुआ",
          },
          folders: {
            success: "फ़ोल्डर सफलतापूर्वक सिंक हुए",
            successWithErrors: "फ़ोल्डर एरर के साथ सिंक हुए",
          },
          messages: {
            success: "मैसेज सफलतापूर्वक सिंक हुए",
            successWithErrors: "मैसेज एरर के साथ सिंक हुए",
          },
        },
        errors: {
          default: "IMAP सिंक फ़ेल हुआ",
          account_failed: "अकाउंट सिंक फ़ेल हुआ",
          folder_sync_failed: "फ़ोल्डर सिंक फ़ेल हुआ",
          message_sync_error: "मैसेज सिंक एरर",
          message_sync_failed: "मैसेज सिंक फ़ेल हुआ",
        },
      },
    },
    enums: {
      loggingLevel: {
        error: "एरर",
        warn: "चेतावनी",
        info: "जानकारी",
        debug: "डीबग",
      },
      syncStatus: {
        pending: "पेंडिंग",
        syncing: "सिंक हो रहा है",
        synced: "सिंक हुआ",
        error: "एरर",
      },
      overallSyncStatus: {
        idle: "निष्क्रिय",
        running: "चल रहा है",
        completed: "पूरा हुआ",
        failed: "फ़ेल",
        cancelled: "रद्द",
      },
      sortOrder: {
        asc: "बढ़ता क्रम",
        desc: "घटता क्रम",
      },
      authMethod: {
        plain: "सादा",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      imapAuthMethod: {
        plain: "सादा",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      specialUseType: {
        inbox: "इनबॉक्स",
        sent: "भेजे गए",
        drafts: "ड्राफ़्ट",
        trash: "ट्रैश",
        junk: "जंक",
        archive: "आर्काइव",
      },
      folderSortField: {
        name: "नाम",
        displayName: "डिस्प्ले नाम",
        messageCount: "मैसेज की गिनती",
        unseenCount: "अनदेखे की गिनती",
        createdAt: "बनाने का समय",
      },
      accountSortField: {
        name: "नाम",
        email: "ईमेल",
        host: "होस्ट",
        enabled: "चालू",
        lastSyncAt: "आख़िरी सिंक का समय",
        createdAt: "बनाने का समय",
      },
      connectionStatus: {
        disconnected: "डिस्कनेक्टेड",
        connecting: "कनेक्ट हो रहा है",
        connected: "जुड़ा हुआ",
        error: "एरर",
        timeout: "टाइमआउट",
      },
      syncStatusFilter: {
        all: "सभी सिंक स्टेटस",
      },
      accountStatusFilter: {
        all: "सभी अकाउंट स्टेटस",
        enabled: "चालू",
        disabled: "बंद",
      },
      accountFilter: {
        all: "सभी अकाउंट",
      },
      messageSortField: {
        subject: "विषय",
        senderName: "भेजने वाले का नाम",
        senderEmail: "भेजने वाले का ईमेल",
        recipientEmail: "प्राप्तकर्ता का ईमेल",
        recipientName: "पाने वाले का नाम",
        isRead: "पढ़ने का स्टेटस",
        isFlagged: "फ़्लैग किया",
        messageSize: "मैसेज साइज़",
        sentAt: "भेजने का समय",
        createdAt: "बनाने का समय",
      },
      messageStatusFilter: {
        all: "सभी मैसेज",
        read: "पढ़ा",
        unread: "बिना पढ़ा",
        flagged: "फ़्लैग किया",
        unflagged: "बिना फ़्लैग",
        draft: "ड्राफ़्ट",
        deleted: "हटा दिया गया",
        hasAttachments: "अटैचमेंट वाले",
        noAttachments: "अटैचमेंट नहीं",
      },
      healthStatus: {
        healthy: "स्वस्थ",
        warning: "चेतावनी",
        error: "एरर",
        maintenance: "मेंटेनेंस",
      },
      performanceStatus: {
        good: "अच्छा",
        warning: "चेतावनी",
        error: "एरर",
      },
    },
  },
  messages: {
    category: "ईमेल मैसेज",
    tag: "मैसेज",
    tags: {
      stats: "स्टैटिस्टिक्स",
      analytics: "एनालिटिक्स",
    },
    id: {
      category: "ईमेल",
      tags: {
        emails: "ईमेल",
      },
      title: "ईमेल ब्योरा",
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
    },
    list: {
      category: "ईमेल",
      tags: {
        emails: "ईमेल",
      },
      title: "ईमेल सूची",
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
            recipientEmail: "प्राप्तकर्ता का ईमेल",
            recipientName: "पाने वाले का नाम",
            senderEmail: "भेजने वाले का ईमेल",
            senderName: "भेजने वाले का नाम",
            type: "टाइप",
            status: "स्टेटस",
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
              title: "टाइमस्टैंप",
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
          search: "सर्च क्वेरी",
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
          description: "सर्वर में अंदरूनी गड़बड़ी हुई",
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
        clearSearch: "साफ़ करें",
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
          recipientEmail: "प्राप्तकर्ता का ईमेल",
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
    },
    stats: {
      category: "ईमेल",
      tags: {
        stats: "स्टैटिस्टिक्स",
        analytics: "एनालिटिक्स",
      },
      dateRange: {
        today: "आज",
        yesterday: "कल",
        last7Days: "पिछले 7 दिन",
        last30Days: "पिछले 30 दिन",
        last90Days: "पिछले 90 दिन",
        thisWeek: "इस हफ़्ते",
        lastWeek: "पिछला हफ़्ता",
        thisMonth: "इस महीने",
        lastMonth: "पिछला महीना",
        thisQuarter: "इस तिमाही",
        lastQuarter: "पिछली तिमाही",
        thisYear: "इस साल",
        lastYear: "पिछला साल",
        custom: "कस्टम रेंज",
      },
      get: {
        title: "ईमेल आँकड़े",
        description: "ईमेल के व्यापक आँकड़े और मेट्रिक लाएँ",
        form: {
          title: "ईमेल आँकड़ों का अनुरोध",
          description: "ईमेल आँकड़े पूछने के पैरामीटर",
        },
        startDate: {
          label: "शुरू की तारीख",
          description: "आँकड़ों की अवधि की शुरुआती तारीख़",
        },
        endDate: {
          label: "अंत की तारीख",
          description: "आँकड़ों की अवधि की अंतिम तारीख़",
        },
        accountId: {
          label: "अकाउंट ID",
          description: "किसी ख़ास अकाउंट से आँकड़े फ़िल्टर करें",
        },
        type: {
          label: "ईमेल प्रकार",
          description: "ईमेल प्रकार से फ़िल्टर करें",
          options: {
            all: "सभी",
            sent: "भेजे गए",
            received: "प्राप्त",
            draft: "ड्राफ़्ट",
            trash: "ट्रैश",
          },
        },
        groupBy: {
          label: "ऐसे समूह बनाएँ",
          description: "आँकड़ों को कैसे समूहित करना है",
          options: {
            day: "दिन के हिसाब से",
            week: "हफ़्ते के हिसाब से",
            month: "महीने के हिसाब से",
            account: "अकाउंट के हिसाब से",
            type: "प्रकार के हिसाब से",
          },
        },
        includeDetails: {
          label: "ब्योरा शामिल करें",
          description: "नतीजों में विस्तृत ब्रेकडाउन शामिल करें",
        },
        status: {
          label: "ईमेल स्थिति",
          description: "ईमेल स्थिति से फ़िल्टर करें",
        },
        search: {
          label: "खोजें",
          description: "विषय या प्राप्तकर्ता से ईमेल खोजें",
        },
        timePeriod: {
          label: "समय अवधि",
          description: "ऐतिहासिक डेटा की समय अवधि का ग्रैन्युलैरिटी",
          hour: "घंटा",
          day: "दिन",
          week: "सप्ताह",
          month: "महीना",
          quarter: "तिमाही",
          year: "साल",
        },
        dateRangePreset: {
          label: "तारीख़ रेंज प्रीसेट",
          description: "फ़िल्टर करने के लिए पहले से तय तारीख़ रेंज",
        },
        dateFrom: {
          label: "शुरू की तारीख",
          description: "इस तारीख़ से ईमेल फ़िल्टर करें",
        },
        dateTo: {
          label: "अंत की तारीख",
          description: "इस तारीख़ तक के ईमेल फ़िल्टर करें",
        },
        chartType: {
          label: "चार्ट प्रकार",
          description: "चार्ट के लिए विज़ुअलाइज़ेशन का प्रकार",
          line: "लाइन चार्ट",
          bar: "बार चार्ट",
          area: "एरिया चार्ट",
          pie: "पाई चार्ट",
          donut: "डोनट चार्ट",
        },
        includeComparison: {
          label: "तुलना शामिल करें",
          description: "पिछली अवधि से तुलना शामिल करें",
        },
        sortBy: {
          label: "इसके हिसाब से क्रम",
          description: "ईमेल सॉर्ट करने का फ़ील्ड",
        },
        sortOrder: {
          label: "सॉर्ट क्रम",
          description: "सॉर्टिंग का क्रम (बढ़ता या घटता)",
        },
        response: {
          title: "ईमेल आँकड़ों का रिस्पॉन्स",
          description: "ईमेल के व्यापक आँकड़े और मेट्रिक डेटा",
          totalEmails: "कुल ईमेल",
          sentEmails: "भेजे गए ईमेल",
          deliveredEmails: "डिलीवर हुए ईमेल",
          openedEmails: "खोले गए ईमेल",
          clickedEmails: "क्लिक किए गए ईमेल",
          bouncedEmails: "बाउंस हुए ईमेल",
          failedEmails: "फ़ेल हुए ईमेल",
          draftEmails: "ड्राफ़्ट ईमेल",
          openRate: "ओपन दर",
          clickRate: "क्लिक दर",
          deliveryRate: "डिलीवरी दर",
          bounceRate: "बाउंस दर",
          failureRate: "फ़ेल दर",
          emailsByProvider: "प्रोवाइडर के हिसाब से ईमेल",
          emailsByTemplate: "टेंप्लेट के हिसाब से ईमेल",
          emailsByStatus: "स्थिति के हिसाब से ईमेल",
          emailsByType: "प्रकार के हिसाब से ईमेल",
          emailsWithUserId: "यूज़र ID वाले ईमेल",
          emailsWithoutUserId: "बिना यूज़र ID वाले ईमेल",
          emailsWithLeadId: "लीड ID वाले ईमेल",
          emailsWithoutLeadId: "बिना लीड ID वाले ईमेल",
          emailsWithErrors: "एरर वाले ईमेल",
          emailsWithoutErrors: "बिना एरर वाले ईमेल",
          averageRetryCount: "औसत रीट्राई गिनती",
          maxRetryCount: "अधिकतम रीट्राई गिनती",
          averageProcessingTime: "औसत प्रोसेसिंग समय",
          averageDeliveryTime: "औसत डिलीवरी समय",
          historicalData: "ऐतिहासिक डेटा",
          groupedStats: "समूहित आँकड़े",
          generatedAt: "बनाए जाने का समय",
          dataRange: "डेटा रेंज",
          recentActivity: "हाल की गतिविधि",
          topPerformingTemplates: "सबसे अच्छे प्रदर्शन वाले टेंप्लेट",
          topPerformingProviders: "सबसे अच्छे प्रदर्शन वाले प्रोवाइडर",
          metrics: {
            totalEmails: "कुल ईमेल",
            sentEmails: "भेजे गए ईमेल",
            deliveredEmails: "डिलीवर हुए ईमेल",
            openedEmails: "खोले गए ईमेल",
            clickedEmails: "क्लिक किए गए ईमेल",
            bouncedEmails: "बाउंस हुए ईमेल",
            failedEmails: "फ़ेल हुए ईमेल",
            deliveryRate: "डिलीवरी दर",
            openRate: "ओपन दर",
            clickRate: "क्लिक दर",
            bounceRate: "बाउंस दर",
            failureRate: "फ़ेल दर",
            emails_with_errors: "एरर वाले ईमेल",
            average_retry_count: "औसत रीट्राई गिनती",
            average_processing_time: "औसत प्रोसेसिंग समय (ms)",
            average_delivery_time: "औसत डिलीवरी समय (ms)",
            provider_historical: "प्रोवाइडर का ऐतिहासिक डेटा",
            template_historical: "टेंप्लेट का ऐतिहासिक डेटा",
            engagement_historical: "एंगेजमेंट का ऐतिहासिक डेटा",
          },
          retry: {
            no_retries: "बिना रीट्राई",
            with_retries: "रीट्राई के साथ",
          },
          association: {
            with_user: "यूज़र के साथ",
            with_lead: "लीड के साथ",
            with_both: "दोनों के साथ",
            with_neither: "अकेले",
          },
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "ईमेल आँकड़े देखने के लिए ऑथेंटिकेशन ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "आँकड़े लाते समय आंतरिक सर्वर एरर हुई",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "आँकड़े लाते समय नेटवर्क एरर हुई",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "ईमेल आँकड़ों का एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "ईमेल आँकड़े नहीं मिले",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव हैं जिन्हें पहले सेव करना है",
          },
          conflict: {
            title: "टकराव",
            description: "आँकड़े लाते समय डेटा टकराव हुआ",
          },
        },
        success: {
          title: "सफल",
          description: "ईमेल आँकड़े सफलतापूर्वक मिल गए",
        },
      },
      widget: {
        title: "ईमेल आँकड़े",
        total: "कुल",
        sent: "भेजे गए",
        delivered: "पहुँच गया",
        opened: "खोले गए",
        clicked: "क्लिक किए गए",
        bounced: "बाउंस हुए",
        failed: "फ़ेल",
        errors: "एरर",
        engagementRates: "एंगेजमेंट दरें",
        deliveryRate: "डिलीवरी दर",
        openRate: "ओपन दर",
        clickRate: "क्लिक दर",
        bounceRate: "बाउंस दर",
        failureRate: "फ़ेल दर",
        byStatus: "स्थिति के हिसाब से",
        byType: "प्रकार के हिसाब से",
        avgRetries: "औसत रीट्राई",
        avgDeliveryMs: "औसत डिलीवरी समय",
        viewList: "सूची देखें",
        refresh: "रीफ़्रेश करें",
        search: "ईमेल खोजें...",
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
        sortField: {
          subject: "विषय",
          recipientEmail: "प्राप्तकर्ता का ईमेल",
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
      sortField: {
        subject: "विषय",
        recipientEmail: "प्राप्तकर्ता का ईमेल",
        recipientName: "पाने वाले का नाम",
        type: "टाइप",
        status: "स्टेटस",
        sentAt: "भेजने का समय",
        createdAt: "बनाने का समय",
      },
      retryRange: {
        noRetries: "बिना रीट्राई",
        oneToTwo: "1-2 रीट्राई",
        threeToFive: "3-5 रीट्राई",
        sixPlus: "6+ रीट्राई",
      },
      syncStatus: {
        pending: "सिंक लंबित",
        syncing: "सिंक हो रहा है",
        synced: "सिंक हुआ",
        failed: "सिंक फ़ेल हुआ",
      },
      specialFolder: {
        inbox: "इनबॉक्स",
        sent: "भेजे गए",
        drafts: "ड्राफ़्ट",
        trash: "ट्रैश",
        spam: "स्पैम",
        archive: "आर्काइव",
      },
      sortOrder: {
        asc: "बढ़ता क्रम",
        desc: "घटता क्रम",
      },
    },
  },
  send: {
    title: "मैसेज भेजें",
    description: "किसी भी चैनल (ईमेल, SMS, WhatsApp, Telegram) से मैसेज भेजें",
    category: "मैसेजिंग",
    tag: "भेजें",

    container: {
      title: "मैसेज भेजें",
      description: "कॉन्फ़िगर किए मैसेंजर अकाउंट से भेजें",
    },

    accountId: {
      label: "मैसेंजर अकाउंट",
      description: "जिस अकाउंट से भेजना है",
      placeholder: "अकाउंट UUID चुनें",
    },
    to: {
      label: "प्राप्तकर्ता",
      description: "ईमेल पता, फ़ोन नंबर या चैट ID",
      placeholder: "user@example.com या +12025551234",
    },
    toName: {
      label: "पाने वाले का नाम",
      description: "प्राप्तकर्ता का डिस्प्ले नाम (वैकल्पिक)",
      placeholder: "राहुल शर्मा",
    },
    subject: {
      label: "विषय",
      description: "विषय लाइन (सिर्फ़ ईमेल, दूसरे चैनलों के लिए वैकल्पिक)",
      placeholder: "आपका विषय यहाँ...",
    },
    text: {
      label: "मैसेज",
      description:
        "सादा टेक्स्ट बॉडी: SMS/WhatsApp/Telegram में इस्तेमाल होती है; ईमेल का फ़ॉलबैक",
      placeholder: "अपना मैसेज लिखें...",
    },
    html: {
      label: "HTML कंटेंट",
      description: "HTML बॉडी (सिर्फ़ ईमेल, वैकल्पिक: न दें तो टेक्स्ट इस्तेमाल होता है)",
      placeholder: "<p>HTML ईमेल कंटेंट डालें...</p>",
    },
    senderName: {
      label: "भेजने वाले का नाम",
      description: "भेजने वाले का डिस्प्ले नाम (सिर्फ़ ईमेल, वैकल्पिक)",
      placeholder: "आपकी कंपनी",
    },
    replyTo: {
      label: "Reply-To",
      description: "जवाब का पता (सिर्फ़ ईमेल, वैकल्पिक)",
      placeholder: "support@example.com",
    },
    leadId: {
      label: "लीड ID",
      description: "ट्रैकिंग के लिए जुड़ी लीड (वैकल्पिक)",
      placeholder: "UUID",
    },
    campaignId: {
      label: "कैंपेन ID",
      description: "ट्रैकिंग के लिए जुड़ा कैंपेन (वैकल्पिक)",
      placeholder: "UUID",
    },

    response: {
      title: "भेजने का नतीजा",
      description: "भेजने के ऑपरेशन का नतीजा",
      messageId: { label: "मैसेज ID" },
      accountName: { label: "अकाउंट" },
      channel: { label: "चैनल" },
      provider: { label: "प्रोवाइडर" },
      sentAt: { label: "भेजने का समय" },
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपके पास मैसेज भेजने की अनुमति नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "भेजते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "इस रिसोर्स का एक्सेस मना है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "भेजते समय नेटवर्क एरर आया",
      },
      notFound: {
        title: "अकाउंट नहीं मिला",
        description: "बताया गया मैसेंजर अकाउंट नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "रिक्वेस्ट मौजूदा डेटा से टकराती है",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },

    success: {
      title: "मैसेज भेज दिया गया",
      description: "आपका मैसेज सफलतापूर्वक भेज दिया गया",
    },
  },
  smtpClient: {
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
            "बग बताएँ, फ़ीचर माँगें, या बताएँ कि क्या कमी है। काम का फ़ीडबैक देने पर {{credits}} क्रेडिट मिलते हैं, यानी पूरा एक महीना हमारी तरफ़ से।",
          feedbackLink: "फ़ीडबैक के साथ जवाब दें →",
          footerSeparator: " · ",
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
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
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
          description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
        },
      },
    },
    emailSending: {
      email: {
        defaultSenderName: "सिस्टम",
        errors: {
          sending_failed: "{{recipient}} को ईमेल भेजना फ़ेल हुआ",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "ईमेल टेम्पलेट रेंडर नहीं हुआ",
          send_failed: "ईमेल भेजना फ़ेल हुआ",
          email_failed_subject: "ईमेल फ़ेल",
          unknown_recipient: "अनजान प्राप्तकर्ता",
          unknown_sender: "सिस्टम",
          email_render_exception: "ईमेल रेंडरिंग में अपवाद आया",
          batch_send_failed: "बैच ईमेल भेजना फ़ेल हुआ",
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
        },
        rejected: {
          title: "ईमेल अस्वीकृत",
          defaultReason: "सर्वर ने ईमेल अस्वीकार किया",
        },
        no_recipients: {
          title: "किसी प्राप्तकर्ता को स्वीकार नहीं किया गया",
          defaultReason: "कोई प्राप्तकर्ता स्वीकार नहीं हुआ",
        },
        rate_limit: {
          title: "रेट लिमिट पार हो गई",
        },
        capacity: {
          title: "कैपेसिटी एरर",
        },
        no_account: {
          title: "कोई SMTP अकाउंट उपलब्ध नहीं",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "ईमेल मेटाडेटा सर्वर एरर",
          description: "ईमेल मेटाडेटा स्टोर करना फ़ेल हुआ",
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
        all: "सभी स्टेटस",
      },
      healthStatus: {
        healthy: "स्वस्थ",
        degraded: "कमज़ोर",
        unhealthy: "अस्वस्थ",
        unknown: "अज्ञात",
      },
      healthStatusFilter: {
        all: "सभी हेल्थ स्टेटस",
      },
      sortField: {
        name: "नाम",
        status: "स्टेटस",
        createdAt: "बनाने का समय",
        updatedAt: "अपडेट का समय",
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
        campaignType: "कैंपेन टाइप",
        journeyVariant: "जर्नी वेरिएंट",
        campaignStage: "कैंपेन चरण",
        country: "देश",
        language: "भाषा",
        createdAt: "बनाने का समय",
        updatedAt: "अपडेट का समय",
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
        weighted: "भारित",
        priority: "प्राथमिकता",
        leastUsed: "सबसे कम इस्तेमाल",
      },
      testResult: {
        success: "सफल",
        authFailed: "ऑथेंटिकेशन फ़ेल",
        connectionFailed: "कनेक्शन फ़ेल",
        timeout: "टाइमआउट",
        unknownError: "अज्ञात एरर",
      },
    },
  },

  // Core emails level translations
  tag: "ईमेल",
  tags: {
    stats: "स्टैटिस्टिक्स",
    analytics: "एनालिटिक्स",
  },
  error: {
    default: "एरर आया",
  },
  template: {
    tagline: "बिना गार्डरेल वाला AI",
  },
  footer: {
    visitWebsite: "वेबसाइट पर जाएँ",
    allRightsReserved: "सर्वाधिकार सुरक्षित",
  },

  // Email Templates
  templates: {
    leads: {
      batch: {
        update: {
          meta: {
            name: "लीड बैच अपडेट ईमेल",
            description: "लीड बैच में अपडेट होने पर भेजा जाने वाला ईमेल",
          },
          preview: {
            totalMatched: "कुल मैच",
            totalMatched_description: "मैच हुई लीड की संख्या",
            totalProcessed: "कुल प्रोसेस हुए",
            totalProcessed_description: "प्रोसेस हुई लीड की संख्या",
            totalUpdated: "कुल अपडेट",
            totalUpdated_description: "सफलतापूर्वक अपडेट हुई लीड की संख्या",
            errorsCount: "एरर की संख्या",
            errorsCount_description: "प्रोसेसिंग के दौरान हुए एरर की संख्या",
            dryRun: "ड्राई रन",
            dryRun_description: "बिना बदलाव किए सिर्फ़ प्रीव्यू",
            userId: "यूज़र ID",
            userId_description: "एक्शन करने वाले यूज़र की ID",
          },
        },
      },
      welcome: {
        meta: {
          name: "लीड वेलकम ईमेल",
          description: "नई लीड को भेजा जाने वाला वेलकम ईमेल",
        },
        preview: {
          leadId: "लीड ID",
          leadId_description: "लीड की यूनिक पहचान",
          businessName: "बिज़नेस का नाम",
          businessName_description: "बिज़नेस का नाम (वैकल्पिक)",
          email: "ईमेल",
          email_description: "लीड का ईमेल एड्रेस",
          userId: "यूज़र ID",
          userId_description: "जुड़े यूज़र की ID (वैकल्पिक)",
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "कॉन्टैक्ट फ़ॉर्म सबमिशन",
          description: "कॉन्टैक्ट फ़ॉर्म सबमिट होने पर भेजा जाने वाला ईमेल",
        },
        preview: {
          name: "नाम",
          name_description: "संपर्क करने वाले का नाम",
          email: "ईमेल",
          email_description: "संपर्क करने वाले का ईमेल एड्रेस",
          company: "कंपनी",
          company_description: "कंपनी का नाम (वैकल्पिक)",
          subject: "विषय",
          subject_description: "मैसेज का विषय",
          message: "मैसेज",
          message_description: "मैसेज का कंटेंट",
          isForCompany: "कंपनी अकाउंट के लिए",
          isForCompany_description: "यह ईमेल कंपनी टीम को भेजा जाता है या नहीं",
          userId: "यूज़र ID",
          userId_description: "जुड़े यूज़र की ID (वैकल्पिक)",
          leadId: "लीड ID",
          leadId_description: "जुड़ी लीड की ID (वैकल्पिक)",
        },
      },
    },
    newsletter: {
      unsubscribe: {
        meta: {
          name: "न्यूज़लेटर अनसब्सक्राइब की पुष्टि",
          description: "न्यूज़लेटर अनसब्सक्राइब करने पर कन्फ़र्मेशन ईमेल",
        },
        preview: {
          email: "ईमेल",
          email_description: "अनसब्सक्राइब होने वाला ईमेल एड्रेस",
        },
      },
      welcome: {
        meta: {
          name: "न्यूज़लेटर वेलकम ईमेल",
          description: "नए न्यूज़लेटर सब्सक्राइबर के लिए वेलकम ईमेल",
        },
        preview: {
          email: "ईमेल",
          email_description: "सब्सक्राइबर का ईमेल एड्रेस",
          name: "नाम",
          name_description: "सब्सक्राइबर का नाम (वैकल्पिक)",
          leadId: "लीड ID",
          leadId_description: "जुड़ी लीड की ID (वैकल्पिक)",
          userId: "यूज़र ID",
          userId_description: "जुड़े यूज़र की ID (वैकल्पिक)",
        },
      },
    },
    password: {
      reset: {
        confirm: {
          meta: {
            name: "पासवर्ड रीसेट कन्फ़र्मेशन",
            description: "पासवर्ड रीसेट के बाद कन्फ़र्मेशन ईमेल",
          },
          preview: {
            publicName: "पब्लिक नाम",
            publicName_description: "यूज़र का सार्वजनिक नाम",
            userId: "यूज़र ID",
            userId_description: "यूज़र की यूनिक पहचान",
          },
        },
        request: {
          meta: {
            name: "पासवर्ड रीसेट रिक्वेस्ट",
            description: "पासवर्ड रीसेट लिंक वाला ईमेल",
          },
          preview: {
            publicName: "पब्लिक नाम",
            publicName_description: "यूज़र का सार्वजनिक नाम",
            userId: "यूज़र ID",
            userId_description: "यूज़र की यूनिक पहचान",
            passwordResetUrl: "पासवर्ड रीसेट URL",
            passwordResetUrl_description: "पासवर्ड रीसेट करने का URL",
          },
        },
      },
    },
    signup: {
      welcome: {
        meta: {
          name: "यूज़र साइन अप वेलकम",
          description: "नए यूज़र साइन अप के लिए वेलकम ईमेल",
        },
        preview: {
          privateName: "निजी नाम",
          privateName_description: "यूज़र का निजी नाम",
          userId: "यूज़र ID",
          userId_description: "यूज़र की यूनिक पहचान",
          leadId: "लीड ID",
          leadId_description: "जुड़ी लीड की ID",
        },
      },
    },
    users: {
      welcome: {
        meta: {
          name: "यूज़र वेलकम ईमेल",
          description: "नए यूज़र को भेजा जाने वाला वेलकम ईमेल",
        },
        preview: {
          userId: "यूज़र ID",
          userId_description: "यूज़र की यूनिक पहचान",
          email: "ईमेल",
          email_description: "यूज़र का ईमेल एड्रेस",
          privateName: "निजी नाम",
          privateName_description: "यूज़र का निजी नाम",
          publicName: "पब्लिक नाम",
          publicName_description: "यूज़र का सार्वजनिक नाम",
          leadId: "लीड ID",
          leadId_description: "जुड़ी लीड की ID (वैकल्पिक)",
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "सब्सक्रिप्शन सफल",
          description: "सफल सब्सक्रिप्शन का कन्फ़र्मेशन ईमेल",
        },
        preview: {
          privateName: "निजी नाम",
          privateName_description: "यूज़र का निजी नाम",
          userId: "यूज़र ID",
          userId_description: "यूज़र की यूनिक पहचान",
          leadId: "लीड ID",
          leadId_description: "जुड़ी लीड की ID",
          planName: "प्लान का नाम",
          planName_description: "सब्सक्रिप्शन प्लान का नाम",
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "एडमिन: नया यूज़र साइन अप",
          description: "नया यूज़र रजिस्टर होने पर एडमिन को नोटिफ़िकेशन",
        },
        preview: {
          privateName: "निजी नाम",
          publicName: "पब्लिक नाम",
          email: "ईमेल",
          userId: "यूज़र ID",
          subscribeToNewsletter: "न्यूज़लेटर सब्सक्रिप्शन",
        },
      },
      subscription: {
        meta: {
          name: "एडमिन: नया सब्सक्रिप्शन",
          description: "यूज़र के सब्सक्राइब करने पर एडमिन को नोटिफ़िकेशन",
        },
        preview: {
          privateName: "निजी नाम",
          publicName: "पब्लिक नाम",
          email: "ईमेल",
          planName: "प्लान का नाम",
          statusName: "स्टेटस",
        },
      },
      user_create: {
        meta: {
          name: "एडमिन: नया यूज़र बना",
          description: "यूज़र अकाउंट बनने पर एडमिन को नोटिफ़िकेशन",
        },
        preview: {
          privateName: "निजी नाम",
          publicName: "पब्लिक नाम",
          email: "ईमेल",
          userId: "यूज़र ID",
          leadId: "लीड ID",
        },
      },
      contact: {
        meta: {
          name: "एडमिन: कॉन्टैक्ट फ़ॉर्म सबमिशन",
          description: "कॉन्टैक्ट फ़ॉर्म सबमिट होने पर एडमिन को नोटिफ़िकेशन",
        },
        preview: {
          name: "भेजने वाले का नाम",
          email: "भेजने वाले का ईमेल",
          subject: "विषय",
          message: "मैसेज",
          company: "कंपनी",
          userId: "यूज़र ID",
          leadId: "लीड ID",
        },
      },
    },
  },

  // Email Preview System
  preview: {
    render: {
      post: {
        title: "ईमेल प्रीव्यू रेंडर करें",
        titleShort: "प्रीव्यू रेंडर करें",
        description: "प्रीव्यू के लिए ईमेल टेम्पलेट का सर्वर-साइड रेंडरिंग",
        container: {
          title: "ईमेल प्रीव्यू कॉन्फ़िगरेशन",
        },
        success: {
          title: "प्रीव्यू रेंडर हो गया",
          description: "ईमेल प्रीव्यू सफलतापूर्वक रेंडर हो गया",
        },
        fields: {
          templateId: {
            label: "टेम्पलेट ID",
            description: "रेंडर होने वाले ईमेल टेम्पलेट की ID",
          },
          language: {
            label: "भाषा",
            description: "ईमेल रेंडरिंग के लिए भाषा",
          },
          country: {
            label: "देश",
            description: "ईमेल रेंडरिंग के लिए देश",
          },
          props: {
            label: "टेम्पलेट प्रॉप्स",
            description: "ईमेल टेम्पलेट को दी जाने वाली प्रॉपर्टी",
          },
          html: {
            title: "रेंडर किया HTML",
          },
          subject: {
            title: "ईमेल विषय",
          },
          templateVersion: {
            title: "टेम्पलेट वर्शन",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "प्रीव्यू रिक्वेस्ट का डेटा गलत है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "प्रीव्यू रेंडर करते समय नेटवर्क एरर",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "प्रीव्यू रेंडर करने की अनुमति आपके पास नहीं है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "प्रीव्यू रेंडरिंग प्रतिबंधित है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "ईमेल टेम्पलेट नहीं मिला",
          },
          server: {
            title: "सर्वर एरर",
            description: "ईमेल प्रीव्यू नहीं बन पाया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
          conflict: {
            title: "टकराव",
            description: "रेंडर करते समय कॉन्फ़्लिक्ट हुआ",
          },
        },
      },
      title: "ईमेल प्रीव्यू",
      preview: "प्रीव्यू",
      version: "वर्ज़न",
      submit: "प्रीव्यू रेंडर करें",
      submitting: "रेंडर हो रहा है...",
    },
    sendTest: {
      post: {
        title: "टेस्ट ईमेल भेजें",
        titleShort: "टेस्ट ईमेल",
        description: "कस्टम टेम्पलेट डेटा के साथ टेस्ट ईमेल भेजें",
        container: {
          title: "टेस्ट ईमेल कॉन्फ़िगरेशन",
        },
        success: {
          title: "टेस्ट ईमेल भेजा गया",
          description: "टेस्ट ईमेल सफलतापूर्वक भेजा गया",
        },
        fields: {
          templateId: {
            label: "टेम्पलेट ID",
            description: "भेजे जाने वाले ईमेल टेम्पलेट की ID",
          },
          recipientEmail: {
            label: "प्राप्तकर्ता का ईमेल",
            description: "जिस ईमेल एड्रेस पर टेस्ट भेजना है",
          },
          language: {
            label: "भाषा",
            description: "ईमेल रेंडरिंग के लिए भाषा",
          },
          country: {
            label: "देश",
            description: "ईमेल रेंडरिंग के लिए देश",
          },
          props: {
            label: "टेम्पलेट प्रॉप्स",
            description: "ईमेल टेम्पलेट को दी जाने वाली प्रॉपर्टी",
          },
          success: {
            title: "सफल",
          },
          message: {
            title: "रिज़ल्ट मैसेज",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "टेस्ट ईमेल रिक्वेस्ट का डेटा गलत है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "टेस्ट ईमेल भेजते समय नेटवर्क एरर",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "टेस्ट ईमेल भेजने की अनुमति आपके पास नहीं है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "टेस्ट ईमेल भेजना प्रतिबंधित है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "ईमेल टेम्पलेट नहीं मिला",
          },
          server: {
            title: "सर्वर एरर",
            description: "टेस्ट ईमेल भेजना फ़ेल हुआ",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
          conflict: {
            title: "टकराव",
            description: "भेजते समय कॉन्फ़्लिक्ट हुआ",
          },
        },
      },
      error: {
        templateNotFound: "ईमेल टेम्पलेट {{templateId}} नहीं मिला",
        invalidProps: "टेम्पलेट प्रॉप्स गलत हैं: {{error}}",
        sendFailed: "टेस्ट ईमेल भेजना फ़ेल हुआ: {{error}}",
      },
      success: "टेस्ट ईमेल भेज दिया गया",
      successDetail: "टेस्ट ईमेल {{email}} को भेज दिया गया",
      title: "टेस्ट ईमेल भेजें",
      failed: "टेस्ट ईमेल भेजना फ़ेल हुआ",
      submit: "टेस्ट ईमेल भेजें",
      submitting: "भेजा जा रहा है...",
    },
  },
  messaging: {
    category: "मैसेजिंग",
    tag: "मैसेजिंग",
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
        twilio: "Twilio",
        awsSns: "AWS SNS",
        messagebird: "MessageBird",
        http: "HTTP",
        whatsappBusiness: "WhatsApp Business",
        telegramBot: "Telegram Bot",
      },
      accountStatus: {
        active: "सक्रिय",
        inactive: "निष्क्रिय",
        error: "एरर",
        testing: "टेस्टिंग",
      },
    },
    send: {
      errors: {
        accountNotFound: "मैसेजिंग अकाउंट {{accountId}} नहीं मिला",
        sendFailed: "मैसेज भेजा नहीं जा सका",
        unexpected: "मैसेज भेजते समय अनपेक्षित एरर: {{error}}",
      },
    },
  },
  providers: {
    errors: {
      smtpSendFailed: "SMTP से भेजना फ़ेल हुआ",
      smtpAccountNotFound: "IMAP अकाउंट नहीं मिला",
      smtpListInboxFailed: "इनबॉक्स की सूची नहीं मिली",
      smtpListFoldersFailed: "फ़ोल्डर लिस्ट नहीं हो सके",
      smtpMoveMessageFailed: "मैसेज मूव नहीं हो सका",
      smtpMarkReadFailed: "मैसेज मार्क नहीं हो सका",
      resendKeyNotConfigured: "Resend API की कॉन्फ़िगर नहीं है",
      resendSendFailed: "Resend से भेजना फ़ेल हुआ",
      resendProviderError: "Resend प्रोवाइडर एरर",
      resendNoInbox: "Resend इनबॉक्स सपोर्ट नहीं करता",
      resendNoFolders: "Resend फ़ोल्डर सपोर्ट नहीं करता",
      smsSendFailed: "SMS भेजना फ़ेल हुआ",
      whatsappSendFailed: "WhatsApp से भेजना फ़ेल हुआ",
      telegramSendFailed: "Telegram से भेजना फ़ेल हुआ",
      accountNotFound: "मैसेजिंग अकाउंट नहीं मिला",
      notSupported: "यह प्रोवाइडर इस ऑपरेशन को सपोर्ट नहीं करता",
    },
  },
};
