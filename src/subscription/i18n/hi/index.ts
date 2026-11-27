import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  checkout: {
    title: "सब्सक्रिप्शन चेकआउट बनाएँ",
    description: "सब्सक्रिप्शन के लिए Stripe चेकआउट सेशन बनाएँ",
    category: "सब्सक्रिप्शन",

    tags: {
      subscription: "subscription",
      checkout: "checkout",
      stripe: "stripe",
    },

    form: {
      title: "चेकआउट कॉन्फ़िगरेशन",
      description: "चेकआउट सेशन के पैरामीटर सेट करें",
      fields: {
        planId: {
          label: "सब्सक्रिप्शन प्लान",
          description: "सब्सक्रिप्शन प्लान चुनें",
          placeholder: "प्लान चुनें",
        },
        billingInterval: {
          label: "बिलिंग अवधि",
          description: "बिलिंग की आवृत्ति चुनें",
          placeholder: "बिलिंग अवधि चुनें",
        },
        provider: {
          label: "पेमेंट प्रोवाइडर",
          description: "चुनें कि आप कैसे पेमेंट करना चाहते हैं",
          placeholder: "पेमेंट प्रोवाइडर चुनें",
        },
        metadata: {
          label: "मेटाडेटा",
          description: "चेकआउट सेशन के लिए अतिरिक्त मेटाडेटा",
          placeholder: "मेटाडेटा JSON में लिखें",
        },
      },
    },

    response: {
      success: "चेकआउट सेशन बन गया",
      sessionId: "Stripe सेशन ID",
      checkoutUrl: "चेकआउट URL",
      message: "स्टेटस मैसेज",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन एरर",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
    },

    success: {
      title: "सफल",
      description: "चेकआउट सेशन बन गया",
    },

    post: {
      title: "चेकआउट सेशन बनाएँ",
      description: "नया सब्सक्रिप्शन चेकआउट सेशन बनाएँ",
      form: {
        title: "चेकआउट सेशन कॉन्फ़िगरेशन",
        description: "चेकआउट सेशन के पैरामीटर सेट करें",
      },
      response: {
        title: "चेकआउट रिस्पॉन्स",
        description: "चेकआउट सेशन का रिस्पॉन्स डेटा",
      },
      errors: {
        alreadySubscribed: {
          title: "पहले से सब्सक्राइब्ड",
          description: "आपके पास पहले से एक एक्टिव सब्सक्रिप्शन है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "चेकआउट के पैरामीटर ग़लत हैं",
          reason: {
            enterpriseCustomPricing: "ENTERPRISE प्लान के लिए कस्टम प्राइसिंग चाहिए",
          },
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क कनेक्शन एरर",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "प्रतिबंधित",
          description: "एक्सेस प्रतिबंधित है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "चेकआउट सेशन नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर में आंतरिक एरर हुआ",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर हुआ",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा में टकराव हुआ",
        },
      },
      success: {
        title: "सफल",
        description: "चेकआउट सेशन बन गया",
      },
    },

    error: "चेकआउट के दौरान एरर हुआ",

    plans: {
      starter: {
        title: "Starter",
      },
    },

    billing: {
      monthly: "मासिक",
      yearly: "सालाना",
    },
  },

  category: "बिलिंग",

  tags: {
    subscription: "subscription",
    billing: "billing",
    get: "get",
    create: "create",
    update: "update",
    cancel: "cancel",
  },

  plans: {
    starter: {
      title: "Starter प्लान",
    },
    professional: {
      title: "Professional प्लान",
    },
    premium: {
      title: "Premium प्लान",
    },
    enterprise: {
      title: "Enterprise प्लान",
    },
  },

  billing: {
    monthly: "मासिक",
    yearly: "सालाना",
  },

  get: {
    title: "सब्सक्रिप्शन पाएँ",
    titleShort: "मेरा सब्सक्रिप्शन",
    description: "मौजूदा सब्सक्रिप्शन की जानकारी पाएँ",
    form: {
      title: "सब्सक्रिप्शन की जानकारी",
      description: "अपने मौजूदा सब्सक्रिप्शन की जानकारी देखें",
    },
  },

  post: {
    title: "सब्सक्रिप्शन बनाएँ",
    titleShort: "सेशन बनाएँ",
    description: "नया सब्सक्रिप्शन बनाएँ",
    form: {
      title: "सब्सक्रिप्शन बनाना",
      description: "चुने हुए प्लान के साथ नया सब्सक्रिप्शन बनाएँ",
    },
    errors: {
      validation: {
        title: "अमान्य इनपुट",
        description: "अपने सब्सक्रिप्शन की जानकारी जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "कनेक्शन एरर",
        description: "कनेक्ट नहीं हो सका। अपना इंटरनेट कनेक्शन जाँचें",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "सब्सक्रिप्शन बनाने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको सब्सक्रिप्शन बनाने की अनुमति नहीं है",
      },
      notFound: {
        title: "प्लान नहीं मिला",
        description: "आपका चुना हुआ सब्सक्रिप्शन प्लान नहीं मिला",
      },
      server: {
        title: "कुछ गड़बड़ हुई",
        description: "हम आपका सब्सक्रिप्शन नहीं बना सके। दोबारा कोशिश करें",
      },
      unknown: {
        title: "अनपेक्षित एरर",
        description: "कुछ अनपेक्षित हुआ। दोबारा कोशिश करें",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "सब्सक्रिप्शन मौजूद है",
        description: "आपके पास पहले से एक एक्टिव सब्सक्रिप्शन है",
      },
    },
    success: {
      title: "सब्सक्रिप्शन बन गया",
      description: "आपका सब्सक्रिप्शन सफलतापूर्वक एक्टिवेट हो गया है",
    },
  },

  put: {
    title: "सब्सक्रिप्शन अपडेट करें",
    titleShort: "सब्सक्रिप्शन अपडेट करें",
    description: "मौजूदा सब्सक्रिप्शन अपडेट करें",
    form: {
      title: "सब्सक्रिप्शन अपडेट",
      description: "अपना सब्सक्रिप्शन प्लान या बिलिंग अवधि बदलें",
    },
    errors: {
      validation: {
        title: "अमान्य अपडेट",
        description: "अपने बदलाव जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "कनेक्शन एरर",
        description: "आपके बदलाव सेव नहीं हो सके। दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "सब्सक्रिप्शन अपडेट करने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको इस सब्सक्रिप्शन को अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "सब्सक्रिप्शन नहीं मिला",
        description: "अपडेट करने के लिए आपका सब्सक्रिप्शन नहीं मिला",
      },
      server: {
        title: "अपडेट विफल रहा",
        description: "हम आपके बदलाव सेव नहीं कर सके। दोबारा कोशिश करें",
      },
      unknown: {
        title: "अनपेक्षित एरर",
        description: "कुछ अनपेक्षित हुआ। दोबारा कोशिश करें",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "अपडेट में टकराव",
        description: "आपका सब्सक्रिप्शन बदल गया है। रिफ़्रेश करके दोबारा कोशिश करें",
      },
    },
    submit: {
      label: "सब्सक्रिप्शन अपडेट करें",
      loading: "अपडेट हो रहा है...",
    },
    success: {
      title: "सब्सक्रिप्शन अपडेट हो गया",
      description: "आपका सब्सक्रिप्शन सफलतापूर्वक अपडेट हो गया है",
    },
  },

  delete: {
    title: "सब्सक्रिप्शन रद्द करें",
    titleShort: "सब्सक्रिप्शन रद्द करें",
    description: "अपना सब्सक्रिप्शन रद्द करें",
    warning: "सब्सक्रिप्शन रद्द करने पर बिलिंग अवधि के अंत में आपका एक्सेस ख़त्म हो जाएगा।",
    form: {
      title: "सब्सक्रिप्शन रद्द करना",
      description: "वैकल्पिक सेटिंग्स के साथ अपना सब्सक्रिप्शन रद्द करें",
    },
    errors: {
      validation: {
        title: "अमान्य रिक्वेस्ट",
        description: "अपने रद्दीकरण की जानकारी जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "कनेक्शन एरर",
        description: "रद्दीकरण प्रोसेस नहीं हो सका। दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "सब्सक्रिप्शन रद्द करने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको इस सब्सक्रिप्शन को रद्द करने की अनुमति नहीं है",
      },
      notFound: {
        title: "सब्सक्रिप्शन नहीं मिला",
        description: "रद्द करने के लिए आपका सब्सक्रिप्शन नहीं मिला",
      },
      server: {
        title: "रद्दीकरण विफल रहा",
        description: "हम आपका सब्सक्रिप्शन रद्द नहीं कर सके। दोबारा कोशिश करें",
      },
      unknown: {
        title: "अनपेक्षित एरर",
        description: "कुछ अनपेक्षित हुआ। दोबारा कोशिश करें",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "रद्दीकरण में टकराव",
        description:
          "आपके सब्सक्रिप्शन का स्टेटस बदल गया है। रिफ़्रेश करके दोबारा कोशिश करें",
      },
    },
    submit: {
      label: "सब्सक्रिप्शन रद्द करें",
      loading: "रद्द हो रहा है...",
    },
    success: {
      title: "सब्सक्रिप्शन रद्द हो गया",
      description: "आपका सब्सक्रिप्शन सफलतापूर्वक रद्द हो गया है",
    },
  },

  form: {
    fields: {
      planId: {
        label: "सब्सक्रिप्शन प्लान",
        description: "अपना सब्सक्रिप्शन प्लान चुनें",
        placeholder: "प्लान चुनें",
      },
      billingInterval: {
        label: "बिलिंग अवधि",
        description: "बिलिंग की आवृत्ति चुनें",
        placeholder: "बिलिंग अवधि चुनें",
      },
      provider: {
        label: "पेमेंट प्रोवाइडर",
        description: "अपना पेमेंट प्रोवाइडर चुनें",
      },
      payCurrency: {
        label: "क्रिप्टो कॉइन",
        description: "जिस कॉइन से पेमेंट करना है (सिर्फ़ क्रिप्टो चेकआउट)",
      },
      catalogProductId: {
        label: "कैटलॉग प्रोडक्ट",
        description: "इस सब्सक्रिप्शन के लिए कैटलॉग प्रोडक्ट से जोड़ें",
      },
      cancelAtPeriodEnd: {
        label: "अवधि के अंत में रद्द करें",
        description: "मौजूदा अवधि के अंत में सब्सक्रिप्शन रद्द करें",
      },
      reason: {
        label: "रद्द करने का कारण",
        description: "कृपया रद्द करने का कारण बताएँ",
        placeholder: "रद्द करने का कारण लिखें",
      },
    },
  },

  response: {
    checkoutUrl: "चेकआउट URL",
    sessionId: "सेशन ID",
    hasSubscription: "सब्सक्रिप्शन है",
    id: "सब्सक्रिप्शन ID",
    userId: "यूज़र ID",
    status: "सब्सक्रिप्शन स्टेटस",
    planId: "प्लान ID",
    billingInterval: "बिलिंग अवधि",
    currentPeriodStart: "मौजूदा अवधि की शुरुआत",
    currentPeriodEnd: "मौजूदा अवधि का अंत",
    cancelAtPeriodEnd: "अवधि के अंत में रद्द करें",
    cancelAt: "रद्द होने की तारीख़",
    canceledAt: "रद्द किया गया",
    endedAt: "समाप्त हुआ",
    gracePeriodEndsAt: "ग्रेस पीरियड खत्म होने की तारीख",
    retryPaymentUrl: "पेमेंट दोबारा करने का लिंक",
    cardCountry: "कार्ड का देश",
    recentCardAuthFailure: "हाल में कार्ड ऑथेंटिकेशन फेल हुआ",
    checkoutProviders: "उपलब्ध पेमेंट तरीके",
    nowPaymentsAcceptsCards: "क्रिप्टो चेकआउट में कार्ड चलता है",
    cryptoCoins: "क्रिप्टो कॉइन और न्यूनतम राशि",
    trialStart: "ट्रायल शुरू होने की तारीख़",
    trialEnd: "ट्रायल ख़त्म होने की तारीख़",
    success: "ऑपरेशन सफल रहा",
    message: "स्टेटस मैसेज",
    subscriptionId: "सब्सक्रिप्शन ID",
    stripeCustomerId: "Stripe कस्टमर ID",
    updatedFields: "अपडेट किए गए फ़ील्ड",
    endsAt: "समाप्ति तिथि",
    createdAt: "बनाने का समय",
    updatedAt: "अपडेट का समय",
    provider: "पेमेंट प्रोवाइडर",
    providerSubscriptionId: "प्रोवाइडर सब्सक्रिप्शन ID",
  },

  errors: {
    tierChange: {
      notActive: "आपका प्लान एक्टिव नहीं है। इसके बजाय नया प्लान शुरू करें।",
      cryptoNotSupported:
        "क्रिप्टो प्लान अवधि के बीच में नहीं बदले जा सकते। यह प्लान ख़त्म होने पर नया प्लान चुनें।",
      paymentRequired:
        "आपका बैंक अपग्रेड के लिए कन्फ़र्मेशन माँग रहा है। पूरा करने के लिए इनवॉइस खोलें: {{url}}",
      failed: "प्लान बदलना विफल रहा: {{error}}",
      upgraded:
        "{{plan}} पर अपग्रेड हो गया। इस अवधि के लिए {{credits}} एक्स्ट्रा क्रेडिट जुड़ गए।",
      changed: "{{plan}} पर स्विच हो गया।",
      downgraded:
        "अगले रिन्यूअल पर {{plan}} पर स्विच होगा। तब तक आपके मौजूदा क्रेडिट बने रहेंगे।",
      unchanged: "आप पहले से इसी प्लान पर हैं।",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "सब्सक्रिप्शन के पैरामीटर ग़लत हैं",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क कनेक्शन एरर",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "एक्सेस प्रतिबंधित है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "सब्सक्रिप्शन नहीं मिला",
    },
    not_found: "सब्सक्रिप्शन नहीं मिला",
    not_found_description: "माँगा गया सब्सक्रिप्शन नहीं मिला",
    server: {
      title: "सर्वर एरर",
      description: "सर्वर में आंतरिक एरर हुआ",
    },
    serverError: {
      title: "सर्वर एरर",
      description: "सर्वर में आंतरिक एरर हुआ",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    use_checkout_flow: "सब्सक्रिप्शन खरीदने के लिए कृपया चेकआउट फ़्लो इस्तेमाल करें",
    use_checkout_flow_description:
      "सब्सक्रिप्शन सीधे नहीं बनाया जा सकता। कृपया चेकआउट प्रोसेस इस्तेमाल करें।",
    conflict: {
      title: "टकराव",
      description: "डेटा में टकराव हुआ",
    },
    sync_failed: "सब्सक्रिप्शन को डेटाबेस से सिंक नहीं किया जा सका",
    database_error: "डेटाबेस एरर हुआ: {{error}}",
    create_crashed: "सब्सक्रिप्शन बनाना विफल रहा",
    cancel_failed: "सब्सक्रिप्शन रद्द नहीं हो सका: {{error}}",
    user_not_found: "यूज़र नहीं मिला",
    stripe_customer_creation_failed: "Stripe कस्टमर नहीं बन सका",
    not_implemented_on_native:
      "नेटिव प्लेटफ़ॉर्म पर {{method}} लागू नहीं है। इस ऑपरेशन के लिए वेब वर्ज़न इस्तेमाल करें।",
    no_provider_id: "कोई पेमेंट प्रोवाइडर ID नहीं मिली",
  },

  sync: {
    failed: "सब्सक्रिप्शन सिंक नहीं हो सका: {{error}}",
    stripe_error: "Stripe सिंक एरर: {{error}}",
    success: "सब्सक्रिप्शन सिंक हो गया",
  },

  cancel: {
    success: "सब्सक्रिप्शन रद्द हो गया",
  },

  success: {
    title: "सफल",
    description: "ऑपरेशन सफल रहा",
  },

  status: {
    incomplete: "अधूरा",
    incomplete_expired: "अधूरा और एक्सपायर",
    trialing: "ट्रायल पर",
    active: "एक्टिव",
    pastDue: "बकाया",
    canceled: "रद्द",
    unpaid: "अनपेड",
    paused: "रुका हुआ",
  },

  email: {
    success: {
      headline: "आप अंदर हैं। न फ़िल्टर, न लेक्चर।",
      subject: "आपका {{appName}} सब्सक्रिप्शन एक्टिव है",
      previewText:
        "{{privateName}}, आप लाइव हैं। {{subscriptionCredits}} क्रेडिट/माह, {{modelCount}} मॉडल, कोई पाबंदी नहीं।",
      activeBadge: "एक्टिव",
      greeting: "हैलो {{privateName}},",
      intro:
        "आपका {{appName}} सब्सक्रिप्शन कन्फ़र्म हो गया है और तैयार है। हर महीने सभी मॉडल्स पर आपके पास {{subscriptionCredits}} क्रेडिट हैं। न रोज़ की सीमा, न कंटेंट फ़िल्टर, न सफ़ाई देने की ज़रूरत।",
      models: {
        title: "{{modelCount}} मॉडल, 3 कैटेगरी",
        mainstream: "मेनस्ट्रीम",
        open: "ओपन सोर्स",
        uncensored: "अनसेंसर्ड",
      },
      included: {
        title: "हर महीने आपको क्या मिलता है:",
        credits: "हर महीने {{subscriptionCredits}} क्रेडिट (अपने आप रिन्यू)",
        models: "सभी {{modelCount}} AI मॉडल्स का एक्सेस",
        nolimits: "कोई दैनिक सीमा नहीं। अपने क्रेडिट जब चाहें खर्च करें",
        uncensored: "बिना कंटेंट फ़िल्टर वाले अनसेंसर्ड मॉडल",
        packs: "कभी एक्सपायर न होने वाले एक्स्ट्रा क्रेडिट पैक खरीदें",
        cancel: "कभी भी रद्द करें, कोई सवाल नहीं",
      },
      cta: "अभी चैट शुरू करें",
      packs: {
        title: "और क्रेडिट चाहिए?",
        description:
          "प्लान रिन्यू होने से पहले क्रेडिट कम पड़ रहे हैं? कभी भी टॉप अप करें: {{packCredits}} क्रेडिट के लिए {{packPrice}}। पैक कभी एक्सपायर नहीं होते और आपके मासिक क्रेडिट के ऊपर जुड़ते हैं।",
        cta: "क्रेडिट पैक खरीदें",
      },
      manage: "अपना सब्सक्रिप्शन कभी भी मैनेज या रद्द करें:",
      manageLink: "आपकी अकाउंट सेटिंग्स",
      signoff: "चैट मुबारक,\n{{appName}} टीम",
    },
    admin_notification: {
      title: "नया सब्सक्रिप्शन",
      subject: "नया सब्सक्रिप्शन: {{planName}}",
      preview: "नया सब्सक्रिप्शन: {{userName}} ने {{planName}} लिया",
      message: "एक नए यूज़र ने {{appName}} सब्सक्राइब किया है।",
      details: "सब्सक्रिप्शन की जानकारी",
      user_name: "यूज़र का नाम",
      user_email: "यूज़र का ईमेल",
      plan: "प्लान",
      status: "स्टेटस",
      contact_user: "यूज़र से संपर्क करें",
      footer: "यह {{appName}} की ऑटोमैटिक सूचना है",
    },
  },

  emailTemplates: {
    success: {
      name: "सब्सक्रिप्शन सफलता ईमेल",
      description: "यूज़र के सब्सक्रिप्शन एक्टिवेट करने पर भेजा जाने वाला कन्फ़र्मेशन ईमेल",
      category: "subscription",
      preview: {
        privateName: {
          label: "यूज़र का नाम",
          description: "यूज़र का डिस्प्ले नाम",
        },
        userId: {
          label: "यूज़र ID",
          description: "यूज़र का यूनिक आइडेंटिफ़ायर",
        },
        leadId: {
          label: "लीड ID",
          description: "जुड़ी हुई लीड की पहचान",
        },
        planName: {
          label: "प्लान का नाम",
          description: "सब्सक्रिप्शन प्लान का नाम",
        },
      },
    },
    adminNotification: {
      name: "एडमिन सब्सक्रिप्शन सूचना",
      description: "यूज़र के सब्सक्राइब करने पर एडमिन को भेजी जाने वाली आंतरिक सूचना",
      category: "admin",
      preview: {
        privateName: {
          label: "यूज़र का नाम",
        },
        publicName: {
          label: "पब्लिक नाम",
        },
        email: {
          label: "यूज़र का ईमेल",
        },
        planName: {
          label: "प्लान का नाम",
        },
        statusName: {
          label: "सब्सक्रिप्शन स्टेटस",
        },
      },
    },
  },

  widget: {
    back: "वापस",
    confirm: {
      title: "सब्सक्रिप्शन रद्द करना चाहते हैं?",
      description:
        "इससे बिलिंग अवधि के अंत में आपका एक्सेस ख़त्म हो जाएगा। इसे वापस नहीं किया जा सकता।",
      cancel: "सब्सक्रिप्शन रखें",
      proceed: "हाँ, रद्द करें",
    },
  },

  title: "आपका सब्सक्रिप्शन",
  description: "अपना सब्सक्रिप्शन और बिलिंग मैनेज करें",
  notAvailable: "लागू नहीं",
  canceledOn: "रद्द करने की तारीख़",
  endedOn: "समाप्त होने की तारीख़",
  billingInterval: "बिलिंग अवधि",
  currentPeriodStart: "मौजूदा अवधि की शुरुआत",
  endsOn: "समाप्ति तिथि",
  nextBillingDate: "अगली बिलिंग तिथि",
  cancellation: {
    title: "सब्सक्रिप्शन रद्द होना तय है",
    description:
      "आपका सब्सक्रिप्शन {{date}} को रद्द हो जाएगा। तब तक आपका एक्सेस बना रहेगा।",
  },
  canceled: {
    title: "सब्सक्रिप्शन समाप्त हो गया",
    description:
      "आपका सब्सक्रिप्शन समाप्त हो गया है। सभी फ़ीचर्स का एक्सेस वापस पाने के लिए रिन्यू करें।",
  },
  pastDue: {
    title: "आपका पिछला पेमेंट पूरा नहीं हुआ",
    description:
      "आपका प्लान और क्रेडिट्स {{date}} तक एक्टिव रहेंगे। तब तक आप कार्ड या क्रिप्टो से एक बार का क्रेडिट पैक भी ले सकते हैं।",
    reason: "अक्सर बैंक आपकी मंज़ूरी के लिए पेमेंट रोक लेता है (3D Secure या OTP)।",
    indiaMandate:
      "आपका कार्ड भारत का है: भारतीय बैंक रिकरिंग कार्ड पेमेंट सिर्फ़ मंज़ूर ई-मैंडेट से ही होने देते हैं, और ₹15,000 से ज़्यादा के हर पेमेंट पर हर बार OTP चाहिए। हर रिन्यूअल से पहले बैंक का SMS या ऐप नोटिफ़िकेशन देखते रहें।",
    retry: "पेमेंट मंज़ूर करें या दोबारा करें",
    buyPack: "क्रेडिट पैक से टॉप-अप करें",
    payCrypto: "क्रिप्टो से पेमेंट करें",
  },
  checkoutTip: {
    title: "कार्ड ने कोड माँगा?",
    body: "बैंक ऐप या SMS में OTP या 3D Secure चेक मंज़ूर करें, और कन्फ़र्म होने तक पेमेंट वाला टैब खुला रखें।",
    india:
      "भारतीय कार्ड: इंटरनेशनल ऑनलाइन पेमेंट अक्सर पहले से बंद रहते हैं। बैंक ऐप में (कार्ड कंट्रोल) इन्हें चालू करें, फिर दोबारा कोशिश करें।",
    other: "फिर भी नहीं हो रहा? दूसरा कार्ड आज़माएँ या क्रिप्टो से पेमेंट करें।",
  },
  noSubscription: {
    title: "अभी तक कोई सब्सक्रिप्शन नहीं",
    description:
      "हर महीने के क्रेडिट और हर मॉडल का एक्सेस अनलॉक करने के लिए सब्सक्राइब करें।",
    cta: "प्लान देखें",
  },
  manage: {
    nowpayments: {
      info: "अपना NowPayments सब्सक्रिप्शन मैनेज करने के लिए कृपया सपोर्ट से संपर्क करें।",
      button: "सब्सक्रिप्शन मैनेज करें",
    },
    stripe: {
      button: "सब्सक्रिप्शन मैनेज करें",
    },
    portal: {
      error: "कस्टमर पोर्टल नहीं खुल सका। दोबारा कोशिश करें।",
    },
  },

  enums: {
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    status: {
      incomplete: "अधूरा",
      incompleteExpired: "अधूरा और एक्सपायर",
      trialing: "ट्रायल पर",
      active: "एक्टिव",
      pastDue: "बकाया",
      canceled: "रद्द",
      unpaid: "अनपेड",
      paused: "रुका हुआ",
      canceling: "रद्द हो रहा है",
    },
    billing: {
      monthly: "मासिक",
      yearly: "सालाना",
    },
    cancellation: {
      tooExpensive: "बहुत महँगा",
      missingFeatures: "ज़रूरी फ़ीचर्स नहीं हैं",
      switchingService: "दूसरी सर्विस पर जा रहा हूँ",
      temporaryPause: "अस्थायी विराम",
      other: "अन्य",
    },
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
    },
  },

  quickCheckout: {
    pack: {
      title: "{{credits}} क्रेडिट",
      note: "एक बार का टॉप अप। कभी एक्सपायर नहीं होता।",
      aria: "{{credits}} क्रेडिट {{price}} में खरीदें, एक बार",
    },
    plan: {
      title: "{{credits}} क्रेडिट / माह",
      note: "{{plan}}। कभी भी रद्द करें।",
      perMonth: "/माह",
      aria: "{{plan}} शुरू करें: हर महीने {{credits}} क्रेडिट, {{price}} में",
    },
    upgrade: {
      title: "{{plan}} पर अपग्रेड करें",
      note: "{{credits}} क्रेडिट / माह",
      aria: "{{plan}} पर अपग्रेड करें: हर महीने {{credits}} क्रेडिट, {{price}} में",
      confirm:
        "इस अवधि के बचे हिस्से का अंतर आप अभी चुकाते हैं। एक्स्ट्रा क्रेडिट तुरंत जुड़ जाते हैं।",
      confirmButton: "अभी अपग्रेड करें",
      cancel: "रद्द करें",
      working: "अपग्रेड हो रहा है...",
    },
    opening: "चेकआउट खुल रहा है...",
    secure: "Stripe से कार्ड, PayPal, Apple Pay, Google Pay।",
    allPlans: "सभी प्लान और क्रिप्टो",
    moreOptions: "क्रिप्टो और दूसरे विकल्प",
    error: "चेकआउट नहीं खुला। दोबारा कोशिश करें।",
  },
  tiers: {
    examples: {
      heading: "महीने के {{credits}} क्रेडिट में क्या मिलता है",
      subheading: "कुछ पॉपुलर मॉडल्स के साथ हर महीने के मैसेज।",
      perMessage: "प्रति मैसेज लगभग {{credits}} क्रेडिट",
      messages: "लगभग {{amount}} मैसेज",
      note: "एक सामान्य मैसेज का अनुमान: {{input}} टोकन इनपुट (अब तक की आपकी चैट) और {{output}} आउटपुट। छोटी चैट सस्ती पड़ती है, लंबी चैट और फ़ाइलें ज़्यादा लेती हैं।",
    },
    faq: {
      heading: "पेमेंट से पहले के सवाल",
      credit: {
        question: "एक क्रेडिट की कीमत क्या है?",
        answer:
          "एक क्रेडिट {{unitPrice}} का है। हल्के मॉडल प्रति मैसेज एक क्रेडिट से कम लेते हैं, टॉप मॉडल कुछ क्रेडिट। ऊपर के उदाहरण असली मॉडल कीमतों पर हैं।",
      },
      unused: {
        question: "बचे हुए क्रेडिट का क्या होता है?",
        answer:
          "प्लान के क्रेडिट आपके बिलिंग महीने के लिए होते हैं और रिन्यूअल पर दोबारा भर जाते हैं। क्रेडिट पैक कभी एक्सपायर नहीं होते।",
      },
      cancel: {
        question: "क्या मैं रद्द कर सकता हूँ?",
        answer:
          "हाँ, कभी भी, यहीं से। जिस अवधि का पेमेंट आप कर चुके हैं उसके ख़त्म होने तक प्लान और उसके क्रेडिट आपके पास रहते हैं।",
      },
      free: {
        question: "क्या फ़्री रहता है?",
        answer:
          "गेस्ट को महीने में {{freeCreditsGuest}} क्रेडिट मिलते हैं। फ़्री अकाउंट को {{freeCreditsSignedIn}}, और कन्फ़र्म न्यूज़लेटर सब्सक्रिप्शन के साथ {{freeCreditsMax}}। कार्ड की ज़रूरत नहीं।",
      },
      api: {
        question: "क्या प्लान से API अनलॉक होता है?",
        answer:
          "हाँ। कोई भी प्लान या क्रेडिट पैक OpenAI और Anthropic कम्पैटिबल क्लाइंट्स के लिए API keys अनलॉक करता है। फ़्री क्रेडिट से ऐसा नहीं होता।",
      },
      pay: {
        question: "मैं पेमेंट कैसे कर सकता हूँ?",
        answer: "Stripe से कार्ड या PayPal, या NOWPayments से क्रिप्टो।",
      },
      more: "हेल्प सेंटर में और जवाब",
    },
    heading: "अपना प्लान चुनें",
    subheading:
      "सभी {{modelCount}} मॉडल्स के लिए हर महीने नए क्रेडिट। कभी भी रद्द करें।",
    changeHeading: "प्लान बदलें",
    changeSubheading: "आप {{plan}} पर हैं: महीने के {{credits}} क्रेडिट।",
    recommended: "सुझाया गया",
    current: "आपका प्लान",
    perMonth: "/ माह",
    perYear: "/ साल",
    creditsPerMonth: "क्रेडिट / माह",
    yearlyEquivalent: "{{monthlyPrice}} / माह, सालाना बिल",
    picked: "{{plan}}: हर महीने {{credits}} क्रेडिट",
    pickedNote:
      "सभी {{modelCount}} मॉडल। क्रेडिट हर महीने रिन्यू होते हैं। कभी भी रद्द करें।",
    cta: {
      start: "{{plan}} लें",
      upgrade: "{{plan}} पर अपग्रेड करें",
      downgrade: "रिन्यूअल पर {{plan}} पर स्विच करें",
      intervalYearly: "सालाना बिलिंग पर स्विच करें",
      intervalMonthly: "{{plan}} मासिक पर स्विच करें",
      current: "आपका मौजूदा प्लान",
    },
    signInHint: "प्लान शुरू करने के लिए फ़्री अकाउंट बनाएँ।",
    cryptoHint:
      "क्रिप्टो से पेमेंट कर रहे हैं? Plus, Pro और Ultra मासिक या सालाना लेते हैं, Starter सिर्फ़ सालाना।",
    confirm: {
      upgradeTitle: "{{plan}} पर अपग्रेड करें?",
      upgradeBody:
        "इस अवधि के बचे हिस्से का अंतर आप अभी चुकाते हैं और एक्स्ट्रा क्रेडिट तुरंत जुड़ जाते हैं। अगले रिन्यूअल से: {{credits}} क्रेडिट के लिए {{price}} प्रति माह।",
      upgradeButton: "पे करें और अपग्रेड करें",
      downgradeTitle: "{{plan}} पर स्विच करें?",
      downgradeBody:
        "{{date}} को आपके अगले रिन्यूअल से शुरू होगा। तब तक आपका मौजूदा प्लान और क्रेडिट बने रहेंगे। उसके बाद: {{credits}} क्रेडिट के लिए {{price}} प्रति माह।",
      downgradeButton: "रिन्यूअल पर स्विच करें",
      intervalTitle: "बिलिंग बदलें?",
      intervalBody:
        "आपकी बिलिंग अवधि आज से दोबारा शुरू होती है और Stripe अनुपातिक अंतर सेटल करता है। नया प्लान: {{plan}}, {{price}}{{period}}, महीने के {{credits}} क्रेडिट।",
      intervalButton: "बिलिंग स्विच करें",
      cancel: "अभी नहीं",
      working: "स्विच हो रहा है...",
    },
    packsLocked: {
      title: "क्रेडिट पैक: {{credits}} क्रेडिट के लिए {{price}}",
      body: "पैक एक एक्टिव प्लान को टॉप अप करते हैं। प्लान शुरू करें, फिर क्रेडिट कम पड़ने पर कभी भी पैक जोड़ें। वे कभी एक्सपायर नहीं होते।",
    },
    topUp: {
      heading: "टॉप अप",
      subheading:
        "रिन्यूअल से पहले क्रेडिट कम पड़ रहे हैं? पैक आपके प्लान के ऊपर जुड़ते हैं और कभी एक्सपायर नहीं होते।",
    },
  },
  buy: {
    provider: {
      stripe: "कार्ड, PayPal और वॉलेट",
      stripeDescription: "Stripe से कार्ड, PayPal, Apple Pay, Google Pay",
      nowpayments: "क्रिप्टो (NowPayments)",
      nowpaymentsDescription: "Bitcoin, Ethereum और दूसरे से पेमेंट करें",
      cryptoAmountTooLow:
        "यह राशि क्रिप्टो की न्यूनतम सीमा से कम है। सालाना बिलिंग या बड़ा प्लान चुनें।",
    },
    login: "साइन इन करें",
    signup: "फ़्री साइन अप करें",
  },

  meta: {
    subscription: {
      title: "सब्सक्रिप्शन",
      description: "अपना सब्सक्रिप्शन और बिलिंग मैनेज करें",
    },
    buyCredits: {
      title: "क्रेडिट खरीदें",
      description: "अपने अकाउंट के लिए एक्स्ट्रा क्रेडिट खरीदें",
    },
    history: {
      title: "बिलिंग हिस्ट्री",
      description: "अपनी बिलिंग और ट्रांज़ैक्शन हिस्ट्री देखें",
    },
    overview: {
      title: "सब्सक्रिप्शन ओवरव्यू",
      description: "अपने सब्सक्रिप्शन का स्टेटस और जानकारी देखें",
    },
  },
};
