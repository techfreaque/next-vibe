import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI टूल",
  tags: {
    skills: "स्किल",
  },
  voices: {
    MALE: "पुरुष आवाज़",
    FEMALE: "महिला आवाज़",
  },
  enums: {
    category: {
      companion: "कंपैनियन",
      assistant: "असिस्टेंट",
      coding: "कोडिंग",
      creative: "क्रिएटिव",
      writing: "राइटिंग",
      analysis: "एनालिसिस",
      roleplay: "रोलप्ले",
      education: "शिक्षा",
      controversial: "विवादित",
      background: "बैकग्राउंड",
      custom: "कस्टम",
    },
    ownershipType: {
      system: "बिल्ट-इन स्किल",
      user: "आपकी बनाई",
      public: "कम्युनिटी की",
    },
  },

  get: {
    title: "स्किल देखें",
    titleShort: "स्किल का ब्योरा",
    dynamicTitle: "स्किल: {{name}}",
    description: "ID से कोई खास स्किल देखें",
    container: {
      title: "स्किल का ब्योरा",
      description: "माँगी गई स्किल का ब्योरा",
    },
    backButton: {
      label: "स्किल पर वापस",
    },
    openFullPage: "पूरा पेज खोलें",
    editButton: {
      label: "स्किल एडिट करें",
    },
    customizeButton: {
      label: "स्किल अपने हिसाब से बनाएँ",
    },
    deleteButton: {
      label: "स्किल हटाएँ",
    },
    addToFavoritesButton: {
      label: "पसंदीदा में जोड़ें",
    },
    inCollection: "कलेक्शन में है",
    useNow: "अभी इस्तेमाल करें",
    goToChat: "चैट पर जाएँ",
    addAnother: "एक और जोड़ें",
    addAnotherTooltip: "इस स्किल का एक और इंस्टेंस अपने कलेक्शन में जोड़ें",
    variants: {
      title: "मॉडल चुनें",
      strength: "खूबी",
      weakness: "कमज़ोरी",
    },
    addToCollection: "अपने कलेक्शन में जोड़ें:",
    addAllToFavorites: "सारे मॉडल जोड़ें",
    quickAdd: "जोड़ें",
    tweakAndAdd: "बदलें और जोड़ें",
    edit: "एडिट करें",
    copyAndCustomize: "अपना वर्शन बनाएँ",
    delete: "हटाएँ",
    vote: "वोट दें",
    report: "रिपोर्ट करें",
    actions: "कार्रवाइयाँ",
    designSelector: {
      label: "डिज़ाइन:",
      current: "मौजूदा",
      a: "A: App Store",
      b: "B: स्प्लिट हेडर",
      c: "C: कार्ड हीरो",
      d: "D: दो-पंक्ति",
    },
    addVariant: "एक और मॉडल जोड़ें",
    addVariantHint: "अलग मॉडल, पर्सनैलिटी या स्टाइल",
    yourskill: "आपकी स्किल",
    signupPrompt: {
      title: "इस स्किल को अपने हिसाब से बनाएँ",
      description:
        "अपनी सेटिंग्स और पसंद के साथ अपना वर्शन बनाएँ। शुरू करने के लिए साइन अप करें।",
      backButton: "वापस",
      signupButton: "अकाउंट बनाएँ",
      loginButton: "लॉग इन करें",
    },
    id: {
      label: "स्किल ID",
      description: "स्किल का स्लग या आसान ID",
    },
    systemPrompt: {
      label: "सिस्टम प्रॉम्प्ट",
      copy: "कॉपी करें",
      copied: "कॉपी हो गया!",
      view: "पूरा प्रॉम्प्ट देखें",
    },
    models: {
      brain: "दिमाग़",
      eyes: "आँखें",
      ears: "कान और आवाज़",
      media: "मीडिया",
      slots: {
        chat: "चैट",
        imageVision: "इमेज विज़न",
        videoVision: "वीडियो विज़न",
        stt: "स्पीच से टेक्स्ट",
        tts: "टेक्स्ट से स्पीच",
        audioVision: "ऑडियो विज़न",
        imageGen: "इमेज जनरेशन",
        musicGen: "म्यूज़िक जनरेशन",
        videoGen: "वीडियो जनरेशन",
      },
    },
    response: {
      skill: {
        title: "स्किल",
        id: { content: "स्किल ID" },
        name: { content: "स्किल का नाम" },
        description: { content: "स्किल का विवरण" },
        icon: { content: "स्किल का आइकन" },
        systemPrompt: { content: "सिस्टम प्रॉम्प्ट" },
        category: { content: "कैटेगरी" },
        source: { content: "सोर्स" },
        preferredModel: { content: "पसंदीदा मॉडल" },
        voice: { content: "वॉइस" },
        modelSelection: { title: "मॉडल का चुनाव" },
        selectionType: { content: "चुनाव का तरीका" },
        minIntelligence: { content: "न्यूनतम इंटेलिजेंस" },
        maxIntelligence: { content: "अधिकतम इंटेलिजेंस" },
        minPrice: { content: "न्यूनतम कीमत" },
        maxPrice: { content: "अधिकतम कीमत" },
        minContent: { content: "न्यूनतम कंटेंट लेवल" },
        maxContent: { content: "अधिकतम कंटेंट लेवल" },
        preferredStrengths: { content: "पसंदीदा खूबियाँ" },
        ignoredWeaknesses: { content: "नज़रअंदाज़ कमज़ोरियाँ" },
        manualModelId: { content: "मैन्युअल मॉडल" },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "इस रिसोर्स को एक्सेस करने के लिए लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपको इस रिसोर्स को एक्सेस करने की अनुमति नहीं है",
      },
      notFound: {
        title: "स्किल नहीं मिली",
        description: "माँगी गई स्किल मौजूद नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "स्किल लाते समय एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "मौजूदा स्थिति से टकराव हो गया",
      },
    },
    voiceModelSelection: {
      systemDefault: "सिस्टम का डिफ़ॉल्ट",
    },
    success: {
      title: "सफल",
      description: "स्किल मिल गई",
    },
    share: {
      button: "शेयर करें और कमाएँ",
      titleNamed: "{{name}} शेयर करें और कमाएँ",
      title: "यह स्किल शेयर करें और कमाएँ",
      description:
        "अपने रेफ़रल लिंक से यह स्किल शेयर करें। साइन अप करने वाले हर यूज़र की पेमेंट पर आपको 10% रिकरिंग कमीशन मिलता है।",
      selectCode: "रेफ़रल कोड चुनें:",
      noCodesYet: "अभी कोई रेफ़रल कोड नहीं",
      createCode: "कोड बनाएँ",
      codePlaceholder: "जैसे MYCODE",
      creating: "बन रहा है...",
      createFailed: "यह कोड नहीं बन पाया। कोई दूसरा आज़माएँ।",
      linkReady: "आपका शेयर लिंक:",
      copied: "कॉपी हो गया!",
      copyLink: "लिंक कॉपी करें",
      close: "बंद करें",
      authRequired: "रेफ़रल लिंक पाने और कमाई शुरू करने के लिए फ़्री अकाउंट बनाएँ।",
      signup: "फ़्री साइन अप करें",
      login: "पहले से अकाउंट है? लॉग इन करें",
    },
  },
  patch: {
    title: "स्किल अपडेट करें",
    titleShort: "स्किल अपडेट करें",
    dynamicTitle: "एडिट: {{name}}",
    container: {
      title: "स्किल अपडेट करें",
      description: "मौजूदा कस्टम स्किल में बदलाव करें",
    },
    backButton: {
      label: "स्किल पर वापस",
    },
    deleteButton: {
      label: "स्किल हटाएँ",
    },
    submitButton: {
      label: "स्किल अपडेट करें",
      loadingText: "स्किल अपडेट हो रही है...",
    },
    actions: {
      update: "स्किल अपडेट करें",
      updating: "स्किल अपडेट हो रही है",
    },
    response: {
      success: {
        content: "स्किल अपडेट हो गई",
      },
    },
    id: {
      label: "स्किल ID",
      description: "जिस स्किल को अपडेट करना है उसका स्लग या आसान ID",
    },
    name: {
      label: "स्किल का नाम",
      description:
        "अपनी स्किल को याद रहने वाला नाम दें। इसी से आप और बाकी लोग इसे पहचानेंगे।",
      placeholder: "स्किल का नाम लिखें",
      validation: {
        minLength: "नाम कम से कम 2 अक्षर का होना चाहिए",
        maxLength: "नाम 100 अक्षर से छोटा होना चाहिए",
      },
    },
    tagline: {
      label: "स्किल की टैगलाइन",
      description: "एक दमदार लाइन जो आपकी स्किल का सार बताए। छोटी और साफ़ रखें।",
      placeholder: "छोटी सी टैगलाइन लिखें",
      validation: {
        minLength: "टैगलाइन कम से कम 2 अक्षर की होनी चाहिए",
        maxLength: "टैगलाइन 500 अक्षर से छोटी होनी चाहिए",
      },
    },
    icon: {
      label: "स्किल का आइकन",
      description:
        "कोई ऐसा इमोजी चुनें जो आपकी स्किल को दिखाए। स्किल जहाँ भी दिखेगी, यह आइकन दिखेगा।",
    },
    description: {
      label: "स्किल का विवरण",
      description:
        "बताएँ कि इस स्किल को खास क्या बनाता है। इसकी भूमिका क्या है? यह किस काम में मदद कर सकती है? साफ़ और विस्तार से लिखें।",
      placeholder: "अपनी स्किल का मक़सद और क्षमताएँ बताएँ",
      validation: {
        minLength: "विवरण कम से कम 10 अक्षर का होना चाहिए",
        maxLength: "विवरण 500 अक्षर से छोटा होना चाहिए",
      },
    },
    category: {
      label: "कैटेगरी",
      description:
        "वह कैटेगरी चुनें जो आपकी स्किल पर सबसे सही बैठे। इससे स्किल छाँटना और खोजना आसान होता है।",
    },
    isPublic: {
      label: "पब्लिक करें",
      description:
        "इसे चालू करने पर आपकी स्किल कम्युनिटी के साथ शेयर होती है। बंद रहने पर स्किल प्राइवेट रहती है और सिर्फ़ आपको दिखती है।",
    },
    chatModel: {
      label: "चैट मॉडल",
      placeholder: "सिस्टम का डिफ़ॉल्ट",
    },
    voice: {
      label: "वॉइस",
      description:
        "ऑडियो जवाब के लिए टेक्स्ट-टू-स्पीच वॉइस चुनें। हर स्किल की अपनी अलग आवाज़ हो सकती है।",
      placeholder: "सिस्टम का डिफ़ॉल्ट",
    },
    sttModel: {
      label: "स्पीच-टू-टेक्स्ट मॉडल",
      description: "स्पीच पहचानने के लिए इस्तेमाल होने वाला मॉडल",
      placeholder: "सिस्टम का डिफ़ॉल्ट",
    },
    imageVisionModel: {
      label: "इमेज विज़न मॉडल",
      description: "इमेज का विश्लेषण करने वाला मॉडल",
      placeholder: "सिस्टम का डिफ़ॉल्ट",
    },
    videoVisionModel: {
      label: "वीडियो विज़न मॉडल",
      description: "वीडियो का विश्लेषण करने वाला मॉडल",
      placeholder: "सिस्टम का डिफ़ॉल्ट",
    },
    audioVisionModel: {
      label: "ऑडियो विज़न मॉडल",
      description: "ऑडियो का विश्लेषण करने वाला मॉडल",
      placeholder: "सिस्टम का डिफ़ॉल्ट",
    },
    imageGenModel: {
      label: "इमेज जनरेशन मॉडल",
      description: "इमेज बनाने वाला मॉडल",
      placeholder: "सिस्टम का डिफ़ॉल्ट",
    },
    musicGenModel: {
      label: "म्यूज़िक जनरेशन मॉडल",
      description: "म्यूज़िक बनाने वाला मॉडल",
      placeholder: "सिस्टम का डिफ़ॉल्ट",
    },
    videoGenModel: {
      label: "वीडियो जनरेशन मॉडल",
      description: "वीडियो बनाने वाला मॉडल",
      placeholder: "सिस्टम का डिफ़ॉल्ट",
    },
    systemPrompt: {
      label: "सिस्टम प्रॉम्प्ट",
      description:
        "अपनी स्किल का व्यवहार, पर्सनैलिटी और विशेषज्ञता तय करें। यही वह मूल निर्देश है जो AI के जवाब गढ़ता है। लहजे, ज्ञान के क्षेत्र और बातचीत के अंदाज़ के बारे में विस्तार से लिखें।",
      placeholder: "आप एक मददगार असिस्टेंट हैं जो खास तौर पर... में माहिर है",
      validation: {
        minLength: "सिस्टम प्रॉम्प्ट कम से कम 10 अक्षर का होना चाहिए",
        maxLength: "सिस्टम प्रॉम्प्ट 5000 अक्षर से छोटा होना चाहिए",
      },
    },
    source: {
      label: "सोर्स",
      description: "इस स्किल का सोर्स (बिल्ट-इन, कस्टम या कम्युनिटी)",
    },
    modelSelection: {
      label: "मॉडल का चुनाव",
      description:
        "AI मॉडल चुनने का तरीका तय करें: कोई खास मॉडल चुनें, या फ़िल्टर के हिसाब से सिस्टम को चुनने दें",
    },
    variants: {
      label: "वैरिएंट",
      description:
        "नाम वाले वैरिएंट, हर वैरिएंट के अपने मॉडल चुनाव के साथ। हर वैरिएंट में चाहिए: id (यूनिक स्ट्रिंग), modelSelection (ज़रूरी), isDefault (ठीक एक true होना चाहिए)। वैकल्पिक: displayName, voice/vision/gen मॉडल ओवरराइड।",
      addButton: "वैरिएंट जोड़ें",
      setDefault: "डिफ़ॉल्ट बनाएँ",
      remove: "हटाएँ",
      defaultBadge: "डिफ़ॉल्ट",
      namePlaceholder: "वैरिएंट का नाम (वैकल्पिक)",
      skillDefaults: "स्किल-स्तर के डिफ़ॉल्ट",
      skillDefaultsHint: "जब कोई वैरिएंट किसी मोडैलिटी को सेट न करे तब यही चलेगा",
    },
    preferredModel: {
      label: "पसंदीदा मॉडल",
      description: "इस स्किल के लिए पसंदीदा AI मॉडल",
    },
    availableTools: {
      label: "अनुमत टूल",
      description:
        "वे टूल जो यह स्किल इस्तेमाल कर सकती है। हर एंट्री में toolId चाहिए (उपलब्ध टूल ID जानने के लिए system_help_GET इस्तेमाल करें)। चलाने से पहले पूछने के लिए requiresConfirmation: true सेट करें। ग्लोबल सेटिंग्स से लेने के लिए null दें।",
    },
    pinnedTools: {
      label: "पिन किए टूल",
      description:
        "इस स्किल के इस्तेमाल में जल्दी पहुँच के लिए टूलबार में पिन किए टूल। availableTools का सबसेट। डिफ़ॉल्ट पिन किए टूल इस्तेमाल करने के लिए null दें।",
    },
    compactTrigger: {
      label: "कॉम्पैक्ट ट्रिगर (टोकन)",
      description:
        "वह टोकन संख्या जिस पर बातचीत अपने आप कॉम्पैक्ट हो जाती है। ग्लोबल डिफ़ॉल्ट इस्तेमाल करने के लिए null रखें।",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "स्किल का डेटा गलत है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "स्किल अपडेट करने के लिए लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपको यह स्किल अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "स्किल नहीं मिली",
        description: "जिस स्किल को आप अपडेट करना चाहते हैं, वह मौजूद नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "स्किल अपडेट करते समय एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "स्किल अपडेट करते समय टकराव हो गया",
      },
    },
    success: {
      title: "स्किल अपडेट हो गई",
      description: "आपकी कस्टम स्किल सफलतापूर्वक अपडेट हो गई",
    },
  },
  delete: {
    title: "स्किल हटाएँ",
    titleShort: "स्किल हटाएँ",
    dynamicTitle: "हटाएँ: {{name}}",
    description: "कस्टम स्किल हटाएँ",
    container: {
      title: "स्किल हटाएँ",
      description: "इस कस्टम स्किल को हमेशा के लिए हटाएँ",
    },
    backButton: {
      label: "स्किल पर वापस",
    },
    actions: {
      delete: "स्किल हटाएँ",
      deleting: "स्किल हटा रहे हैं",
    },
    id: {
      label: "स्किल ID",
      description: "जिस स्किल को हटाना है उसका स्लग या आसान ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "स्किल का डेटा गलत है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको यह स्किल हटाने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "आपको यह स्किल हटाने की अनुमति नहीं है",
      },
      notFound: {
        title: "स्किल नहीं मिली",
        description: "जिस स्किल को आप हटाना चाहते हैं, वह मौजूद नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "स्किल हटाते समय एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "स्किल हटाते समय कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "इस स्किल को किसी दूसरे यूज़र ने बदल दिया है",
      },
    },
    success: {
      title: "स्किल हटा दी गई",
      description: "स्किल सफलतापूर्वक हटा दी गई",
      content: "स्किल हट गई",
    },
  },
};
