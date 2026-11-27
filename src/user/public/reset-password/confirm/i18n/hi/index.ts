import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र",

  title: "पासवर्ड रीसेट कन्फ़र्म करें",
  description: "नया पासवर्ड डालकर अपना पासवर्ड रीसेट कन्फ़र्म करें",
  tag: "पासवर्ड रीसेट",
  email: {
    title: "पासवर्ड रीसेट हो गया",
    subject: "पासवर्ड रीसेट हो गया - {{appName}}",
    previewText:
      "आपका {{appName}} पासवर्ड रीसेट हो गया है। लॉग इन करें और {{modelCount}} AI मॉडल से चैट शुरू करें।",
    greeting: "नमस्ते {{name}},",
    successMessage:
      "आपका पासवर्ड रीसेट हो गया है। सब तैयार है। लॉग इन करें और वहीं से शुरू करें जहाँ छोड़ा था।",
    loginButton: "{{appName}} में लॉग इन करें",
    promoText: "{{modelCount}} AI मॉडल। कोई फ़िल्टर नहीं। कोई भाषण नहीं।",
    securityWarning:
      "आपने पासवर्ड रीसेट नहीं किया? तुरंत सपोर्ट से संपर्क करें। आपका अकाउंट खतरे में हो सकता है।",
  },
  groups: {
    verification: {
      title: "वेरिफ़िकेशन",
      description: "अपनी पासवर्ड रीसेट रिक्वेस्ट वेरिफ़ाई करें",
    },
    newPassword: {
      title: "नया पासवर्ड",
      description: "अपना नया पासवर्ड सेट करें",
    },
  },
  fields: {
    token: {
      label: "रीसेट टोकन",
      description: "आपके ईमेल में आया पासवर्ड रीसेट टोकन",
      placeholder: "रीसेट टोकन डालें",
      help: "अपने ईमेल में पासवर्ड रीसेट टोकन देखें और यहाँ डालें",
      validation: {
        required: "रीसेट टोकन ज़रूरी है",
      },
    },
    email: {
      label: "ईमेल पता",
      description: "आपका ईमेल पता",
      placeholder: "अपना ईमेल पता डालें",
      validation: {
        invalid: "कृपया सही ईमेल पता डालें",
      },
    },
    password: {
      label: "नया पासवर्ड",
      description: "आपका नया पासवर्ड",
      placeholder: "नया पासवर्ड डालें",
      help: "कम से कम 8 कैरेक्टर का मज़बूत पासवर्ड चुनें, जिसमें अक्षर, नंबर और सिंबल हों",
      validation: {
        minLength: "पासवर्ड कम से कम 8 कैरेक्टर का होना चाहिए",
      },
    },
    confirmPassword: {
      label: "पासवर्ड कन्फ़र्म करें",
      description: "अपना नया पासवर्ड दोबारा डालें",
      placeholder: "नया पासवर्ड कन्फ़र्म करें",
      validation: {
        minLength: "पासवर्ड कम से कम 8 कैरेक्टर का होना चाहिए",
      },
    },
  },
  validation: {
    passwords: {
      mismatch: "पासवर्ड मेल नहीं खाते",
    },
  },
  response: {
    title: "पासवर्ड रीसेट रिस्पॉन्स",
    description: "पासवर्ड रीसेट कन्फ़र्मेशन रिस्पॉन्स",
    message: {
      label: "मैसेज",
      description: "रिस्पॉन्स मैसेज",
    },
    securityTip: "बेहतर सुरक्षा के लिए टू-फ़ैक्टर ऑथेंटिकेशन चालू करने पर विचार करें",
    nextSteps: [
      "अपने नए पासवर्ड से लॉग इन करें",
      "ब्राउज़र में सेव किए पासवर्ड अपडेट करें",
      "ज़्यादा सुरक्षा के लिए 2FA चालू करें",
    ],
  },
  errors: {
    title: "पासवर्ड रीसेट एरर",
    no_email: "इस ईमेल पते से कोई अकाउंट नहीं मिला",
    validation: {
      title: "वैलिडेशन एरर",
      description: "अपना इनपुट जाँचें और दोबारा कोशिश करें",
      passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "रीसेट टोकन गलत है या एक्सपायर हो गया है",
    },
    internal: {
      title: "सर्वर एरर",
      description: "सर्वर में अंदरूनी एरर आया",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "एक अज्ञात एरर आया",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क कनेक्शन में एरर",
    },
    forbidden: {
      title: "एक्सेस नहीं है",
      description: "आपको यह काम करने की अनुमति नहीं है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रीसेट टोकन नहीं मिला या एक्सपायर हो गया",
    },
    unsaved: {
      title: "बदलाव सेव नहीं हुए",
      description: "कुछ बदलाव अभी सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "आपकी रिक्वेस्ट प्रोसेस करते समय टकराव हुआ",
    },
  },
  success: {
    title: "पासवर्ड रीसेट हो गया",
    description: "आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है",
    message: "पासवर्ड रीसेट हो गया",
    password_reset: "आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है",
  },
  actions: {
    requestNewLink: "नया रीसेट लिंक मँगाएँ",
  },
  emailTemplates: {
    confirm: {
      name: "पासवर्ड रीसेट कन्फ़र्मेशन ईमेल",
      description: "पासवर्ड सफलतापूर्वक रीसेट होने के बाद यूज़र को भेजा जाने वाला ईमेल",
      category: "ऑथेंटिकेशन",
      preview: {
        publicName: {
          label: "पब्लिक नाम",
          description: "यूज़र का पब्लिक डिस्प्ले नाम",
        },
        userId: {
          label: "यूज़र ID",
          description: "यूज़र की यूनिक पहचान",
        },
      },
    },
  },
};
