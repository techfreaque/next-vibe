import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र्स",

  title: "लॉगिन विकल्प",
  titleShort: "लॉगिन विकल्प",
  description: "लॉगिन कॉन्फ़िगरेशन के विकल्प",
  tag: "login-options",
  container: {
    title: "लॉगिन कॉन्फ़िगरेशन",
    description: "लॉगिन सेटिंग्स और विकल्प कॉन्फ़िगर करें",
  },
  fields: {
    email: {
      label: "ईमेल एड्रेस",
      description: "अपना ईमेल एड्रेस लिखें",
      placeholder: "your@email.com",
    },
    allowPasswordAuth: {
      label: "पासवर्ड ऑथेंटिकेशन की अनुमति दें",
      description: "पासवर्ड आधारित ऑथेंटिकेशन चालू करें",
    },
    allowSocialAuth: {
      label: "सोशल ऑथेंटिकेशन की अनुमति दें",
      description: "सोशल प्रोवाइडर ऑथेंटिकेशन चालू करें",
    },
    maxAttempts: {
      label: "अधिकतम लॉगिन कोशिशें",
      description: "अनुमत लॉगिन कोशिशों की अधिकतम संख्या",
    },
    requireTwoFactor: {
      label: "टू-फ़ैक्टर ऑथेंटिकेशन ज़रूरी करें",
      description: "यूज़र लॉगिन के लिए 2FA ज़रूरी करें",
    },
    socialProviders: {
      label: "सोशल प्रोवाइडर",
      description: "उपलब्ध सोशल ऑथेंटिकेशन प्रोवाइडर",
    },
    socialProvider: {
      title: "सोशल प्रोवाइडर",
      description: "सोशल ऑथेंटिकेशन प्रोवाइडर की कॉन्फ़िगरेशन",
      enabled: {
        label: "चालू",
        description: "यह प्रोवाइडर चालू है या नहीं",
      },
      name: {
        label: "प्रोवाइडर का नाम",
        description: "सोशल प्रोवाइडर का नाम",
      },
      providers: {
        label: "प्रोवाइडर विकल्प",
        description: "उपलब्ध सोशल प्रोवाइडर विकल्प",
      },
    },
  },
  response: {
    title: "लॉगिन विकल्पों का रिस्पॉन्स",
    description: "उपलब्ध लॉगिन कॉन्फ़िगरेशन विकल्प",
    success: {
      badge: "सफल",
    },
    message: {
      content: "स्टेटस मैसेज",
    },
    forUser: {
      content: "ईमेल एड्रेस",
    },
    loginMethods: {
      title: "लॉगिन के तरीके",
      description: "उपलब्ध ऑथेंटिकेशन तरीके",
      password: {
        title: "पासवर्ड लॉगिन",
        description: "सामान्य पासवर्ड ऑथेंटिकेशन",
        enabled: {
          badge: "चालू",
        },
      },
      social: {
        title: "सोशल लॉगिन",
        description: "सोशल मीडिया ऑथेंटिकेशन विकल्प",
        enabled: {
          badge: "चालू",
        },
        providers: {
          item: {
            title: "सोशल प्रोवाइडर",
            description: "सोशल ऑथेंटिकेशन प्रोवाइडर",
          },
          name: {
            content: "प्रोवाइडर का नाम",
          },
          id: {
            content: "प्रोवाइडर ID",
          },
          enabled: {
            badge: "उपलब्ध",
          },
          description: "प्रोवाइडर का विवरण",
        },
      },
    },
    security: {
      title: "सिक्योरिटी सेटिंग्स",
      description: "ऑथेंटिकेशन की सुरक्षा ज़रूरतें",
      maxAttempts: {
        content: "अधिकतम लॉगिन कोशिशें",
      },
      requireTwoFactor: {
        badge: "2FA ज़रूरी",
      },
    },
    recommendations: {
      item: "सुझाया गया लॉगिन विकल्प",
    },
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    server: {
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
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "डेटा में टकराव हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "बदलाव सेव नहीं हुए",
    },
  },
  success: {
    title: "सफल",
    description: "लॉगिन विकल्प मिल गए",
  },
  post: {
    title: "लॉगिन विकल्प",
    description: "उपलब्ध लॉगिन विकल्प पाएँ",
    response: {
      title: "लॉगिन विकल्पों का रिस्पॉन्स",
      description: "उपलब्ध लॉगिन कॉन्फ़िगरेशन विकल्प",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
    },
    success: {
      description: "लॉगिन विकल्प मिल गए",
    },
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  messages: {
    successMessage: "लॉगिन विकल्प मिल गए",
    passwordAuthDescription: "अपने ईमेल और पासवर्ड से लॉग इन करें",
    socialAuthDescription: "अपने सोशल मीडिया अकाउंट से लॉग इन करें",
    continueWithProvider: "{{provider}} से जारी रखें",
    twoFactorRequired: "बेहतर सुरक्षा: 2FA ज़रूरी",
    standardSecurity: "सामान्य सुरक्षा ज़रूरतें",
    tryPasswordFirst: "पहले पासवर्ड लॉगिन आज़माएँ",
    useSocialLogin: "सोशल लॉगिन इस्तेमाल करें",
    socialLoginFaster: "नए यूज़र्स के लिए सोशल लॉगिन तेज़ है",
  },
};
