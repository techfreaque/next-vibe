import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र",
  title: "पासवर्ड रीसेट रिक्वेस्ट",
  description: "पासवर्ड रीसेट की रिक्वेस्ट करें",
  tag: "पासवर्ड रीसेट",
  ui: {
    title: "अपना पासवर्ड रीसेट करें",
    subtitle: "अपना ईमेल पता डालें, हम आपको पासवर्ड रीसेट करने का लिंक भेजेंगे",
    sendResetLink: "रीसेट लिंक भेजें",
    alreadyHaveAccount: "पहले से अकाउंट है? लॉग इन करें",
  },
  actions: {
    submitting: "भेज रहे हैं...",
  },
  email: {
    title: "अपना {{appName}} पासवर्ड रीसेट करें",
    subject: "पासवर्ड रीसेट रिक्वेस्ट - {{appName}}",
    previewText: "अपना {{appName}} पासवर्ड रीसेट करें। लिंक {{hours}} घंटे तक वैलिड है।",
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
      label: "ईमेल पता",
      description: "अपना ईमेल पता डालें",
      placeholder: "your@email.com",
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
    no_email: "{{email}} के लिए कोई अकाउंट नहीं मिला",
    email_generation_failed:
      "{{email}} के लिए रीसेट ईमेल नहीं बन पाया: {{errorMessage}}",
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
};
