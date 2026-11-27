import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },
  post: {
    title: "क्रेडिट खरीदें",
    titleShort: "क्रेडिट खरीदें",
    description: "क्रेडिट पैक की खरीद के लिए Stripe चेकआउट सेशन बनाएँ",
    container: {
      title: "क्रेडिट खरीदें",
      description: "AI फ़ीचर्स इस्तेमाल करने के लिए क्रेडिट पैक खरीदें",
    },
    quantity: {
      label: "मात्रा",
      description: "खरीदे जाने वाले क्रेडिट पैक की संख्या (1-10)",
      placeholder: "मात्रा लिखें (1-10)",
    },
    productId: {
      label: "क्रेडिट पैक",
      description: "खरीदने के लिए पैक का साइज़ चुनें",
      placeholder: "पैक चुनें",
    },
    provider: {
      label: "पेमेंट का तरीका चुनें",
      description: "चुनें कि आप अपने क्रेडिट पैक का पेमेंट कैसे करना चाहते हैं",
      placeholder: "पेमेंट प्रोवाइडर चुनें",
      stripe: "कार्ड, PayPal और वॉलेट",
      stripeDescription: "Stripe से कार्ड, PayPal, Apple Pay, Google Pay",
      nowpayments: "क्रिप्टोकरेंसी",
      nowpaymentsDescription: "Bitcoin, Ethereum और दूसरे से पेमेंट करें",
      cryptoMinimumDisabled: "क्रिप्टो पेमेंट के लिए कम से कम {{min}} पैक ज़रूरी हैं",
    },
    checkoutUrl: {
      content: "चेकआउट URL",
    },
    sessionId: {
      content: "सेशन ID",
    },
    totalAmount: {
      content: "कुल राशि (सेंट में)",
    },
    totalCredits: {
      content: "कुल क्रेडिट",
    },
    pack: {
      addPack: "एक पैक जोड़ें",
      removePack: "एक पैक हटाएँ",
      qtyCredits: "{{count}} क्रेडिट",
      title: "क्रेडिट पैक",
      description: "अपना प्लान टॉप अप करें। क्रेडिट कभी एक्सपायर नहीं होते।",
      perPack: "/ पैक",
      features: {
        credits: "{{count}} क्रेडिट शामिल",
        expiry: "क्रेडिट कभी एक्सपायर नहीं होते",
        bestFor: "अपने मासिक क्रेडिट के ऊपर जुड़ते हैं",
      },
      planRequired: {
        title: "पैक प्लान को टॉप अप करते हैं",
        body: "पहले प्लान शुरू करें, फिर क्रेडिट कम पड़ने पर कभी भी पैक जोड़ें। प्लान {{price}} प्रति माह से शुरू।",
        cta: "प्लान देखें",
      },
      logIn: "लॉग इन करें",
      signUp: "साइन अप करें",
      signInToBuy: "पैक प्लान को टॉप अप करते हैं। फ़्री अकाउंट बनाएँ और पहले प्लान शुरू करें।",
      totalSummary: "कुल {{totalCredits}} क्रेडिट · कुल {{totalPrice}}",
    },
    submit: {
      text: "क्रेडिट पैक खरीदें",
      loading: "प्रोसेस हो रहा है...",
    },
    redirecting: "चेकआउट पर भेजा जा रहा है...",
    openCheckout: "चेकआउट खोलें",
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "क्रेडिट खरीदें",
      loadingText: "प्रोसेस हो रहा है...",
    },
    success: {
      title: "चेकआउट बन गया",
      description: "Stripe चेकआउट सेशन बन गया",
    },
    errors: {
      planRequired: {
        title: "प्लान ज़रूरी है",
        description:
          "क्रेडिट पैक एक एक्टिव प्लान को टॉप अप करते हैं। पहले प्लान चुनें, फिर कभी भी पैक जोड़ें।",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "खरीद की मात्रा ग़लत है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन विफल रहा",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "क्रेडिट खरीदने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपको क्रेडिट खरीदने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "चेकआउट सेशन नहीं बन सका",
        detail: "चेकआउट शुरू नहीं हो सका: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "रिसोर्स में टकराव हुआ",
      },
    },
  },
  errors: {
    userNotFound: {
      title: "यूज़र नहीं मिला",
      description: "यूज़र अकाउंट नहीं मिला",
    },
    checkoutFailed: {
      title: "चेकआउट विफल रहा",
      description: "क्रेडिट खरीद के लिए चेकआउट सेशन नहीं बन सका",
    },
  },
};
