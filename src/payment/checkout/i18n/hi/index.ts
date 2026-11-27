import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "सब्सक्रिप्शन चेकआउट बनाएँ",
  titleShort: "चेकआउट",
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
      title: "चेकआउट सेशन की कॉन्फ़िगरेशन",
      description: "चेकआउट सेशन के पैरामीटर सेट करें",
    },
    response: {
      title: "चेकआउट रिस्पॉन्स",
      description: "चेकआउट सेशन का रिस्पॉन्स डेटा",
    },
    errors: {
      alreadySubscribed: {
        detail: "आपके पास पहले से एक एक्टिव सब्सक्रिप्शन है (यूज़र {{userId}})",
        title: "पहले से सब्सक्राइब्ड",
        description: "आपके पास पहले से एक एक्टिव सब्सक्रिप्शन है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "चेकआउट के पैरामीटर ग़लत हैं",
        reason: {
          yearlyNotAvailable:
            "सालाना बिलिंग सिर्फ़ {{plan}} प्लान के लिए उपलब्ध है। मासिक चुनें।",
          cryptoStarterYearly:
            "Starter में क्रिप्टो पेमेंट सिर्फ़ सालाना बिलिंग के साथ चलता है। सालाना चुनें, या Plus, Pro या Ultra लें।",
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
        detail: "यूज़र {{userId}} के लिए कोई अकाउंट नहीं मिला",
        title: "नहीं मिला",
        description: "चेकआउट सेशन नहीं मिला",
      },
      server: {
        detail: "चेकआउट शुरू नहीं हो सका: {{error}}",
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
  errorDetail: "चेकआउट विफल रहा: {{error}}",

  plans: {
    starter: {
      title: "Starter",
    },
    plus: {
      title: "Plus",
    },
    pro: {
      title: "Pro",
    },
    ultra: {
      title: "Ultra",
    },
  },

  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },

  billing: {
    monthly: "मासिक",
    yearly: "सालाना",
  },
  availability: {
    cardPaused: "कार्ड पेमेंट अभी कुछ समय के लिए बंद है। क्रिप्टो से तुरंत पेमेंट करें।",
    cardPausedError:
      "कार्ड पेमेंट अभी कुछ समय के लिए बंद है। खरीदारी पूरी करने के लिए क्रिप्टो चुनें।",
    nowpaymentsCardLabel: "कार्ड या क्रिप्टो (NOWPayments)",
    nowpaymentsCardDescription:
      "Visa, Mastercard, Apple Pay, Google Pay या Bitcoin, Ethereum और दूसरे",
  },
};
