import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stripe CLI",
  titleShort: "Stripe CLI",
  description: "लोकल में Stripe वेबहुक सुनें",
  category: "पेमेंट इंटीग्रेशन",
  tags: {
    stripe: "Stripe",
    cli: "कमांड लाइन",
    webhook: "वेबहुक",
  },

  form: {
    title: "Stripe CLI",
    description: "Stripe वेबहुक इवेंट अपने लोकल सर्वर पर फ़ॉरवर्ड करें",
    fields: {
      port: {
        label: "पोर्ट",
        description: "वेबहुक फ़ॉरवर्ड करने का लोकल पोर्ट (डिफ़ॉल्ट: 3000)",
        placeholder: "3000",
      },
    },
  },

  status: {
    authenticated: "ऑथेंटिकेटेड और तैयार",
    not_authenticated: "ऑथेंटिकेटेड नहीं। 'stripe login' चलाएँ।",
    not_installed: "Stripe CLI इंस्टॉल नहीं है। {{instructions}}",
  },

  errors: {
    validation: {
      title: "कॉन्फ़िगरेशन गलत है",
      description: "अपना Stripe CLI कॉन्फ़िगरेशन जाँचें और फिर कोशिश करें",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "Stripe से कनेक्ट नहीं हो सका",
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
      title: "नहीं मिला",
      description: "Stripe CLI इंस्टॉल नहीं है",
    },
    serverError: {
      detail: "Stripe CLI लिसनर फ़ेल हुआ: {{error}}",
      title: "सर्वर एरर",
      description: "Stripe लिसनर चलाते समय एरर आई",
    },
    unknown: {
      title: "अनजान एरर",
      description: "अप्रत्याशित एरर आई",
    },
    customerRetrievalFailed: {
      detail:
        "आपका Stripe कस्टमर रिकॉर्ड लोड नहीं हो सका: {{error}} (यूज़र {{userId}})",
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
    execution_failed: "Stripe CLI कार्रवाई फ़ेल हुई",
    userNotFound: {
      detail: "यूज़र {{userId}} के लिए कोई अकाउंट नहीं मिला",
      title: "यूज़र नहीं मिला",
      description: "बताया गया यूज़र नहीं मिला",
    },
    customerCreationFailed: {
      detail:
        "आपका Stripe कस्टमर रिकॉर्ड बनाया नहीं जा सका: {{error}} (यूज़र {{userId}})",
      title: "कस्टमर बनाना फ़ेल हुआ",
      description: "Stripe कस्टमर बनाना फ़ेल हुआ",
    },
    checkoutUnavailable: {
      detail:
        "कार्ड चेकआउट अभी हमारी तरफ़ से बंद है। हमें इसकी जानकारी है और हम इसे ठीक कर रहे हैं। थोड़ी देर बाद फिर कोशिश करें।",
    },
    checkoutCreationFailed: {
      detail: "चेकआउट शुरू नहीं हो सका: {{error}}",
      title: "चेकआउट बनाना फ़ेल हुआ",
      description: "Stripe चेकआउट सेशन बनाना फ़ेल हुआ",
    },
    webhookVerificationFailed: {
      detail: "Stripe वेबहुक की जाँच नहीं हो सकी: {{error}}",
      title: "वेबहुक की जाँच फ़ेल हुई",
      description: "वेबहुक सिग्नेचर की जाँच फ़ेल हुई",
    },
    subscriptionRetrievalFailed: {
      detail: "Stripe से सब्सक्रिप्शन लोड नहीं हो सका: {{error}}",
      title: "सब्सक्रिप्शन पाना फ़ेल हुआ",
      description: "Stripe से सब्सक्रिप्शन पाना फ़ेल हुआ",
    },
    subscriptionCancellationFailed: {
      detail: "सब्सक्रिप्शन रद्द नहीं हो सका: {{error}}",
      title: "सब्सक्रिप्शन रद्द करना फ़ेल हुआ",
      description: "Stripe में सब्सक्रिप्शन रद्द करना फ़ेल हुआ",
    },
    priceCreationFailed: {
      detail: "Stripe प्राइस बनाया नहीं जा सका: {{error}} (प्रोडक्ट {{productId}})",
      title: "प्राइस बनाना फ़ेल हुआ",
      description: "Stripe में प्राइस बनाना फ़ेल हुआ",
    },
    notConfigured: {
      title: "Stripe कॉन्फ़िगर नहीं है",
      description: "अपनी .env में STRIPE_SECRET_KEY सेट करें",
    },
    stripeCliNotInstalled: "Stripe CLI इंस्टॉल नहीं है",
    listenerFailed: "Stripe वेबहुक लिसनर शुरू नहीं हो सका",
  },

  success: {
    title: "लिसनर शुरू हो गया",
    description: "Stripe CLI वेबहुक सुन रहा है",
  },
};
