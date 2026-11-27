import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  config: {
    folders: {
      private: "प्राइवेट चैट",
      shared: "शेयर्ड चैट",
      public: "पब्लिक चैट",
      incognito: "इनकॉग्निटो चैट",
      background: "बैकग्राउंड थ्रेड",
      remote: "रिमोट चैट",
    },
  },
  tags: {
    messages: "मैसेज",
  },
  loadingOlderMessages: "पुराने मैसेज लोड हो रहे हैं...",
  loadingNewerMessages: "नए मैसेज लोड हो रहे हैं...",
  scrollUpForOlderMessages: "पुराने मैसेज के लिए ऊपर स्क्रोल करें",
  showOlderMessages: "पुराने मैसेज दिखाएँ",
  showNewerMessages: "नए मैसेज दिखाएँ",
  transcribing: "ऑडियो ट्रांसक्राइब हो रहा है...",
  uploadingAttachments: "फ़ाइलें अपलोड हो रही हैं...",
  gapFill: {
    transcribingAudio: "ऑडियो ट्रांसक्राइब हो रहा है…",
    analyzingImage: "इमेज का विश्लेषण हो रहा है…",
    describingVideo: "वीडियो का विवरण बन रहा है…",
    processingMedia: "मीडिया प्रोसेस हो रहा है…",
    variantUsing: "{{model}} के ज़रिए",
    variantCost: "{{cost}} क्रेडिट",
    transcription: "ट्रांसक्रिप्शन",
    imageDescription: "इमेज का विवरण",
    videoDescription: "वीडियो का विवरण",
    showTranscription: "ट्रांसक्रिप्शन दिखाएँ",
    hideTranscription: "ट्रांसक्रिप्शन छिपाएँ",
    showImageDescription: "इमेज का विवरण दिखाएँ",
    hideImageDescription: "इमेज का विवरण छिपाएँ",
    showVideoDescription: "वीडियो का विवरण दिखाएँ",
    hideVideoDescription: "वीडियो का विवरण छिपाएँ",
  },
  errorCode: "एरर कोड",
  errorActions: {
    retry: "दोबारा कोशिश करें",
    tryAnotherModel: "दूसरा मॉडल आज़माएँ",
    continue: "जारी रखें",
    /** Sent as the user message when Continue is pressed */
    continuePrompt: "जारी रखें",
  },
  streamInterrupted: {
    label: "जनरेशन रुक गया",
    hint: "अधूरा जवाब सेव हो गया। आगे बढ़ने के लिए नया मैसेज भेजें।",
  },
  errorFeedback: {
    autoReported: "एरर की रिपोर्ट अपने आप भेज दी गई",
    helpFix: "इसे ठीक करने में हमारी मदद करें",
    autoContext: "[ऑटो-जनरेटेड एरर रिपोर्ट]",
    errorLabel: "एरर",
    causeLabel: "वजह",
    userContextLabel: "यहाँ और जानकारी जोड़ें (वैकल्पिक)",
    separator: "·",
  },
  compacting: {
    title: "हिस्ट्री छोटी की गई",
    loading: "हिस्ट्री छोटी हो रही है...",
    summarizing: "बातचीत का सार बन रहा है...",
    failed: "हिस्ट्री छोटी करना नाकाम रहा",
  },
  get: {
    title: "थ्रेड के मैसेज की सूची",
    titleShort: "मैसेज",
    description: "चैट थ्रेड के सारे मैसेज देखें",
    container: {
      title: "मैसेज",
      description: "थ्रेड के मैसेज की सूची",
    },
    threadId: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड के मैसेज चाहिए उसकी ID",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
    },
    leafMessageId: {
      label: "लीफ़ मैसेज ID",
      description: "मौजूदा ब्रांच का लीफ़ मैसेज ID",
    },
    response: {
      title: "मैसेज रिस्पॉन्स",
      description: "थ्रेड के मैसेज की सूची",
      messages: {
        message: {
          title: "मैसेज",
          id: {
            content: "मैसेज ID",
          },
          threadId: {
            content: "थ्रेड ID",
          },
          role: {
            content: "रोल",
          },
          content: {
            content: "कंटेंट",
          },
          parentId: {
            content: "पैरेंट मैसेज ID",
          },
          authorId: {
            content: "ऑथर ID",
          },
          isAI: {
            content: "AI है",
          },
          model: {
            content: "मॉडल",
          },
          skill: {
            content: "स्किल",
          },
          tokens: {
            content: "टोकन",
          },
          sequenceId: {
            content: "सीक्वेंस ID",
          },

          toolCalls: {
            content: "टूल कॉल",
          },
          createdAt: {
            content: "बनाने का समय",
          },
          updatedAt: {
            content: "अपडेट का समय",
          },
        },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर सही नहीं हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "मैसेज देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको ये मैसेज देखने की अनुमति नहीं है",
        incognitoNotAllowed: "इनकॉग्निटो थ्रेड सर्वर पर नहीं खुल सकते",
      },
      notFound: {
        title: "नहीं मिला",
        description: "थ्रेड नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
        detail: "सर्वर एरर: {{error}}",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कुछ अनपेक्षित गड़बड़ी हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "बदलावों में टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "मैसेज मिल गए",
    },
  },
  post: {
    title: "मैसेज बनाएँ",
    titleShort: "मैसेज बनाएँ",
    description: "चैट थ्रेड में नया मैसेज बनाएँ",
    form: {
      title: "नया मैसेज",
      description: "थ्रेड में मैसेज बनाएँ",
    },
    sections: {
      message: {
        title: "मैसेज की जानकारी",
        description: "मैसेज का कंटेंट और सेटिंग्स",
      },
    },
    threadId: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड में मैसेज जोड़ना है उसकी ID",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
    },
    id: {
      label: "मैसेज ID",
      description: "क्लाइंट से बनाया गया मैसेज ID",
    },
    content: {
      label: "कंटेंट",
      description: "मैसेज का कंटेंट",
      placeholder: "मैसेज लिखें...",
    },
    role: {
      label: "रोल",
      description: "मैसेज का रोल (user, assistant, system)",
    },
    parentId: {
      label: "पैरेंट मैसेज",
      description: "ब्रांचिंग के लिए पैरेंट मैसेज ID",
    },
    model: {
      label: "मॉडल",
      description: "जवाब के लिए AI मॉडल",
    },
    skill: {
      label: "स्किल",
      description: "इस मैसेज के लिए AI स्किल या पर्सोना",
    },
    metadata: {
      label: "मेटाडेटा",
      description: "मैसेज का मेटाडेटा (अटैचमेंट, टोकन वगैरह)",
    },
    response: {
      title: "बनाया गया मैसेज",
      description: "नए बने मैसेज की जानकारी",
      message: {
        title: "मैसेज",
        id: {
          content: "मैसेज ID",
        },
        threadId: {
          content: "थ्रेड ID",
        },
        role: {
          content: "रोल",
        },
        content: {
          content: "कंटेंट",
        },
        parentId: {
          content: "पैरेंट मैसेज ID",
        },
        createdAt: {
          content: "बनाने का समय",
        },
        updatedAt: {
          content: "अपडेट का समय",
        },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "मैसेज का डेटा सही नहीं है",
        parentNotFound: "पैरेंट मैसेज नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "मैसेज बनाने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको मैसेज बनाने की अनुमति नहीं है",
        incognitoNotAllowed: "इनकॉग्निटो थ्रेड सर्वर पर नहीं खुल सकते",
      },
      notFound: {
        title: "नहीं मिला",
        description: "थ्रेड नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
        detail: "सर्वर एरर: {{error}}",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कुछ अनपेक्षित गड़बड़ी हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "बदलावों में टकराव हुआ",
      },
      createFailed: {
        title: "मैसेज नहीं बन सका",
        description: "मैसेज बनाते समय गड़बड़ी हुई",
      },
    },
    success: {
      title: "सफल",
      description: "मैसेज बन गया",
    },
  },
  enums: {
    role: {
      user: "यूज़र",
      assistant: "असिस्टेंट",
    },
  },
  debugView: {
    systemPromptTitle: "सिस्टम प्रॉम्प्ट",
    copied: "कॉपी हो गया!",
    systemMessageHint: "सिस्टम मैसेज (यूज़र को नहीं दिखता)",
    systemPromptLabel: "सिस्टम प्रॉम्प्ट · सबसे पहले · कैश्ड",
    upcomingContextLabel: "आने वाला असिस्टेंट कॉन्टेक्स्ट · आखिरी मैसेज",
  },
  widget: {
    common: {
      send: "भेजें",
      sending: "भेजा जा रहा है...",
      cancel: "रद्द करें",
      close: "बंद करें",
      copyButton: {
        copied: "कॉपी हो गया!",
        copyToClipboard: "क्लिपबोर्ड पर कॉपी करें",
        copyAsMarkdown: "Markdown में कॉपी करें",
        copyAsText: "सादे टेक्स्ट में कॉपी करें",
      },
      viewModeToggle: {
        linearView: "लीनियर व्यू",
        threadedView: "थ्रेडेड व्यू",
        flatView: "फ़्लैट व्यू",
        debugView: "डीबग व्यू",
      },
      userMessageActions: {
        branch: "ब्रांच",
        retry: "दोबारा कोशिश करें",
        deleteMessage: "मैसेज हटाएँ",
        cancelLoading: "लोडिंग रद्द करें",
        stopAudio: "ऑडियो रोकें",
        playAudio: "ऑडियो चलाएँ ({{cost}} क्रेडिट)",
      },
      assistantMessageActions: {
        answerAsAI: "AI के तौर पर जवाब दें",
        cancelLoading: "लोडिंग रद्द करें",
        stopAudio: "ऑडियो रोकें",
        playAudio: "ऑडियो चलाएँ ({{cost}} क्रेडिट)",
        actualCostUsed: "असल में लगा खर्च",
        credits: "क्रेडिट",
        tokens: "टोकन",
        tokensUsed: "इस्तेमाल हुए टोकन",
        inputTokens: "इनपुट",
        outputTokens: "आउटपुट",
        cachedTokens: "कैश्ड",
        cachedPercent: "{{percent}}% कैश्ड",
        cachedPercentTitle:
          "इनपुट टोकन का {{percent}}% कैश से आया, इसलिए खर्च कम हुआ",
        cached: "कैश्ड",
        pipeline: "पाइपलाइन",
        timeToFirstToken: "पहले टोकन तक {{seconds}} सेकंड",
        timeToFirstTokenTitle: "पहले टोकन तक का समय",
        streamingTime: "{{seconds}} सेकंड स्ट्रीमिंग",
        streamingTimeTitle: "स्ट्रीमिंग का कुल समय",
        cacheWriteTokens: "कैश राइट",
        cacheWrite: "{{tokens}} कैश में लिखे गए",
        cacheWriteTitle:
          "इस रिक्वेस्ट में {{tokens}} टोकन कैश में लिखे गए (कैश राइट रेट पर बिल)",
        deleteMessage: "मैसेज हटाएँ",
        upvote: "अपवोट",
        downvote: "डाउनवोट",
      },
      generatedMediaActions: {
        copy: "कॉपी करें",
        copied: "कॉपी हो गया",
        download: "डाउनलोड करें",
        showPrompt: "प्रॉम्प्ट दिखाएँ",
        hidePrompt: "प्रॉम्प्ट छिपाएँ",
      },
    },
    messages: {
      assistant: "असिस्टेंट",
      anonymous: "अनजान",
      you: "आप",
      edited: "एडिट किया गया",
      branch: {
        previous: "पिछली ब्रांच",
        next: "अगली ब्रांच",
      },
      authorWithId: "{{name}} ({{id}})",
      aiBadge: "AI",
      aiBadgeTitle: "इसे AI मॉडल ने लिखा है, किसी इंसान ने नहीं",
    },
    linearView: {
      answerModal: {
        title: "AI के तौर पर जवाब दें",
        description: "इस मैसेज पर AI से जवाब बनवाएँ",
        inputPlaceholder: "AI के लिए कॉन्टेक्स्ट जोड़ें...",
        confirmLabel: "जनरेट करें",
      },
      retryModal: {
        title: "दूसरे मॉडल से दोबारा करें",
        description: "इस जवाब को किसी दूसरे मॉडल से दोबारा बनवाएँ",
        confirmLabel: "दोबारा कोशिश करें",
      },
    },
    threadedView: {
      replyModal: {
        title: "जवाब दें",
        description: "इस पोस्ट के जवाब में मैसेज भेजें",
        inputPlaceholder: "अपना जवाब लिखें...",
        confirmLabel: "जवाब दें",
      },
      actions: {
        reply: "जवाब दें",
        replyToMessage: "इस मैसेज का जवाब दें",
        branch: "ब्रांच",
        branchMessage: "एडिट करें और ब्रांच बनाएँ",
        retry: "दोबारा कोशिश करें",
        retryWithDifferent: "दूसरे मॉडल से दोबारा करें",
        answerAsAI: "AI के तौर पर जवाब दें",
        generateAIResponse: "AI जवाब बनवाएँ",
        cancelLoading: "लोडिंग रद्द करें",
        stop: "रोकें",
        stopAudio: "ऑडियो रोकें",
        playAudio: "ऑडियो चलाएँ ({{cost}} क्रेडिट)",
        delete: "हटाएँ",
        deleteMessage: "मैसेज हटाएँ",
        share: "शेयर करें",
        copyPermalink: "परमालिंक कॉपी करें",
        upvote: "अपवोट",
        downvote: "डाउनवोट",
        play: "चलाएँ",
        cancel: "रद्द करें",
        parent: "पैरेंट पर जाएँ",
      },
      answerModal: {
        title: "AI के तौर पर जवाब दें",
        description: "इस मैसेज पर AI से जवाब बनवाएँ",
        inputPlaceholder: "AI के लिए कॉन्टेक्स्ट जोड़ें...",
        confirmLabel: "जनरेट करें",
      },
      retryModal: {
        title: "दूसरे मॉडल से दोबारा करें",
        description: "इस जवाब को किसी दूसरे मॉडल से दोबारा बनवाएँ",
        confirmLabel: "दोबारा कोशिश करें",
      },
      anonymous: "अनजान",
      assistantFallback: "असिस्टेंट",
      userFallback: "यूज़र",
      youLabel: "आप",
      authorWithId: "{{name}} ({{id}})",
      reply: "जवाब",
      replies: "जवाब",
      expandReplies: "जवाब खोलें",
      collapseReplies: "जवाब समेटें",
      continueThread: "थ्रेड जारी रखें ({{count}} {{replyText}})",
    },
    flatView: {
      replyModal: {
        title: "जवाब दें",
        description: "इस पोस्ट के जवाब में मैसेज भेजें",
        inputPlaceholder: "अपना जवाब लिखें...",
        confirmLabel: "जवाब दें",
      },
      actions: {
        reply: "जवाब दें",
        replyToMessage: "इस मैसेज का जवाब दें",
        branch: "ब्रांच",
        branchMessage: "एडिट करें और ब्रांच बनाएँ",
        retry: "दोबारा कोशिश करें",
        retryWithDifferent: "दूसरे मॉडल से दोबारा करें",
        answerAsAI: "AI के तौर पर जवाब दें",
        generateAIResponse: "AI जवाब बनवाएँ",
        delete: "हटाएँ",
        deleteMessage: "मैसेज हटाएँ",
        copyReference: "रेफ़रेंस कॉपी करें",
        upvote: "अपवोट",
        downvote: "डाउनवोट",
      },
      answerModal: {
        title: "AI के तौर पर जवाब दें",
        description: "इस मैसेज पर AI से जवाब बनवाएँ",
        inputPlaceholder: "AI के लिए कॉन्टेक्स्ट जोड़ें...",
        confirmLabel: "जनरेट करें",
      },
      retryModal: {
        title: "दूसरे मॉडल से दोबारा करें",
        description: "इस जवाब को किसी दूसरे मॉडल से दोबारा बनवाएँ",
        confirmLabel: "दोबारा कोशिश करें",
      },
      anonymous: "अनजान",
      assistantFallback: "असिस्टेंट",
      youLabel: "आप",
      replyingTo: "इसके जवाब में",
      replies: "जवाब:",
      clickToCopyRef: "रेफ़रेंस कॉपी करने के लिए क्लिक करें",
      postsById: "इस ID की {{count}} पोस्ट",
      idLabel: "ID: {{id}}",
    },
    debugView: {
      systemMessageHint: "सिस्टम मैसेज (यूज़र को नहीं दिखता)",
    },
    userProfile: {
      recentPosts: "हाल की पोस्ट",
      noPostsYet: "अभी कोई पोस्ट नहीं",
      postCount: "{{count}} पोस्ट",
    },
    screenshot: {
      capture: "स्क्रीनशॉट लें",
      capturing: "कैप्चर हो रहा है...",
    },
    shareDialog: {
      title: "थ्रेड शेयर करें",
    },
    messageEditor: {
      titles: {
        branch: "एडिट करें और ब्रांच बनाएँ",
        reply: "जवाब दें",
        cancel: "रद्द करें",
      },
      hint: {
        branch: "एडिट करने पर नई ब्रांच बनती है",
        reply: "अपना जवाब लिखें",
      },
    },
    input: {
      keyboardShortcuts: {
        press: "दबाएँ",
        enter: "Enter",
        shiftEnter: "Shift+Enter",
        forNewLine: "नई लाइन के लिए",
      },
    },
    voiceMode: {
      callMode: "कॉल मोड",
      callModeDescription: "AI आवाज़ में जवाब देगा",
      tapToRecord: "रिकॉर्ड करने के लिए टैप करें",
    },
    batchToolConfirmation: {
      title: "बैच टूल कॉल कन्फ़र्म करें",
    },
    queue: {
      badge: "कतार में",
      cancelTooltip: "कतार से हटाकर इनपुट में वापस लाएँ",
    },
  },
  flatView: {
    timestamp: {
      sun: "रवि",
      mon: "सोम",
      tue: "मंगल",
      wed: "बुध",
      thu: "गुरु",
      fri: "शुक्र",
      sat: "शनि",
      format:
        "{{month}}/{{day}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
  },
};
