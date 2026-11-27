import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  name: "NOWPayments",
  description: "सब्सक्रिप्शन सपोर्ट वाला क्रिप्टोकरेंसी पेमेंट प्रोवाइडर",
  cli: {
    post: {
      title: "NOWPayments CLI",
      description: "ngrok से NOWPayments वेबहुक टनलिंग संभालें",
      category: "पेमेंट",
      tags: {
        nowpayments: "NOWPayments",
        cli: "CLI",
        webhook: "वेबहुक",
      },
      operations: {
        check: "जाँच",
        install: "इंस्टॉल",
        tunnel: "टनल",
        status: "स्टेटस",
      },
      form: {
        title: "NOWPayments CLI कार्रवाइयाँ",
        description: "NOWPayments वेबहुक के लिए ngrok टनल कॉन्फ़िगर और मैनेज करें",
        fields: {
          operation: {
            label: "कार्रवाई",
            description: "करने वाली कार्रवाई चुनें",
            placeholder: "कार्रवाई चुनें",
          },
          port: {
            label: "पोर्ट",
            description: "टनल करने वाला लोकल पोर्ट (डिफ़ॉल्ट: 3000)",
            placeholder: "3000",
          },
        },
      },
      errors: {
        validationFailed: {
          title: "वैलिडेशन एरर",
          description: "कार्रवाई या पैरामीटर गलत हैं",
        },
        networkError: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क कनेक्शन फ़ेल हुआ",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "प्रतिबंधित",
          description: "एक्सेस अस्वीकृत",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        serverError: {
          title: "सर्वर एरर",
          description: "कार्रवाई चल नहीं सकी",
        },
        unknownError: {
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "रिसोर्स में टकराव",
        },
      },
      response: {
        title: "रिस्पॉन्स",
        description: "कार्रवाई का नतीजा",
        fields: {
          success: "सफल",
          installed: "इंस्टॉल है",
          version: "वर्ज़न",
          status: "स्टेटस",
          output: "आउटपुट",
          instructions: "निर्देश",
          tunnelUrl: "टनल URL",
          webhookUrl: "वेबहुक URL",
        },
      },
      success: {
        title: "सफल",
        description: "कार्रवाई सफलतापूर्वक पूरी हुई",
      },
    },
  },
  errors: {
    userNotFound: {
      detail: "यूज़र {{userId}} का कोई अकाउंट नहीं मिला",
      title: "यूज़र नहीं मिला",
      description: "बताया गया यूज़र नहीं मिला",
    },
    customerCreationFailed: {
      detail:
        "आपका NOWPayments कस्टमर रिकॉर्ड सेट नहीं हो सका: {{error}} (यूज़र {{userId}})",
      title: "कस्टमर बनाना फ़ेल हुआ",
      description: "NOWPayments कस्टमर सुनिश्चित नहीं हो सका: {{error}}",
    },
    productNotFound: {
      detail: "ऐसा कोई प्रोडक्ट नहीं: {{productId}}",
      title: "प्रोडक्ट नहीं मिला",
      description: "बताया गया प्रोडक्ट नहीं मिला: {{productId}}",
    },
    userEmailRequired: {
      title: "यूज़र का ईमेल ज़रूरी है",
      description: "सब्सक्रिप्शन के लिए यूज़र का ईमेल ज़रूरी है: {{userId}}",
    },
    checkoutCreationFailed: {
      detail: "क्रिप्टो चेकआउट शुरू नहीं हो सका: {{error}}",
      title: "चेकआउट बनाना फ़ेल हुआ",
      description: "NOWPayments चेकआउट सेशन नहीं बन सका: {{error}}",
    },
    invoiceCreationFailed: {
      detail: "NOWPayments इनवॉइस नहीं बन सका: {{error}}",
      title: "इनवॉइस बनाना फ़ेल हुआ",
      description: "NOWPayments इनवॉइस नहीं बन सका: {{error}}",
    },
    invalidApiKey: {
      detail:
        "NOWPayments API key गलत है। अपने एनवायरनमेंट में NOWPAYMENTS_API_KEY जाँचें और key को https://nowpayments.io/app/dashboard पर पक्का करें",
      title: "API key गलत है",
      description:
        "NOWPayments API key गलत है। अपना कॉन्फ़िगरेशन जाँचें और https://nowpayments.io/app/dashboard से सही API key लें",
    },
    planCreationFailed: {
      title: "प्लान बनाना फ़ेल हुआ",
      description: "NOWPayments सब्सक्रिप्शन प्लान नहीं बन सका: {{error}}",
    },
    subscriptionCreationFailed: {
      title: "सब्सक्रिप्शन बनाना फ़ेल हुआ",
      description: "NOWPayments सब्सक्रिप्शन नहीं बन सका: {{error}}",
    },
    subscriptionRetrievalFailed: {
      detail: "NOWPayments सब्सक्रिप्शन लोड नहीं हो सका: {{error}}",
      title: "सब्सक्रिप्शन लाना फ़ेल हुआ",
      description: "NOWPayments सब्सक्रिप्शन नहीं मिल सका: {{error}}",
    },
    subscriptionCancellationFailed: {
      detail: "NOWPayments सब्सक्रिप्शन रद्द नहीं हो सका: {{error}}",
      title: "सब्सक्रिप्शन रद्द करना फ़ेल हुआ",
      description: "NOWPayments सब्सक्रिप्शन रद्द नहीं हो सका: {{error}}",
    },
    subscriptionListFailed: {
      detail: "NOWPayments सब्सक्रिप्शन की सूची नहीं मिल सकी: {{error}}",
      title: "सब्सक्रिप्शन सूची फ़ेल हुई",
      description: "NOWPayments सब्सक्रिप्शन की सूची नहीं बन सकी: {{error}}",
    },
    notConfigured: {
      title: "NOWPayments कॉन्फ़िगर नहीं है",
      description:
        "NOWPayments कॉन्फ़िगर नहीं है। अपनी .env में NOWPAYMENTS_API_KEY और NOWPAYMENTS_IPN_SECRET सेट करें",
    },
    webhookVerificationFailed: {
      detail: "NOWPayments वेबहुक वेरिफ़ाई नहीं हो सका: {{error}}",
      invalidSignature: "वेबहुक सिग्नेचर मेल नहीं खाता",
      title: "वेबहुक वेरिफ़िकेशन फ़ेल हुआ",
      description: "NOWPayments वेबहुक सिग्नेचर वेरिफ़ाई नहीं हो सका: {{error}}",
    },
    paymentStatusFailed: {
      detail: "NOWPayments से पेमेंट स्टेटस नहीं पढ़ा जा सका: {{error}}",
      title: "पेमेंट स्टेटस लाना फ़ेल हुआ",
      description: "NOWPayments से पेमेंट स्टेटस नहीं मिल सका: {{error}}",
    },
  },
  success: {
    invoiceCreated: {
      title: "इनवॉइस बन गया",
      description: "NOWPayments इनवॉइस सफलतापूर्वक बना",
    },
    webhookVerified: {
      title: "वेबहुक वेरिफ़ाई हुआ",
      description: "NOWPayments वेबहुक सफलतापूर्वक वेरिफ़ाई हुआ",
    },
    paymentStatusRetrieved: {
      title: "पेमेंट स्टेटस मिल गया",
      description: "NOWPayments पेमेंट स्टेटस सफलतापूर्वक मिला",
    },
  },
};
