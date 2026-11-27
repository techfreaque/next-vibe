/**
 * Contact API translations (Hindi)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "किसी इंसान से बात करें",
  titleShort: "संपर्क करें",
  description:
    "कुछ काम नहीं कर रहा, या बस किसी असली इंसान से बात करनी है। हम यहाँ हैं। बताइए आपको क्या चाहिए, हमारी टीम का एक इंसान इसे पढ़ेगा और जवाब देगा।",
  category: "सिस्टम",
  summary: "लीड ट्रैकिंग के साथ कॉन्टैक्ट फ़ॉर्म सबमिशन प्रोसेस करें",
  tags: {
    contactForm: "कॉन्टैक्ट फ़ॉर्म",
    contactUs: "संपर्क करें",
    contactSubmission: "कॉन्टैक्ट सबमिशन",
    helpSupport: "मदद और सपोर्ट",
  },

  form: {
    label: "संपर्क करें",
    description:
      "इसे एक असली इंसान पढ़ेगा और जवाब देगा। कोई बॉट नहीं, कोई टालमटोल नहीं।",
    fields: {
      name: {
        label: "आपका नाम",
        description: "कॉन्टैक्ट फ़ॉर्म भेजने वाले व्यक्ति का पूरा नाम। कम से कम 2 अक्षर।",
        placeholder: "राहुल शर्मा",
      },
      email: {
        label: "ईमेल पता",
        description:
          "हम जवाब कहाँ भेजें। अगर आप लॉग इन हैं तो खाली छोड़ दें, हम आपके अकाउंट का ईमेल इस्तेमाल करेंगे।",
        placeholder: "rahul.sharma@example.com",
      },
      company: {
        label: "कंपनी",
        description: "पूछताछ से जुड़ी कंपनी या संस्था का नाम (वैकल्पिक)।",
        placeholder: "Acme Corp",
      },
      subject: {
        label: "विषय",
        description: "पूछताछ की कैटेगरी। इससे मैसेज सही टीम तक पहुँचता है।",
        placeholder: "सेवाओं के बारे में सामान्य सवाल",
      },
      message: {
        label: "मैसेज",
        description:
          "पूछताछ का पूरा टेक्स्ट। कम से कम 10 अक्षर। साफ़ बताइए कि आपको क्या चाहिए।",
        placeholder: "आपको क्या चाहिए? कुछ वाक्य काफ़ी हैं।",
      },
      priority: {
        label: "प्राथमिकता",
        description:
          "पूछताछ कितनी ज़रूरी है। 'ज़्यादा' या 'बहुत ज़रूरी' रिक्वेस्ट को जल्दी जवाब मिलता है।",
        placeholder: "प्राथमिकता चुनें",
      },
      leadId: {
        label: "Lead ID",
        description: "अंदरूनी लीड ट्रैकिंग ID (अपने आप भरता है)",
        placeholder: "lead_123",
      },
    },
    submitButton: {
      label: "मैसेज भेजें",
      loadingText: "भेजा जा रहा है...",
    },
  },

  subject: {
    helpSupport: "मदद और सपोर्ट",
    generalInquiry: "सामान्य सवाल",
    technicalSupport: "टेक्निकल सपोर्ट",
    accountQuestion: "अकाउंट से जुड़ा सवाल",
    billingQuestion: "बिलिंग से जुड़ा सवाल",
    salesInquiry: "सेल्स पूछताछ",
    featureRequest: "फ़ीचर रिक्वेस्ट",
    bugReport: "बग रिपोर्ट",
    feedback: "फ़ीडबैक",
    complaint: "शिकायत",
    partnership: "पार्टनरशिप",
    other: "अन्य",
  },

  priority: {
    low: "कम",
    medium: "मध्यम",
    high: "ज़्यादा",
    urgent: "बहुत ज़रूरी",
  },

  status: {
    new: "नया",
    inProgress: "काम चल रहा है",
    resolved: "हल हो गया",
    closed: "बंद",
  },

  response: {
    label: "कॉन्टैक्ट सबमिशन का जवाब",
    description: "आपके कॉन्टैक्ट सबमिशन के स्टेटस अपडेट",
    success: "संपर्क करने के लिए शुक्रिया! आपका मैसेज हमें मिल गया है, हम जल्द जवाब देंगे।",
    messageId: "ट्रैकिंग के लिए मैसेज ID",
    status: "कॉन्टैक्ट का मौजूदा स्टेटस",
  },

  examples: {
    requests: {
      general: {
        title: "सामान्य कॉन्टैक्ट पूछताछ",
        description: "सामान्य कॉन्टैक्ट फ़ॉर्म सबमिशन का उदाहरण",
      },
    },
    responses: {
      success: {
        title: "सफल सबमिशन",
        description: "सफल कॉन्टैक्ट फ़ॉर्म जवाब का उदाहरण",
      },
    },
  },

  errors: {
    createFailed: {
      title: "मैसेज नहीं भेजा जा सका",
      description:
        "अभी आपका कॉन्टैक्ट फ़ॉर्म प्रोसेस नहीं हो पाया। थोड़ी देर बाद फिर कोशिश करें।",
    },
    repositoryCreateFailed: "कॉन्टैक्ट रिक्वेस्ट नहीं बन पाई: {{error}}",
    repositoryCreateFailedForEmail: "{{email}} के लिए कॉन्टैक्ट रिक्वेस्ट नहीं बन पाई",
    repositoryCreateFailedWithDetails:
      "कॉन्टैक्ट रिक्वेस्ट नहीं बन पाई: {{error}}। {{details}}",
    repositoryCreateDetails:
      "अभी आपका कॉन्टैक्ट फ़ॉर्म प्रोसेस नहीं हो पाया। थोड़ी देर बाद फिर कोशिश करें।",
    noContactReturned: "बनाने के बाद कोई कॉन्टैक्ट रिकॉर्ड वापस नहीं आया",
    validation: {
      messageEmpty: "भेजने से पहले मैसेज लिखें।",
      title: "वैलिडेशन एरर",
      description: "अपनी जानकारी जाँचें और फिर कोशिश करें",
      nameMinLength: "नाम कम से कम 2 अक्षर का होना चाहिए",
      emailInvalid: "सही ईमेल पता डालें",
      emailRequired: "ईमेल पता दें ताकि हम आपको जवाब दे सकें",
      subjectRequired: "विषय ज़रूरी है",
      messageMinLength: "मैसेज कम से कम 10 अक्षर का होना चाहिए",
      priorityInvalid: "सही प्राथमिकता चुनें",
      statusInvalid: "स्टेटस की वैल्यू गलत है",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "आपकी रिक्वेस्ट प्रोसेस करते समय नेटवर्क एरर आया",
    },
    unauthorized: {
      title: "अनुमति नहीं",
      description: "आपको यह काम करने की अनुमति नहीं है",
    },
    forbidden: {
      title: "मना है",
      description: "यह काम करने की अनुमति नहीं है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "मांगा गया रिसोर्स नहीं मिला",
    },
    serverError: {
      title: "सर्वर एरर",
      description: "सर्वर में अंदरूनी एरर आया",
    },
    unknown: {
      title: "अनजान एरर",
      description: "एक अनजान एरर आया",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके कुछ बदलाव अभी सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "आपकी रिक्वेस्ट प्रोसेस करते समय टकराव हुआ",
    },
    email_generation_failed: "ईमेल नहीं बन पाया",
  },

  sms: {
    admin: {
      notification: "नई कॉन्टैक्ट पूछताछ: {name} ({email}) - {subject}",
      phone: {
        missing: "कॉन्टैक्ट नोटिफ़िकेशन के लिए कोई एडमिन फ़ोन नंबर सेट नहीं है",
      },
      send: {
        start: "कॉन्टैक्ट सबमिशन के लिए एडमिन नोटिफ़िकेशन SMS भेजा जा रहा है",
        error: "कॉन्टैक्ट के लिए एडमिन नोटिफ़िकेशन SMS भेजने में एरर",
      },
    },
    confirmation: {
      message: "{name}, आपके मैसेज के लिए शुक्रिया! हम जल्द जवाब देंगे।",
      phone: {
        missing: "कॉन्टैक्ट कन्फ़र्मेशन SMS के लिए यूज़र का फ़ोन नंबर नहीं है",
      },
      send: {
        start: "कॉन्टैक्ट फ़ॉर्म भेजने वाले को कन्फ़र्मेशन SMS भेजा जा रहा है",
        error: "कॉन्टैक्ट के लिए कन्फ़र्मेशन SMS भेजने में एरर",
      },
    },
  },

  repository: {
    create: {
      start: "कॉन्टैक्ट फ़ॉर्म सबमिशन शुरू हो रहा है",
      success: "कॉन्टैक्ट फ़ॉर्म सफलतापूर्वक भेजा गया",
      error: "कॉन्टैक्ट फ़ॉर्म सबमिशन बनाने में एरर",
    },
    lead: {
      conversion: {
        start: "कॉन्टैक्ट के लिए लीड कन्वर्ज़न शुरू हो रहा है",
        error: "कॉन्टैक्ट के लीड कन्वर्ज़न में एरर",
      },
      provided: "कॉन्टैक्ट सबमिशन के लिए Lead ID दी गई",
    },
    seed: {
      create: {
        start: "कॉन्टैक्ट सीड बनाना शुरू हो रहा है",
        error: "कॉन्टैक्ट सीड बनाने में एरर",
      },
    },
  },

  route: {
    sms: {
      admin: {
        failed: "कॉन्टैक्ट सबमिशन के लिए एडमिन नोटिफ़िकेशन SMS फ़ेल हुआ",
      },
      confirmation: {
        failed: "कॉन्टैक्ट सबमिशन के लिए कन्फ़र्मेशन SMS फ़ेल हुआ",
      },
    },
  },

  seeds: {
    dev: {
      start: "डेवलपमेंट एनवायरनमेंट के लिए कॉन्टैक्ट सीड शुरू हो रहे हैं",
      submission: {
        created: "डेवलपमेंट सीड में कॉन्टैक्ट सबमिशन बना",
        failed: "डेवलपमेंट सीड में कॉन्टैक्ट सबमिशन नहीं बन पाया",
        error: "डेवलपमेंट सीड में कॉन्टैक्ट सबमिशन बनाने में एरर",
      },
      complete: "कॉन्टैक्ट डेवलपमेंट सीड पूरे हुए",
      error: "कॉन्टैक्ट डेवलपमेंट डेटा सीड करने में एरर",
    },
    test: {
      start: "टेस्ट एनवायरनमेंट के लिए कॉन्टैक्ट सीड शुरू हो रहे हैं",
      submission: {
        created: "टेस्ट सीड में कॉन्टैक्ट सबमिशन बना",
        failed: "टेस्ट सीड में कॉन्टैक्ट सबमिशन नहीं बन पाया",
      },
      error: "कॉन्टैक्ट टेस्ट डेटा सीड करने में एरर",
    },
    prod: {
      start: "प्रोडक्शन एनवायरनमेंट के लिए कॉन्टैक्ट सीड शुरू हो रहे हैं",
      ready: "कॉन्टैक्ट प्रोडक्शन एनवायरनमेंट तैयार है",
      error: "कॉन्टैक्ट प्रोडक्शन डेटा सीड करने में एरर",
    },
  },

  noEmail: {
    warning: {
      title: "जवाब के लिए कोई पता नहीं",
      description:
        "ईमेल के बिना हम आपका मैसेज पढ़ तो सकते हैं, पर जवाब नहीं दे पाएँगे। अगर यह ठीक है तो फिर भी भेजें।",
      addEmail: "ईमेल जोड़ें",
      sendAnyway: "फिर भी भेजें",
    },
  },

  success: {
    title: "मैसेज भेज दिया गया",
    description: "आपका मैसेज मिल गया है। एक असली इंसान जवाब देगा।",
  },

  aiPrompt: {
    confirmBeforeSend: "यूज़र की ओर से कॉन्टैक्ट फ़ॉर्म भेजने से पहले हमेशा उनसे पुष्टि करें।",
    humanHelp:
      "अगर यूज़र परेशान, नाराज़ या अटका हुआ लगे, तो खुद आगे बढ़कर कॉन्टैक्ट फ़ॉर्म के ज़रिए हमारी सपोर्ट टीम के किसी इंसान से जोड़ने का ऑफ़र दें।",
    emailFallback:
      "अगर यूज़र लॉग इन है, तो उसका ईमेल पहले से हमारे पास है। उसे दोबारा देने की ज़रूरत नहीं।",
  },

  email: {
    // Legacy keys for existing email template compatibility
    partner: {
      greeting: "नमस्ते",
      thankYou: "संपर्क करने के लिए शुक्रिया!",
      message: "मैसेज",
      additionalInfo: "आपकी पूछताछ हमें मिल गई है, हम जल्द जवाब देंगे।",
      subject: "कॉन्टैक्ट फ़ॉर्म सबमिशन",
    },
    company: {
      contactDetails: "संपर्क विवरण",
      name: "नाम",
      email: "ईमेल",
      company: "कंपनी",
      contactSubject: "विषय",
      viewDetails: "एडमिन में देखें",
    },
    // User confirmation email
    user_confirmation: {
      title: "आपका मैसेज मिल गया!",
      subject: "{{appName}} से संपर्क करने के लिए शुक्रिया",
      previewText: "आपका मैसेज मिल गया है। हम जल्द जवाब देंगे।",
      greeting: "नमस्ते {{name}},",
      thankYou: "{{appName}} से संपर्क करने के लिए शुक्रिया!",
      confirmation:
        "आपका मैसेज हम तक पहुँच गया है। हर मैसेज एक इंसान पढ़ता है, और हम जितनी जल्दी हो सके जवाब देते हैं।",
      yourMessage: "आपका मैसेज",
      subject_label: "विषय",
      message_label: "मैसेज",
      whatHappensNext: "आगे क्या होगा?",
      step1: "एक इंसान आपका मैसेज पढ़ेगा",
      step2: "हम जितनी जल्दी हो सके जवाब देंगे",
      step3: "हम मिलकर आपकी ज़रूरत पूरी करेंगे",
      needUrgentHelp: "तुरंत मदद चाहिए?",
      urgentHelpInfo: "कई सवालों के जवाब हमारे हेल्प सेंटर में पहले से मौजूद हैं।",
      helpCenterButton: "हेल्प सेंटर देखें",
      signoff: "{{appName}} चुनने के लिए शुक्रिया,\n{{appName}} सपोर्ट टीम",
      footer: "यह {{appName}} की ओर से एक ऑटोमैटिक कन्फ़र्मेशन है",
    },
    // Admin notification email
    admin_notification: {
      title: "नया कॉन्टैक्ट फ़ॉर्म सबमिशन",
      subject: "नया कॉन्टैक्ट: {{name}} - {{subject}}",
      previewText: "{{name}} ({{email}}) की नई पूछताछ",
      message: "एक नया कॉन्टैक्ट फ़ॉर्म सबमिशन आया है।",
      contactDetails: "संपर्क विवरण",
      name: "नाम",
      email: "ईमेल",
      company: "कंपनी",
      subject_label: "विषय",
      priority: "प्राथमिकता",
      message_label: "मैसेज",
      submittedAt: "भेजने का समय",
      leadInfo: "लीड की जानकारी",
      leadId: "Lead ID",
      status: "स्टेटस",
      actionRequired: "कार्रवाई ज़रूरी",
      actionInfo: "इस पूछताछ को देखें और जितनी जल्दी हो सके जवाब दें।",
      viewInAdmin: "एडमिन पैनल में देखें",
      replyToContact: "कॉन्टैक्ट को जवाब दें",
      footer: "यह {{appName}} की ओर से एक ऑटोमैटिक नोटिफ़िकेशन है",
    },
  },

  error: {
    general: {
      internal_server_error: "सर्वर में अंदरूनी एरर आया",
    },
  },

  emailTemplates: {
    contactForm: {
      meta: {
        name: "कॉन्टैक्ट फ़ॉर्म नोटिफ़िकेशन",
        description:
          "कॉन्टैक्ट फ़ॉर्म भेजे जाने पर भेजने वाले और कंपनी टीम को जाने वाला ईमेल",
        category: "संपर्क",
      },
      preview: {
        name: {
          label: "भेजने वाले का नाम",
          description: "कॉन्टैक्ट फ़ॉर्म भेजने वाले व्यक्ति का पूरा नाम",
        },
        email: {
          label: "भेजने वाले का ईमेल",
          description: "फ़ॉर्म भेजने वाले व्यक्ति का ईमेल पता",
        },
        company: {
          label: "कंपनी का नाम",
          description: "भेजने वाले की कंपनी का नाम (वैकल्पिक)",
        },
        subject: {
          label: "मैसेज का विषय",
          description: "कॉन्टैक्ट मैसेज की सब्जेक्ट लाइन",
        },
        priority: {
          label: "प्राथमिकता",
          description: "पूछताछ कितनी ज़रूरी है",
        },
        message: {
          label: "मैसेज का टेक्स्ट",
          description: "कॉन्टैक्ट फ़ॉर्म का मुख्य मैसेज",
        },
        isForCompany: {
          label: "कंपनी ईमेल फ़्लैग",
          description: "यह ईमेल कंपनी (एडमिन) के लिए है या भेजने वाले (कन्फ़र्मेशन) के लिए",
        },
        userId: {
          label: "User ID",
          description: "ट्रैकिंग के लिए User ID (वैकल्पिक)",
        },
        leadId: {
          label: "Lead ID",
          description: "CRM ट्रैकिंग के लिए Lead ID (वैकल्पिक)",
        },
      },
    },
    adminContact: {
      meta: {
        name: "एडमिन कॉन्टैक्ट नोटिफ़िकेशन",
        description:
          "नया कॉन्टैक्ट फ़ॉर्म आने पर एडमिन को भेजा जाने वाला अंदरूनी नोटिफ़िकेशन ईमेल",
        category: "एडमिन",
      },
      preview: {
        name: {
          label: "भेजने वाले का नाम",
        },
        email: {
          label: "भेजने वाले का ईमेल",
        },
        subject: {
          label: "मैसेज का विषय",
        },
        priority: {
          label: "प्राथमिकता",
        },
        message: {
          label: "मैसेज का टेक्स्ट",
        },
        company: {
          label: "कंपनी का नाम",
        },
        userId: {
          label: "User ID",
        },
        leadId: {
          label: "Lead ID",
        },
      },
    },
  },
};
