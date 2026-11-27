import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र्स",
  title: "वापसी पर स्वागत है",
  titleShort: "साइन इन करें",
  description: "अनसेंसर्ड AI मॉडल्स और अपनी बातचीत की हिस्ट्री तक पहुँचें।",
  tag: "ऑथेंटिकेशन",
  options: {
    category: "यूज़र्स",

    title: "लॉगिन विकल्प",
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
      socialAuthDescription:
        "सोशल लॉगिन अभी उपलब्ध नहीं है। ईमेल और पासवर्ड इस्तेमाल करें।",
      continueWithProvider: "{{provider}} से जारी रखें",
      twoFactorRequired: "बेहतर सुरक्षा: 2FA ज़रूरी",
      standardSecurity: "सामान्य सुरक्षा ज़रूरतें",
      tryPasswordFirst: "पहले पासवर्ड लॉगिन आज़माएँ",
      useSocialLogin: "सोशल लॉगिन इस्तेमाल करें",
      socialLoginFaster: "नए यूज़र्स के लिए सोशल लॉगिन तेज़ है",
    },
  },
  actions: {
    submit: "लॉग इन",
    submitting: "लॉग इन हो रहा है...",
  },
  fields: {
    email: {
      label: "आपका ईमेल",
      description: "वह ईमेल जिससे आपने साइन अप किया था।",
      placeholder: "अपना ईमेल लिखें",
      validation: {
        required: "ईमेल ज़रूरी है",
        invalid: "कृपया सही ईमेल एड्रेस लिखें",
      },
    },
    password: {
      label: "आपका पासवर्ड",
      description: "साइन अप के समय सेट किया पासवर्ड लिखें।",
      placeholder: "अपना पासवर्ड लिखें",
      help: "अपने अकाउंट का पासवर्ड लिखें",
      validation: {
        required: "पासवर्ड ज़रूरी है",
        minLength: "पासवर्ड कम से कम 8 अक्षर का होना चाहिए",
      },
    },
    twoFactorCode: {
      label: "ऑथेंटिकेशन कोड",
      description: "ऐप कोड या रिकवरी कोड इस्तेमाल करें।",
      placeholder: "6 अंकों का कोड",
    },
    rememberMe: {
      label: "मुझे लॉग इन रखें",
    },
  },
  emailCode: "ईमेल कन्फ़र्मेशन कोड",
  twoFactorStep: {
    title: "टू-स्टेप जाँच",
    helper: "अपने ऑथेंटिकेटर ऐप का 6 अंकों का कोड लिखें।",
    recoveryHelper: "अपना कोई एक रिकवरी कोड लिखें। हर कोड एक ही बार चलता है।",
    codeLabel: "ऑथेंटिकेशन कोड",
    recoveryLabel: "रिकवरी कोड",
    recoveryPlaceholder: "XXXXX-XXXXX",
    useRecovery: "रिकवरी कोड इस्तेमाल करें",
    useApp: "ऑथेंटिकेटर ऐप इस्तेमाल करें",
    verify: "वेरिफ़ाई करें",
    verifying: "वेरिफ़ाई हो रहा है...",
    back: "वापस",
  },
  groups: {
    credentials: {
      title: "लॉगिन क्रेडेंशियल",
      description: "अपनी लॉगिन जानकारी लिखें",
    },
    options: {
      title: "लॉगिन विकल्प",
      description: "अतिरिक्त लॉगिन पसंद और सेटिंग्स",
    },
    preferences: {
      title: "लॉगिन पसंद",
      description: "अतिरिक्त लॉगिन विकल्प",
    },
    advanced: {
      title: "एडवांस्ड विकल्प",
      description: "एडवांस्ड लॉगिन सेटिंग्स",
    },
  },
  footer: {
    forgotPassword: "पासवर्ड भूल गए?",
    createAccount: "अकाउंट नहीं है? साइन अप करें",
  },
  response: {
    title: "लॉगिन रिस्पॉन्स",
    description: "लॉगिन रिस्पॉन्स डेटा",
    success: "लॉगिन सफल",
    message: "स्टेटस मैसेज",
    user: {
      title: "यूज़र की जानकारी",
      description: "लॉग इन यूज़र की जानकारी",
      id: "यूज़र ID",
      email: "ईमेल एड्रेस",
      firstName: "पहला नाम",
      lastName: "उपनाम",
      privateName: "प्राइवेट नाम",
      publicName: "पब्लिक नाम",
      imageUrl: "प्रोफ़ाइल इमेज",
    },
    sessionInfo: {
      title: "सेशन की जानकारी",
      description: "यूज़र सेशन की जानकारी",
      expiresAt: "सेशन कब एक्सपायर होगा",
      rememberMeActive: "मुझे याद रखें स्टेटस",
      loginLocation: "लॉगिन की जगह",
    },
    nextSteps: {
      title: "अगले कदम",
      item: "अगले कदम",
    },
  },
  errors: {
    title: "लॉगिन एरर",
    account_suspended:
      "अकाउंट सस्पेंड है। अगर आपको लगता है यह ग़लती है तो सपोर्ट से संपर्क करें।",
    account_locked:
      "बहुत ज़्यादा विफल कोशिशें। 15 मिनट रुकें, या अपना पासवर्ड रीसेट करें। अकाउंट नहीं है? साइन अप करें।",
    accountLocked: "अकाउंट लॉक है",
    accountLockedDescription:
      "आपका अकाउंट लॉक कर दिया गया है। कृपया सपोर्ट से संपर्क करें।",
    pendingEmail: "साइन इन करने से पहले अपना ईमेल कन्फ़र्म करें।",
    resendPending: "कन्फ़र्मेशन ईमेल दोबारा भेजें",
    invalid_credentials: "ईमेल या पासवर्ड ग़लत है। अकाउंट नहीं है? पहले साइन अप करें।",
    two_factor_required: "टू-फ़ैक्टर ऑथेंटिकेशन ज़रूरी है",
    invalid_two_factor_code: "ऑथेंटिकेशन कोड ग़लत है",
    auth_error: "{{email}} के लिए ऑथेंटिकेशन विफल रहा: {{error}}",
    user_not_found: "{{userId}} के लिए कोई यूज़र नहीं मिला",
    session_creation_failed: "{{userId}} के लिए सेशन नहीं बन सका: {{error}}",
    token_save_failed: "ऑथेंटिकेशन टोकन सेव नहीं हो सका",
    validation: {
      title: "वैलिडेशन विफल रहा",
      description: "कृपया अपना इनपुट जाँचें",
    },
    unauthorized: {
      title: "लॉगिन विफल रहा",
      description: "क्रेडेंशियल ग़लत हैं",
    },
    unknown: {
      title: "लॉगिन एरर",
      description: "लॉगिन के दौरान एरर हुआ",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "कनेक्शन विफल रहा",
    },
    forbidden: {
      title: "एक्सेस नहीं मिला",
      description: "लॉगिन की अनुमति नहीं है",
    },
    notFound: {
      title: "यूज़र नहीं मिला",
      description: "यूज़र अकाउंट नहीं मिला",
    },
    unsaved: {
      title: "बिना सेव किए बदलाव",
      description: "बदलाव सेव नहीं हुए",
    },
    conflict: {
      title: "लॉगिन में टकराव",
      description: "लॉगिन में टकराव मिला",
    },
    server: {
      title: "सर्वर एरर",
      description: "सर्वर में आंतरिक एरर हुआ",
    },
  },
  success: {
    title: "लॉगिन सफल",
    description: "आप लॉग इन हो गए हैं",
    message: "वापसी पर स्वागत है! आप सफलतापूर्वक लॉग इन हो गए हैं।",
  },
  token: {
    save: {
      failed: "ऑथेंटिकेशन टोकन सेव नहीं हो सका",
      success: "ऑथेंटिकेशन टोकन सेव हो गया",
    },
  },
  process: {
    failed: "लॉगिन प्रोसेस विफल रहा",
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  dev: {
    quickLogin: "डेव क्विक लॉगिन",
  },
};
