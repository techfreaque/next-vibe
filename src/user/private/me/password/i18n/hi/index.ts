import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र प्रोफ़ाइल",

  title: "पासवर्ड बदलें",
  titleShort: "पासवर्ड बदलें",
  description: "अपना मौजूदा पासवर्ड कन्फ़र्म करें, फिर नया सेट करें।",
  tag: "password-change",
  debug: {
    updatingPassword: "पासवर्ड अपडेट हो रहा है",
    errorUpdatingPassword: "पासवर्ड अपडेट करने में एरर",
    settingPassword: "पासवर्ड सेट हो रहा है",
    errorSettingPassword: "पासवर्ड सेट करने में एरर",
  },
  groups: {
    currentCredentials: {
      title: "मौजूदा पासवर्ड",
      description: "आगे बढ़ने के लिए अपना मौजूदा पासवर्ड वेरिफ़ाई करें",
    },
    newCredentials: {
      title: "नया पासवर्ड",
      description: "अपने अकाउंट के लिए मज़बूत नया पासवर्ड चुनें",
    },
  },
  currentPassword: {
    label: "मौजूदा पासवर्ड",
    description: "अपना मौजूदा पासवर्ड लिखें",
    placeholder: "आपका मौजूदा पासवर्ड",
    help: "बदलने से पहले अपनी पहचान वेरिफ़ाई करने के लिए मौजूदा पासवर्ड लिखें",
  },
  newPassword: {
    label: "नया पासवर्ड",
    description: "कम से कम 8 अक्षर।",
    placeholder: "कम से कम 8 अक्षर",
    help: "कम से कम 8 अक्षर का मज़बूत पासवर्ड चुनें, जिसमें अक्षर, संख्याएँ और सिंबल हों",
  },
  confirmPassword: {
    label: "नया पासवर्ड दोहराएँ",
    description: "अपना नया पासवर्ड कन्फ़र्म करें",
    placeholder: "इसे दोबारा लिखें",
    help: "सही टाइप हुआ है यह पक्का करने के लिए नया पासवर्ड दोबारा लिखें",
  },
  twoFactorCode: {
    label: "टू-फ़ैक्टर कोड",
    description: "अगर चालू है तो अपना टू-फ़ैक्टर ऑथेंटिकेशन कोड लिखें",
    placeholder: "2FA कोड लिखें",
  },
  response: {
    title: "पासवर्ड बदलने का रिस्पॉन्स",
    description: "पासवर्ड बदलने के ऑपरेशन का रिस्पॉन्स",
    success: "पासवर्ड बदल गया",
    message: "स्टेटस मैसेज",
    securityTip: "सिक्योरिटी टिप",
    nextSteps: {
      item: "अगले कदम",
    },
  },
  validation: {
    currentPassword: {
      minLength: "मौजूदा पासवर्ड कम से कम 8 अक्षर का होना चाहिए",
    },
    newPassword: {
      minLength: "नया पासवर्ड कम से कम 8 अक्षर का होना चाहिए",
    },
    confirmPassword: {
      minLength: "पासवर्ड कन्फ़र्मेशन कम से कम 8 अक्षर का होना चाहिए",
    },
    passwords: {
      mismatch: "पासवर्ड मेल नहीं खाते",
    },
  },
  errors: {
    passwords_do_not_match: "पासवर्ड मेल नहीं खाते",
    user_not_found: "यूज़र {{userId}} नहीं मिला",
    incorrect_password: "ग़लत पासवर्ड",
    update_failed: "पासवर्ड अपडेट नहीं हो सका",
    token_creation_failed: "पासवर्ड टोकन नहीं बन सका",
    two_factor_code_required: "टू-फ़ैक्टर ऑथेंटिकेशन कोड ज़रूरी है",
    invalid_two_factor_code: "टू-फ़ैक्टर ऑथेंटिकेशन कोड ग़लत है",
    invalid_request: {
      title: "अमान्य रिक्वेस्ट",
      description: "पासवर्ड बदलने की रिक्वेस्ट अमान्य है",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "पासवर्ड बदलने के लिए आपका लॉग इन होना ज़रूरी है",
    },
    server: {
      title: "सर्वर एरर",
      description: "सर्वर एरर की वजह से पासवर्ड अपडेट नहीं हो सका",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "पासवर्ड अपडेट करते समय अनपेक्षित एरर हुआ",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क कनेक्शन विफल रहा",
    },
    forbidden: {
      title: "एक्सेस प्रतिबंधित है",
      description: "आपको यह कार्रवाई करने की अनुमति नहीं है",
    },
    notFound: {
      title: "यूज़र नहीं मिला",
      description: "यूज़र अकाउंट नहीं मिला",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके कुछ बदलाव सेव नहीं हुए हैं और खो जाएँगे",
    },
    conflict: {
      title: "डेटा में टकराव",
      description: "पासवर्ड अपडेट करते समय टकराव हुआ",
    },
  },
  success: {
    updated: "पासवर्ड सफलतापूर्वक अपडेट हो गया",
    securityTip: "बेहतर सुरक्षा के लिए टू-फ़ैक्टर ऑथेंटिकेशन चालू करें",
    nextSteps: {
      logoutOther:
        "बाकी सभी सेशन साइन आउट हो जाते हैं। अगली बार नया पासवर्ड इस्तेमाल करें।",
      enable2fa: "बेहतर सुरक्षा के लिए टू-फ़ैक्टर ऑथेंटिकेशन चालू करने पर विचार करें",
    },
    title: "पासवर्ड अपडेट हो गया",
    description: "आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है",
  },
  update: {
    success: {
      title: "पासवर्ड अपडेट हो गया",
      description: "आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है",
    },
    errors: {
      unknown: {
        title: "अज्ञात एरर",
        description: "पासवर्ड अपडेट करते समय अनपेक्षित एरर हुआ",
      },
    },
  },
  widget: {
    back: "वापस",
    submit: "पासवर्ड अपडेट करें",
    submitting: "अपडेट हो रहा है...",
  },
};
