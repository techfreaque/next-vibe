import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import sub-domain translations
  checkout: {
    // Main checkout titles and descriptions
    title: "सब्सक्रिप्शन चेकआउट बनाएँ",
    description: "सब्सक्रिप्शन के लिए Stripe चेकआउट सेशन बनाएँ",
    category: "सब्सक्रिप्शन",

    // Tags
    tags: {
      subscription: "सब्सक्रिप्शन",
      checkout: "चेकआउट",
      stripe: "stripe",
    },

    // Form configuration
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
          label: "बिलिंग अंतराल",
          description: "बिलिंग की अवधि चुनें",
          placeholder: "बिलिंग इंटरवल चुनें",
        },
        provider: {
          label: "पेमेंट प्रोवाइडर",
          description: "पेमेंट का तरीका चुनें",
          placeholder: "पेमेंट प्रोवाइडर चुनें",
        },
        metadata: {
          label: "मेटाडेटा",
          description: "चेकआउट सेशन का अतिरिक्त मेटाडेटा",
          placeholder: "मेटाडेटा JSON में डालें",
        },
      },
    },

    // Response fields
    response: {
      success: "चेकआउट सेशन बन गया",
      sessionId: "Stripe सेशन ID",
      checkoutUrl: "चेकआउट URL",
      message: "स्टेटस मैसेज",
    },

    // Error types
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन एरर",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
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
        description: "डेटा टकराव हुआ",
      },
    },

    // Success types
    success: {
      title: "सफल",
      description: "चेकआउट सेशन बन गया",
    },

    // POST endpoint specific translations
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
          description: "आपका सब्सक्रिप्शन पहले से सक्रिय है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "चेकआउट पैरामीटर गलत हैं",
          reason: {
            enterpriseCustomPricing: "ENTERPRISE प्लान की कस्टम प्राइसिंग होती है",
          },
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क कनेक्शन एरर",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस मना है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "चेकआउट सेशन नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "इंटरनल सर्वर एरर आया",
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
          description: "डेटा टकराव हुआ",
        },
      },
      success: {
        title: "सफल",
        description: "चेकआउट सेशन बन गया",
      },
    },

    // General error message
    error: "चेकआउट के दौरान एरर आया",

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "मासिक",
      yearly: "सालाना",
    },
  },
  invoice: {
    category: "बिलिंग",
    tags: {
      payment: "payment",
      invoice: "invoice",
      transactions: "ट्रांज़ैक्शन",
    },
    defaultItem: "इनवॉइस आइटम",
    success: {
      created: "इनवॉइस बन गया",
    },
    post: {
      title: "इनवॉइस",
      description: "इनवॉइस एंडपॉइंट",
      form: {
        title: "इनवॉइस कॉन्फ़िगरेशन",
        description: "इनवॉइस के पैरामीटर सेट करें",
      },
      response: {
        success: "इनवॉइस बन गया",
        message: "स्टेटस मैसेज",
        invoice: {
          title: "इनवॉइस का ब्योरा",
          description: "बनाए गए इनवॉइस की जानकारी",
          id: "इनवॉइस ID",
          userId: "यूज़र ID",
          stripeInvoiceId: "Stripe इनवॉइस ID",
          invoiceNumber: "इनवॉइस नंबर",
          amount: "रकम",
          currency: "करेंसी",
          status: "स्टेटस",
          invoiceUrl: "इनवॉइस URL",
          invoicePdf: "इनवॉइस PDF",
          dueDate: "देय तारीख",
          paidAt: "चुकाने की तारीख़",
          createdAt: "बनाने का समय",
          updatedAt: "अपडेट का समय",
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
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "सफल",
        description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
      },
      widget: {
        back: "वापस",
      },
    },
    customerId: {
      label: "कस्टमर ID",
      description: "Stripe कस्टमर आइडेंटिफ़ायर",
      placeholder: "कस्टमर ID डालें",
    },
    amount: {
      label: "रकम",
      description: "इनवॉइस की राशि",
      placeholder: "रकम डालें",
    },
    currency: {
      label: "करेंसी",
      description: "करेंसी कोड",
      placeholder: "करेंसी चुनें",
      usd: "US डॉलर (USD)",
      eur: "यूरो (EUR)",
      pln: "पोलिश ज़्लॉटी (PLN)",
    },
    description: {
      label: "विवरण",
      description: "इनवॉइस का विवरण",
      placeholder: "विवरण लिखें",
    },
    dueDate: {
      label: "देय तारीख",
      description: "भुगतान की देय तारीख",
      placeholder: "देय तारीख़ चुनें",
    },
    metadata: {
      label: "मेटाडेटा",
      description: "अतिरिक्त मेटाडेटा",
      placeholder: "मेटाडेटा JSON में डालें",
    },
  },
  portal: {
    success: {
      created: "कस्टमर पोर्टल सेशन बन गया",
    },
    post: {
      title: "कस्टमर पोर्टल",
      description: "बिलिंग मैनेज करने के लिए कस्टमर पोर्टल सेशन बनाएँ",
      form: {
        title: "पोर्टल कॉन्फ़िगरेशन",
        description: "कस्टमर पोर्टल के पैरामीटर सेट करें",
      },
      returnUrl: {
        label: "रिटर्न URL",
        description: "पोर्टल सेशन के बाद जिस URL पर भेजना है",
        placeholder: "https://example.com/dashboard",
      },
      response: {
        success: "पोर्टल सेशन बन गया",
        message: "स्टेटस मैसेज",
        customerPortalUrl: "कस्टमर पोर्टल URL",
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
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "सफल",
        description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
      },
    },
  },
  refund: {
    title: "रिफ़ंड प्रोसेस करें",
    description: "किसी पेमेंट ट्रांज़ैक्शन का रिफ़ंड प्रोसेस करें",
    category: "पेमेंट रिफ़ंड",

    tags: {
      refund: "refund",
      transaction: "transaction",
    },

    success: {
      created: "रिफ़ंड सफलतापूर्वक प्रोसेस हुआ",
    },

    reason: {
      requestedByCustomer: "कस्टमर ने माँगा",
    },

    form: {
      title: "रिफ़ंड फ़ॉर्म",
      description: "रिफ़ंड का ब्योरा भरें",
      fields: {
        transactionId: {
          label: "ट्रांज़ैक्शन ID",
          description: "जिस ट्रांज़ैक्शन का रिफ़ंड करना है उसकी ID",
          placeholder: "ट्रांज़ैक्शन ID डालें",
        },
        amount: {
          label: "रिफ़ंड की रकम",
          description: "रिफ़ंड की राशि (वैकल्पिक, खाली रहने पर पूरी राशि)",
          placeholder: "रकम डालें",
        },
        reason: {
          label: "रिफ़ंड की वजह",
          description: "रिफ़ंड की वजह",
          placeholder: "वजह लिखें",
        },
        metadata: {
          label: "मेटाडेटा",
          description: "रिफ़ंड का अतिरिक्त मेटाडेटा",
          placeholder: "मेटाडेटा JSON में डालें",
        },
      },
    },

    post: {
      title: "रिफ़ंड प्रोसेस करें",
      description: "पेमेंट रिफ़ंड प्रोसेस करें",
      response: {
        success: "रिफ़ंड सफलतापूर्वक प्रोसेस हुआ",
        message: "स्टेटस मैसेज",
        refund: {
          title: "रिफ़ंड का ब्योरा",
          description: "प्रोसेस हुए रिफ़ंड की जानकारी",
          id: "रिफ़ंड ID",
          userId: "यूज़र ID",
          transactionId: "ट्रांज़ैक्शन ID",
          stripeRefundId: "Stripe रिफ़ंड ID",
          amount: "रिफ़ंड की रकम",
          currency: "करेंसी",
          status: "रिफ़ंड स्टेटस",
          reason: "रिफ़ंड की वजह",
          createdAt: "बनाने का समय",
          updatedAt: "अपडेट का समय",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिफ़ंड पैरामीटर गलत हैं",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "अनुमति नहीं",
        },
        notFound: {
          title: "नहीं मिला",
          description: "ट्रांज़ैक्शन नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "इंटरनल सर्वर एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क कनेक्शन एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        conflict: {
          title: "टकराव",
          description: "रिफ़ंड में टकराव मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "सफल",
        description: "रिफ़ंड सफलतापूर्वक प्रोसेस हुआ",
      },
    },
  },
  providers: {
    stripe: {
      title: "Stripe CLI इंटीग्रेशन",
      description: "Stripe CLI ऑपरेशन और वेबहुक लिसनिंग मैनेज करें",
      category: "पेमेंट इंटीग्रेशन",
      tags: {
        stripe: "Stripe",
        cli: "कमांड लाइन",
        webhook: "वेबहुक",
      },

      operations: {
        check: "इंस्टॉलेशन जाँचें",
        install: "Stripe CLI इंस्टॉल करें",
        listen: "वेबहुक लिसनर शुरू करें",
        login: "Stripe में लॉगिन करें",
        status: "स्टेटस जाँचें",
      },

      form: {
        title: "Stripe CLI कॉन्फ़िगरेशन",
        description: "Stripe CLI ऑपरेशन और वेबहुक सेटिंग्स सेट करें",
        fields: {
          operation: {
            label: "ऑपरेशन का प्रकार",
            description: "जो Stripe CLI ऑपरेशन चलाना है उसे चुनें",
            placeholder: "कोई ऑपरेशन चुनें...",
          },
          port: {
            label: "पोर्ट नंबर",
            description: "वेबहुक फ़ॉरवर्डिंग के लिए पोर्ट नंबर (1000-65535)",
            placeholder: "4242",
          },
          events: {
            label: "वेबहुक इवेंट",
            description: "जिन Stripe इवेंट को सुनना है उन्हें चुनें",
            placeholder: "मॉनिटर करने के लिए इवेंट चुनें...",
            paymentIntentSucceeded: "पेमेंट इंटेंट सफल",
            paymentIntentFailed: "पेमेंट इंटेंट फ़ेल",
            subscriptionCreated: "सब्सक्रिप्शन बना",
            subscriptionUpdated: "सब्सक्रिप्शन अपडेट हुआ",
            invoicePaymentSucceeded: "इनवॉइस पेमेंट सफल",
            invoicePaymentFailed: "इनवॉइस पेमेंट फ़ेल",
          },
          forwardTo: {
            label: "इस URL पर फ़ॉरवर्ड करें",
            description: "वेबहुक इवेंट जिस लोकल एंडपॉइंट पर भेजने हैं",
            placeholder: "localhost:3000/api/webhooks/stripe",
          },
          skipSslVerify: {
            label: "SSL वेरिफ़िकेशन छोड़ें",
            description: "डेवलपमेंट के लिए SSL सर्टिफ़िकेट वेरिफ़िकेशन छोड़ें",
          },
        },
      },

      response: {
        success: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
        installed: "Stripe CLI इंस्टॉलेशन स्टेटस",
        version: "इंस्टॉल किया गया Stripe CLI वर्शन",
        status: "मौजूदा ऑपरेशन का स्टेटस",
        output: "कमांड आउटपुट और लॉग",
        instructions: "अगले कदम और निर्देश",
        webhookEndpoint: "वेबहुक एंडपॉइंट URL",
      },

      login: {
        instructions:
          "Stripe से ऑथेंटिकेट करने के लिए टर्मिनल में 'stripe login' चलाएँ और अपना Stripe अकाउंट जोड़ने के निर्देश फ़ॉलो करें।",
      },

      status: {
        authenticated: "ऑथेंटिकेटेड और तैयार",
        not_authenticated: "ऑथेंटिकेटेड नहीं है, 'stripe login' चलाएँ",
        not_installed: "Stripe CLI इंस्टॉल नहीं है",
      },

      errors: {
        validation: {
          title: "गलत कॉन्फ़िगरेशन",
          description: "अपना Stripe CLI कॉन्फ़िगरेशन जाँचें और दोबारा कोशिश करें",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "Stripe सेवाओं से कनेक्ट नहीं हो पाया",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "आपको यह कार्रवाई करने की अनुमति नहीं है",
        },
        forbidden: {
          title: "एक्सेस मना है",
          description: "आपके अकाउंट के लिए यह कार्रवाई मंज़ूर नहीं है",
        },
        notFound: {
          title: "रिसोर्स नहीं मिला",
          description: "माँगा गया Stripe रिसोर्स नहीं मिला",
        },
        serverError: {
          title: "सर्वर एरर",
          description: "Stripe ऑपरेशन प्रोसेस करते समय एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "Stripe CLI में कोई अनपेक्षित एरर आया",
        },
        customerRetrievalFailed: {
          title: "कस्टमर पाना फ़ेल हुआ",
          description: "Stripe कस्टमर की जानकारी नहीं मिल सकी",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कॉन्फ़िगरेशन के बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "कार्रवाई में टकराव",
          description: "एक और Stripe कार्रवाई अभी चल रही है",
        },
        execution_failed: "Stripe CLI ऑपरेशन ठीक से नहीं चल पाया",
        userNotFound: {
          title: "यूज़र नहीं मिला",
          description: "बताया गया यूज़र नहीं मिला",
        },
        customerCreationFailed: {
          title: "कस्टमर बनाना फ़ेल हुआ",
          description: "Stripe कस्टमर बनाना फ़ेल हुआ",
        },
        checkoutCreationFailed: {
          title: "चेकआउट बनाना फ़ेल हुआ",
          description: "Stripe चेकआउट सेशन बनाना फ़ेल हुआ",
        },
        webhookVerificationFailed: {
          title: "वेबहुक की जाँच फ़ेल हुई",
          description: "वेबहुक सिग्नेचर की जाँच फ़ेल हुई",
        },
        subscriptionRetrievalFailed: {
          title: "सब्सक्रिप्शन पाना फ़ेल हुआ",
          description: "Stripe से सब्सक्रिप्शन पाना फ़ेल हुआ",
        },
        subscriptionCancellationFailed: {
          title: "सब्सक्रिप्शन रद्द करना फ़ेल हुआ",
          description: "Stripe में सब्सक्रिप्शन रद्द करना फ़ेल हुआ",
        },
        priceCreationFailed: {
          title: "प्राइस बनाना फ़ेल हुआ",
          description: "Stripe में प्राइस बनाना फ़ेल हुआ",
        },
        notConfigured: {
          title: "Stripe कॉन्फ़िगर नहीं है",
          description: "Stripe सेट नहीं है, अपनी .env में STRIPE_SECRET_KEY डालें",
        },
        stripeCliNotInstalled: "Stripe CLI इंस्टॉल नहीं है",
        listenerFailed: "Stripe वेबहुक लिसनर शुरू नहीं हो सका",
      },

      success: {
        title: "ऑपरेशन सफल",
        description: "Stripe CLI ऑपरेशन पूरा हुआ",
      },

      installInstructions: {
        documentation:
          "कृपया आधिकारिक डॉक्युमेंटेशन से Stripe CLI इंस्टॉल करें: https://docs.stripe.com/stripe-cli",
        quickInstallation: "इंस्टॉल करने के तेज़ तरीके:",
        macOS: {
          title: "macOS (Homebrew से):",
          command: "brew install stripe/stripe-cli/stripe",
        },
        linux: {
          title: "Linux (पैकेज मैनेजर से):",
          debian: {
            title: "Debian/Ubuntu",
          },
          fedora: {
            title: "CentOS/RHEL/Fedora",
          },
        },
        windows: {
          title: "Windows:",
          scoop: {
            title: "scoop से",
          },
          github: {
            title: "या GitHub रिलीज़ से सीधे डाउनलोड करें:",
            url: "https://github.com/stripe/stripe-cli/releases",
          },
        },
        authentication: {
          title: "इंस्टॉल के बाद ऑथेंटिकेट करें:",
          command: "stripe login",
        },
      },
    },
    nowpayments: {
      name: "NOWPayments",
      description: "सब्सक्रिप्शन सपोर्ट वाला क्रिप्टोकरेंसी पेमेंट प्रोवाइडर",

      cli: {
        post: {
          title: "NOWPayments CLI",
          description: "ngrok से NOWPayments वेबहुक टनलिंग मैनेज करें",
          category: "पेमेंट",
          tags: {
            nowpayments: "NOWPayments",
            cli: "CLI",
            webhook: "वेबहुक",
          },
          operations: {
            check: "जाँच",
            install: "इंस्टॉल करें",
            tunnel: "टनल",
            status: "स्टेटस",
          },
          form: {
            title: "NOWPayments CLI ऑपरेशन",
            description: "NOWPayments वेबहुक के लिए ngrok टनल सेट और मैनेज करें",
            fields: {
              operation: {
                label: "ऑपरेशन",
                description: "जो ऑपरेशन चलाना है उसे चुनें",
                placeholder: "कोई ऑपरेशन चुनें",
              },
              port: {
                label: "पोर्ट",
                description: "टनल के लिए लोकल पोर्ट (डिफ़ॉल्ट: 3000)",
                placeholder: "3000",
              },
            },
          },
          errors: {
            validationFailed: {
              title: "वैलिडेशन एरर",
              description: "ऑपरेशन या पैरामीटर गलत हैं",
            },
            networkError: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क कनेक्शन फ़ेल हुआ",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "लॉगिन ज़रूरी है",
            },
            forbidden: {
              title: "अनुमति नहीं",
              description: "एक्सेस नहीं मिला",
            },
            notFound: {
              title: "नहीं मिला",
              description: "रिसोर्स नहीं मिला",
            },
            serverError: {
              title: "सर्वर एरर",
              description: "ऑपरेशन नहीं चल पाया",
            },
            unknownError: {
              title: "अज्ञात एरर",
              description: "कोई अज्ञात एरर आया",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "कुछ बदलाव सेव नहीं हुए हैं",
            },
            conflict: {
              title: "टकराव",
              description: "रिसोर्स टकराव",
            },
          },
          response: {
            title: "रिस्पॉन्स",
            description: "ऑपरेशन का नतीजा",
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
            description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
          },
        },
      },

      errors: {
        userNotFound: {
          title: "यूज़र नहीं मिला",
          description: "बताया गया यूज़र नहीं मिल सका",
        },
        customerCreationFailed: {
          title: "कस्टमर बनाना फ़ेल हुआ",
          description: "NOWPayments कस्टमर सेट नहीं हो पाया: {error}",
        },
        productNotFound: {
          title: "प्रोडक्ट नहीं मिला",
          description: "बताया गया प्रोडक्ट नहीं मिला: {productId}",
        },
        userEmailRequired: {
          title: "यूज़र का ईमेल ज़रूरी है",
          description: "सब्सक्रिप्शन के लिए यूज़र का ईमेल ज़रूरी है: {userId}",
        },
        checkoutCreationFailed: {
          title: "चेकआउट बनाना फ़ेल हुआ",
          description: "NOWPayments चेकआउट सेशन नहीं बन पाया: {error}",
        },
        invoiceCreationFailed: {
          title: "इनवॉइस नहीं बन पाया",
          description: "NOWPayments इनवॉइस नहीं बन पाया: {error}",
        },
        invalidApiKey: {
          title: "API key गलत है",
          description:
            "NOWPayments API key गलत है। अपना कॉन्फ़िगरेशन जाँचें और https://nowpayments.io/app/dashboard से सही API key लें",
        },
        planCreationFailed: {
          title: "प्लान नहीं बन पाया",
          description: "NOWPayments सब्सक्रिप्शन प्लान नहीं बन पाया: {error}",
        },
        subscriptionCreationFailed: {
          title: "सब्सक्रिप्शन नहीं बन पाया",
          description: "NOWPayments सब्सक्रिप्शन नहीं बन पाया: {error}",
        },
        subscriptionRetrievalFailed: {
          title: "सब्सक्रिप्शन पाना फ़ेल हुआ",
          description: "NOWPayments सब्सक्रिप्शन नहीं मिल पाया: {error}",
        },
        subscriptionCancellationFailed: {
          title: "सब्सक्रिप्शन रद्द करना फ़ेल हुआ",
          description: "NOWPayments सब्सक्रिप्शन रद्द नहीं हो पाया: {error}",
        },
        subscriptionListFailed: {
          title: "सब्सक्रिप्शन लिस्ट नहीं मिली",
          description: "NOWPayments सब्सक्रिप्शन की लिस्ट नहीं मिल पाई: {error}",
        },
        notConfigured: {
          title: "NOWPayments सेट नहीं है",
          description:
            "NOWPayments सेट नहीं है, अपनी .env में NOWPAYMENTS_API_KEY और NOWPAYMENTS_IPN_SECRET डालें",
        },
        webhookVerificationFailed: {
          title: "वेबहुक की जाँच फ़ेल हुई",
          description: "NOWPayments वेबहुक सिग्नेचर वेरिफ़ाई नहीं हो पाया: {error}",
        },
        paymentStatusFailed: {
          title: "पेमेंट स्टेटस नहीं मिला",
          description: "NOWPayments से पेमेंट स्टेटस नहीं मिल पाया: {error}",
        },
      },

      success: {
        invoiceCreated: {
          title: "इनवॉइस बन गया",
          description: "NOWPayments इनवॉइस बन गया",
        },
        webhookVerified: {
          title: "वेबहुक वेरिफ़ाई हुआ",
          description: "NOWPayments वेबहुक वेरिफ़ाई हो गया",
        },
        paymentStatusRetrieved: {
          title: "पेमेंट स्टेटस मिल गया",
          description: "NOWPayments से पेमेंट स्टेटस मिल गया",
        },
      },
    },
  },

  // Main payment domain
  category: "बिलिंग",

  // Main form configuration
  form: {
    title: "पेमेंट कॉन्फ़िगरेशन",
    description: "पेमेंट के पैरामीटर सेट करें",
  },

  // Tags
  tags: {
    payment: "payment",
    stripe: "stripe",
    checkout: "चेकआउट",
    list: "list",
    transactions: "ट्रांज़ैक्शन",
    info: "जानकारी",
  },

  // Create payment endpoint
  create: {
    title: "पेमेंट सेशन बनाएँ",
    titleShort: "सेशन बनाएँ",
    description: "Stripe के साथ नया पेमेंट सेशन बनाएँ",
    form: {
      title: "पेमेंट कॉन्फ़िगरेशन",
      description: "पेमेंट सेशन के पैरामीटर सेट करें",
    },
    paymentMethodTypes: {
      label: "पेमेंट मेथड",
      description: "स्वीकार किए जाने वाले पेमेंट तरीके चुनें",
    },
    successUrl: {
      label: "सफलता URL",
      description: "पेमेंट सफल होने के बाद जिस URL पर भेजना है",
      placeholder: "https://example.com/success",
    },
    cancelUrl: {
      label: "कैंसल URL",
      description: "पेमेंट रद्द होने पर जिस URL पर भेजना है",
      placeholder: "https://example.com/cancel",
    },
    customerEmail: {
      label: "कस्टमर का ईमेल",
      description: "पेमेंट के लिए कस्टमर का ईमेल",
      placeholder: "customer@example.com",
    },
    response: {
      success: "पेमेंट सेशन बन गया",
      sessionId: "Stripe सेशन ID",
      sessionUrl: "Stripe सेशन URL",
      checkoutUrl: "चेकआउट URL",
      message: "स्टेटस मैसेज",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "पेमेंट पैरामीटर गलत हैं",
      },
      internal: {
        title: "इंटरनल एरर",
        description: "इंटरनल एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "अनुमति नहीं",
      },
      notFound: {
        detail: "यूज़र {{userId}} के लिए कोई अकाउंट नहीं मिला",
        title: "नहीं मिला",
        description: "पेमेंट सेशन नहीं मिला",
      },
      server: {
        detail: "पेमेंट सेशन नहीं बन पाया: {{error}}",
        stripeNotConfigured:
          "Stripe अभी सेट नहीं है। अपने एनवायरनमेंट में STRIPE_SECRET_KEY जोड़ें।",
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन एरर",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "पेमेंट में टकराव मिला",
      },
    },
    success: {
      title: "सफल",
      description: "पेमेंट सेशन बन गया",
      message: "पेमेंट सेशन बन गया",
    },
  },

  // Get payment endpoint
  get: {
    title: "आपके पेमेंट",
    titleShort: "पेमेंट",
    description: "आपके अकाउंट के 10 ताज़ा पेमेंट रिकॉर्ड तक।",
    summary: {
      empty: "अभी कोई पेमेंट नहीं",
      emptyDescription: "आपके पेमेंट रिकॉर्ड यहाँ दिखेंगे।",
      loading: "आपके पेमेंट लोड हो रहे हैं…",
      error: "आपके पेमेंट लोड नहीं हो पाए",
      retry: "दोबारा कोशिश करें",
      amountUnavailable: "राशि उपलब्ध नहीं",
    },
    form: {
      title: "पेमेंट क्वेरी",
      description: "पेमेंट की जानकारी देखें",
    },
    response: {
      success: "पेमेंट डेटा मिल गया",
      sessionUrl: "पेमेंट सेशन URL",
      sessionId: "पेमेंट सेशन ID",
      message: "स्टेटस मैसेज",
      transactions: "पेमेंट ट्रांज़ैक्शन",
      paymentMethods: "पेमेंट मेथड",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "क्वेरी पैरामीटर गलत हैं",
      },
      internal: {
        title: "इंटरनल एरर",
        description: "इंटरनल एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "अनुमति नहीं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "पेमेंट की जानकारी नहीं मिली",
      },
      server: {
        detail: "आपकी पेमेंट जानकारी लोड नहीं हो पाई: {{error}}",
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन एरर",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "पेमेंट में टकराव मिला",
      },
    },
    success: {
      title: "सफल",
      description: "पेमेंट जानकारी मिल गई",
    },
  },

  // Top-level error handling
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "पेमेंट पैरामीटर गलत हैं",
    },
    notFound: {
      title: "नहीं मिला",
      description: "पेमेंट नहीं मिला",
    },
    unauthorized: {
      signInRequired: "पेमेंट मैनेज करने के लिए साइन इन करें",
      title: "अनधिकृत",
      description: "लॉगिन ज़रूरी है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "अनुमति नहीं",
    },
    server: {
      detail: "पेमेंट वेबहुक प्रोसेस नहीं हो पाया: {{error}}",
      title: "सर्वर एरर",
      description: "इंटरनल सर्वर एरर आया",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क कनेक्शन एरर",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर आया",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "कुछ बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "पेमेंट में टकराव मिला",
    },
    notImplemented: {
      title: "लागू नहीं है",
      description: "यह पेमेंट प्रोवाइडर फ़ीचर अभी लागू नहीं है",
    },
    customerCreationFailed: "Stripe कस्टमर बनाना फ़ेल हुआ",
    customerNotFound: "Stripe कस्टमर नहीं मिला",
    localMode: "लोकल डेवलपमेंट मोड में पेमेंट बंद है।",
    webhookVerificationFailed: "वेबहुक सिग्नेचर वेरिफ़िकेशन फ़ेल: {{error}}",
  },

  // Top-level success
  success: {
    title: "सफल",
    description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
    sessionCreated: "पेमेंट सेशन बन गया",
    infoRetrieved: "पेमेंट जानकारी मिल गई",
  },

  // Field labels and descriptions
  amount: {
    label: "रकम",
    description: "चुनी हुई करेंसी में पेमेंट की राशि",
    placeholder: "रकम डालें",
  },
  currency: {
    label: "करेंसी",
    description: "पेमेंट की करेंसी",
    placeholder: "करेंसी चुनें",
    usd: "US डॉलर (USD)",
    eur: "यूरो (EUR)",
    pln: "पोलिश ज़्लॉटी (PLN)",
  },
  mode: {
    label: "पेमेंट मोड",
    description: "पेमेंट सेशन का प्रकार",
    placeholder: "पेमेंट मोड चुनें",
  },
  successUrl: {
    label: "सफलता URL",
    description: "पेमेंट सफल होने के बाद जिस URL पर भेजना है",
    placeholder: "https://example.com/success",
  },
  cancelUrl: {
    label: "कैंसल URL",
    description: "पेमेंट रद्द होने पर जिस URL पर भेजना है",
    placeholder: "https://example.com/cancel",
  },
  metadata: {
    label: "मेटाडेटा",
    description: "पेमेंट सेशन का अतिरिक्त मेटाडेटा",
    placeholder: "मेटाडेटा JSON में डालें",
  },
  paymentId: {
    label: "पेमेंट ID",
    description: "जो पेमेंट ID निकालनी है",
    placeholder: "पेमेंट ID लिखें",
  },
  sessionId: {
    label: "सेशन ID",
    description: "जिस Stripe सेशन ID को क्वेरी करना है",
    placeholder: "सेशन ID लिखें",
  },
  limit: {
    label: "सीमा",
    description: "लौटाए जाने वाले नतीजों की अधिकतम संख्या",
    placeholder: "20",
  },
  offset: {
    label: "ऑफ़सेट",
    description: "छोड़े जाने वाले नतीजों की संख्या",
    placeholder: "0",
  },
  priceId: {
    label: "प्राइस ID",
    description: "प्रोडक्ट का Stripe प्राइस आइडेंटिफ़ायर",
    placeholder: "price_1234567890",
  },
  provider: {
    label: "पेमेंट प्रोवाइडर",
    description: "पेमेंट का तरीका चुनें",
    placeholder: "पेमेंट प्रोवाइडर चुनें",
  },

  // Enum translations
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      whop: "Whop",
    },
    paymentStatus: {
      pending: "पेंडिंग",
      processing: "प्रोसेस हो रहा है",
      succeeded: "सफल हुए",
      failed: "फ़ेल",
      canceled: "रद्द",
      refunded: "रिफ़ंड हुआ",
    },
    paymentMethodType: {
      card: "क्रेडिट/डेबिट कार्ड",
      bankTransfer: "बैंक ट्रांसफ़र",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "SEPA डायरेक्ट डेबिट",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "पेमेंट मेथड ज़रूरी",
      requiresConfirmation: "कन्फ़र्मेशन ज़रूरी",
      requiresAction: "एक्शन ज़रूरी",
      processing: "प्रोसेस हो रहा है",
      requiresCapture: "कैप्चर ज़रूरी",
      canceled: "रद्द",
      succeeded: "सफल हुए",
    },
    checkoutMode: {
      payment: "पेमेंट",
      subscription: "सब्सक्रिप्शन",
      setup: "सेटअप",
    },
    refundStatus: {
      pending: "पेंडिंग",
      succeeded: "सफल हुए",
      failed: "फ़ेल",
      canceled: "रद्द",
    },
    disputeStatus: {
      warningNeedsResponse: "चेतावनी: जवाब चाहिए",
      warningUnderReview: "चेतावनी: समीक्षा जारी",
      warningClosed: "चेतावनी: बंद",
      needsResponse: "जवाब चाहिए",
      underReview: "समीक्षा जारी",
      chargeRefunded: "चार्ज रिफ़ंड हुआ",
      won: "जीता",
      lost: "हारा",
    },
    invoiceStatus: {
      draft: "ड्राफ़्ट",
      open: "खुला",
      paid: "चुकाया गया",
      void: "वॉइड",
      uncollectible: "वसूली नामुमकिन",
    },
    taxStatus: {
      complete: "पूरा करें",
      failed: "फ़ेल",
      requiresLocation: "लोकेशन ज़रूरी",
    },
    paymentInterval: {
      month: "मासिक",
      year: "सालाना",
      one_time: "एक बार",
    },
    manualPaymentMethod: {
      cash: "कैश",
      bankTransfer: "बैंक ट्रांसफ़र",
      other: "अन्य",
    },
    billStatus: {
      DRAFT: "ड्राफ़्ट",
      RECEIVED: "प्राप्त",
      APPROVED: "मंज़ूर",
      PAID: "चुकाया गया",
      DISPUTED: "विवादित",
    },
    estimateStatus: {
      DRAFT: "ड्राफ़्ट",
      SENT: "भेजे गए",
      ACCEPTED: "स्वीकृत",
      DECLINED: "अस्वीकृत",
      EXPIRED: "एक्सपायर हो गया",
      CONVERTED: "बदला गया",
    },
  },
};
