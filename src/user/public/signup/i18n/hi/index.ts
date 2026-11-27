import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  bounceSync: {
    title: "साइन अप ईमेल डिलीवरी फ़ेल्योर सिंक करें",
    description: "सिस्टम इनबॉक्स में फ़ेल हुए साइन अप कन्फ़र्मेशन ईमेल देखें।",
    marked: "साइन अप अपडेट हुए",
    result: "अपडेट हुए साइन अप: {{count}}",
    productionOnly: "साइन अप डिलीवरी सिंक सिर्फ़ प्रोडक्शन पर चलता है।",
    mailboxUnavailable: "फ़ेल हुए साइन अप ईमेल के लिए सिस्टम इनबॉक्स नहीं देखा जा सका।",
  },
  events: {
    started: "साइन अप शुरू हुआ",
    emailSent: "कन्फ़र्मेशन ईमेल भेजा गया",
    sendFailed: "कन्फ़र्मेशन ईमेल नहीं भेजा जा सका",
    bounced: "कन्फ़र्मेशन ईमेल बाउंस हुआ",
    expired: "कन्फ़र्मेशन एक्सपायर हुआ",
    confirmed: "ईमेल कन्फ़र्म हुआ",
    reminderSent: "रिमाइंडर भेजा गया",
  },
  reminder: {
    subject: "आपका {{appName}} अकाउंट बस एक क्लिक दूर है",
    hint: "आपने साइन अप शुरू किया, पर ईमेल कन्फ़र्म नहीं किया। अभी कन्फ़र्म करें और हर महीने {{credits}} फ़्री क्रेडिट पाएँ। यह कोड और नीचे का बटन 24 घंटे तक काम करेंगे और पहले ईमेल वाले कोड और बटन की जगह लेंगे।",
    button: "कन्फ़र्म करें और लॉग इन करें",
    ignore:
      "आपने साइन अप नहीं किया? इस ईमेल को अनदेखा करें। क्लिक किए बिना कोई अकाउंट नहीं बनेगा।",
  },
  confirmation: {
    linkSent:
      "हमने नया कन्फ़र्मेशन ईमेल भेजा है। उसे खोलें और लॉग इन करने के लिए लिंक पर क्लिक करें।",
    bouncedTitle: "हम आपका कन्फ़र्मेशन ईमेल नहीं पहुँचा पाए",
    changeAddress: "ईमेल पता बदलें",
    description: "ईमेल में आए कोड या लिंक से साइन अप पूरा करें।",
    title: "अपना इनबॉक्स देखें",
    sent: "{{email}} पर भेजा गया कोड डालें। यह 30 मिनट में एक्सपायर हो जाएगा।",
    code: "6 अंकों का कोड",
    confirm: "कन्फ़र्म करें और लॉग इन करें",
    change: "गलत पता? बदलें",
    resend: "कोड दोबारा भेजें",
    countdown: "{{seconds}}s में दोबारा भेजें",
    save: "इस पते पर भेजें",
    cancel: "रद्द करें",
    email: "ईमेल पता",
    hint: "अकाउंट बनाना पूरा करने के लिए यह कोड डालें, या 30 मिनट के अंदर नीचे दिए लिंक पर क्लिक करें।",
    bounce:
      "हम {{email}} पर कन्फ़र्मेशन ईमेल नहीं पहुँचा पाए। पता जाँचें या कोई दूसरा पता इस्तेमाल करें।",
    bouncePolicy:
      "आपके ईमेल प्रोवाइडर ने हमारा मैसेज ब्लॉक कर दिया। स्कूल और ऑफ़िस वाले अकाउंट अक्सर बाहर के ईमेल रोक देते हैं। कोई दूसरा पता इस्तेमाल करें।",
    bounceMailboxMissing:
      "आपके ईमेल प्रोवाइडर के मुताबिक {{email}} मौजूद नहीं है। स्पेलिंग जाँचें या कोई दूसरा पता इस्तेमाल करें।",
    bounceMailboxFull:
      "{{email}} का मेलबॉक्स भर गया है। जगह खाली करें और कोड दोबारा भेजें, या कोई दूसरा पता इस्तेमाल करें।",
    invalid: "यह कोड या लिंक गलत है या एक्सपायर हो गया है। नया कोड मँगाएँ।",
    cooldown: "बहुत ज़्यादा रिक्वेस्ट। नया कोड माँगने से पहले थोड़ा रुकें।",
    domain: "इस डोमेन पर ईमेल नहीं आ सकता। पता जाँचें।",
    sendFailed: "हम {{email}} पर ईमेल नहीं भेज पाए। पता जाँचें या दोबारा भेजकर देखें।",
    done: "ईमेल कन्फ़र्म हो गया। आप लॉग इन हैं।",
    newsletter: "कन्फ़र्म करते ही आप उस न्यूज़लेटर से भी जुड़ जाएँगे जो आपने चुना था।",
    link: "मेरा ईमेल कन्फ़र्म करें",
    pendingId: "साइन अप रेफ़रेंस",
    token: "ईमेल कन्फ़र्मेशन लिंक टोकन",
    callback: "वापसी का रास्ता",
    suggestion: "क्या आपका मतलब {{email}} था?",
    expired: "यह साइन अप एक्सपायर हो गया है। नया कोड पाने के लिए फिर से शुरू करें।",
    retry: "साइन अप फिर से शुरू करें",
    subject: "{{code}} आपका {{appName}} कोड है",
    wrongCode: "कोड गलत है। सबसे नए ईमेल वाला कोड डालें और फिर से कोशिश करें।",
    staleLink: "यह लिंक पुराने ईमेल का है। सबसे नया ईमेल खोलें या उसका कोड डालें।",
    alreadyConfirmed: "यह ईमेल पहले ही कन्फ़र्म हो चुका है। आगे बढ़ने के लिए लॉग इन करें।",
    login: "लॉग इन करें",
  },
  category: "यूज़र",

  _components: {
    passwordStrength: {
      label: "पासवर्ड की मज़बूती",
      weak: "कमज़ोर",
      fair: "ठीक-ठाक",
      good: "अच्छा",
      strong: "मज़बूत",
      requirement: {
        minLength: {
          icon: "✗",
          text: "कम से कम 8 कैरेक्टर",
        },
        uppercase: {
          icon: "✗",
          text: "कम से कम एक कैपिटल अक्षर",
        },
        lowercase: {
          icon: "✗",
          text: "कम से कम एक स्मॉल अक्षर",
        },
        number: {
          icon: "✗",
          text: "कम से कम एक नंबर",
        },
        special: {
          icon: "!",
          text: "स्पेशल कैरेक्टर (ज़रूरी नहीं, पासवर्ड को मज़बूत बनाता है)",
        },
      },
    },
    post: {
      title: "_components",
      description: "_components एंडपॉइंट",
      form: {
        title: "_components कॉन्फ़िगरेशन",
        description: "_components पैरामीटर कॉन्फ़िगर करें",
      },
      response: {
        title: "रिस्पॉन्स",
        description: "_components रिस्पॉन्स डेटा",
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
  title: "यूज़र साइन अप",
  titleShort: "साइन अप करें",
  description: "यूज़र रजिस्ट्रेशन एंडपॉइंट",
  tag: "ऑथेंटिकेशन",
  form: {
    title: "अपना अकाउंट बनाएँ",
    description: "हर मॉडल। आपके नियम। शुरुआत फ़्री।",
    privacy: "ईमेल सिर्फ़ लॉग इन के लिए। न फ़ोन नंबर, न कार्ड, न कोई थर्ड-पार्टी ट्रैकर।",
  },
  actions: {
    submit: "कन्फ़र्मेशन कोड भेजें",
    submitting: "कोड भेज रहे हैं…",
  },
  fields: {
    privateName: {
      label: "प्राइवेट नाम",
      description: "AI आपको इसी नाम से बुलाएगा। यह किसी और को कभी नहीं दिखता।",
      placeholder: "जैसे, राहुल",
      validation: {
        required: "प्राइवेट नाम ज़रूरी है",
        minLength: "नाम कम से कम 2 कैरेक्टर का होना चाहिए",
        maxLength: "नाम 100 कैरेक्टर से कम होना चाहिए",
      },
    },
    publicName: {
      label: "पब्लिक नाम",
      description: "शेयर किए गए चैट और फ़ोरम में दिखता है।",
      placeholder: "जैसे, rahul_builds",
      validation: {
        required: "डिस्प्ले नाम ज़रूरी है",
        minLength: "डिस्प्ले नाम कम से कम 2 कैरेक्टर का होना चाहिए",
        maxLength: "डिस्प्ले नाम 100 कैरेक्टर से कम होना चाहिए",
      },
    },
    email: {
      label: "ईमेल",
      description: "सिर्फ़ लॉग इन के लिए। कभी शेयर नहीं होता।",
      placeholder: "you@example.com",
      help: "यही आपका लॉग इन ईमेल और संपर्क का मुख्य ज़रिया होगा",
      validation: {
        required: "ईमेल ज़रूरी है",
        invalid: "कृपया सही ईमेल पता डालें",
      },
    },
    password: {
      label: "पासवर्ड",
      description:
        "8+ कैरेक्टर, जिसमें कैपिटल, स्मॉल अक्षर और एक नंबर हो। इसे संभालकर रखें: एंड-टू-एंड एन्क्रिप्शन आने वाला है, और उसके बाद रीसेट करने पर आपकी हिस्ट्री मिट जाएगी।",
      placeholder: "पासवर्ड बनाएँ",
      validation: {
        required: "पासवर्ड ज़रूरी है",
        minLength: "पासवर्ड कम से कम 8 कैरेक्टर का होना चाहिए",
        complexity: "पासवर्ड में कैपिटल, स्मॉल अक्षर और एक नंबर होना चाहिए",
      },
    },
    confirmPassword: {
      label: "पासवर्ड कन्फ़र्म करें",
      validation: {
        required: "कृपया अपना पासवर्ड कन्फ़र्म करें",
        minLength: "पासवर्ड कम से कम 8 कैरेक्टर का होना चाहिए",
        mismatch: "पासवर्ड मेल नहीं खाते",
      },
    },
    subscribeToNewsletter: {
      label: "न्यूज़लेटर से जुड़ें और हर महीने बोनस फ़्री क्रेडिट पाएँ",
      description: "मंथली न्यूज़लेटर बोनस चालू करने के लिए अपना ईमेल पता कन्फ़र्म करें।",
      checkboxLabel: "न्यूज़लेटर से जुड़ें: हर महीने +{{credits}} फ़्री क्रेडिट",
      hint: "हर कुछ हफ़्तों में नए मॉडल और प्रोडक्ट अपडेट। जब चाहें अनसब्सक्राइब करें।",
      tooltip:
        "न्यूज़लेटर के वेलकम ईमेल में दिए लिंक पर क्लिक करें और जब तक आप सब्सक्राइब्ड रहें, हर महीने {{credits}} एक्स्ट्रा क्रेडिट पाएँ, कुल {{total}}।",
    },
    acceptTerms: {
      label: "मैं शर्तें स्वीकार करता/करती हूँ",
      description: "हमारी शर्तें और प्राइवेसी पॉलिसी आपकी आज़ादी का सम्मान करती हैं।",
      termsLink: "शर्तें",
      conditionsLink: "प्राइवेसी पॉलिसी",
      descriptionPrefix: "हमारी",
      descriptionAnd: "और",
      descriptionSuffix: "आपकी आज़ादी का सम्मान करती हैं।",
      validation: {
        required: "आगे बढ़ने के लिए आपको नियम और शर्तें स्वीकार करनी होंगी",
      },
    },
    referralCode: {
      label: "रेफ़रल कोड (ज़रूरी नहीं)",
      description: "किसी दोस्त से कोड मिला? आपके सब्सक्राइब करने पर उन्हें कमाई होगी।",
      placeholder: "कोड डालें",
      labelPrefilled: "रेफ़रल कोड",
      subscriptionBonus: "पहले सब्सक्रिप्शन के साथ +{{credits}} बोनस क्रेडिट।",
      descriptionPrefilled: "आपका अकाउंट बनते ही आपके दोस्त को इनाम मिलेगा।",
      validation: {
        invalid:
          "यह रेफ़रल कोड मौजूद नहीं है या अब चालू नहीं है। इसे ठीक करें या फ़ील्ड खाली करें।",
      },
    },
    supportedSkillId: {
      label: "किसी क्रिएटर को सपोर्ट करें",
      description:
        "आपका साइन अप इस स्किल के क्रिएटर को सपोर्ट करता है: उन्हें आपके सब्सक्रिप्शन पर +5% बोनस मिलेगा।",
      selectorTitle: "किसी क्रिएटर को सपोर्ट करें",
      selectorDescription:
        "आपने इंडिपेंडेंट क्रिएटर्स की स्किल फ़ेवरिट में जोड़ी हैं। सपोर्ट करने के लिए एक चुनें: उन्हें आपके सब्सक्रिप्शन का +5% मिलेगा। आप इसे कभी भी बदल सकते हैं।",
      selectorNone: "कोई नहीं (छोड़ें)",
    },
    localFavorites: {
      label: "लोकल फ़ेवरिट",
    },
  },

  footer: {
    alreadyHaveAccount: "पहले से अकाउंट है? लॉग इन करें",
  },
  errors: {
    title: "साइन अप एरर",
    validation: {
      title: "वैलिडेशन एरर",
      description: "अपना इनपुट जाँचें और दोबारा कोशिश करें",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    server: {
      title: "सर्वर एरर",
      description: "सर्वर में अंदरूनी एरर आया",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "एक अनपेक्षित एरर आया",
    },
    conflict: {
      title: "अकाउंट पहले से है",
      description: "इस ईमेल से एक अकाउंट पहले से मौजूद है",
      detail: "इस ईमेल से एक अकाउंट पहले से मौजूद है। लॉग इन करें।",
    },
    disposableEmail: {
      title: "स्थायी ईमेल ज़रूरी है",
      detail:
        "टेम्पररी इनबॉक्स से साइन अप नहीं हो सकता। कोई स्थायी ईमेल पता इस्तेमाल करें।",
    },
    subnetSignupLimit: {
      title: "आपके नेटवर्क से बहुत ज़्यादा साइन अप",
      detail:
        "आज आपके नेटवर्क से बहुत ज़्यादा अकाउंट बन चुके हैं। कल फिर कोशिश करें, या किसी मौजूदा अकाउंट में लॉग इन करें।",
    },
    userNotFound: "{{email}} के लिए कोई अकाउंट नहीं मिला",
    forbidden: {
      title: "एक्सेस नहीं है",
      description: "एक्सेस नहीं दिया गया",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर आया",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    unsaved: {
      title: "बदलाव सेव नहीं हुए",
      description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
    },
    autoLoginFailed:
      "अकाउंट बन गया, पर हम आपको लॉग इन नहीं कर पाए। अपने नए पासवर्ड से लॉग इन करें।",
    internal: {
      title: "{{email}} के लिए साइन अप फ़ेल हुआ: {{error}}",
      description: "एक अंदरूनी एरर आया",
    },
  },
  emailCheck: {
    title: "ईमेल उपलब्धता जाँच",
    description: "जाँचें कि ईमेल रजिस्ट्रेशन के लिए उपलब्ध है या नहीं",
    tag: "ईमेल जाँच",
    fields: {
      email: {
        label: "ईमेल पता",
        description: "जाँचने के लिए ईमेल",
        placeholder: "ईमेल पता डालें",
        validation: {
          invalid: "ईमेल का फ़ॉर्मैट गलत है",
        },
      },
    },
    response: {
      title: "ईमेल जाँच रिस्पॉन्स",
      description: "ईमेल उपलब्धता जाँच का नतीजा",
      available: "ईमेल उपलब्ध है",
      message: "उपलब्धता मैसेज",
    },
    errors: {
      validation: {
        title: "गलत ईमेल",
        description: "कृपया सही ईमेल पता डालें",
      },
      internal: {
        title: "{{email}} की जाँच नहीं हो सकी: {{error}}",
        description: "ईमेल उपलब्धता जाँचने में एरर",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "एक अनपेक्षित एरर आया",
      },
      conflict: {
        title: "ईमेल पहले से इस्तेमाल में है",
        description: "यह ईमेल पहले से रजिस्टर्ड है",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह ईमेल जाँचने की अनुमति नहीं है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "ईमेल जाँचते समय नेटवर्क एरर आया",
      },
      notFound: {
        title: "सर्विस नहीं मिली",
        description: "ईमेल जाँच सर्विस उपलब्ध नहीं है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ईमेल जाँचने के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      unsaved: {
        title: "बदलाव सेव नहीं हुए",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "ईमेल जाँच पूरी हुई",
      description: "ईमेल उपलब्धता सफलतापूर्वक जाँची गई",
    },
  },
  post: {
    title: "साइन अप",
    description: "साइन अप एंडपॉइंट",
    form: {
      title: "साइन अप कॉन्फ़िगरेशन",
      description: "साइन अप पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "साइन अप रिस्पॉन्स डेटा",
      success: "साइन अप सफल रहा",
      message: "स्टेटस मैसेज",
      userId: "यूज़र ID",
      nextSteps: "अगले कदम",
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
      unsaved: {
        title: "बदलाव सेव नहीं हुए",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "हो गया",
      description: "काम सफलतापूर्वक पूरा हुआ",
      processing: "साइन अप प्रोसेस हो रहा है",
    },
  },
  response: {
    title: "रिस्पॉन्स",
    description: "साइन अप रिस्पॉन्स डेटा",
    success: "साइन अप सफल रहा",
    message: "स्टेटस मैसेज",
    user: {
      id: "यूज़र ID",
      email: "ईमेल पता",
      firstName: "पहला नाम",
      lastName: "उपनाम",
      privateName: "प्राइवेट नाम",
      publicName: "पब्लिक नाम",
      imageUrl: "प्रोफ़ाइल इमेज URL",
      verificationRequired: "वेरिफ़िकेशन ज़रूरी है",
    },
    verificationInfo: {
      title: "ईमेल वेरिफ़िकेशन",
      description: "ईमेल वेरिफ़िकेशन प्रोसेस की जानकारी",
      emailSent: "ईमेल भेजा गया",
      expiresAt: "वेरिफ़िकेशन की एक्सपायरी",
      checkSpamFolder: "स्पैम फ़ोल्डर देखें",
    },
    nextSteps: "अगले कदम",
  },
  success: {
    title: "अपना इनबॉक्स देखें",
    description: "ईमेल में आया कोड डालें।",
  },
  admin_notification: {
    title: "नया यूज़र साइन अप",
    subject: "नया यूज़र साइन अप: {{privateName}}",
    preview: "नए यूज़र {{privateName}} ने साइन अप किया है",
    message: "{{appName}} पर एक नए यूज़र ने साइन अप किया है",
    privateName: "प्राइवेट नाम",
    publicName: "पब्लिक नाम",
    email: "ईमेल",
    locale: "भाषा",
    creditBalance: "क्रेडिट बैलेंस",
    leadCreditBalance: "लीड क्रेडिट बैलेंस",
    signup_preferences: "साइन अप प्रेफ़रेंस",
    user_details: "यूज़र की जानकारी",
    basic_information: "बुनियादी जानकारी",
    signup_type: "साइन अप टाइप",
    direct_signup: "डायरेक्ट साइन अप",
    newsletter: "न्यूज़लेटर",
    subscribed: "सब्सक्राइब्ड",
    not_subscribed: "सब्सक्राइब्ड नहीं",
    signup_details: "साइन अप की जानकारी",
    signup_date: "साइन अप की तारीख",
    user_id: "यूज़र ID",
    recommended_next_steps: "सुझाए गए अगले कदम",
    direct_recommendation: "यूज़र प्रोफ़ाइल और पेमेंट सेटअप देखें",
    contact_user: "यूज़र से संपर्क करें",
    footer: "यह {{appName}} का ऑटोमेटेड नोटिफ़िकेशन है",
  },
  email: {
    subject: "आप अंदर हैं। {{appName}} आपके लिए तैयार है",
    previewText:
      "नमस्ते {{privateName}}, आपका अकाउंट तैयार है। Claude, GPT, Gemini, DeepSeek और {{modelCount}} और मॉडल से चैट करें। फ़्री, कोई कार्ड नहीं चाहिए।",
    headline: "आपका AI इंतज़ार कर रहा है।",
    greeting: "नमस्ते {{privateName}},",
    intro:
      "{{appName}} में आपका स्वागत है। ChatGPT की हर अच्छी चीज़, साथ में ओपन-सोर्स मॉडल और बिना कंटेंट फ़िल्टर वाले मॉडल। एक अकाउंट, एक जगह।",
    models: {
      title: "3 कैटेगरी में {{modelCount}} मॉडल",
      mainstream: "मेनस्ट्रीम",
      open: "ओपन सोर्स",
      uncensored: "अनसेंसर्ड",
    },
    free: {
      title: "हमेशा के लिए फ़्री में क्या मिलता है:",
      credits:
        "हर महीने {{freeCreditsSignedIn}} फ़्री क्रेडिट, न्यूज़लेटर के साथ +{{freeCreditsNewsletterBonus}}। कोई कार्ड नहीं चाहिए",
      allModels: "सभी {{modelCount}} AI मॉडल का एक्सेस",
      uncensored: "अनसेंसर्ड मॉडल जो सच में आपके सवालों का जवाब देते हैं",
      chatModes: "प्राइवेट, इनकॉग्निटो, शेयर्ड और पब्लिक चैट मोड",
      noCard: "क्रेडिट कार्ड की ज़रूरत नहीं। कभी नहीं।",
    },
    verify: {
      note: "यह पता कन्फ़र्म करते ही आपके फ़्री क्रेडिट चालू हो जाएँगे।",
      cta: "ईमेल कन्फ़र्म करें, {{freeCreditsSignedIn}} क्रेडिट पाएँ",
    },
    ctaButton: "अभी चैट शुरू करें",
    upgrade: {
      title: "और चाहिए?",
      desc: "प्लान {{subscriptionPrice}}/महीना में {{subscriptionCredits}} क्रेडिट से शुरू होते हैं और {{ultraPrice}} में {{ultraCredits}} क्रेडिट तक जाते हैं। सब्सक्राइबर ऐसे पैक से टॉप अप कर सकते हैं जो कभी एक्सपायर नहीं होते।",
      cta: "प्लान देखें",
    },
    signoff: "मज़े से चैट करें,\n{{appName}} टीम",
    ps: "P.S. इनकॉग्निटो मोड इस्तेमाल करें ताकि आपकी बातचीत सिर्फ़ आपके डिवाइस पर रहे। हम उन्हें अपने सर्वर पर कभी सेव नहीं करते (तकनीकी कारणों से बनाया गया मीडिया कुछ समय के लिए सेव रहता है)।",
  },
  emailTemplates: {
    welcome: {
      name: "साइन अप वेलकम ईमेल",
      description: "सफल रजिस्ट्रेशन के बाद यूज़र को भेजा जाने वाला वेलकम ईमेल",
      category: "ऑथेंटिकेशन",
      preview: {
        privateName: {
          label: "प्राइवेट नाम",
          description: "यूज़र का प्राइवेट नाम",
        },
        userId: {
          label: "यूज़र ID",
          description: "यूज़र की यूनिक पहचान",
        },
        leadId: {
          label: "लीड ID",
          description: "यूज़र की लीड पहचान",
        },
      },
    },
    adminSignup: {
      name: "एडमिन साइन अप नोटिफ़िकेशन ईमेल",
      description: "नया यूज़र रजिस्टर होने पर एडमिन को भेजा जाने वाला ईमेल",
      category: "एडमिनिस्ट्रेशन",
      preview: {
        privateName: {
          label: "प्राइवेट नाम",
        },
        publicName: {
          label: "पब्लिक नाम",
        },
        email: {
          label: "ईमेल पता",
        },
        userId: {
          label: "यूज़र ID",
        },
        subscribeToNewsletter: {
          label: "न्यूज़लेटर सब्सक्रिप्शन",
        },
      },
    },
  },
};
