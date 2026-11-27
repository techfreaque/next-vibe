import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम",

  errors: {
    readFailed: "सिस्टम सेटिंग पढ़ी नहीं जा सकीं",
    writeFailed: ".env फ़ाइल में सेटिंग लिखी नहीं जा सकीं",
    readOnly: "इस एनवायरनमेंट में कॉन्फ़िगरेशन रीड-ओनली है",
    defaultPasswordDetected: "डिफ़ॉल्ट एडमिन पासवर्ड मिला",
    passwordNotConfigured: "एडमिन पासवर्ड सेट नहीं है",
  },

  messages: {
    settingsUpdated: "सेटिंग अपडेट हो गईं",
  },

  get: {
    title: "सिस्टम सेटिंग",
    titleShort: "सिस्टम सेटिंग",
    description: "मॉड्यूल के हिसाब से बँटा एनवायरनमेंट कॉन्फ़िगरेशन देखें और मैनेज करें",
    tags: {
      settings: "सेटिंग्स",
    },
    response: {
      modules: {
        title: "कॉन्फ़िगरेशन मॉड्यूल",
      },
      isWritable: {
        title: "लिखने लायक",
      },
      isDevMode: {
        title: "Dev मोड",
      },
      needsOnboarding: {
        title: "ऑनबोर्डिंग ज़रूरी है",
      },
      onboardingIssues: {
        title: "ऑनबोर्डिंग की समस्याएँ",
      },
      wizardSteps: {
        title: "सेटअप विज़ार्ड स्टेप",
      },
    },
    success: {
      title: "सेटिंग लोड हो गईं",
      description: "एनवायरनमेंट सेटिंग सफलतापूर्वक मिल गईं",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "सेटिंग्स नहीं मिलीं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      server: {
        title: "सर्वर एरर",
        description: "सेटिंग लोड नहीं हो सकीं",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
    },
  },

  patch: {
    title: "सेटिंग अपडेट करें",
    titleShort: "सेटिंग अपडेट करें",
    description: ".env फ़ाइल में एनवायरनमेंट कॉन्फ़िगरेशन वैल्यू अपडेट करें",
    tags: {
      settings: "सेटिंग्स",
    },
    fields: {
      settings: {
        label: "सेटिंग्स",
        description: "अपडेट होने वाली key-value जोड़ियाँ",
      },
    },
    response: {
      updated: {
        title: "अपडेट हुई कीज़",
      },
      needsRestart: {
        title: "रीस्टार्ट ज़रूरी",
      },
      resultMessage: {
        title: "सेटिंग अपडेट हो गईं",
      },
    },
    success: {
      title: "सेटिंग्स सेव हो गईं",
      description: "एनवायरनमेंट सेटिंग सफलतापूर्वक अपडेट हो गईं",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "सेटिंग की वैल्यू गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "सेटिंग्स नहीं मिलीं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      server: {
        title: "सर्वर एरर",
        description: "सेटिंग्स सेव नहीं हो पाईं",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
    },
  },

  widget: {
    title: "सिस्टम कॉन्फ़िगरेशन",
    subtitle: "मॉड्यूल के हिसाब से एनवायरनमेंट वेरिएबल",
    readOnlyBanner:
      "कॉन्फ़िगरेशन रीड-ओनली है। .env फ़ाइल सीधे एडिट करें या CLI इस्तेमाल करें।",
    onboardingBanner: "सेटअप ज़रूरी है। शुरू करने के लिए हाइलाइट किए फ़ील्ड भरें।",
    defaultPasswordWarning: "डिफ़ॉल्ट एडमिन पासवर्ड मिला! इसे तुरंत बदलें।",
    cancel: "रद्द करें",
    save: "बदलाव सेव करें",
    saving: "सेव हो रहा है...",
    apply: "लागू करें और रीस्टार्ट करें",
    applying: "लागू हो रहा है...",
    saved: "सेटिंग्स सफलतापूर्वक सेव हुईं",
    restartRequired: "सेटिंग सेव हो गईं। बदलाव लागू करने के लिए रीस्टार्ट ज़रूरी है।",
    devRestartHint:
      "बदलाव लागू करने के लिए dev सर्वर रीस्टार्ट करें (Ctrl+C, फिर vibe dev चलाएँ)।",
    notSet: "सेट नहीं है",
    configured: "कॉन्फ़िगर है",
    partial: "आंशिक",
    notConfigured: "कॉन्फ़िगर नहीं है",
    required: "ज़रूरी",
    selectPlaceholder: "चुनें...",
    boolTrue: "चालू",
    boolFalse: "बंद",
    logPathDisabled: "फ़ाइल लॉगिंग बंद है",
    openSetup: "सेटअप खोलें",
    restartWizard: "सेटअप विज़ार्ड",
    exportProd: "प्रोडक्शन के लिए एक्सपोर्ट करें",
    generate: "जनरेट करें",
    editConfirmHint: "[Enter] कन्फ़र्म  [Esc] रद्द करें",
    editSettings: "सेटिंग्स बदलें",
    exit: "बाहर निकलें",
    loading: "सेटिंग लोड हो रही हैं...",
    moduleLabels: {
      env: "Core",
      agent: "AI प्रोवाइडर",
      leadsCampaigns: "लीड कैंपेन",
      messenger: "Messenger / SMTP",
      imap: "IMAP",
      payment: "पेमेंट",
      sms: "SMS",
      serverSystem: "सर्वर / प्लेटफ़ॉर्म",
    },
  },

  wizard: {
    title: "Vibe सेटअप में स्वागत है",
    subtitle: "तीन छोटे स्टेप, फिर चैट शुरू।",
    alreadyConfigured: "पहले से कॉन्फ़िगर है",
    stepOf: "स्टेप {{step}} / {{total}}",
    next: "अगला",
    continue: "आगे बढ़ें",
    back: "वापस",
    skip: "यह स्टेप छोड़ें",
    finish: "सेटअप पूरा करें",
    restart: "विज़ार्ड दोबारा शुरू करें",
    done: "सेटअप पूरा",
    doneSubtitle: "आपका इंस्टेंस तैयार है। कोई भी सेटिंग बाद में 'सभी सेटिंग देखें' में बदलें।",
    goToSettings: "पूरी सेटिंग पर जाएँ",
    startChatting: "चैट शुरू करें",
    viewAllSettings: "सभी सेटिंग देखें",
    encryptionNote: "एन्क्रिप्टेड सेव होता है। इसे कोई सादे टेक्स्ट में वापस नहीं पढ़ सकता।",
    autoGeneratedNote: "आपके लिए बनाया गया। इसे रखें, या अपना पेस्ट करें।",
    steps: {
      admin: "एडमिन अकाउंट",
      database: "डेटाबेस",
      security: "सिक्योरिटी कीज़",
      ai: "AI प्रोवाइडर",
    },
    ai: {
      claudeCodeTitle: "Claude Code (इस मशीन पर मिला)",
      claudeCodeDescription:
        "आपका लोकल Claude CLI सेशन इस्तेमाल करता है। API की की ज़रूरत नहीं।",
      claudeDetected:
        "Claude CLI मिला। पक्का करें कि आप `claude login` से लॉग इन हैं।",
      claudeNotDetected:
        "Claude CLI नहीं मिला। इसे claude.ai/code से इंस्टॉल करके `claude login` चलाएँ, या इस पेज का कोई और विकल्प चुनें।",
      claudeInstallHint:
        "वैकल्पिक। आपका unbottled.ai अकाउंट या OpenRouter की भी उतना ही अच्छा काम करती है।",
      openRouterTitle: "OpenRouter API की",
      openRouterDescription:
        "एक की से सैकड़ों मॉडल। अकेले चलती है या Claude Code के साथ भी।",
      openRouterHint:
        "openrouter.ai/keys पर की लें। फ़्री मॉडल के लिए क्रेडिट कार्ड नहीं चाहिए।",
      recommended: "सुझाया गया",
      unbottledTitle: "आपका unbottled.ai अकाउंट",
      unbottledDescription:
        "एक बार साइन इन करें और इस इंस्टेंस को unbottled.ai के सभी मॉडल मिल जाते हैं। चैट आपके डेटाबेस में रहती हैं, मॉडल यूसेज आपके क्रेडिट से बिल होता है। पेड प्लान या क्रेडिट पैक चाहिए।",
      unbottledNoAccount:
        "अकाउंट नहीं है? unbottled.ai पर बनाएँ, फिर यहाँ साइन इन करें।",
      unbottledConnected: "{{url}} से जुड़ गया",
      unbottledDisconnected: "जुड़ा नहीं है",
      unbottledSignIn: "साइन इन करें",
      unbottledSigningIn: "साइन इन हो रहा है...",
      unbottledDisconnect: "डिस्कनेक्ट करें",
      unbottledEmail: "ईमेल",
      unbottledPassword: "पासवर्ड",
      unbottledRemoteUrl: "क्लाउड URL",
      unbottledLoginFailed: "साइन इन फ़ेल हुआ। ईमेल और पासवर्ड जाँचें।",
      unbottledConnectionError: "सर्वर तक नहीं पहुँच सके। URL जाँचें।",
      orDivider: "या अपना प्रोवाइडर लाएँ",
    },
  },

  post: {
    title: "unbottled.ai पर साइन इन करें",
    titleShort: "Unbottled लॉगिन",
    description: "सर्वर-साइड प्रॉक्सी लॉगिन, क्रेडेंशियल आपके सर्वर से बाहर नहीं जाते",
    tags: { settings: "Unbottled लॉगिन" },
    fields: {
      email: {
        label: "ईमेल",
        description: "unbottled.ai अकाउंट का ईमेल",
        placeholder: "you@example.com",
      },
      password: {
        label: "पासवर्ड",
        description: "unbottled.ai अकाउंट का पासवर्ड",
        placeholder: "पासवर्ड",
      },
      remoteUrl: {
        label: "रिमोट URL",
        description: "unbottled.ai इंस्टेंस URL",
        placeholder: "https://unbottled.ai",
      },
      credential: {
        label: "क्रेडेंशियल",
        description: "एन्कोड किया हुआ क्रेडेंशियल स्ट्रिंग",
      },
      syncScope: {
        label: "सिंक स्कोप",
        description: "इस कनेक्शन पर कौन सा डेटा सिंक होता है।",
      },
    },
    success: { title: "साइन इन हो गया", description: "क्रेडेंशियल मिल गया" },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "ईमेल, पासवर्ड और URL जाँचें",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      network: {
        title: "कनेक्शन फ़ेल",
        description: "रिमोट इंस्टेंस तक नहीं पहुँच सके",
      },
      server: { title: "लॉगिन फ़ेल", description: "ईमेल या पासवर्ड गलत है" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: { title: "टकराव", description: "टकराव हो गया" },
    },
  },

  export: {
    title: "प्रोडक्शन के लिए एक्सपोर्ट करें",
    subtitle:
      "अपने सर्वर पर डिप्लॉय करने के लिए तैयार .env फ़ाइल बनाएँ। संवेदनशील वैल्यू सादे टेक्स्ट में दिखती हैं, इसलिए फ़ाइल सुरक्षित रखें।",
    copyButton: "क्लिपबोर्ड पर कॉपी करें",
    copied: "कॉपी हो गया!",
    downloadButton: ".env.prod डाउनलोड करें",
    instructions:
      "इस फ़ाइल को अपने सर्वर पर कॉपी करें:\n  scp .env.prod user@yourserver:/app/.env\nया हाथ से पेस्ट करें:\n  ssh user@yourserver && nano /app/.env",
    checklist: "डिप्लॉयमेंट चेकलिस्ट",
    close: "बंद करें",
  },
};
