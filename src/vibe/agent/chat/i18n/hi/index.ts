import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    threads: "थ्रेड",
    folders: "फ़ोल्डर",
    files: "फ़ाइलें",
    messages: "मैसेज",
    characters: "स्किल",
    memories: "मेमोरी",
    favorites: "पसंदीदा",
    credits: "क्रेडिट",
    balance: "बैलेंस",
    permissions: "अनुमतियाँ",
    hotkey: "हॉटकी",
    cli: "CLI",
    speech: "वॉइस",
    sharing: "शेयरिंग",
    settings: "सेटिंग्स",
  },
  config: {
    appName: "unbottled.ai",
    folders: {
      private: "प्राइवेट",
      shared: "शेयर्ड",
      public: "पब्लिक",
      incognito: "इनकॉग्निटो",
      background: "बैकग्राउंड",
      remote: "रिमोट",
    },
    foldersShort: {
      private: "प्राइवेट",
      shared: "शेयर्ड",
      public: "पब्लिक",
      incognito: "इनकॉग्निटो",
      background: "बैकग्राउंड",
      remote: "रिमोट",
    },
  },
  enums: {
    role: {
      user: "यूज़र",
      assistant: "असिस्टेंट",
      system: "सिस्टम",
      tool: "टूल",
      error: "एरर",
    },
    threadModerationStatus: {
      visible: "दिखाई दे रहा है",
      underReview: "समीक्षा में",
      removed: "हटाया गया",
    },
    threadReportReason: {
      spam: "स्पैम",
      illegal: "गैरकानूनी कंटेंट",
      abuse: "गाली-गलौज या उत्पीड़न",
      csamFlag: "बाल सुरक्षा की चिंता",
      other: "अन्य",
    },
    threadModerationAction: {
      dismiss: "रिपोर्ट खारिज करें (बहाल करें)",
      remove: "कंटेंट हटाएँ",
      banAuthor: "हटाएँ और लेखक को बैन करें",
    },
    threadStatus: {
      active: "सक्रिय",
      archived: "आर्काइव",
      deleted: "हटाया गया",
    },
    viewMode: {
      linear: "लीनियर",
      threaded: "थ्रेडेड",
      flat: "फ़्लैट",
      debug: "डीबग",
    },
  },
  components: {
    sidebar: {
      login: "लॉग इन",
      logout: "लॉग आउट",
      footer: {
        account: "अकाउंट",
        profile: "प्रोफ़ाइल",
        balance: "बैलेंस",
        buy: "खरीदें",
        freeCreditsLeft: "फ़्री क्रेडिट",
      },
    },
    credits: {
      credit: "{{count}} क्रेडिट",
      credits: "{{count}} क्रेडिट",
    },
    navigation: {
      subscription: "सब्सक्रिप्शन और क्रेडिट",
      referral: "रेफ़रल प्रोग्राम",
      help: "मदद",
      about: "हमारे बारे में",
    },
    confirmations: {
      deleteMessage: "क्या आप सच में यह मैसेज हटाना चाहते हैं?",
    },
    welcomeTour: {
      authDialog: {
        title: "प्राइवेट और शेयर्ड फ़ोल्डर अनलॉक करें",
        description:
          "प्राइवेट और शेयर्ड फ़ोल्डर पाने के लिए साइन अप या लॉग इन करें। आपकी चैट सभी डिवाइस पर सिंक रहेंगी।",
        continueTour: "टूर जारी रखें",
        signUp: "साइन अप / लॉग इन",
      },
      buttons: {
        back: "वापस",
        close: "बंद करें",
        last: "पूरा करें",
        next: "आगे",
        skip: "छोड़ें",
      },
      welcome: {
        title: "{{appName}} में स्वागत है!",
        description:
          "प्राइवेसी-फ़र्स्ट AI प्लेटफ़ॉर्म। {{modelCount}} मॉडल, फ़िल्टर आपके हाथ में और अभिव्यक्ति की आज़ादी।",
        subtitle: "शुरू करने के लिए एक छोटा टूर लेते हैं।",
      },
      aiCompanion: {
        title: "अपना AI कंपैनियन चुनें",
        description:
          "{{modelCount}} AI मॉडल में से चुनें: मुख्यधारा, ओपन-सोर्स और अनसेंसर्ड, सब यहाँ हैं।",
        tip: "मॉडल सिलेक्टर खोलने के लिए क्लिक करें और अपना कंपैनियन चुनें।",
      },
      rootFolders: {
        title: "आपके चैट फ़ोल्डर",
        description: "अपनी चैट अलग-अलग फ़ोल्डर में रखें। हर फ़ोल्डर की प्राइवेसी अलग है:",
        private: {
          name: "प्राइवेट",
          suffix: "सिर्फ़ आप देख सकते हैं",
        },
        incognito: {
          name: "इनकॉग्निटो",
          suffix: "कोई हिस्ट्री सेव नहीं होती",
        },
        shared: {
          name: "शेयर्ड",
          suffix: "दूसरों के साथ मिलकर काम करें",
        },
        public: {
          name: "पब्लिक",
          suffix: "सबको दिखता है",
        },
      },
      privateFolder: {
        name: "प्राइवेट",
        suffix: "फ़ोल्डर",
        description:
          "आपकी प्राइवेट चैट सिर्फ़ आपको दिखती हैं। संवेदनशील विषयों के लिए एकदम सही।",
      },
      incognitoFolder: {
        name: "इनकॉग्निटो",
        suffix: "फ़ोल्डर",
        description:
          "बिना सर्वर पर हिस्ट्री सेव किए चैट करें। मैसेज आपके ब्राउज़र में लोकल रहते हैं और आप हटाएँ तब तक बने रहते हैं।",
        note: "इनकॉग्निटो सेशन में हमारे सर्वर पर कोई डेटा सेव नहीं होता (जनरेट किया गया मीडिया तकनीकी कारणों से कुछ समय के लिए सेव रहता है)।",
      },
      sharedFolder: {
        name: "शेयर्ड",
        suffix: "फ़ोल्डर",
        description: "इस फ़ोल्डर का एक्सेस शेयर करके चुनिंदा लोगों के साथ मिलकर काम करें।",
      },
      publicFolder: {
        name: "पब्लिक",
        suffix: "फ़ोल्डर",
        description:
          "अपनी AI बातचीत दुनिया के साथ शेयर करें। दूसरे आपके थ्रेड देख सकते हैं और फ़ोर्क कर सकते हैं।",
        note: "पब्लिक में जो भी है, वह सभी यूज़र और सर्च इंजन को दिखता है।",
      },
      newChatButton: {
        title: "नई चैट शुरू करें",
        description: "किसी भी फ़ोल्डर में नई बातचीत शुरू करने के लिए यहाँ क्लिक करें।",
      },
      sidebarLogin: {
        title: "और पाने के लिए साइन इन करें",
        description:
          "फ़्री अकाउंट बनाएँ और प्राइवेट व शेयर्ड फ़ोल्डर पाएँ, अपनी बातचीत की हिस्ट्री सभी डिवाइस पर सिंक करें, और AI को आपकी बातें याद रखने दें।",
        tip: "साइन अप फ़्री है!",
      },
      subscriptionButton: {
        title: "क्रेडिट और सब्सक्रिप्शन",
        description:
          "सिर्फ़ {{price}}/महीना में सब्सक्रिप्शन के साथ हर महीने {{credits}} क्रेडिट पाएँ। फ़्री अकाउंट को हर महीने {{freeCredits}} क्रेडिट मिलते हैं, न्यूज़लेटर के साथ {{freeCreditsMax}}।",
      },
      chatInput: {
        title: "अपना मैसेज लिखें",
        description:
          "यहाँ अपना मैसेज लिखें और अपने AI कंपैनियन से चैट करने के लिए Enter दबाएँ या भेजें पर क्लिक करें।",
        tip: "नई लाइन के लिए Shift+Enter दबाएँ। आप फ़ाइलें और इमेज भी अटैच कर सकते हैं।",
      },
      voiceInput: {
        title: "वॉइस इनपुट",
        description: "माइक्रोफ़ोन से अपने AI कंपैनियन से बोलकर बात करें:",
        options: {
          transcribe: "बोली को टेक्स्ट में बदलें",
          sendAudio: "ऑडियो सीधे AI को भेजें",
          pauseResume: "रिकॉर्डिंग रोकें और फिर शुरू करें",
        },
      },
      callMode: {
        title: "कॉल मोड",
        description:
          "हैंड्स-फ़्री, आवाज़ से चलने वाली बातचीत के लिए कॉल मोड चालू करें। AI के जवाब रियल-टाइम में मिलते हैं।",
        tip: "चलते-फिरते या टाइप करने से ज़्यादा बोलना पसंद हो, तब एकदम सही।",
      },
      complete: {
        title: "सब तैयार है!",
        description: "टूर पूरा हुआ! अब अपने AI कंपैनियन से चैट शुरू करें।",
        help: "मदद चाहिए? साइडबार में कभी भी सवालिया निशान आइकन पर क्लिक करें।",
      },
      authUnlocked: {
        unlocked: "अनलॉक हो गया!",
        privateDescription:
          "आपका प्राइवेट फ़ोल्डर अब उपलब्ध है। यहाँ की सारी चैट सिर्फ़ आपको दिखती हैं।",
        privateNote: "प्राइवेट चैट आपके सभी डिवाइस पर अपने आप सिंक होती हैं।",
        sharedDescription:
          "आपका शेयर्ड फ़ोल्डर अब उपलब्ध है। दूसरों को बुलाएँ और AI बातचीत पर साथ मिलकर काम करें।",
        sharedNote: "आपके शेयर्ड फ़ोल्डर और थ्रेड का एक्सेस किसे मिले, यह आप तय करते हैं।",
      },
    },
  },
  selector: {
    loading: "लोड हो रहा है...",
    best: "सबसे बढ़िया मैच",
    free: "फ़्री",
    creditsSingle: "1 क्रेडिट",
    creditsExact: "{{cost}} क्रेडिट",
    modelOnly: "सिर्फ़ मॉडल",
    editModelSettings: "मॉडल सेटिंग्स बदलें",
    editSettings: "सेटिंग्स बदलें",
    switchSkill: "स्किल बदलें",
    editSkill: "स्किल एडिट करें",
    delete: "हटाएँ",
    autoSelectedModel: "फ़िल्टर के हिसाब से",
    manualSelectedModel: "खुद चुना हुआ",
    intelligence: "इंटेलिजेंस",
    contentFilter: "कंटेंट",
    maxPrice: "अधिकतम कीमत",
    modelSelection: "मॉडल चुनें",
    autoModeDescription: "आपके फ़िल्टर के हिसाब से सबसे अच्छा मॉडल चुना जाता है",
    manualModeDescription: "कोई खास मॉडल खुद चुनें",
    autoMode: "फ़िल्टर के हिसाब से",
    manualMode: "मैनुअल",
    allModelsCount: "सभी {{count}} मॉडल",
    filteredModelsCount: "{{count}} मॉडल फ़िल्टर से मैच करते हैं",
    showFiltered: "फ़िल्टर किए हुए दिखाएँ",
    showAllModels: "सभी मॉडल दिखाएँ",
    showLess: "कम दिखाएँ",
    showMore: "{{remaining}} और दिखाएँ",
    showLegacyModels_one: "{{count}} लेगेसी मॉडल दिखाएँ",
    showLegacyModels_other: "{{count}} लेगेसी मॉडल दिखाएँ",
    noMatchingModels: "कोई मैचिंग मॉडल नहीं",
    noModelsWarning: "आपके फ़िल्टर से कोई मॉडल मैच नहीं करता",
    useOnce: "एक बार इस्तेमाल करें",
    saveAsDefault: "पसंदीदा में जोड़ें",
    deleteSetup: "सेटअप हटाएँ",
    content: "कंटेंट खोजें...",
    characterSetup: "स्किल सेटअप",
    noResults: "कोई नतीजा नहीं",
    add: "पसंदीदा में जोड़ें",
    added: "जुड़ गया",
    addNew: "नया जोड़ें",
    searchSkills: "स्किल खोजें...",
    createCustom: "कस्टम बनाएँ",
    customizeSettings: "सेटिंग्स कस्टमाइज़ करें",
    requirements: {
      characterConflict: "स्किल की शर्तों में टकराव",
      tooLow: "बहुत कम",
      tooHigh: "बहुत ज़्यादा",
      min: "न्यूनतम",
      max: "अधिकतम",
    },
  },
  common: {
    newChat: "नई चैट",
    privateChats: "प्राइवेट चैट",
    search: "सर्च",
    delete: "हटाएँ",
    cancel: "रद्द करें",
    save: "सेव करें",
    edit: "एडिट करें",
    settings: "सेटिंग्स",
    close: "बंद करें",
    toggleSidebar: "साइडबार खोलें/बंद करें",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    searchPlaceholder: "सर्च करें...",
    searchThreadsPlaceholder: "थ्रेड सर्च करें...",
    searchResults: "सर्च के नतीजे",
    noChatsFound: "कोई चैट नहीं मिली",
    noThreadsFound: "कोई थ्रेड नहीं मिला",
    enableTTSAutoplay: "TTS ऑटोप्ले चालू करें",
    disableTTSAutoplay: "TTS ऑटोप्ले बंद करें",
    selector: {
      country: "देश",
      language: "भाषा",
    },
    copyButton: {
      copied: "कॉपी हो गया!",
      copyToClipboard: "क्लिपबोर्ड पर कॉपी करें",
      copyAsMarkdown: "Markdown के रूप में कॉपी करें",
      copyAsText: "टेक्स्ट के रूप में कॉपी करें",
    },
    assistantMessageActions: {
      cancelLoading: "लोडिंग रद्द करें",
      stopAudio: "ऑडियो रोकें",
      playAudio: "ऑडियो चलाएँ",
      answerAsAI: "AI मॉडल के रूप में जवाब दें",
      deleteMessage: "मैसेज हटाएँ",
    },
    characterSelector: {
      placeholder: "स्किल चुनें",
      addNewLabel: "कस्टम स्किल बनाएँ",
      grouping: {
        bySource: "सोर्स के हिसाब से",
        byCategory: "कैटेगरी के हिसाब से",
        sourceLabels: {
          builtIn: "बिल्ट-इन",
          my: "मेरी स्किल",
          community: "कम्युनिटी",
        },
        sourceIcons: {
          builtIn: "sparkles",
          my: "user",
          community: "people",
        },
      },
      addDialog: {
        title: "कस्टम स्किल बनाएँ",
        fields: {
          name: {
            label: "नाम",
            placeholder: "स्किल का नाम लिखें",
          },
          icon: {
            label: "आइकन (इमोजी)",
            placeholder: "😊",
          },
          description: {
            label: "विवरण",
            placeholder: "स्किल का छोटा विवरण",
          },
          systemPrompt: {
            label: "सिस्टम प्रॉम्प्ट",
            placeholder: "तय करें कि स्किल कैसे बर्ताव करे...",
          },
          category: {
            label: "कैटेगरी",
          },
        },
        createCategory: "कैटेगरी बनाएँ",
        cancel: "रद्द करें",
        create: "स्किल बनाएँ",
      },
      addCategoryDialog: {
        title: "कैटेगरी बनाएँ",
        fields: {
          name: {
            label: "कैटेगरी का नाम",
            placeholder: "कैटेगरी का नाम लिखें",
          },
          icon: {
            label: "आइकन (इमोजी)",
            placeholder: "📁",
          },
        },
        cancel: "रद्द करें",
        create: "कैटेगरी बनाएँ",
      },
    },
  },
  actions: {
    newChatInFolder: "फ़ोल्डर में नई चैट",
    newFolder: "नया फ़ोल्डर",
    deleteFolder: "फ़ोल्डर हटाएँ",
    deleteMessage: "मैसेज हटाएँ",
    deleteThisMessage: "यह मैसेज हटाएँ",
    searchEnabled: "सर्च चालू है",
    searchDisabled: "सर्च बंद है",
    answerAsAI: "AI मॉडल के रूप में जवाब दें",
    retry: "दूसरे मॉडल/स्किल से दोबारा कोशिश करें",
    branch: "यहाँ से बातचीत की नई ब्रांच बनाएँ",
    editMessage: "मैसेज एडिट करें",
    stopAudio: "ऑडियो प्लेबैक रोकें",
    playAudio: "ऑडियो चलाएँ",
    copyContent: "क्लिपबोर्ड पर कॉपी करें",
  },
  dialogs: {
    searchAndCreate: "सर्च और बनाएँ",
    deleteChat: '"{{title}}" चैट हटाएँ?',
    deleteFolderConfirm:
      '"{{name}}" फ़ोल्डर हटाएँ और {{count}} चैट General में ले जाएँ?',
  },
  views: {
    linearView: "लीनियर व्यू (ChatGPT स्टाइल)",
    threadedView: "थ्रेडेड व्यू (Reddit/Discord स्टाइल)",
    flatView: "फ़्लैट व्यू (4chan स्टाइल)",
    debugView: "डीबग व्यू (सिस्टम प्रॉम्प्ट के साथ)",
  },

  screenshot: {
    capturing: "कैप्चर हो रहा है...",
    capture: "स्क्रीनशॉट लें",
    failed: "स्क्रीनशॉट नहीं लिया जा सका",
    failedWithMessage: "स्क्रीनशॉट नहीं लिया जा सका: {{message}}",
    tryAgain: "स्क्रीनशॉट नहीं लिया जा सका। दोबारा कोशिश करें।",
    noMessages: "चैट मैसेज वाला हिस्सा नहीं मिला। पक्का करें कि चैट में मैसेज मौजूद हैं।",
    quotaExceeded: "स्टोरेज कोटा पूरा हो गया। स्क्रीनशॉट बहुत बड़ा है।",
    canvasError: "स्क्रीनशॉट को इमेज फ़ॉर्मैट में नहीं बदला जा सका।",
  },
  errors: {
    noResponse:
      "AI से कोई जवाब नहीं मिला। रिक्वेस्ट पूरी हुई, पर कंटेंट खाली आया। दोबारा कोशिश करें।",
    noStream: "जवाब स्ट्रीम नहीं हो सका: कोई रीडर उपलब्ध नहीं",
    saveFailed: "एडिट सेव नहीं हो सका",
    branchFailed: "ब्रांच नहीं बन सकी",
    retryFailed: "दोबारा कोशिश नहीं हो सकी",
    answerFailed: "जवाब नहीं दिया जा सका",
    deleteFailed: "हटाया नहीं जा सका",
  },
  errorTypes: {
    streamError: "स्ट्रीम एरर",
  },
  hooks: {
    stt: {
      "endpoint-not-available": "स्पीच-टू-टेक्स्ट एंडपॉइंट उपलब्ध नहीं है",
      "failed-to-start": "रिकॉर्डिंग शुरू नहीं हो सकी",
      "permission-denied":
        "माइक्रोफ़ोन एक्सेस ब्लॉक है। ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें और पेज रीलोड करें।",
      "permission-denied-ios":
        "माइक्रोफ़ोन ब्लॉक है। Settings → Safari → Microphone में जाकर इस साइट को अनुमति दें।",
      "permission-denied-android":
        "माइक्रोफ़ोन ब्लॉक है। एड्रेस बार में लॉक आइकन दबाएँ → Site settings → Microphone → Allow चुनें।",
      "permission-denied-mac":
        "माइक्रोफ़ोन ब्लॉक है। System Settings → Privacy & Security → Microphone खोलें और अपना ब्राउज़र चालू करें।",
      "permission-dismissed":
        "माइक्रोफ़ोन का प्रॉम्प्ट बंद हो गया। माइक दोबारा दबाएँ और Allow चुनें।",
      "permission-denied-site":
        "इस साइट के लिए माइक्रोफ़ोन ब्लॉक है। एड्रेस बार के बाईं ओर के आइकन पर क्लिक करें → Microphone → Allow चुनें, फिर दोबारा कोशिश करें।",
      "permission-denied-windows":
        "माइक्रोफ़ोन ब्लॉक है। Settings → Privacy → Microphone खोलें और देखें कि आपके ब्राउज़र को अनुमति है।",
      "no-microphone":
        "कोई माइक्रोफ़ोन नहीं मिला। माइक्रोफ़ोन या हेडसेट जोड़ें और दोबारा कोशिश करें।",
      "microphone-in-use":
        "आपका माइक्रोफ़ोन किसी दूसरे ऐप में इस्तेमाल हो रहा है। उसे बंद करें और दोबारा कोशिश करें।",
      "not-supported":
        "आपका ब्राउज़र माइक्रोफ़ोन एक्सेस सपोर्ट नहीं करता। Chrome, Firefox या Safari आज़माएँ।",
      "transcription-failed": "ऑडियो को टेक्स्ट में नहीं बदला जा सका",
      "audio-too-short":
        "रिकॉर्डिंग बहुत छोटी है। माइक दबाकर रखें, साफ़ बोलें और दोबारा कोशिश करें।",
    },
    tts: {
      "endpoint-not-available": "टेक्स्ट-टू-स्पीच एंडपॉइंट उपलब्ध नहीं है",
      "failed-to-play": "ऑडियो नहीं चल सका",
      "conversion-failed": "TTS कन्वर्ज़न फ़ेल हो गया",
      "failed-to-generate": "ऑडियो जनरेट नहीं हो सका",
    },
  },
  post: {
    title: "चैट",
    description: "चैट इंटरफ़ेस",
  },
  models: {
    descriptions: {
      uncensoredLmV11: "क्रिएटिव और बेरोकटोक बातचीत के लिए अनसेंसर्ड AI मॉडल",
      freedomgptLiberty:
        "FreedomGPT Liberty - अभिव्यक्ति की आज़ादी और क्रिएटिव कंटेंट पर केंद्रित अनसेंसर्ड AI मॉडल",
      gabAiArya:
        "Gab AI Arya - खुलकर बोलने और क्रिएटिव काम की क्षमता वाला अनसेंसर्ड बातचीत वाला AI मॉडल",
      gemini31ProPreviewCustomTools:
        "Gemini 3.1 Pro Preview (Custom Tools) - बेहतर टूल चयन वाला Gemini 3.1 Pro वेरिएंट। bash टूल का ज़रूरत से ज़्यादा इस्तेमाल रोककर ज़्यादा कारगर थर्ड-पार्टी फ़ंक्शन चुनता है। कोडिंग एजेंट और मल्टी-टूल वर्कफ़्लो के लिए बढ़िया",
      gemini31FlashImagePreview:
        "Gemini 3.1 Flash Image Preview - Google का मल्टीमॉडल मॉडल जो चैट में ही टेक्स्ट प्रॉम्प्ट से सीधे इमेज बनाता है। एक ही बातचीत में टेक्स्ट और इमेज दोनों आउटपुट देता है",
      gemini31FlashLitePreview:
        "Gemini 3.1 Flash Lite Preview - Google का हाई-वॉल्यूम इस्तेमाल के लिए बना तेज़ और किफ़ायती मॉडल। ऑडियो, RAG रैंकिंग, ट्रांसलेशन और कोड कंप्लीशन में Gemini 2.5 Flash Lite से बेहतर",
      gemini3Pro:
        "Google Gemini 3 Pro - बड़े कॉन्टेक्स्ट विंडो और दमदार रीज़निंग वाला एडवांस्ड मल्टीमॉडल AI मॉडल",
      gemini35Flash:
        "Gemini 3.5 Flash - Flash की कीमत पर लगभग Pro जैसी कोडिंग और रीज़निंग। टेक्स्ट, इमेज, वीडियो, ऑडियो और PDF संभालता है। पैरेलल एजेंटिक लूप बिल्ट-इन। कीमत और परफ़ॉर्मेंस पर सटीक कंट्रोल के लिए minimal से high तक थिंकिंग लेवल।",
      gemini3Flash:
        "Google Gemini 3 Flash - तेज़ जवाबों के लिए बना तेज़ और कारगर मल्टीमॉडल AI मॉडल",
      deepseekV32:
        "DeepSeek V3.2 - एडवांस्ड कोडिंग क्षमता वाला हाई-परफ़ॉर्मेंस रीज़निंग मॉडल",
      deepseekV4Pro:
        "DeepSeek V4 Pro - 1M कॉन्टेक्स्ट वाला 1.6T पैरामीटर MoE पावरहाउस। पूरे कोडबेस के विश्लेषण, जटिल रीज़निंग और मल्टी-स्टेप एजेंट वर्कफ़्लो के लिए बना।",
      deepseekV4Flash:
        "DeepSeek V4 Flash - लगभग ज़ीरो कीमत पर 284B MoE। 1M कॉन्टेक्स्ट, तेज़ इन्फ़रेंस, दमदार कोडिंग। भारी वर्कलोड के लिए किफ़ायती चुनाव।",
      gpt55:
        "GPT-5.5 - जटिल प्रोफ़ेशनल वर्कलोड के लिए OpenAI का फ़्रंटियर मॉडल। बेहतर रीज़निंग, ज़्यादा भरोसेमंद, टोकन का बेहतर इस्तेमाल। 1M+ कॉन्टेक्स्ट, टेक्स्ट और इमेज इनपुट।",
      gpt55Pro:
        "GPT-5.5 Pro - जटिल और ऊँचे दाँव वाले काम में गहरी रीज़निंग के लिए OpenAI का सबसे सक्षम मॉडल। 1M+ कॉन्टेक्स्ट, लंबे समय की समस्याओं का हल, एजेंटिक कोडिंग, सटीक मल्टी-स्टेप एक्ज़ीक्यूशन।",
      gpt54Pro:
        "GPT-5.4 Pro - बेहतर रीज़निंग, 1M+ कॉन्टेक्स्ट विंडो और जटिल, ऊँचे दाँव वाले कामों में शानदार परफ़ॉर्मेंस वाला OpenAI का सबसे एडवांस्ड मॉडल",
      gpt54:
        "GPT-5.4 - Codex और GPT को एक करने वाला OpenAI का नया फ़्रंटियर मॉडल। 1M+ कॉन्टेक्स्ट विंडो के साथ हाई-कॉन्टेक्स्ट रीज़निंग, कोडिंग और मल्टीमॉडल विश्लेषण",
      gpt53Codex:
        "GPT-5.3-Codex - OpenAI का सबसे एडवांस्ड एजेंटिक कोडिंग मॉडल। फ़्रंटियर सॉफ़्टवेयर इंजीनियरिंग और व्यापक रीज़निंग का मेल, लंबे टूल-आधारित वर्कफ़्लो और जटिल डेवलपमेंट काम के लिए बना",
      gpt53Chat:
        "GPT-5.3 Chat - ChatGPT का अपडेटेड बातचीत वाला मॉडल। ज़्यादा सटीक और संदर्भ वाले जवाब, बेवजह के इनकार और चेतावनियाँ काफ़ी कम",
      gpt52Pro:
        "GPT-5.2 Pro - बेहतर रीज़निंग और कोडिंग क्षमता वाला एडवांस्ड OpenAI मॉडल",
      gpt52: "GPT-5.2 - जटिल कामों और विश्लेषण के लिए हाई-परफ़ॉर्मेंस OpenAI मॉडल",
      gpt52_chat: "GPT-5.2 Chat - बातचीत के लिए ऑप्टिमाइज़ किया हुआ OpenAI मॉडल",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Mistral पर आधारित अनसेंसर्ड लार्ज लैंग्वेज मॉडल",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Llama 3 पर आधारित अनसेंसर्ड लार्ज लैंग्वेज मॉडल",
      veniceUncensored:
        "Venice Uncensored 1.1 - टूल कॉलिंग सपोर्ट वाला सबसे अनसेंसर्ड AI मॉडल। ज़्यादा से ज़्यादा क्रिएटिव आज़ादी और असली बातचीत के लिए बना। खुली खोजबीन, रोलप्ले और बिना फ़िल्टर की बातचीत के लिए बढ़िया, कंटेंट पर न्यूनतम पाबंदी।",
      claudeOpus45:
        "Claude Opus 4.5 - शानदार रीज़निंग और क्रिएटिव क्षमता वाला सबसे ताकतवर Claude मॉडल",
      claudeOpus46:
        "Claude Opus 4.6 - शानदार रीज़निंग और क्रिएटिव क्षमता वाला ताकतवर Claude मॉडल",
      claudeOpus47:
        "Claude Opus 4.7 - पिछली पीढ़ी का Opus मॉडल। इसकी जगह अब 4.8 है।",
      claudeOpus48:
        "Claude Opus 4.8 - Anthropic का सबसे सक्षम आम तौर पर उपलब्ध Opus मॉडल। लंबे समय के एजेंटिक काम, जटिल कोडिंग और बहुत लंबे आउटपुट पर मल्टी-स्टेप रीज़निंग के लिए बना। 1M टोकन कॉन्टेक्स्ट। टेक्स्ट, इमेज और फ़ाइल इनपुट सपोर्ट करता है।",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Anthropic का सबसे सक्षम Sonnet-क्लास मॉडल। कोडिंग, एजेंट और प्रोफ़ेशनल काम में फ़्रंटियर परफ़ॉर्मेंस",
      claudeHaiku45:
        "Claude Haiku 4.5 - स्पीड और किफ़ायत के लिए बना तेज़ और कारगर Claude मॉडल",
      glm5_1:
        "GLM-5.1 - Z.AI का लंबे समय के कामों के लिए बना अगली पीढ़ी का कोडिंग मॉडल। एक ही टास्क पर 8+ घंटे अपने आप काम करता है: प्लान बनाता है, चलाता है और खुद को सुधारता है, जब तक इंजीनियरिंग-ग्रेड नतीजा न दे दे।",
      glm5: "GLM-5 - Z.AI का फ़्लैगशिप ओपन-सोर्स फ़ाउंडेशन मॉडल। जटिल सिस्टम डिज़ाइन और लंबे एजेंट वर्कफ़्लो के लिए बना, टॉप क्लोज़्ड-सोर्स मॉडल को टक्कर देता है",
      glm5Turbo:
        "GLM-5 Turbo - Z.AI का अगली पीढ़ी का मॉडल, एजेंट-आधारित माहौल के लिए गहराई से ऑप्टिमाइज़ किया हुआ। तेज़ इन्फ़रेंस, जटिल निर्देशों की बेहतर समझ और लंबे टास्क में स्थिरता",
      glm46:
        "GLM-4 6B - दमदार सामान्य क्षमता वाला कारगर चीनी-अंग्रेज़ी द्विभाषी AI मॉडल",
      glm47:
        "GLM-4 7B - बेहतर रीज़निंग और कोडिंग वाला एडवांस्ड चीनी-अंग्रेज़ी द्विभाषी मॉडल",
      glm47Flash: "GLM-4 7B Flash - तेज़ जवाबों के लिए बना बेहद तेज़ चीनी-अंग्रेज़ी मॉडल",
      kimiK2: "Kimi K2 - कॉन्टेक्स्ट की बेहतरीन समझ वाला ताकतवर चीनी AI मॉडल",
      kimiK2_5:
        "Kimi K2.5 - Moonshot AI का पिछली पीढ़ी का मॉडल। लंबे कॉन्टेक्स्ट की दमदार रीज़निंग और कोडिंग",
      kimiK2_6:
        "Kimi K2.6 - Moonshot AI का अगली पीढ़ी का मल्टीमॉडल मॉडल। लंबे समय की कोडिंग, प्रॉम्प्ट और इमेज से UI/UX बनाना, और सैकड़ों पैरेलल सब-एजेंट तक फैलने वाले एजेंट स्वार्म आर्किटेक्चर से मल्टी-एजेंट ऑर्केस्ट्रेशन",
      claudeSonnet45:
        "Claude Sonnet 4.5 - Anthropic का पिछली पीढ़ी का Sonnet मॉडल। दमदार कोडिंग और विश्लेषण क्षमता",
      claudeAgentSonnet:
        "Claude Agent Sonnet - Anthropic के Agent SDK से चलने वाला Claude Sonnet आधारित ऑटोनॉमस AI एजेंट। बिल्ट-इन रीज़निंग के साथ टूल खुद चलाता है।",
      claudeAgentHaiku:
        "Claude Agent Haiku - Anthropic के Agent SDK से चलने वाला Claude Haiku आधारित तेज़ ऑटोनॉमस AI एजेंट। स्पीड के लिए ऑप्टिमाइज़, टूल एक्ज़ीक्यूशन के साथ।",
      claudeAgentOpus:
        "Claude Agent Opus - Anthropic के Agent SDK से चलने वाला Claude Opus आधारित सबसे ताकतवर ऑटोनॉमस AI एजेंट। टूल एक्ज़ीक्यूशन के साथ अधिकतम इंटेलिजेंस।",
      grok4: "Grok 4 - विज़न और वेब सर्च वाला xAI का फ़्लैगशिप रीज़निंग मॉडल",
      grok4Fast:
        "Grok 4 Fast - तेज़ जवाबों के लिए ऑप्टिमाइज़ किया हुआ 2M टोकन कॉन्टेक्स्ट वाला xAI का हाई-स्पीड मॉडल",
      grok43:
        "Grok 4.3 - 1M टोकन कॉन्टेक्स्ट वाला xAI का रीज़निंग मॉडल। तथ्यों में ऊँची सटीकता, एजेंटिक वर्कफ़्लो और गहरी रिसर्च के लिए हमेशा-चालू रीज़निंग",
      grok420Beta:
        "Grok 4.20 (Legacy) - xAI का पिछला फ़्लैगशिप मॉडल। एजेंटिक टूल कॉलिंग, कम हैलुसिनेशन और 2M टोकन कॉन्टेक्स्ट",
      gpt5Pro:
        "GPT-5 Pro - टॉप-टियर रीज़निंग और एडवांस्ड कोडिंग वाला OpenAI का प्रीमियम मॉडल",
      gpt5Codex:
        "GPT-5 Codex - शानदार प्रोग्रामिंग और तकनीकी क्षमता वाला OpenAI का खास कोडिंग मॉडल",
      gpt51Codex:
        "GPT 5.1 Codex - बेहतर क्रिएटिव और प्रोग्रामिंग क्षमता वाला अपडेटेड OpenAI कोडिंग मॉडल",
      gpt51:
        "GPT 5.1 - दमदार रीज़निंग और विश्लेषण वाला OpenAI का कारगर जनरल-पर्पज़ मॉडल",
      gpt5: "GPT-5 - व्यापक इंटेलिजेंस और हर काम की क्षमता वाला OpenAI का फ़्लैगशिप मॉडल",
      gpt54Mini:
        "GPT-5.4 Mini - हाई-थ्रूपुट वर्कलोड के लिए बना GPT-5.4 का कारगर वेरिएंट। कम कीमत पर दमदार रीज़निंग, कोडिंग और टूल इस्तेमाल",
      gpt54Nano:
        "GPT-5.4 Nano - OpenAI का सबसे हल्का और किफ़ायती मॉडल। क्लासिफ़िकेशन, डेटा एक्सट्रैक्शन और सब-एजेंट एक्ज़ीक्यूशन जैसे स्पीड-क्रिटिकल कामों के लिए",
      gpt5Mini: "GPT-5 Mini - रोज़ के छोटे कामों के लिए OpenAI का हल्का और तेज़ मॉडल",
      gpt5Nano:
        "GPT-5 Nano - सीधी-सादी बातचीत के लिए OpenAI का सबसे छोटा और सबसे सस्ता मॉडल",
      gptOss120b:
        "GPT-OSS 120B - दमदार कोडिंग क्षमता वाला OpenAI का ओपन-सोर्स 120B पैरामीटर मॉडल",
      kimiK2Thinking:
        "Kimi K2 Thinking - Kimi का रीज़निंग पर केंद्रित मॉडल। बेहतर विश्लेषण और स्टेप-बाय-स्टेप सोच",
      minimaxM27:
        "MiniMax M2.7 - MiniMax का अगली पीढ़ी का एजेंटिक मॉडल। असल दुनिया की ऑटोनॉमस प्रोडक्टिविटी, मल्टी-एजेंट सहयोग और कोड डीबगिंग, फ़ाइनेंशियल मॉडलिंग व डॉक्यूमेंट जनरेशन जैसे प्रोडक्शन वर्कफ़्लो के लिए बना",
      mimoV2Pro:
        "MiMo V2 Pro - Xiaomi का फ़्लैगशिप 1T+ पैरामीटर फ़ाउंडेशन मॉडल, 1M कॉन्टेक्स्ट के साथ। एजेंट ऑर्केस्ट्रेशन, जटिल वर्कफ़्लो ऑटोमेशन और प्रोडक्शन इंजीनियरिंग के लिए गहराई से ऑप्टिमाइज़",
      glm45Air: "GLM 4.5 AIR - Z.AI का तेज़ बातचीत के लिए बना बेहद तेज़ हल्का मॉडल",
      glm45v: "GLM 4.5v - Z.AI का विज़न वाला मॉडल, इमेज समझता है और चैट करता है",
      geminiFlash25Lite:
        "Gemini 2.5 Flash Lite - बड़े कॉन्टेक्स्ट और तेज़ जवाबों वाला Google का एंट्री-लेवल Gemini मॉडल",
      geminiFlash25Flash:
        "Gemini 2.5 Flash - तेज़ कामों के लिए 1M टोकन कॉन्टेक्स्ट वाला Google का कारगर मल्टीमॉडल मॉडल",
      geminiFlash25Pro:
        "Gemini 2.5 Pro - बड़े कॉन्टेक्स्ट और दमदार रीज़निंग वाला Google का पिछली पीढ़ी का Pro मॉडल",
      deepseekV31:
        "DeepSeek V3.1 - दमदार कोडिंग और विश्लेषण वाला DeepSeek का पिछली पीढ़ी का मॉडल",
      deepseekR1:
        "DeepSeek R1 - स्टेप-बाय-स्टेप समस्या हल करने वाला DeepSeek का रीज़निंग-केंद्रित मॉडल",
      qwen3235bFree:
        "Qwen3 235B - जटिल कोडिंग और रीज़निंग के लिए 235B पैरामीटर वाला Alibaba का बड़ा ओपन मॉडल",
      deepseekR1Distill:
        "DeepSeek R1 Distill - DeepSeek R1 का कॉम्पैक्ट डिस्टिल्ड वर्शन, कारगर रीज़निंग के साथ",
      qwen257b:
        "Qwen 2.5 7B - तेज़ और किफ़ायती बातचीत के लिए Alibaba का कॉम्पैक्ट 7B मॉडल",
      dallE3:
        "DALL-E 3 - टेक्स्ट प्रॉम्प्ट से हाई-क्वालिटी, बारीक इमेज बनाने वाला OpenAI का इमेज जनरेशन मॉडल",
      gptImage1: "GPT-Image-1 - OpenAI का तेज़ और किफ़ायती इमेज जनरेशन मॉडल",
      fluxSchnell:
        "Flux Schnell - Black Forest Labs का स्पीड के लिए बना तेज़ इमेज जनरेशन मॉडल",
      fluxPro:
        "Flux Pro 1.1 - बेहतरीन क्वालिटी और प्रॉम्प्ट का सटीक पालन करने वाला Black Forest Labs का प्रोफ़ेशनल इमेज जनरेशन मॉडल",
      flux2Max:
        "FLUX.2 Max - Black Forest Labs का टॉप-टियर इमेज मॉडल। सबसे ऊँची इमेज क्वालिटी, प्रॉम्प्ट की गहरी समझ और एडिटिंग में एकरूपता",
      flux2Klein4b:
        "FLUX.2 Klein 4B - Black Forest Labs का सबसे तेज़ और सबसे किफ़ायती इमेज मॉडल, हाई-थ्रूपुट इस्तेमाल के लिए",
      riverflowV2Pro:
        "Riverflow V2 Pro - Sourceful का सबसे ताकतवर इमेज जनरेशन मॉडल। टॉप-टियर कंट्रोल और एकदम सही टेक्स्ट रेंडरिंग",
      riverflowV2Fast:
        "Riverflow V2 Fast - Sourceful का सबसे तेज़ इमेज जनरेशन मॉडल, प्रोडक्शन डिप्लॉयमेंट और लेटेंसी-क्रिटिकल वर्कफ़्लो के लिए",
      riverflowV2MaxPreview:
        "Riverflow V2 Max Preview - Sourceful का सबसे ताकतवर प्रीव्यू वेरिएंट, एक ही मॉडल में टेक्स्ट-टू-इमेज और इमेज-टू-इमेज",
      riverflowV2StandardPreview:
        "Riverflow V2 Standard Preview - Sourceful का स्टैंडर्ड प्रीव्यू वेरिएंट, एक ही मॉडल में टेक्स्ट-टू-इमेज और इमेज-टू-इमेज। Riverflow 1 फ़ैमिली से बेहतर",
      riverflowV2FastPreview:
        "Riverflow V2 Fast Preview - Sourceful का सबसे तेज़ प्रीव्यू वेरिएंट, एक ही मॉडल में टेक्स्ट-टू-इमेज और इमेज-टू-इमेज, सबसे कम कीमत पर",
      flux2Flex:
        "FLUX.2 Flex - Black Forest Labs का इमेज मॉडल जो जटिल टेक्स्ट रेंडरिंग, टाइपोग्राफ़ी और मल्टी-रेफ़रेंस एडिटिंग में माहिर है, सब एक आर्किटेक्चर में",
      flux2Pro:
        "FLUX.2 Pro - Black Forest Labs का हाई-एंड इमेज जनरेशन और एडिटिंग मॉडल। फ़्रंटियर-लेवल विज़ुअल क्वालिटी, प्रॉम्प्ट का सटीक पालन और किरदारों की एकरूपता",
      gemini3ProImagePreview:
        "Nano Banana Pro (Gemini 3 Pro Image Preview) - Google का सबसे एडवांस्ड इमेज जनरेशन मॉडल। बेहतर मल्टीमॉडल रीज़निंग, असल दुनिया से जुड़ाव, हाई-फ़िडेलिटी विज़ुअल और इंडस्ट्री में सबसे अच्छी टेक्स्ट रेंडरिंग",
      gpt5ImageMini:
        "GPT-5 Image Mini - OpenAI का कारगर मल्टीमॉडल इमेज जनरेशन मॉडल। GPT-5 Mini की भाषा क्षमता के साथ तेज़ और सस्ती इमेज जनरेशन",
      gpt5Image:
        "GPT-5 Image - OpenAI का फ़्लैगशिप मल्टीमॉडल मॉडल। GPT-5 की भाषा क्षमता के साथ अत्याधुनिक इमेज जनरेशन और एडिटिंग",
      gpt54Image2:
        "GPT-5.4 Image 2 - GPT-5.4 की रीज़निंग और GPT Image 2 की जनरेशन क्षमता वाला OpenAI का अगली पीढ़ी का मल्टीमॉडल मॉडल। एक ही बातचीत में कोडिंग, विश्लेषण और विज़ुअल क्रिएशन के बीच आराम से बदलता है।",
      seedream45:
        "Seedream 4.5 - ByteDance का नया इमेज जनरेशन मॉडल। एडिटिंग में एकरूपता, पोर्ट्रेट की सफ़ाई और मल्टी-इमेज कंपोज़िशन में बड़े सुधार",
      sdxl: "Stable Diffusion XL - Stability AI का हाई-क्वालिटी ओपन इमेज जनरेशन मॉडल",
      cassetteMusic:
        "CassetteAI Music - Fal.ai पर तेज़ टेक्स्ट-टू-म्यूज़िक जनरेशन, तीन मिनट तक की क्लिप",
      musicgenStereo:
        "MusicGen Stereo - Replicate के ज़रिए Meta का ओपन-सोर्स स्टीरियो म्यूज़िक जनरेशन मॉडल",
      stableAudio:
        "Stable Audio - हाई-क्वालिटी क्लिप के लिए Stability AI का म्यूज़िक और ऑडियो जनरेशन मॉडल",
      udioV2:
        "Udio v2 - वोकल्स और फ़ुल प्रोडक्शन क्वालिटी वाला हाई-क्वालिटी AI म्यूज़िक जनरेशन",
      modelsLabMusicGen:
        "ModelsLab Music Gen - टेक्स्ट प्रॉम्प्ट से AI म्यूज़िक जनरेशन, MP3/WAV/FLAC आउटपुट सपोर्ट",
      modelsLabElevenlabsMusic:
        "ElevenLabs Music - ModelsLab के ज़रिए ElevenLabs से चलने वाला हाई-क्वालिटी म्यूज़िक जनरेशन",
      modelsLabSonautoSong:
        "Sonauto Song - वोकल्स के साथ पूरा गाना बनाता है, अलग-अलग जॉनर और 4:45 मिनट तक के ट्रैक सपोर्ट करता है",
      modelsLabLyria3:
        "Lyria 3 - Google का एडवांस्ड म्यूज़िक जनरेशन मॉडल, टेक्स्ट से 30 सेकंड के ओरिजिनल ट्रैक बनाता है",
      modelsLabCogVideoX:
        "CogVideoX - छोटी वीडियो क्लिप बनाने वाला ModelsLab का टेक्स्ट-टू-वीडियो मॉडल",
      modelsLabWanx: "Wanx - ModelsLab का टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
      modelsLabWan22:
        "Wan 2.2 Ultra - ModelsLab का हाई-क्वालिटी टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
      modelsLabWan21:
        "Wan 2.1 Ultra - बेहतर क्वालिटी वाला ModelsLab का टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
      modelsLabWan25T2V:
        "Wan 2.5 T2V - ModelsLab का Wan 2.5 टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
      modelsLabWan25I2V:
        "Wan 2.5 I2V - ModelsLab का Wan 2.5 इमेज-टू-वीडियो जनरेशन मॉडल",
      modelsLabWan27T2V:
        "Wan 2.7 T2V - Alibaba का नया Wan 2.7 टेक्स्ट-टू-वीडियो मॉडल, फ़्लेक्सिबल एस्पेक्ट रेशियो और 1080p आउटपुट के साथ",
      modelsLabWan26T2V:
        "Wan 2.6 T2V - ModelsLab का Wan 2.6 टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
      modelsLabWan26I2V:
        "Wan 2.6 I2V - ModelsLab का Wan 2.6 इमेज-टू-वीडियो जनरेशन मॉडल",
      modelsLabWan26I2VFlash:
        "Wan 2.6 I2V Flash - ModelsLab का तेज़ Wan 2.6 इमेज-टू-वीडियो जनरेशन मॉडल",
      modelsLabSeedanceT2V:
        "Seedance T2V - BytePlus का टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
      modelsLabSeedanceI2V:
        "Seedance I2V - BytePlus का इमेज-टू-वीडियो जनरेशन मॉडल",
      modelsLabOmnihuman: "Omnihuman - BytePlus का ह्यूमन वीडियो जनरेशन मॉडल",
      modelsLabSeedance1ProI2V:
        "Seedance 1.0 Pro I2V - BytePlus का प्रोफ़ेशनल इमेज-टू-वीडियो मॉडल",
      modelsLabSeedance1ProFastI2V:
        "Seedance 1.0 Pro Fast I2V - BytePlus का तेज़ प्रोफ़ेशनल इमेज-टू-वीडियो मॉडल",
      modelsLabSeedance1ProFastT2V:
        "Seedance 1.0 Pro Fast T2V - BytePlus का तेज़ प्रोफ़ेशनल टेक्स्ट-टू-वीडियो मॉडल",
      modelsLabOmnihuman15:
        "Omnihuman 1.5 - BytePlus का बेहतर ह्यूमन वीडियो जनरेशन मॉडल",
      modelsLabSeedance15Pro:
        "Seedance 1.5 Pro - BytePlus का एडवांस्ड वीडियो जनरेशन मॉडल",
      modelsLabVeo2:
        "Veo 2 - ModelsLab के ज़रिए Google का हाई-क्वालिटी वीडियो जनरेशन मॉडल",
      modelsLabVeo3: "Veo 3 - ModelsLab के ज़रिए Google का नया वीडियो जनरेशन मॉडल",
      modelsLabVeo3Fast:
        "Veo 3 Fast - ModelsLab के ज़रिए Google का तेज़ वीडियो जनरेशन मॉडल",
      modelsLabVeo3FastPreview:
        "Veo 3 Fast Preview - ModelsLab के ज़रिए Google का तेज़ वीडियो जनरेशन प्रीव्यू मॉडल",
      modelsLabVeo31:
        "Veo 3.1 - ModelsLab के ज़रिए Google का बेहतर Veo 3 वीडियो जनरेशन मॉडल",
      modelsLabVeo31Fast:
        "Veo 3.1 Fast - ModelsLab के ज़रिए Google का तेज़ Veo 3.1 वीडियो जनरेशन मॉडल",
      modelsLabKlingV21I2V:
        "Kling V2.1 I2V - Kling AI का इमेज-टू-वीडियो मॉडल, वर्शन 2.1",
      modelsLabKlingV25TurboI2V:
        "Kling V2.5 Turbo I2V - Kling AI का टर्बो इमेज-टू-वीडियो मॉडल, वर्शन 2.5",
      modelsLabKlingV25TurboT2V:
        "Kling V2.5 Turbo T2V - Kling AI का टर्बो टेक्स्ट-टू-वीडियो मॉडल, वर्शन 2.5",
      modelsLabKlingV2MasterT2V:
        "Kling V2 Master T2V - Kling AI का मास्टर क्वालिटी टेक्स्ट-टू-वीडियो मॉडल",
      modelsLabKlingV2MasterI2V:
        "Kling V2 Master I2V - Kling AI का मास्टर क्वालिटी इमेज-टू-वीडियो मॉडल",
      modelsLabKlingV21MasterT2V:
        "Kling V2.1 Master T2V - Kling AI का मास्टर क्वालिटी टेक्स्ट-टू-वीडियो मॉडल v2.1",
      modelsLabKlingV21MasterI2V:
        "Kling V2.1 Master I2V - Kling AI का मास्टर क्वालिटी इमेज-टू-वीडियो मॉडल v2.1",
      modelsLabKlingV16MultiI2V:
        "Kling V1.6 Multi I2V - Kling AI का मल्टी-इमेज-टू-वीडियो मॉडल, वर्शन 1.6",
      modelsLabKling30T2V:
        "Kling 3.0 T2V - Kling AI का टेक्स्ट-टू-वीडियो मॉडल, वर्शन 3.0",
      modelsLabLtx2ProT2V:
        "LTX 2 PRO T2V - LTX का प्रोफ़ेशनल टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
      modelsLabLtx2ProI2V:
        "LTX 2 PRO I2V - LTX का प्रोफ़ेशनल इमेज-टू-वीडियो जनरेशन मॉडल",
      modelsLabLtx23ProI2V:
        "LTX 2.3 Pro I2V - LTX का बेहतर प्रोफ़ेशनल इमेज-टू-वीडियो मॉडल",
      modelsLabHailuo23T2V:
        "Hailuo 2.3 T2V - MiniMax का टेक्स्ट-टू-वीडियो जनरेशन मॉडल, वर्शन 2.3",
      modelsLabHailuo02T2V:
        "Hailuo 02 T2V - MiniMax का टेक्स्ट-टू-वीडियो जनरेशन मॉडल 02",
      modelsLabHailuo23I2V:
        "Hailuo 2.3 I2V - MiniMax का इमेज-टू-वीडियो जनरेशन मॉडल, वर्शन 2.3",
      modelsLabHailuo23FastI2V:
        "Hailuo 2.3 Fast I2V - MiniMax का तेज़ इमेज-टू-वीडियो मॉडल, वर्शन 2.3",
      modelsLabHailuo02I2V:
        "Hailuo 02 I2V - MiniMax का इमेज-टू-वीडियो जनरेशन मॉडल 02",
      modelsLabHailuo02StartEnd:
        "Hailuo 02 Start/End - MiniMax का स्टार्ट-एंड फ़्रेम वीडियो जनरेशन मॉडल",
      modelsLabSora2:
        "Sora 2 - ModelsLab के ज़रिए OpenAI का Sora 2 वीडियो जनरेशन मॉडल",
      modelsLabSora2Pro:
        "Sora 2 Pro - ModelsLab के ज़रिए OpenAI का Sora 2 Pro वीडियो जनरेशन मॉडल",
      modelsLabGen4Aleph:
        "Gen4 Aleph - ModelsLab के ज़रिए Runway का Gen4 Aleph वीडियो जनरेशन मॉडल",
      modelsLabLipsync2:
        "Lipsync 2 - Sync का लिप सिंक्रोनाइज़ेशन वीडियो जनरेशन मॉडल",
      modelsLabGrokT2V:
        "Grok T2V - ModelsLab के ज़रिए xAI का Grok टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
      modelsLabGrokI2V:
        "Grok I2V - ModelsLab के ज़रिए xAI का Grok इमेज-टू-वीडियो जनरेशन मॉडल",
      klingV30Std:
        "Kling 3.0 Standard - OpenRouter के ज़रिए Kuaishou का स्टैंडर्ड-टियर वीडियो मॉडल, T2V और I2V के साथ",
      klingVideoO1:
        "Kling Video O1 - OpenRouter के ज़रिए Kuaishou का रीज़निंग-बेहतर वीडियो जनरेशन मॉडल",
      veo31Lite:
        "Veo 3.1 Lite - OpenRouter के ज़रिए बड़े पैमाने की जनरेशन के लिए Google का किफ़ायती वीडियो मॉडल",
      seedance2:
        "Seedance 2.0 - OpenRouter के ज़रिए ByteDance का अगली पीढ़ी का वीडियो मॉडल। किरदारों में एकरूपता और रेफ़रेंस-टू-वीडियो",
      seedance2Fast:
        "Seedance 2.0 Fast - OpenRouter के ज़रिए ByteDance का तेज़ वीडियो जनरेशन मॉडल",
      happyhorse11:
        "HappyHorse 1.1 - OpenRouter के ज़रिए Alibaba का वीडियो जनरेशन मॉडल, T2V, I2V और रेफ़रेंस इमेज सपोर्ट के साथ",
      happyhorse10:
        "HappyHorse 1.0 - OpenRouter के ज़रिए Alibaba का वीडियो जनरेशन मॉडल, T2V, I2V और रेफ़रेंस इमेज सपोर्ट के साथ",
      modelsLabGen4T2ITurbo:
        "Gen4 T2I Turbo - ModelsLab के ज़रिए Runway का तेज़ टेक्स्ट-टू-इमेज जनरेशन मॉडल",
      modelsLabGen4Image:
        "Gen4 Image - ModelsLab के ज़रिए Runway का Gen4 टेक्स्ट-टू-इमेज जनरेशन मॉडल",
      modelsLabWan27T2I:
        "Wan 2.7 T2I - ModelsLab के ज़रिए Alibaba का Wan 2.7 टेक्स्ट-टू-इमेज जनरेशन मॉडल",
      modelsLabGrokT2I:
        "Grok Imagine T2I - ModelsLab के ज़रिए xAI का Grok टेक्स्ट-टू-इमेज जनरेशन मॉडल",
      modelsLabZImageBase:
        "Z Image Base - ModelsLab का तेज़ और किफ़ायती टेक्स्ट-टू-इमेज मॉडल",
      modelsLabZImageTurbo:
        "Z Image Turbo - ModelsLab का बेहद तेज़ टेक्स्ट-टू-इमेज मॉडल",
      modelsLabFlux2MaxT2I:
        "Flux 2 Max T2I - ModelsLab के ज़रिए Black Forest Labs का Flux 2 Max टेक्स्ट-टू-इमेज",
      modelsLabFluxPro11Ultra:
        "Flux Pro 1.1 Ultra - ModelsLab के ज़रिए Black Forest Labs का हाई-क्वालिटी Flux Pro Ultra",
      modelsLabFluxPro11:
        "Flux Pro 1.1 - ModelsLab के ज़रिए Black Forest Labs का Flux Pro 1.1 टेक्स्ट-टू-इमेज",
      modelsLabFlux2ProT2I:
        "Flux 2 Pro T2I - ModelsLab के ज़रिए Black Forest Labs का Flux 2 Pro टेक्स्ट-टू-इमेज",
      modelsLabFlux2DevT2I:
        "Flux 2 Dev T2I - ModelsLab के ज़रिए Black Forest Labs का Flux 2 Dev टेक्स्ट-टू-इमेज",
      modelsLabFluxT2I:
        "Flux T2I - ModelsLab के ज़रिए Black Forest Labs का Flux टेक्स्ट-टू-इमेज",
      modelsLabSeedream45T2I:
        "Seedream 4.5 T2I - ModelsLab के ज़रिए ByteDance का Seedream 4.5 टेक्स्ट-टू-इमेज",
      modelsLabSeedream40T2I:
        "Seedream 4.0 T2I - ModelsLab के ज़रिए ByteDance का Seedream 4.0 टेक्स्ट-टू-इमेज",
      modelsLabSeedreamT2I:
        "Seedream T2I - ModelsLab के ज़रिए ByteDance का Seedream टेक्स्ट-टू-इमेज",
      modelsLabImagen4Ultra:
        "Imagen 4 Ultra - ModelsLab के ज़रिए Google की सबसे ऊँची क्वालिटी की इमेज जनरेशन",
      modelsLabImagen4:
        "Imagen 4 - ModelsLab के ज़रिए Google का Imagen 4 टेक्स्ट-टू-इमेज",
      modelsLabImagen4Fast:
        "Imagen 4 Fast - ModelsLab के ज़रिए Google का तेज़ Imagen 4 टेक्स्ट-टू-इमेज",
      modelsLabImagen3:
        "Imagen 3 - ModelsLab के ज़रिए Google का Imagen 3 टेक्स्ट-टू-इमेज",
      modelsLabNanoBananaPro:
        "Nano Banana Pro - ModelsLab के ज़रिए हाई-क्वालिटी इमेज जनरेशन",
      modelsLabNanoBanana: "Nano Banana - ModelsLab के ज़रिए इमेज जनरेशन",
      modelsLabQwenT2I:
        "Qwen T2I - ModelsLab के ज़रिए Alibaba का Qwen टेक्स्ट-टू-इमेज",
      modelsLabRealtimeT2I:
        "Realtime T2I - ModelsLab का बेहद तेज़ रियलटाइम टेक्स्ट-टू-इमेज मॉडल",
      claudeSonnet5:
        "Claude Sonnet 5 - Anthropic का संतुलित Sonnet-क्लास मॉडल। कोडिंग, एजेंट और विश्लेषण में दमदार परफ़ॉर्मेंस। 1M-टोकन कॉन्टेक्स्ट।",
      claudeOpus5:
        "Claude Opus 5 - सबसे मुश्किल एजेंटिक और विश्लेषण वाले कामों के लिए Anthropic का फ़्लैगशिप मॉडल। 1M-टोकन कॉन्टेक्स्ट।",
      claudeOpus5Fast:
        "Claude Opus 5 Fast - लेटेंसी-संवेदनशील ऐप्स के लिए ऑप्टिमाइज़ किया हुआ Claude Opus 5 का हाई-थ्रूपुट वेरिएंट। 1M-टोकन कॉन्टेक्स्ट।",
      claudeFable5:
        "Claude Fable 5 - गहरी रीज़निंग, क्रिएटिव सिंथेसिस और लंबी प्लानिंग को जोड़ने वाला Anthropic का नया फ़्रंटियर मॉडल। 1M-टोकन कॉन्टेक्स्ट।",
      grok45:
        "Grok 4.5 - विज़न सपोर्ट और खुली कंटेंट पॉलिसी वाला xAI का सक्षम रीज़निंग मॉडल। 500K-टोकन कॉन्टेक्स्ट।",
      grok46:
        "Grok 4.6 - बेहतर रीज़निंग और कोडिंग वाला xAI का नया Grok मॉडल। 500K-टोकन कॉन्टेक्स्ट।",
      gpt56Luna:
        "GPT-5.6 Luna - रोज़ के कामों के लिए OpenAI का हल्का और तेज़ मॉडल। बेहद किफ़ायती। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt56LunaPro:
        "GPT-5.6 Luna Pro - बेहतर कोडिंग और निर्देश मानने वाला Luna का एन्हांस्ड वेरिएंट। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt56Terra:
        "GPT-5.6 Terra - क्षमता और कीमत का संतुलन रखने वाला OpenAI का मिड-टियर मॉडल। कोडिंग और रीज़निंग में दमदार। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt56TerraPro:
        "GPT-5.6 Terra Pro - गहरी रीज़निंग और विश्लेषण वाला Terra का एडवांस्ड वेरिएंट। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt56Sol:
        "GPT-5.6 Sol - जटिल कामों के लिए OpenAI का प्रीमियम रीज़निंग मॉडल। अत्याधुनिक परफ़ॉर्मेंस। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt56SolPro:
        "GPT-5.6 Sol Pro - एडवांस्ड रीज़निंग के साथ क्रिएटिव और विश्लेषण की गहराई वाला टॉप-टियर GPT मॉडल। 1.05M-टोकन कॉन्टेक्स्ट।",
      gemini36Flash:
        "Gemini 3.6 Flash - मल्टीमॉडल इनपुट और दमदार कोडिंग वाला Google का सक्षम Flash मॉडल। 1M-टोकन कॉन्टेक्स्ट।",
      gemini35FlashLite:
        "Gemini 3.5 Flash Lite - आसान कामों के लिए Google का बेहद सस्ता और तेज़ मॉडल। 1M-टोकन कॉन्टेक्स्ट।",
      gemini37Flash:
        "Gemini 3.7 Flash - बेहतर रीज़निंग और मल्टीमॉडल क्षमता वाला Google की Flash सीरीज़ का नया मॉडल। 1.05M-टोकन कॉन्टेक्स्ट।",
      kimiK3:
        "Kimi K3 - लंबे कॉन्टेक्स्ट की मल्टीमॉडल रीज़निंग और एडवांस्ड एजेंट क्षमता वाला Moonshot AI का नया फ़्रंटियर मॉडल। 1.05M-टोकन कॉन्टेक्स्ट।",
      glm52:
        "GLM-5.2 - दमदार रीज़निंग और तेज़ इन्फ़रेंस वाला Z.AI का अगली पीढ़ी का फ़ाउंडेशन मॉडल। 1.05M-टोकन कॉन्टेक्स्ट।",
      minimaxM3:
        "MiniMax M3 - टक्कर की कीमत पर दमदार कोडिंग और रीज़निंग वाला MiniMax का फ़्लैगशिप मॉडल। 1.05M-टोकन कॉन्टेक्स्ट।",
      qwen37Flash:
        "Qwen 3.7 Flash - हाई-वॉल्यूम कामों के लिए Alibaba का बेहद तेज़ बजट मॉडल। 1M-टोकन कॉन्टेक्स्ट।",
      qwen38Max:
        "Qwen 3.8 Max - फ़्रंटियर-लेवल परफ़ॉर्मेंस वाला Alibaba का टॉप रीज़निंग मॉडल। 1M-टोकन कॉन्टेक्स्ट।",
      mimoV25:
        "MiMo V2.5 - दमदार कोडिंग वाला Xiaomi का कारगर रीज़निंग मॉडल। 1.05M-टोकन कॉन्टेक्स्ट।",
      mimoV25Pro:
        "MiMo V2.5 Pro - गहरे विश्लेषण और कोडिंग वाला Xiaomi का प्रीमियम रीज़निंग मॉडल। 1.05M-टोकन कॉन्टेक्स्ट।",
      metaMuseSpark12:
        "Meta Muse Spark 1.2 - विज़न, ऑडियो और वीडियो इनपुट वाला Meta का मल्टीमॉडल रीज़निंग मॉडल। क्रॉस-मोडल विश्लेषण में दमदार। 1.05M-टोकन कॉन्टेक्स्ट।",
      mistralMedium35:
        "Mistral Medium 3.5 - विज़न सपोर्ट और दमदार कोडिंग वाला Mistral AI का सक्षम मिड-टियर मॉडल। 262K-टोकन कॉन्टेक्स्ट।",
      claudeOpus55:
        "Claude Opus 5.5 - Anthropic का टॉप मॉडल। सबसे मुश्किल एजेंटिक, कोडिंग और विश्लेषण का काम, अब Opus 5 से 20% सस्ता। 1M-टोकन कॉन्टेक्स्ट।",
      claudeSonnet55:
        "Claude Sonnet 5.5 - Anthropic का वर्कहॉर्स। Sonnet की कीमत पर लगभग Opus जैसी कोडिंग और एजेंट स्किल। 1M-टोकन कॉन्टेक्स्ट।",
      claudeHaiku55:
        "Claude Haiku 5.5 - Anthropic का सबसे तेज़ मॉडल। विज़न, टूल और 1M कॉन्टेक्स्ट, Haiku 4.5 की कीमत के दसवें हिस्से में।",
      claudeFable51:
        "Claude Fable 5.1 - Anthropic का फ़्रंटियर रीज़नर। गहरा सिंथेसिस, लंबी प्लानिंग, Fable 5 से ज़्यादा तेज़। 1M-टोकन कॉन्टेक्स्ट।",
      claudeFable52:
        "Claude Fable 5.2 - Anthropic का फ़्रंटियर रीज़नर। Fable 5.1 से गहरा सिंथेसिस और ज़्यादा स्थिर लंबी प्लानिंग, कम कीमत पर। 1M-टोकन कॉन्टेक्स्ट।",
      gpt6Astra:
        "पिछला Astra फ़्लैगशिप टेक्स्ट, इमेज और टूल सपोर्ट करता है। इसका उत्तराधिकारी GPT-6.2 Astra है।",
      gpt6AstraPro:
        "GPT-6 Astra Pro - ज़्यादा रीज़निंग एफ़र्ट वाला GPT-6 Astra। धीमा, पर ज़्यादा गहराई से सोचता है। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt61Sol:
        "पिछला Sol रिलीज़ टेक्स्ट, इमेज और टूल सपोर्ट करता है। इसका उत्तराधिकारी GPT-6.2 Sol है।",
      gpt61SolPro:
        "GPT-6.1 Sol Pro - जटिल विश्लेषण और कोड के लिए ज़्यादा रीज़निंग एफ़र्ट वाला GPT-6.1 Sol। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt61Terra:
        "GPT-6.1 Terra - OpenAI का संतुलित मिड-टियर। दमदार कोडिंग और रीज़निंग, रोज़मर्रा की कीमत। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt61TerraPro:
        "GPT-6.1 Terra Pro - विश्लेषण-भारी कामों के लिए गहरी रीज़निंग वाला GPT-6.1 Terra। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt6Luna:
        "GPT-6 Luna - OpenAI का हल्का मॉडल। चंद पैसों में तेज़ जवाब। 1.05M-टोकन कॉन्टेक्स्ट।",
      gpt6LunaPro:
        "GPT-6 Luna Pro - अतिरिक्त रीज़निंग वाला GPT-6 Luna। बेहतर कोड और निर्देश पालन, वही कम कीमत। 1.05M-टोकन कॉन्टेक्स्ट।",
      gemini4Argon:
        "Gemini 4 Argon - Google का नया फ़्लैगशिप। टेक्स्ट, इमेज, वीडियो और ऑडियो इनपुट, फ़्रंटियर रीज़निंग आउटपुट। 1M-टोकन कॉन्टेक्स्ट।",
      gemini38Flash:
        "Gemini 3.8 Flash - Google का नया Flash। दमदार कोडिंग वाला तेज़ मल्टीमॉडल मॉडल। 1M-टोकन कॉन्टेक्स्ट।",
      grok47:
        "Grok 4.7 - xAI का नया Grok। तेज़ रीज़निंग और कोड, खुली कंटेंट पॉलिसी, विज़न। 500K-टोकन कॉन्टेक्स्ट।",
      kimiK31Pro:
        "Kimi K3.1 Pro - Moonshot AI का सबसे दमदार मॉडल। मल्टीमॉडल रीज़निंग और लंबे एजेंट रन। 1M-टोकन कॉन्टेक्स्ट।",
      gpt62Sol: "Sol टेक्स्ट और इमेज पढ़ता है, कोड लिखता है और टूल कॉल करता है।",
      gpt62Astra:
        "Astra टेक्स्ट, इमेज और टूल के साथ जटिल इंजीनियरिंग और विश्लेषण संभालता है।",
      superGemma426b:
        "Jiunsong का फ़ाइन-ट्यून किया Gemma 4 टेक्स्ट के साथ एक इमेज पढ़ता है और टूल कॉल कर सकता है।",
      deepseekV41FlashCsf:
        "jcartu का abliterated DeepSeek V4.1 Flash टेक्स्ट, रीज़निंग और टूल कॉल संभालता है।",
      maiImage27: "Microsoft का टेक्स्ट-टू-इमेज मॉडल, इस रूट पर 1K में रेंडर करता है।",
      maiImage27Flash: "MAI Image 2.7 का तेज़ वेरिएंट, टेक्स्ट से 1K इमेज बनाता है।",
      qwen4Max:
        "Qwen 4 Max - Alibaba का नया फ़्लैगशिप। फ़्रंटियर रीज़निंग, कोड और विश्लेषण, इमेज और वीडियो पढ़ता है। 1M-टोकन कॉन्टेक्स्ट।",
      kimiK31ProUncensored:
        "Kimi K3.1 Pro Uncensored - Moonshot AI का सबसे दमदार Kimi, इनकार हटाकर (abliterated)। फ़्लैगशिप रीज़निंग, कोई भाषण नहीं, टूल भी शामिल। 1M-टोकन कॉन्टेक्स्ट।",
      hy4: "Hy4 - Tencent का फ़्लैगशिप। डिफ़ॉल्ट रूप से रीज़निंग करता है, कोड लिखता है, इमेज पढ़ता है, टूल कॉल करता है। अपनी टियर के हिसाब से कम कीमत। 1M-टोकन कॉन्टेक्स्ट।",
      hy4Flash:
        "Hy4 Flash - Tencent का छोटा और तेज़ Hy4। टेक्स्ट और इमेज इनपुट, कोड और टूल कॉल आउटपुट, लगभग मुफ़्त में। 1M-टोकन कॉन्टेक्स्ट।",
      deepseekV41Flash:
        "DeepSeek V4.1 Flash - DeepSeek का तेज़ ओपन मॉडल, अब विज़न के साथ। लगभग मुफ़्त में दमदार कोडिंग। 1M-टोकन कॉन्टेक्स्ट।",
      qwen38Flash:
        "Qwen 3.8 Flash - Alibaba का तेज़ मल्टीमॉडल मॉडल। बजट कीमत पर टेक्स्ट, इमेज और वीडियो। 1M-टोकन कॉन्टेक्स्ट।",
      glm53:
        "GLM-5.3 - Z.AI का नया फ़ाउंडेशन मॉडल। आक्रामक कीमत पर दमदार रीज़निंग और कोड। 1M-टोकन कॉन्टेक्स्ट।",
      glm53Flash:
        "GLM-5.3 Flash - Z.AI का तेज़ मल्टीमॉडल मॉडल। हाई-वॉल्यूम काम के लिए टेक्स्ट, इमेज और वीडियो। 1M-टोकन कॉन्टेक्स्ट।",
      mimoV26Pro:
        "MiMo V2.6 Pro - Xiaomi का प्रीमियम रीज़नर। टेक्स्ट, इमेज, वीडियो और ऑडियो इनपुट, गहरा विश्लेषण आउटपुट। 1.05M-टोकन कॉन्टेक्स्ट।",
      mimoV26Flash:
        "MiMo V2.6 Flash - Xiaomi का तेज़ मल्टीमॉडल मॉडल। बेहद सस्ता, सक्षम कोडर। 1.05M-टोकन कॉन्टेक्स्ट।",
      metaMuseSpark13:
        "Meta Muse Spark 1.3 - Meta का मल्टीमॉडल रीज़नर। टेक्स्ट, इमेज और वीडियो पर क्रॉस-मोडल विश्लेषण। 1M-टोकन कॉन्टेक्स्ट।",
      metaMuseWonder:
        "Meta Muse Wonder - Meta का फ़्लैगशिप। हर मोडैलिटी में फ़्रंटियर रीज़निंग, कोड और क्रिएटिव काम। 1M-टोकन कॉन्टेक्स्ट।",
      mistralLarge4:
        "Mistral Large 4 - Mistral AI का नया फ़्लैगशिप। यूरोपीय, विज़न सक्षम, कोड में दमदार, Medium 3.5 से सस्ता। 1M-टोकन कॉन्टेक्स्ट।",
      gemini4Hydrogen:
        "Gemini 4 Hydrogen - Google के Gemini 4 का वर्कहॉर्स। तेज़ एजेंटिक कोडिंग और विश्लेषण, टेक्स्ट, इमेज, वीडियो और ऑडियो इनपुट। 1M-टोकन कॉन्टेक्स्ट।",
      gemini4Carbon:
        "Gemini 4 Carbon - Google का सबसे दमदार Gemini। सबसे मुश्किल कोड, एजेंट और रीज़निंग के लिए बना, हर तरह का मीडिया पढ़ता है। 1M-टोकन कॉन्टेक्स्ट।",
      minimaxM31Flash:
        "MiniMax M3.1 Flash - MiniMax का तेज़ मल्टीमॉडल मॉडल। आधी या उससे कम कीमत पर एजेंट और कोड में M3 से बेहतर। 1M-टोकन कॉन्टेक्स्ट।",
      metaMuseEmber:
        "Meta Muse Ember - Meta का सबसे छोटा Muse। चंद पैसों में तेज़ टूल कॉल, रूटिंग और हल्की कोडिंग, हर तरह का मीडिया पढ़ता है। 1M-टोकन कॉन्टेक्स्ट।",
      veniceDeepseekV41FlashUncensored:
        "DeepSeek V4.1 Flash Uncensored - इनकार हटाया हुआ DeepSeek V4.1 Flash, Venice.ai से। असली क्षमता, कोई भाषण नहीं, टूल भी शामिल। 1M-टोकन कॉन्टेक्स्ट।",
      drummerArtemis31b:
        "Artemis 31B - TheDrummer का Gemma 4 रोलप्ले फ़ाइनट्यून। डार्क सीन, एक्सप्लिसिट फ़िक्शन, किरदार अपनी आवाज़ में बने रहते हैं। सस्ता, 262K कॉन्टेक्स्ट, इमेज पढ़ता है, टूल कॉल करता है।",
      hermes4405b:
        "Hermes 4 405B - Nous Research का Llama 3.1 405B ट्यून। आपका सिस्टम प्रॉम्प्ट मानता है, कम ही इनकार करता है, ज़रूरत पड़ने पर रीज़निंग करता है। फ़िक्शन और रोलप्ले के लिए, 131K कॉन्टेक्स्ट, टूल कॉल नहीं।",
      grokImagineImage2:
        "Grok Imagine Image 2.0 - बेहतर प्रॉम्प्ट पालन और विज़ुअल क्वालिटी वाला xAI का नया इमेज जनरेशन मॉडल।",
      recraftV41:
        "Recraft V4.1 - Recraft का डिज़ाइन-फ़र्स्ट इमेज मॉडल। इमेज में सटीक टेक्स्ट, लोगो, पोस्टर और ब्रांड ग्राफ़िक्स के लिए बना।",
      recraftV41Pro:
        "Recraft V4.1 Pro - बारीक डिटेल के साथ प्रिंट-रेडी ब्रांड और प्रोडक्ट विज़ुअल के लिए Recraft का 2K प्रीमियम टियर।",
      recraftV41Flash:
        "Recraft V4.1 Flash - ड्राफ़्ट और बल्क रन के लिए Recraft का तेज़, कम कीमत वाला टियर, प्रति इमेज 1 क्रेडिट से कम।",
      qwenImage3: "Qwen Image 3 - बेहद कम कीमत पर Alibaba का तेज़ इमेज जनरेशन मॉडल।",
      qwenImage3Pro:
        "Qwen Image 3 Pro - बेहतर क्वालिटी और डिटेल वाला Alibaba का प्रीमियम इमेज जनरेशन मॉडल।",
      hailuo3:
        "Hailuo 3 - सिनेमैटिक क्वालिटी और मोशन की एकरूपता वाला MiniMax का नया वीडियो जनरेशन मॉडल।",
      seedance25:
        "Seedance 2.5 - बेहतर मोशन और विज़ुअल फ़िडेलिटी वाला ByteDance का सुधरा हुआ वीडियो जनरेशन मॉडल।",
      flux3Video:
        "Flux 3 Video - शानदार क्वालिटी और प्रॉम्प्ट पालन वाला Black Forest Labs का फ़्लैगशिप वीडियो जनरेशन मॉडल।",
      grokImagineVideo15:
        "Grok Imagine Video 1.5 - बेहतर टेम्पोरल एकरूपता वाला xAI का अपडेटेड वीडियो जनरेशन मॉडल।",
      lyria3ProPreview:
        "Lyria 3 Pro Preview - ऊँची प्रोडक्शन क्वालिटी वाले पूरे गानों के लिए Google का प्रीमियम म्यूज़िक जनरेशन मॉडल।",
      lyria3ClipPreview:
        "Lyria 3 Clip Preview - छोटे ऑडियो कंटेंट के लिए Google का तेज़ म्यूज़िक क्लिप जनरेटर।",
      geminiNanoBanana21:
        "Nano Banana 2.1 - चैट में इमेज जनरेशन और एडिटिंग, ओरिजिनल Nano Banana की आधी इमेज कीमत पर।",
      seedream55:
        "Seedream 5.5 - ByteDance का इमेज जनरेशन और मल्टी-रेफ़रेंस एडिटिंग मॉडल, प्रति इमेज 2 क्रेडिट पर।",
      flux3Image:
        "FLUX.3 - FLUX.2 से बारीक डिटेल और साफ़ टेक्स्ट वाला Black Forest Labs का फ़्लैगशिप इमेज मॉडल।",
      flux3Klein:
        "FLUX.3 Klein - ड्राफ़्ट और बल्क रन के लिए Black Forest Labs का छोटा, तेज़ इमेज मॉडल, प्रति इमेज 1 क्रेडिट से कम।",
      gptImage26Flare:
        "GPT Image 2.6 Flare - OpenAI का तेज़ इमेज जनरेशन और एडिटिंग मॉडल।",
      gptImage26Sunburst:
        "GPT Image 2.6 Sunburst - घनी कंपोज़िशन और टेक्स्ट-भारी लेआउट के लिए OpenAI का डिटेल-केंद्रित इमेज मॉडल।",
      geminiOmni12Flash:
        "Gemini Omni 1.2 Flash - नेटिव ऑडियो वाला Google का वीडियो मॉडल, 3 से 15 सेकंड की क्लिप, 4K तक।",
      grokImagineVideo15Lite:
        "Grok Imagine Video 1.5 Lite - xAI का तेज़, कम कीमत वाला वीडियो मॉडल, 1080p तक।",
      wan30:
        "Wan 3.0 - नेटिव ऑडियो और 30 सेकंड तक की क्लिप वाला Alibaba का वीडियो मॉडल।",
      seedance2Mini:
        "Seedance 2.0 Mini - 480p और 720p पर नेटिव ऑडियो वाला ByteDance का बजट वीडियो मॉडल।",
      seedance25Flash:
        "Seedance 2.5 Flash - नेटिव ऑडियो वाला ByteDance का तेज़ Seedance 2.5, 480p और 720p पर 30 सेकंड तक की क्लिप।",
      hailuo3Max:
        "Hailuo 3 Max - 768p पर MiniMax का तेज़ और सस्ता Hailuo 3 वेरिएंट, बिना ऑडियो।",
      runwayGen45:
        "Runway Gen-4.5 - 720p पर टेक्स्ट और इमेज से वीडियो बनाने वाला Runway का सिनेमैटिक वीडियो मॉडल।",
    },
  },
  modelUtilities: {
    adultExplicit: "एडल्ट/एक्सप्लिसिट कंटेंट",
    adultImplied: "एडल्ट/इशारों वाला कंटेंट",
    analysis: "विश्लेषण",
    chat: "चैट",
    coding: "कोडिंग",
    conspiracy: "कॉन्स्पिरेसी थ्योरी",
    controversial: "विवादित विषय",
    creative: "क्रिएटिव राइटिंग",
    fast: "तेज़",
    harmful: "संभावित रूप से हानिकारक कंटेंट",
    illegalInfo: "गैरकानूनी जानकारी",
    imageGen: "इमेज जनरेशन",
    legacy: "लेगेसी",
    medicalAdvice: "मेडिकल सलाह",
    offensiveLanguage: "आपत्तिजनक भाषा",
    politicalLeft: "वामपंथी राजनीतिक विचार",
    politicalRight: "दक्षिणपंथी राजनीतिक विचार",
    reasoning: "एडवांस्ड रीज़निंग",
    roleplay: "रोलप्ले",
    roleplayDark: "डार्क रोलप्ले",
    smart: "स्मार्ट",
    uncensored: "अनसेंसर्ड",
    violence: "हिंसा",
    vision: "विज़न",
  },
  input: {
    attachments: {
      uploadFile: "फ़ाइलें अटैच करें",
      attachedFiles: "अटैच की गई फ़ाइलें",
      addMore: "और जोड़ें",
    },
  },
};
