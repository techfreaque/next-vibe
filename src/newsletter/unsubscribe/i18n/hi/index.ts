import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "न्यूज़लेटर",
  tags: {
    newsletter: "न्यूज़लेटर",
  },
  emailPlaceholder: "अपना ईमेल डालें",
  subscription: {
    unsubscribe: {
      title: "अनसब्सक्राइब करें",
      confirmButton: "अनसब्सक्राइब कन्फ़र्म करें",
      success: "आप अनसब्सक्राइब हो गए हैं",
      error: "अनसब्सक्राइब नहीं हो पाया",
    },
  },
  unsubscribe: {
    page: {
      title: "अनसब्सक्राइब करें",
      description: "अपना पता लिखें, बटन दबाएँ, हो गया। कोई सवाल-जवाब नहीं।",
      subtitle: "अपना न्यूज़लेटर सब्सक्रिप्शन मैनेज करें",
      emailProvided: {
        title: "अनसब्सक्राइब कन्फ़र्म करें",
        description: "इस पते पर हमारा न्यूज़लेटर आना बंद हो जाएगा। बस एक क्लिक।",
      },
      unsubscribeButton: "अनसब्सक्राइब करें",
      unsubscribing: "अनसब्सक्राइब हो रहा है...",
      status: {
        subscribed: "इस पते पर हमारा न्यूज़लेटर आता है।",
        notSubscribed: "यह पता हमारी लिस्ट में नहीं है।",
      },
      subscribeText: "मन बदल गया?",
      subscribeLink: "फिर से सब्सक्राइब करें",
      info: {
        title: "आगे क्या होगा",
        description: "अनसब्सक्राइब करने के बारे में ये जान लें:",
        immediate: {
          title: "तुरंत।",
          description: "हमारे न्यूज़लेटर ईमेल तुरंत आने बंद हो जाएँगे।",
        },
        resubscribe: {
          title: "वापस भी हो सकता है।",
          description: "मन बदले तो आप कभी भी फिर से सब्सक्राइब कर सकते हैं।",
        },
      },
      alternatives: {
        title: "जाने से पहले",
        description: "ये विकल्प भी देख लें:",
        subscribe: "इसकी जगह ईमेल कम करवाएँ",
        contact: "बताइए क्या ठीक करें",
      },
    },
  },
  email: {
    label: "ईमेल पता",
    description: "वह ईमेल पता जिसे न्यूज़लेटर से हटाना है",
    placeholder: "user@example.com",
    unsubscribe: {
      title: "न्यूज़लेटर से अनसब्सक्राइब करें",
      preview: "आप हमारे न्यूज़लेटर से अनसब्सक्राइब हो गए हैं",
      greeting: "नमस्ते",
      confirmation: "हमने {{email}} को अपने न्यूज़लेटर से हटा दिया है",
      resubscribe_info:
        "मन बदल जाए तो हमारी वेबसाइट पर जाकर कभी भी फिर से सब्सक्राइब कर सकते हैं",
      resubscribe_button: "फिर से सब्सक्राइब करें",
      support_message: "कोई सवाल हो तो हमारी सपोर्ट टीम से संपर्क करें",
      subject: "न्यूज़लेटर अनसब्सक्राइब की पुष्टि",
      admin_unsubscribe_notification: {
        title: "न्यूज़लेटर अनसब्सक्राइब नोटिफ़िकेशन",
        preview: "एक यूज़र ने न्यूज़लेटर से अनसब्सक्राइब किया है",
        message: "एक यूज़र ने न्यूज़लेटर से अनसब्सक्राइब किया है",
        email: "ईमेल",
        date: "तारीख",
        view_dashboard: "डैशबोर्ड देखें",
        subject: "न्यूज़लेटर अनसब्सक्राइब: एडमिन नोटिफ़िकेशन",
      },
    },
  },
  response: {
    success: "न्यूज़लेटर से अनसब्सक्राइब हो गया",
    message: "सफलता मैसेज",
  },
  errors: {
    email_generation_failed: "ईमेल नहीं बन पाया",
    internal: {
      title: "अंदरूनी एरर",
      description: "आपकी अनसब्सक्राइब रिक्वेस्ट प्रोसेस करते समय एरर आया",
      detail: "अनसब्सक्राइब फ़ेल हुआ: {{error}}",
    },
  },
  post: {
    title: "न्यूज़लेटर अनसब्सक्राइब",
    titleShort: "अनसब्सक्राइब करें",
    description: "न्यूज़लेटर अपडेट बंद करें",
    form: {
      title: "न्यूज़लेटर से अनसब्सक्राइब करें",
      description: "हमारे न्यूज़लेटर से अनसब्सक्राइब करने के लिए अपना ईमेल पता डालें",
    },
    response: {
      title: "अनसब्सक्राइब का जवाब",
      description: "न्यूज़लेटर अनसब्सक्राइब की पुष्टि",
    },
    errors: {
      unauthorized: {
        title: "अनुमति नहीं",
        description: "लॉग इन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "ईमेल पता गलत है",
      },
      internal: {
        title: "अंदरूनी एरर",
        description: "आपकी अनसब्सक्राइब रिक्वेस्ट प्रोसेस करते समय एरर आया",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस की अनुमति नहीं है",
      },
    },
    success: {
      title: "अनसब्सक्राइब हो गया",
      description: "आपको हमारे न्यूज़लेटर से हटा दिया गया है",
    },
  },
  oneClick: {
    tag: "वन-क्लिक अनसब्सक्राइब",
    post: {
      title: "वन-क्लिक अनसब्सक्राइब",
      titleShort: "अनसब्सक्राइब करें",
      description:
        "ईमेल हेडर में दिए साइन किए हुए वन-क्लिक लिंक से अनसब्सक्राइब करें (RFC 8058)",
      container: {
        title: "वन-क्लिक अनसब्सक्राइब",
        description:
          "मेलबॉक्स प्रोवाइडर इसे कॉल करते हैं। साइन किया हुआ टोकन अनसब्सक्राइब की अनुमति देता है।",
      },
      token: {
        label: "टोकन",
        description: "ईमेल से मिला साइन किया हुआ अनसब्सक्राइब टोकन",
      },
      errors: {
        invalidToken: {
          title: "गलत लिंक",
          description: "यह अनसब्सक्राइब लिंक सही नहीं है।",
        },
        server: {
          title: "सर्वर एरर",
          description: "अनसब्सक्राइब नहीं हो पाया। फिर कोशिश करें।",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "टोकन का फ़ॉर्मेट गलत है",
        },
      },
      success: {
        title: "अनसब्सक्राइब हो गया",
        description: "आप लिस्ट से हट गए हैं।",
      },
    },
  },
  sync: {
    failed: "न्यूज़लेटर अनसब्सक्राइब सिंक फ़ेल हुआ",
    error: "न्यूज़लेटर अनसब्सक्राइब सिंक एरर",
    tag: "न्यूज़लेटर सिंक",
    post: {
      title: "न्यूज़लेटर अनसब्सक्राइब सिंक",
      description: "न्यूज़लेटर अनसब्सक्राइब के लिए लीड स्टेटस सिंक करें",
      container: {
        title: "अनसब्सक्राइब सिंक सेटिंग्स",
        description: "अनसब्सक्राइब सिंक के पैरामीटर सेट करें",
      },
      fields: {
        batchSize: {
          label: "बैच साइज़",
          description: "हर बैच में कितने रिकॉर्ड प्रोसेस हों",
        },
        dryRun: {
          label: "ड्राई रन",
          description: "बिना कोई बदलाव किए चलाएँ",
        },
      },
      response: {
        leadsProcessed: "प्रोसेस हुई लीड",
        leadsUpdated: "अपडेट हुई लीड",
        executionTimeMs: "चलने का समय (ms)",
      },
      errors: {
        unauthorized: {
          title: "अनुमति नहीं",
          description: "लॉग इन ज़रूरी है",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस की अनुमति नहीं है",
        },
        server: {
          title: "सर्वर एरर",
          description: "अनसब्सक्राइब सिंक करते समय एरर आया",
        },
        unknown: {
          title: "अनजान एरर",
          description: "एक अनजान एरर आया",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
      },
      success: {
        title: "सिंक पूरा हुआ",
        description: "न्यूज़लेटर अनसब्सक्राइब सिंक पूरा हुआ",
      },
    },
  },
  emailTemplates: {
    unsubscribe: {
      name: "न्यूज़लेटर अनसब्सक्राइब ईमेल",
      description: "न्यूज़लेटर से अनसब्सक्राइब करने वाले यूज़र को भेजा जाने वाला पुष्टि ईमेल",
      category: "न्यूज़लेटर",
      preview: {
        email: {
          label: "ईमेल पता",
          description: "वह ईमेल पता जिसे अनसब्सक्राइब किया जा रहा है",
        },
      },
    },
  },
  sms: {
    confirmation: {
      message:
        "आप {{appName}} न्यूज़लेटर से अनसब्सक्राइब हो गए हैं। गलती से हुआ हो तो हमारी वेबसाइट पर जाकर फिर से सब्सक्राइब करें।",
    },
    admin_notification: {
      message: "न्यूज़लेटर अनसब्सक्राइब: {{email}} ने न्यूज़लेटर से अनसब्सक्राइब किया।",
    },
    errors: {
      confirmation_failed: {
        title: "SMS पुष्टि फ़ेल हुई",
        description: "अनसब्सक्राइब पुष्टि SMS नहीं भेजा जा सका",
      },
      admin_notification_failed: {
        title: "एडमिन SMS नोटिफ़िकेशन फ़ेल हुआ",
        description: "एडमिन नोटिफ़िकेशन SMS नहीं भेजा जा सका",
      },
    },
  },
};
