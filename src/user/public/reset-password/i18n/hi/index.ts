import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: {
    category: "यूज़र",

    title: "पासवर्ड रीसेट कन्फ़र्म करें",
    titleShort: "रीसेट कन्फ़र्म करें",
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
  },
  request: {
    category: "यूज़र",
    title: "पासवर्ड रीसेट रिक्वेस्ट",
    titleShort: "पासवर्ड रीसेट करें",
    description: "पासवर्ड रीसेट की रिक्वेस्ट करें",
    tag: "पासवर्ड रीसेट",
    ui: {
      title: "अपना पासवर्ड रीसेट करें",
      subtitle: "अपना ईमेल डालें। हम आपको रीसेट लिंक भेजेंगे।",
      sendResetLink: "रीसेट लिंक भेजें",
      alreadyHaveAccount: "पहले से अकाउंट है? लॉग इन करें",
    },
    actions: {
      submitting: "भेज रहे हैं...",
    },
    email: {
      title: "अपना {{appName}} पासवर्ड रीसेट करें",
      subject: "पासवर्ड रीसेट रिक्वेस्ट - {{appName}}",
      previewText:
        "अपना {{appName}} पासवर्ड रीसेट करें। लिंक {{hours}} घंटे तक वैलिड है।",
      greeting: "नमस्ते {{name}},",
      requestInfo:
        "किसी ने आपके {{appName}} अकाउंट का पासवर्ड रीसेट करने की रिक्वेस्ट की है। अगर यह आप थे, तो नीचे बटन पर क्लिक करें।",
      buttonText: "मेरा पासवर्ड रीसेट करें",
      expirationInfo:
        "लिंक {{hours}} घंटे में एक्सपायर हो जाएगा। अगर आपने यह रिक्वेस्ट नहीं की, तो इस ईमेल को अनदेखा करें। आपका पासवर्ड नहीं बदला है।",
      signoff: "{{appName}} टीम",
      promoText: "{{modelCount}} AI मॉडल। कोई फ़िल्टर नहीं। कोई भाषण नहीं।",
    },
    groups: {
      emailInput: {
        title: "ईमेल डालें",
        description: "रीसेट के निर्देश पाने के लिए अपना ईमेल पता डालें",
      },
    },
    fields: {
      email: {
        label: "ईमेल",
        description: "अपना ईमेल पता डालें",
        placeholder: "you@example.com",
        help: "अपने अकाउंट से जुड़ा ईमेल पता डालें",
        validation: {
          invalid: "कृपया सही ईमेल पता डालें",
        },
      },
    },
    response: {
      title: "रीसेट रिक्वेस्ट रिस्पॉन्स",
      description: "पासवर्ड रीसेट रिक्वेस्ट का रिस्पॉन्स",
      success: {
        message: "पासवर्ड रीसेट लिंक भेज दिया गया",
      },
      deliveryInfo: {
        estimatedTime: "5 मिनट के अंदर",
        expiresAt: "अब से 4 घंटे बाद",
      },
      nextSteps: {
        checkEmail: "अपना ईमेल इनबॉक्स और स्पैम फ़ोल्डर देखें",
        clickLink: "ईमेल में आए रीसेट लिंक पर क्लिक करें",
        createPassword: "नया और सुरक्षित पासवर्ड बनाएँ",
      },
    },
    errors: {
      title: "एरर",
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत इनपुट दिया गया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "रिक्वेस्ट की अनुमति नहीं है",
      },
      internal: {
        title: "अंदरूनी एरर",
        description: "सर्वर में अंदरूनी एरर",
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
        description: "एक्सेस की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      unsaved: {
        title: "बदलाव सेव नहीं हुए",
        description: "बदलाव सेव नहीं हुए",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
      no_email: "इस ईमेल पते से कोई अकाउंट नहीं मिला",
      email_generation_failed: "ईमेल नहीं बन पाया",
    },
    success: {
      title: "रिक्वेस्ट भेज दी गई",
      description: "पासवर्ड रीसेट रिक्वेस्ट भेज दी गई",
    },
    post: {
      title: "रिक्वेस्ट",
      description: "रिक्वेस्ट एंडपॉइंट",
      form: {
        title: "रिक्वेस्ट कॉन्फ़िगरेशन",
        description: "रिक्वेस्ट पैरामीटर कॉन्फ़िगर करें",
      },
      response: {
        title: "रिस्पॉन्स",
        description: "रिक्वेस्ट रिस्पॉन्स डेटा",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर में अंदरूनी एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "एक अज्ञात एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        forbidden: {
          title: "एक्सेस नहीं है",
          description: "एक्सेस की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा में टकराव हुआ",
        },
      },
      success: {
        title: "हो गया",
        description: "काम सफलतापूर्वक पूरा हुआ",
      },
    },
    emailTemplates: {
      request: {
        name: "पासवर्ड रीसेट रिक्वेस्ट ईमेल",
        description: "यूज़र को पासवर्ड रीसेट लिंक के साथ भेजा जाने वाला ईमेल",
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
          passwordResetUrl: {
            label: "पासवर्ड रीसेट URL",
            description: "पासवर्ड रीसेट करने का URL",
          },
        },
      },
    },
  },
  validate: {
    category: "यूज़र",

    title: "पासवर्ड रीसेट टोकन वैलिडेट करें",
    titleShort: "टोकन वैलिडेट करें",
    description: "पासवर्ड रीसेट टोकन वैलिडेशन एंडपॉइंट",
    tag: "पासवर्ड रीसेट वैलिडेशन",
    groups: {
      tokenInput: {
        title: "टोकन वैलिडेशन",
        description: "वैलिडेट करने के लिए पासवर्ड रीसेट टोकन डालें",
      },
    },
    fields: {
      token: {
        label: "रीसेट टोकन",
        description: "ईमेल में आया पासवर्ड रीसेट टोकन",
        placeholder: "रीसेट टोकन डालें",
        help: "ईमेल में मिला टोकन डालें",
        validation: {
          required: "रीसेट टोकन ज़रूरी है",
        },
      },
    },
    response: {
      title: "वैलिडेशन नतीजा",
      description: "टोकन वैलिडेशन रिस्पॉन्स",
      valid: "टोकन वैलिड है",
      message: "वैलिडेशन मैसेज",
      validationMessage: "रीसेट टोकन वैलिडेशन पूरा हुआ",
      userId: "यूज़र ID",
      expiresAt: "टोकन एक्सपायरी",
      nextSteps: {
        item: "वैलिडेशन के बाद अगले कदम",
        setPassword: "अपना नया पासवर्ड सेट करें",
        choosePassword: "मज़बूत और यूनिक पासवर्ड चुनें",
      },
    },
    errors: {
      title: "एरर",
      validation: {
        title: "वैलिडेशन एरर",
        description: "टोकन वैलिडेशन फ़ेल हो गया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "टोकन गलत है या एक्सपायर हो गया है",
      },
      internal: {
        title: "अंदरूनी एरर",
        description: "सर्वर में अंदरूनी एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "एक अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "एक्सेस की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "टोकन नहीं मिला",
      },
      unsaved: {
        title: "बदलाव सेव नहीं हुए",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
    },
    success: {
      title: "टोकन वैलिड है",
      description: "पासवर्ड रीसेट टोकन वैलिड है",
    },
    post: {
      title: "वैलिडेट करें",
      description: "वैलिडेट एंडपॉइंट",
      form: {
        title: "वैलिडेट कॉन्फ़िगरेशन",
        description: "वैलिडेट पैरामीटर कॉन्फ़िगर करें",
      },
      response: {
        title: "रिस्पॉन्स",
        description: "वैलिडेट रिस्पॉन्स डेटा",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर में अंदरूनी एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "एक अज्ञात एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        forbidden: {
          title: "एक्सेस नहीं है",
          description: "एक्सेस की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा में टकराव हुआ",
        },
      },
      success: {
        title: "हो गया",
        description: "काम सफलतापूर्वक पूरा हुआ",
      },
    },
  },
  actions: {
    back: "वापस",
    submit: "भेजें",
    submitting: "भेज रहे हैं...",
  },
  success: {
    password_reset: "आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है।",
  },
  errors: {
    tokenValidationFailed: "टोकन वैलिडेशन फ़ेल हो गया",
    userLookupFailed: "यूज़र नहीं खोजा जा सका",
    tokenDeletionFailed: "टोकन डिलीट नहीं हो सका",
    userDeletionFailed: "यूज़र डिलीट नहीं हो सका",
    resetFailed: "पासवर्ड रीसेट फ़ेल हो गया",
    tokenCreationFailed: "रीसेट टोकन नहीं बन सका",
    noDataReturned: "डेटाबेस से कोई डेटा नहीं मिला",
    tokenInvalid: "रीसेट टोकन गलत है",
    tokenExpired: "रीसेट टोकन एक्सपायर हो गया है",
    tokenVerificationFailed: "टोकन वेरिफ़िकेशन फ़ेल हो गया",
    userNotFound: "यूज़र नहीं मिला",
    passwordUpdateFailed: "पासवर्ड अपडेट नहीं हो सका",
    passwordResetFailed: "पासवर्ड रीसेट फ़ेल हो गया",
    requestFailed: "रीसेट रिक्वेस्ट फ़ेल हो गई",
    emailMismatch: "ईमेल मेल नहीं खाता",
    confirmationFailed: "पासवर्ड रीसेट कन्फ़र्मेशन फ़ेल हो गया",
  },
};
