import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  success: {
    created: "कस्टमर पोर्टल सेशन बन गया",
  },
  post: {
    title: "कस्टमर पोर्टल",
    titleShort: "कस्टमर पोर्टल",
    description: "बिलिंग मैनेज करने के लिए कस्टमर पोर्टल सेशन बनाएँ",
    form: {
      title: "पोर्टल कॉन्फ़िगरेशन",
      description: "कस्टमर पोर्टल के पैरामीटर सेट करें",
    },
    returnUrl: {
      label: "रिटर्न URL",
      description: "पोर्टल सेशन के बाद जिस URL पर भेजा जाए",
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
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      server: {
        detail: "बिलिंग पोर्टल नहीं खुल सका: {{error}}",
        portalNotConfigured:
          "Stripe Customer Portal अभी सेट अप नहीं है। इसे https://dashboard.stripe.com/test/settings/billing/portal पर कॉन्फ़िगर करें",
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित है",
      },
      notFound: {
        noStripeCustomer: "आपके अकाउंट के लिए कोई Stripe कस्टमर रिकॉर्ड नहीं है",
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      title: "सफल",
      description: "ऑपरेशन सफल रहा",
    },
  },
};
