import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंट",
  tags: {
    remoteConnection: "रिमोट कनेक्शन",
  },
  widget: {
    loading: "कनेक्शन लोड हो रहा है…",
    title: "रिमोट कनेक्शन",
    signInDescription: "अपना रिमोट कनेक्शन कॉन्फ़िगर करने के लिए साइन इन करें",
    back: "वापस",
    statusSection: "स्टेटस",
    connected: {
      title: "जुड़ा हुआ",
      badge: "सक्रिय",
      connectedTo: "रिमोट URL",
      transport: "ट्रांसपोर्ट (आउटबाउंड)",
      remoteTransport: "उनका ट्रांसपोर्ट",
      remoteInstance: "रिमोट इंस्टेंस",
      capabilities: "कैपेबिलिटी वर्ज़न",
      lastSynced: "आख़िरी सिंक एक्सचेंज",
      wsConnected: "जुड़ा हुआ तब से",
      refresh: "रिफ़्रेश",
      transportReverseWs: "Reverse WS (टनल)",
      transportDirectHttp: "Direct HTTP",
    },
    notConnected: {
      title: "जुड़ा नहीं है",
      description:
        "क्लाउड अकाउंट (जैसे unbottled.ai) से जुड़ें ताकि मेमोरी सिंक हो और आप कहीं से भी अपने टर्मिनल से AI टूल कॉल कर सकें।",
      benefit1: "मेमोरी इस डिवाइस और आपके क्लाउड अकाउंट के बीच अपने आप सिंक होती हैं",
      benefit2: "कमांड लाइन से AI टूल चलाएँ:",
      benefit2Code: "vibe --remote",
      benefit3: "लोकल और क्लाउड सिंक में रहते हैं",
    },
    behaviorSection: "व्यवहार",
    syncSection: "सिंक और एक्सेस",
    syncScope: {
      memories: "मेमोरी",
      documents: "दस्तावेज़",
      skills: "स्किल",
      favorites: "फ़ेवरेट",
      threads: "थ्रेड",
    },
    cortexSection: "Cortex",
    cortexDescription: "इस कनेक्शन का साझा फ़ाइल सिस्टम देखें।",
    cortexLink: "Cortex खोलें",
    sshSection: "SSH और टर्मिनल",
    sshDescription: "इस कनेक्शन से SSH कॉन्फ़िगरेशन और टर्मिनल सेशन।",
    sshLink: "SSH कनेक्शन खोलें",
    state: {
      noSyncRecorded: "कोई सिंक दर्ज नहीं",
      syncRecorded: "सिंक दर्ज",
      tunnelActive: "WebSocket खुला",
      bridgeActive: "जुड़ा हुआ",
      degraded: "कनेक्शन कमज़ोर",
      connectionLost: "कनेक्शन टूट गया",
      inactive: "निष्क्रिय",
      connectedSince: "से",
      initialSync: "सिंक हुआ",
    },
    reauthButton: "दोबारा ऑथेंटिकेट करें",
    renameButton: "नाम बदलें",
    editButton: "एडिट करें",
    reconnectButton: "दोबारा जोड़ें",
    disconnectButton: "डिस्कनेक्ट करें",
    disconnectConfirmTitle: "यह इंस्टेंस डिस्कनेक्ट करें?",
    disconnectConfirmDescription:
      "कनेक्शन हटा दिया जाएगा। आप कभी भी दोबारा जुड़ सकते हैं।",
    disconnectConfirmCancel: "रद्द करें",
    disconnectConfirmProceed: "डिस्कनेक्ट करें",
    edit: {
      identitySection: "नाम",
      reauthSection: "दोबारा ऑथेंटिकेट करें",
      transportSection: "ट्रांसपोर्ट",
      behaviorSection: "व्यवहार",
    },
  },
  get: {
    title: "रिमोट कनेक्शन स्टेटस",
    titleShort: "कनेक्शन",
    description: "किसी खास रिमोट कनेक्शन का पूरा स्टेटस और सेटिंग्स",
    instanceId: {
      label: "कनेक्शन",
      description: "देखने के लिए कनेक्शन इंस्टेंस",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "लॉग इन नहीं है",
        description: "अपना रिमोट कनेक्शन देखने के लिए लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको इसे देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "जुड़ा नहीं है",
        description: "इस इंस्टेंस के लिए कोई रिमोट कनेक्शन नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "आपका कनेक्शन निकालते समय एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
    },
    success: {
      title: "कनेक्शन मिल गया",
      description: "रिमोट कनेक्शन स्टेटस सफलतापूर्वक मिला",
    },
  },
  patch: {
    title: "रिमोट कनेक्शन अपडेट करें",
    titleShort: "कनेक्शन अपडेट करें",
    description:
      "नाम बदलें, दोबारा ऑथेंटिकेट करें, या ट्रांसपोर्ट और सिंक सेटिंग्स कॉन्फ़िगर करें",
    newInstanceId: {
      label: "नया नाम",
      description:
        "इस कनेक्शन का नाम बदलें। लोकल लेबल अपडेट होता है और रिमोट से सिंक होता है।",
    },
    email: {
      label: "ईमेल",
      description: "रिमोट इंस्टेंस पर आपका अकाउंट ईमेल",
    },
    password: {
      label: "पासवर्ड",
      description: "रिमोट इंस्टेंस पर आपका अकाउंट पासवर्ड",
    },
    transportMode: {
      label: "ट्रांसपोर्ट मोड",
      description:
        "यह कनेक्शन कैसे बात करता है। reverse-ws: लगातार आउटबाउंड WS (सेव करते ही खुलता है)। direct-http: सीधी HTTP कॉल।",
      options: {
        reverseWs: "Reverse WS",
        directHttp: "Direct HTTP",
      },
    },
    remoteTransportMode: {
      label: "उनका ट्रांसपोर्ट मोड",
      description:
        "पीयर इस तरफ़ कैसे पहुँचता है। reverse-ws: उनके भेजे पाने के लिए हम आउटबाउंड कनेक्टर रखते हैं। direct-http: वे हमारे ब्रिज पर POST करते हैं।",
    },
    isInferenceProvider: {
      label: "इन्फ़रेंस प्रोवाइडर",
      description:
        "इस कनेक्शन को AI इन्फ़रेंस देने दें। रिमोट इंस्टेंस reverse-WS पर LLM लूप चलाता है।",
    },
    forceSystemProvider: {
      label: "सिस्टम प्रोवाइडर ज़बरदस्ती",
      description:
        "एडमिन ओवरराइड: लागत और यूज़र-वार रूटिंग नियम छोड़कर सारी AI स्ट्रीम इसी कनेक्शन से भेजें। एक समय में एक कनेक्शन।",
    },
    threadMirrorMode: {
      label: "थ्रेड मिररिंग",
      description:
        "इस इंस्टेंस और जुड़े इंस्टेंस के बीच थ्रेड सिंक हों या नहीं। 'both' दोनों दिशा में थ्रेड मिरर करता है; 'off' हर थ्रेड वहीं रखता है जहाँ बना।",
      options: {
        both: "दोनों दिशा में मिरर",
        off: "मिररिंग नहीं",
      },
    },
    loopLocation: {
      label: "लूप की जगह",
      description:
        "रिमोट थ्रेड का AI लूप कहाँ चलता है। 'target' उसे जुड़े इंस्टेंस पर चलाता है (डिफ़ॉल्ट); 'caller' लूप यहीं रखता है जबकि टूल रिमोट पर चलते हैं।",
      options: {
        target: "जुड़े इंस्टेंस पर",
        caller: "इस इंस्टेंस पर",
      },
    },
    syncScope: {
      label: "सिंक स्कोप",
      description:
        "इस कनेक्शन पर कौन से डेटा प्रोवाइडर सिंक होते हैं: मेमोरी, दस्तावेज़, स्किल, फ़ेवरेट, थ्रेड।",
      memories: "मेमोरी",
      documents: "दस्तावेज़",
      skills: "स्किल",
      favorites: "फ़ेवरेट",
      threads: "थ्रेड",
    },
    reconnectNow: {
      label: "अभी दोबारा जोड़ें",
      description: "कनेक्शन बंद करके दोबारा खोलें, जिससे कनेक्ट पर पुल-सिंक चलता है।",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट गलत है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "लॉग इन नहीं है",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "इस फ़ील्ड के लिए एडमिन रोल ज़रूरी है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कनेक्शन नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "कनेक्शन अपडेट नहीं हो सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
    },
    success: {
      title: "कनेक्शन अपडेट हुआ",
      description: "सेटिंग्स सफलतापूर्वक सेव हुईं",
    },
  },
  delete: {
    title: "डिस्कनेक्ट करें",
    titleShort: "डिस्कनेक्ट करें",
    description: "इस रिमोट कनेक्शन को हटाएँ और WebSocket चैनल बंद करें",
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट गलत है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "लॉग इन नहीं है",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपके पास अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कनेक्शन नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "डिस्कनेक्ट नहीं हो सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
    },
    success: {
      title: "डिस्कनेक्ट हुआ",
      description: "रिमोट कनेक्शन सफलतापूर्वक हटा दिया गया",
    },
  },
};
