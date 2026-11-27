import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "रिफ़ंड प्रोसेस करें",
  titleShort: "रिफ़ंड",
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
        description: "ट्रांज़ैक्शन की करेंसी में वैकल्पिक आंशिक रिफ़ंड",
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

  widget: {
    transactionDetails: "सेव किया ट्रांज़ैक्शन",
    customerEmail: "कस्टमर का ईमेल",
    customerId: "कस्टमर ID",
    originalAmount: "मूल चार्ज",
    chooseTransaction: "पेमेंट खोजें",
    enterTransaction:
      "चार्ज और रिफ़ंड की रकम जाँचने के लिए Transactions में कोई पेमेंट खोलें।",
    transactionDate: "चार्ज की तारीख",
    lookupLoading: "सेव किया ट्रांज़ैक्शन लोड हो रहा है",
    transactionMissing: "ट्रांज़ैक्शन नहीं मिला",
    lookupFailed: "ट्रांज़ैक्शन लोड नहीं हो सका",
    retryLookup: "दोबारा खोजें",
    amountExceedsCharge: "मूल चार्ज तक की रकम डालें।",
    confirmRemaining: "Stripe बची हुई रकम {{currency}} में रिफ़ंड करेगा।",
    confirmAmount: "आंशिक रिफ़ंड: {{amount}} ({{currency}})।",
    title: "Stripe रिफ़ंड देखें",
    amountHelp:
      "{{currency}} में आंशिक रकम डालें। बची हुई पूरी रकम रिफ़ंड करने के लिए खाली छोड़ें।",
    review: "रकम देखें",
    confirmTitle: "Stripe रिफ़ंड की पुष्टि करें",
    confirmDescription:
      "Stripe {{email}} का पेमेंट रिफ़ंड करेगा। इस कार्रवाई में पैसे हिलते हैं।",
    confirm: "रिफ़ंड जारी करें",
    cancel: "रद्द करें",
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
        ineligible: "ये ट्रांज़ैक्शन Stripe रिफ़ंड के योग्य नहीं है।",
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
        detail: "id {{transactionId}} वाला कोई ट्रांज़ैक्शन नहीं मिला",
        title: "नहीं मिला",
        description: "ट्रांज़ैक्शन नहीं मिला",
      },
      server: {
        detail: "रिफ़ंड प्रोसेस नहीं हो सका: {{error}}",
        noPaymentIntent:
          "इस ट्रांज़ैक्शन से कोई Stripe पेमेंट जुड़ा नहीं है, इसलिए रिफ़ंड नहीं हो सकता",
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
};
