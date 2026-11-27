import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
        get: { errors: { server: { title: "मैसेज लिस्ट करते समय सर्वर एरर" } } },
      },
    },
  },
  sync: {
    category: "IMAP क्लाइंट",

    title: "IMAP सिंक",
    description: "IMAP सिंक्रोनाइज़ेशन सर्विस",
    container: {
      title: "IMAP सिंक कॉन्फ़िगरेशन",
      description: "IMAP सिंक्रोनाइज़ेशन के पैरामीटर कॉन्फ़िगर करें",
    },
    accountIds: {
      label: "अकाउंट ID",
      description: "सिंक करने वाले IMAP अकाउंट ID",
      placeholder: "अकाउंट ID कॉमा से अलग करके डालें",
    },
    force: {
      label: "ज़बरदस्ती सिंक",
      description: "हाल में सिंक हुआ हो तब भी सिंक्रोनाइज़ेशन करें",
    },
    dryRun: {
      label: "ड्राई रन",
      description: "बदलाव किए बिना टेस्ट रन करें",
    },
    maxMessages: {
      label: "ज़्यादा से ज़्यादा मैसेज",
      description: "हर फ़ोल्डर के लिए सिंक होने वाले मैसेज की अधिकतम संख्या",
      placeholder: "मैसेज की अधिकतम संख्या डालें",
    },
    post: {
      title: "सिंक",
      description: "सिंक endpoint",
      form: {
        title: "सिंक कॉन्फ़िगरेशन",
        description: "सिंक पैरामीटर कॉन्फ़िगर करें",
      },
      response: {
        title: "रिस्पॉन्स",
        description: "सिंक रिस्पॉन्स डेटा",
        result: {
          title: "सिंक के नतीजे",
          description: "सिंक्रोनाइज़ेशन के विस्तृत नतीजे",
          accountsProcessed: "प्रोसेस हुए अकाउंट",
          foldersProcessed: "प्रोसेस हुए फ़ोल्डर",
          messagesProcessed: "प्रोसेस हुए मैसेज",
          messagesAdded: "जोड़े गए मैसेज",
          messagesUpdated: "अपडेट हुए मैसेज",
          messagesDeleted: "हटाए गए मैसेज",
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
          description: "लॉगिन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "इंटरनल सर्वर एरर आया",
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
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
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
      messagesAdded: "जोड़े गए मैसेज",
      messagesUpdated: "अपडेट हुए मैसेज",
      messagesDeleted: "हटाए गए मैसेज",
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
      failed: "कनेक्शन फ़ेल हुआ",
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
        failed: "अकाउंट सिंक फ़ेल हुआ: {{error}}",
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
        account_failed: "अकाउंट सिंक फ़ेल हुआ: {{error}}",
        folder_sync_failed: "फ़ोल्डर सिंक फ़ेल हुआ: {{error}}",
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
      synced: "सिंक हो गया",
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
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapAuthMethod: {
      plain: "Plain",
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
      connected: "कनेक्टेड",
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
      recipientEmail: "पाने वाले का ईमेल",
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
};
