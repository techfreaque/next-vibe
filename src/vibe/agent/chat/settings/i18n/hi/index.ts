// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/hi";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    settings: "सेटिंग्स",
  },
  voices: {
    MALE: "पुरुष आवाज़",
    FEMALE: "महिला आवाज़",
  },
  enums: {
    viewMode: {
      linear: "लीनियर",
      threaded: "थ्रेडेड",
      flat: "फ़्लैट",
      debug: "डीबग",
    },
    provider: {
      AUTO: "ऑटो",
      BRAVE: "Brave",
      KAGI: "Kagi",
    },
  },
  get: {
    title: "सेटिंग्स",
    titleShort: "चैट सेटिंग्स",
    description: "यूज़र की चैट सेटिंग्स और पसंद पाएँ",
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "सेटिंग्स देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपको इस रिसोर्स तक पहुँचने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "सेटिंग्स नहीं मिलीं",
      },
      server: {
        title: "सर्वर एरर",
        description: "सेटिंग्स लाते समय गड़बड़ी हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unsavedChanges: {
        title: "अनसेव्ड बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "मौजूदा स्टेट से टकराव हुआ",
      },
    },
    success: {
      title: "हो गया",
      description: "सेटिंग्स मिल गईं",
    },
  },
  post: {
    title: "सेटिंग्स सेव करें",
    titleShort: "सेटिंग्स सेव करें",
    description: "यूज़र की चैट सेटिंग्स और पसंद अपडेट करें",
    container: {
      title: "चैट सेटिंग्स",
    },
    selectedModel: {
      label: "चुना हुआ मॉडल",
    },
    selectedSkill: {
      label: "चुनी हुई स्किल",
    },
    activeFavoriteId: {
      label: "एक्टिव फ़ेवरेट",
    },
    ttsAutoplay: {
      label: "TTS ऑटोप्ले",
    },
    viewMode: {
      label: "व्यू मोड",
    },
    contextMemory: {
      title: "कॉन्टेक्स्ट मेमोरी बजट",
      description:
        "AI आपकी बातचीत कितना पीछे तक याद रखे, उसके बाद वह समरी बनाना शुरू करता है।",
      costNote: "कम = सस्ता",
      costExplain: "(एक हद तक)। थोड़ी मेमोरी के बदले हर मैसेज का ख़र्च घटता है।",
      tooltipTitle: "AI कितनी बातचीत याद रखता है",
      tooltipBody:
        "बातचीत इस सीमा से लंबी हो जाए तो पुराने मैसेज अपने आप समराइज़ हो जाते हैं। AI की बात जुड़ी रहती है, पर टोकन कम लगते हैं। यानी ख़र्च कम।",
      tooltipModelCap: "मौजूदा मॉडल {cap} टोकन तक सपोर्ट करता है।",
      default: "डिफ़ॉल्ट",
      tokens: "टोकन",
      modelMax: "मॉडल की अधिकतम सीमा",
      resetToDefault: "डिफ़ॉल्ट पर लौटें ({value})",
      cheaper: "सस्ता",
      moreMemory: "ज़्यादा मेमोरी",
      barCheap: "कम ख़र्च · छोटी मेमोरी",
      barBalanced: "ख़र्च और मेमोरी का संतुलन",
      barRich: "भरपूर मेमोरी · ज़्यादा ख़र्च",
      barMax: "अधिकतम मेमोरी · सबसे ज़्यादा ख़र्च",
      tools: "टूल",
      toolsInherited: "विरासत में मिला",
    },
    turnStepLimit: {
      save: "सेव करें",
      label: "हर टर्न में स्टेप",
      description:
        "रुकने से पहले AI कितने टूल-कॉल राउंड चला सकता है। 5 से 500 के बीच चुनें।",
    },
    searchProvider: {
      label: "सर्च प्रोवाइडर",
      description:
        "आपका पसंदीदा वेब सर्च इंजन। ऑटो में Brave कॉन्फ़िगर हो तो वही चलता है, वरना Kagi।",
    },
    codingAgent: {
      label: "कोडिंग एजेंट",
      description:
        "AI कोडिंग एजेंट टूल बुलाए तो कौन सा कोडिंग एजेंट CLI चले। सिर्फ़ एडमिन के लिए सेटिंग।",
      options: {
        claudeCode: "Claude Code (डिफ़ॉल्ट)",
        openCode: "OpenCode",
        nextVibeCoder: "Next Vibe Coder",
      },
    },
    dreaming: {
      title: "ड्रीमिंग",
      description:
        "आप सोते हैं, AI आपका दिमाग़ सुलझाता है। मेमोरी जोड़ता है, डॉक्यूमेंट साफ़ करता है, ज़रूरी चीज़ें सामने लाता है।",
      toggle: {
        label: "ड्रीमिंग चालू करें",
      },
      schedule: {
        label: "शेड्यूल",
        options: {
          nightlyAt2: "रोज़ रात 2:00 बजे",
          weekdaysAt2: "कामकाजी दिनों में 2:00 बजे",
          weekdaysAt8: "कामकाजी दिनों में सुबह 8:00 बजे",
          every6h: "हर 6 घंटे",
          every12h: "हर 12 घंटे",
        },
      },
      favoriteId: {
        label: "फ़ेवरेट स्लॉट",
        defaultOption: "डिफ़ॉल्ट (Thea)",
      },
      prompt: {
        label: "सेशन प्रॉम्प्ट",
        placeholder: "इस सेशन में Thea किस पर ध्यान दे? डिफ़ॉल्ट के लिए खाली छोड़ें।",
        defaultPrompt:
          "Run your dreaming session. Reorganize and consolidate the cortex - memories, documents, threads. Leave everything cleaner and more organized.",
      },
      lastRun: "आख़िरी रन:",
      neverRun: "अभी तक नहीं चला",
      folderLink: "ड्रीम्स फ़ोल्डर खोलें",
      sessionCost:
        "हर सेशन में: अधिकतम {{steps}} स्टेप। {{cap}} क्रेडिट पार होते ही रुक जाता है।",
      runNow: "अभी चलाएँ",
    },
    autopilot: {
      title: "ऑटोपायलट",
      description:
        "आप दूर हों तब AI आपकी कतार संभालता है। अगले स्टेप उठाता है, प्रोजेक्ट आगे बढ़ाता है, जो रुका है उसे निपटाता है।",
      toggle: {
        label: "ऑटोपायलट चालू करें",
      },
      schedule: {
        label: "शेड्यूल",
        options: {
          nightlyAt2: "रोज़ रात 2:00 बजे",
          weekdaysAt2: "कामकाजी दिनों में 2:00 बजे",
          weekdaysAt8: "कामकाजी दिनों में सुबह 8:00 बजे",
          every6h: "हर 6 घंटे",
          every12h: "हर 12 घंटे",
        },
      },
      favoriteId: {
        label: "फ़ेवरेट स्लॉट",
        defaultOption: "डिफ़ॉल्ट (Thea)",
      },
      prompt: {
        label: "सेशन प्रॉम्प्ट",
        placeholder: "इस सेशन में Hermes किस पर ध्यान दे? डिफ़ॉल्ट के लिए खाली छोड़ें।",
        defaultPrompt:
          "Run your autopilot session. Pick up where active projects left off - advance next steps, handle queued work, keep things moving.",
      },
      lastRun: "आख़िरी रन:",
      neverRun: "अभी तक नहीं चला",
      folderLink: "ऑटोपायलट फ़ोल्डर खोलें",
      sessionCost:
        "हर सेशन में: अधिकतम {{steps}} स्टेप। {{cap}} क्रेडिट पार होते ही रुक जाता है।",
      runNow: "अभी चलाएँ",
    },
    mama: {
      title: "प्लेटफ़ॉर्म हार्टबीट",
      description:
        "Thea आपका प्रोडक्शन इंस्टेंस संभालती है। हेल्थ चेक करती है, फ़ीचर आगे बढ़ाती है, मार्केटिंग देखती है, न्यूज़ भेजती है। सभी एडमिन के बीच एक साझा स्लॉट।",
      toggle: {
        label: "Mama मोड चालू करें",
      },
      schedule: {
        label: "शेड्यूल",
        options: {
          every4h: "हर 4 घंटे",
          every6h: "हर 6 घंटे",
          every12h: "हर 12 घंटे",
          daily: "रोज़ आधी रात को",
        },
      },
      prompt: {
        label: "सेशन प्रॉम्प्ट",
        placeholder: "Thea किस पर ध्यान दे? डिफ़ॉल्ट के लिए खाली छोड़ें।",
        defaultPrompt:
          "Run your mama session. Check platform health, review error logs, advance any pending feature work, and draft any needed announcements. Leave a summary in /documents/mama/log/.",
      },
      lastRun: "आख़िरी रन:",
      neverRun: "अभी तक नहीं चला",
      runNow: "अभी चलाएँ",
    },
    webPinnedTools: {
      label: "वेब साइडबार में पिन किए टूल",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दी गई सेटिंग्स ग़लत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सेटिंग्स सेव नहीं हो पाईं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "सेटिंग्स बदलने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपको सेटिंग्स बदलने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "सेटिंग्स नहीं मिलीं",
      },
      server: {
        title: "सर्वर एरर",
        description: "सेटिंग्स सेव नहीं हो पाईं",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unsavedChanges: {
        title: "अनसेव्ड बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "सेटिंग्स में टकराव हुआ",
      },
    },
    success: {
      title: "सेटिंग्स सेव हो गईं",
      description: "आपकी सेटिंग्स सेव हो गईं",
    },
  },
  patch: {
    chatModel: {
      label: "चैट मॉडल",
      placeholder: "सिस्टम डिफ़ॉल्ट",
    },
  },
  models: { names: modelTranslations.names },
};
