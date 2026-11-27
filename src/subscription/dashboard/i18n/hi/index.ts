import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "सब्सक्रिप्शन ओवरव्यू",
    titleShort: "डैशबोर्ड",
    description: "आपका सब्सक्रिप्शन एक नज़र में",
    errors: {
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "अपना सब्सक्रिप्शन देखने के लिए साइन इन करें",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "अमान्य पैरामीटर",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको इसे देखने की अनुमति नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "सब्सक्रिप्शन डेटा लोड नहीं हो सका",
        detail: "आपका सब्सक्रिप्शन लोड नहीं हो सका: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      conflict: { title: "टकराव", description: "डेटा में टकराव" },
      network: {
        title: "कनेक्शन एरर",
        description: "अपना इंटरनेट कनेक्शन जाँचें",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई सब्सक्रिप्शन नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "लोड हो गया",
      description: "सब्सक्रिप्शन डेटा लोड हो गया",
    },
    response: {
      activeCount: "एक्टिव",
      cancelingCount: "रद्द हो रहा है",
      trialCount: "ट्रायल",
      totalCount: "कुल",
    },
  },
  widget: {
    renewalDiagnostics: "रिन्यूअल और पेमेंट फ़ेल",
    actions: "क्विक एक्शन",
    mySubscription: "मेरा सब्सक्रिप्शन",
    manage: "मैनेज करें",
    refresh: "रिफ़्रेश करें",
    noData: "सब्सक्रिप्शन डेटा उपलब्ध नहीं है",
  },
};
