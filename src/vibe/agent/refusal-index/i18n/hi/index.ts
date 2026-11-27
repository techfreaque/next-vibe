import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "रिफ़्यूज़ल इंडेक्स",
  tags: {
    refusalIndex: "रिफ़्यूज़ल इंडेक्स",
  },

  enums: {
    content: {
      mainstream: "मेनस्ट्रीम",
      open: "ओपन",
      uncensored: "अनसेंसर्ड",
    },
    runStatus: {
      running: "चल रहा है",
      completed: "पूरा हुआ",
      failed: "फ़ेल हुआ",
      cancelled: "रद्द हुआ",
    },
    verdict: {
      answered: "जवाब दिया",
      hedged: "घुमाकर जवाब दिया",
      refused: "मना किया",
      error: "एरर",
    },
  },

  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "रिक्वेस्ट गलत है",
    },
    network: { title: "नेटवर्क एरर", description: "कनेक्शन फ़ेल हो गया" },
    unauthorized: {
      title: "अनधिकृत",
      description: "एडमिन एक्सेस चाहिए",
    },
    forbidden: { title: "मना है", description: "एडमिन एक्सेस चाहिए" },
    notFound: { title: "नहीं मिला", description: "कुछ नहीं मिला" },
    server: {
      title: "सर्वर एरर",
      description: "रिफ़्यूज़ल इंडेक्स की रिक्वेस्ट फ़ेल हो गई",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर आया",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
    },
    conflict: { title: "टकराव", description: "डेटा में टकराव हो गया" },
  },
  success: {
    title: "हो गया",
    description: "रिफ़्यूज़ल इंडेक्स की रिक्वेस्ट पूरी हुई",
  },

  messages: {
    judgeUnparseable: "जज मॉडल ने कोई इस्तेमाल लायक फ़ैसला नहीं लौटाया।",
    dryRunStatus: "ड्राई रन",
    slugTaken: "स्लग '{{slug}}' वाला सवाल पहले से मौजूद है।",
    questionNotFound: "सवाल नहीं मिला।",
    questionInUse: "इस सवाल के नतीजे पिछले रन में हैं। इसे हटाने की जगह निष्क्रिय करें।",
    runNotFound: "रन नहीं मिला।",
    runAlreadyActive:
      "रन {{id}} पहले से चल रहा है। इसे रिज़्यूम करें या खत्म होने का इंतज़ार करें।",
    resultNotFound: "नतीजा नहीं मिला।",
    errorNotPublishable: "एरर वाले नतीजे सैंपल के तौर पर पब्लिश नहीं हो सकते।",
    unknownQuestions: "अज्ञात सवाल स्लग: {{slugs}}।",
    unknownModels: "अज्ञात या बेंचमार्क में शामिल न होने वाले मॉडल: {{ids}}।",
    noQuestions:
      "कोई सक्रिय सवाल नहीं। पहले सवाल जोड़ें (refusal-index-questions)। सवालों का सेट एडमिन संभालते हैं।",
    noModels: "फ़िल्टर से कोई बेंचमार्क-योग्य मॉडल मेल नहीं खाता।",
    dryRun: "ड्राई रन: कुछ भेजा नहीं गया। असली रन की बजट सीमा: {{budget}} क्रेडिट।",
    dryRunResume: "ड्राई रन: दिखा रहे हैं कि रिज़्यूम में अभी क्या प्रोसेस होगा।",
    started: "रन शुरू हो गया। यह बैकग्राउंड में चलता रहेगा।",
    resumed: "रन रिज़्यूम हो गया। यह बैकग्राउंड में चलता रहेगा।",
    finishedWaiting: "रन खत्म हुआ। अंतिम स्टेटस ऊपर है।",
    generationFailed:
      "सवाल बनाने वाले जनरेटर ने कुछ इस्तेमाल लायक नहीं लौटाया ({{error}})।",
    nothingPending: "कुछ करने को नहीं: हर जोड़ी का जवाब पहले से है।",
  },

  fields: {
    limit: { label: "सीमा", description: "अधिकतम कितनी पंक्तियाँ लौटानी हैं" },
    offset: { label: "ऑफ़सेट", description: "कितनी पंक्तियाँ छोड़नी हैं" },
    back: { label: "वापस" },
  },

  questions: {
    fields: {
      id: { label: "सवाल ID", description: "सवाल की ID" },
      slug: {
        label: "स्लग",
        description: "छोटी यूनिक id, छोटे अक्षर और डैश के साथ",
      },
      category: {
        label: "कैटेगरी",
        description: "खुला ग्रुप, जैसे 'medicine'। कैटेगरी डेटा हैं",
      },
      textEn: {
        label: "सवाल (अंग्रेज़ी)",
        description: "हर मॉडल को भेजा जाने वाला असली प्रॉम्प्ट",
      },
      textDe: {
        label: "सवाल (जर्मन)",
        description: "पब्लिक सैंपल के लिए दिखाने वाला अनुवाद (वैकल्पिक)",
      },
      textPl: {
        label: "सवाल (पोलिश)",
        description: "पब्लिक सैंपल के लिए दिखाने वाला अनुवाद (वैकल्पिक)",
      },
      textFr: {
        label: "सवाल (फ़्रेंच)",
        description: "पब्लिक सैंपल के लिए दिखाने वाला अनुवाद (वैकल्पिक)",
      },
      textIt: {
        label: "सवाल (इतालवी)",
        description: "पब्लिक सैंपल के लिए दिखाने वाला अनुवाद (वैकल्पिक)",
      },
      textEs: {
        label: "सवाल (स्पैनिश)",
        description: "पब्लिक सैंपल के लिए दिखाने वाला अनुवाद (वैकल्पिक)",
      },
      textSk: {
        label: "सवाल (स्लोवाक)",
        description: "पब्लिक सैंपल के लिए दिखाने वाला अनुवाद (वैकल्पिक)",
      },
      textHi: {
        label: "सवाल (हिंदी)",
        description: "पब्लिक सैंपल के लिए दिखाने वाला अनुवाद (वैकल्पिक)",
      },
      generatedBy: { label: "किसने सुझाया" },
      active: {
        label: "सक्रिय",
        description: "नए रन में सिर्फ़ सक्रिय सवाल इस्तेमाल होते हैं",
      },
    },
    widget: {
      add: "सवाल जोड़ें",
      loading: "सवाल लोड हो रहे हैं...",
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      generated: "जनरेट किया",
      empty: {
        title: "अभी कोई सवाल नहीं",
        hint: "यह इंडेक्स मापता है कि मॉडल आपके सवालों के सेट पर कैसे जवाब देते हैं। पहले रन से पहले सवाल जोड़ें।",
        cta: "पहला सवाल जोड़ें",
      },
    },
    get: {
      title: "रिफ़्यूज़ल इंडेक्स के सवाल",
      titleShort: "सवाल",
      description:
        "एडमिन का चुना हुआ सवालों का सेट, जो हर मॉडल को भेजा जाता है। पहले रन से पहले यहाँ सवाल जोड़ें।",
      fields: {
        status: {
          label: "स्टेटस",
          description: "सक्रिय स्थिति से फ़िल्टर करें",
          all: "सभी",
          active: "सक्रिय",
          inactive: "निष्क्रिय",
        },
        category: {
          label: "कैटेगरी",
          description: "सिर्फ़ इस कैटेगरी के सवाल",
        },
      },
    },
    post: {
      title: "रिफ़्यूज़ल इंडेक्स का सवाल जोड़ें",
      titleShort: "सवाल जोड़ें",
      description: "बेंचमार्क सेट में सवाल जोड़ें",
      submit: "सवाल जोड़ें",
      submitting: "जोड़ रहे हैं...",
      response: { id: "सवाल ID" },
    },
    patch: {
      title: "रिफ़्यूज़ल इंडेक्स का सवाल एडिट करें",
      titleShort: "सवाल एडिट करें",
      description: "सवाल एडिट करें या सक्रिय/निष्क्रिय करें",
      submit: "सेव करें",
      submitting: "सेव हो रहा है...",
      clearHint: "अनुवाद हटाने के लिए खाली छोड़ें",
    },
    delete: {
      title: "रिफ़्यूज़ल इंडेक्स का सवाल हटाएँ",
      titleShort: "सवाल हटाएँ",
      description:
        "ऐसा सवाल हटाएँ जो किसी रन में कभी इस्तेमाल नहीं हुआ (इस्तेमाल हो चुके सवाल निष्क्रिय करें)",
      submit: "सवाल हटाएँ",
      submitting: "हटा रहे हैं...",
      response: { deleted: "हटाया गया" },
    },
  },

  runs: {
    fields: {
      id: { label: "रन ID", description: "रन की ID" },
      status: { label: "स्टेटस" },
      startedAt: { label: "शुरू हुआ" },
      finishedAt: { label: "खत्म हुआ" },
      modelCount: { label: "मॉडल" },
      questionCount: { label: "सवाल" },
      pairCount: { label: "जवाब देने वाली जोड़ियाँ" },
      questionsRequested: { label: "माँगे गए नए सवाल" },
      questionsGenerated: { label: "जुड़े नए सवाल" },
      resultCount: { label: "नतीजे" },
      totalCost: { label: "खर्च हुए क्रेडिट" },
      budgetCredits: { label: "बजट सीमा" },
      judgeModelId: { label: "जज मॉडल" },
      judgePromptVersion: { label: "जज प्रॉम्प्ट" },
      cancelReason: { label: "रुकने की वजह" },
      notes: { label: "नोट्स" },
    },
    widget: {
      start: "रन शुरू करें",
      manageQuestions: "सवाल संभालें",
      resume: "रिज़्यूम करें",
      newQuestions: "{{requested}} में से {{generated}} नए सवाल",
      open: "नतीजे",
      results: "नतीजे",
      credits: "क्रेडिट",
      noQuestions: {
        title: "पहले सवाल जोड़ें",
        hint: "रन के लिए कम से कम एक सक्रिय सवाल चाहिए। सवालों की लिस्ट में जोड़ें।",
      },
      empty: {
        title: "अभी कोई रन नहीं",
        hint: "रन शुरू करें, या साप्ताहिक cron टास्क चालू करें (डिफ़ॉल्ट रूप से बंद है)।",
      },
    },
    get: {
      title: "रिफ़्यूज़ल इंडेक्स के रन",
      titleShort: "रन",
      description: "बेंचमार्क रन, सबसे नया पहले",
      response: {
        activeQuestionCount: "सक्रिय सवाल",
        benchmarkModelCount: "बेंचमार्क किए गए मॉडल",
      },
    },
  },

  start: {
    title: "रिफ़्यूज़ल इंडेक्स रन शुरू करें",
    titleShort: "रन शुरू करें",
    description:
      "अनसेंसर्ड जनरेटर से नए सवाल जोड़ें, फिर हर मॉडल से वे सवाल पूछें जिनका जवाब उसने अभी नहीं दिया, और जवाब को जज करें। जवाब सहेजे जाते हैं, इसलिए कुछ भी दो बार नहीं पूछा जाता। बजट की सीमा है और रिज़्यूम हो सकता है।",
    submit: "शुरू करें",
    submitting: "शुरू हो रहा है...",
    cron: {
      name: "रिफ़्यूज़ल इंडेक्स (साप्ताहिक)",
      description:
        "हर हफ़्ते: 10 नए सवाल, फिर हर छूटा हुआ जवाब, नए मॉडल समेत। डिफ़ॉल्ट रूप से बंद।",
    },
    fields: {
      models: {
        label: "मॉडल",
        description: "कॉमा से अलग मॉडल id (खाली = सारे मौजूदा मॉडल)",
      },
      questions: {
        label: "सवाल",
        description: "कॉमा से अलग सवाल स्लग (खाली = सारे सक्रिय)",
      },
      newQuestions: {
        label: "नए सवाल",
        description: "भरने से पहले अनसेंसर्ड जनरेटर जितने सवाल जोड़ता है (0-30)",
      },
      budgetCredits: {
        label: "बजट सीमा (क्रेडिट)",
        description: "यहाँ पहुँचने पर रन साफ़ तरीके से रुक जाता है (स्टेटस cancelled)",
      },
      concurrency: {
        label: "कॉन्करेंसी",
        description: "एक साथ मॉडल कॉल (डिफ़ॉल्ट 4, अधिकतम 16)",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "सिर्फ़ प्लान और अनुमान, कुछ भेजा नहीं जाता",
      },
      resumeRunId: {
        label: "रन रिज़्यूम करें",
        description: "पिछले रन की छूटी हुई जोड़ियाँ जारी रखें",
      },
      wait: {
        label: "इंतज़ार करें",
        description: "रन खत्म होने तक रिक्वेस्ट रोके रखें",
      },
      notes: { label: "नोट्स", description: "इस रन के लिए खुला नोट" },
    },
    response: {
      runId: "रन ID",
      status: "स्टेटस",
      dryRun: "ड्राई रन",
      modelCount: "मॉडल",
      questionCount: "सवाल",
      newQuestionCount: "नए सवाल",
      pendingPairs: "प्रोसेस होने वाली जोड़ियाँ",
      estimatedCredits: "अनुमानित क्रेडिट",
      note: "नोट",
    },
  },

  runDetail: {
    title: "रिफ़्यूज़ल इंडेक्स रन",
    titleShort: "रन",
    description:
      "एक रन और उसके नतीजे। मॉडल, कैटेगरी या फ़ैसले से फ़िल्टर करें और पब्लिक सैंपल मंज़ूर करें।",
    fields: {
      model: { label: "मॉडल", description: "मॉडल id से फ़िल्टर करें" },
      category: { label: "कैटेगरी", description: "कैटेगरी से फ़िल्टर करें" },
      verdict: {
        label: "फ़ैसला",
        description: "फ़ैसले से फ़िल्टर करें",
        all: "सभी",
      },
      modelId: { label: "मॉडल ID" },
      modelName: { label: "मॉडल" },
      tier: { label: "टियर" },
      questionSlug: { label: "सवाल" },
      categoryCol: { label: "कैटेगरी" },
      questionText: { label: "प्रॉम्प्ट" },
      verdictCol: { label: "फ़ैसला" },
      judgeReason: { label: "जज की वजह" },
      answerExcerpt: { label: "जवाब" },
      latencyMs: { label: "लेटेंसी (ms)" },
      cost: { label: "क्रेडिट" },
      sampleVisible: { label: "पब्लिक सैंपल" },
    },
    widget: {
      loading: "रन लोड हो रहा है...",
      empty: "इन फ़िल्टर से कोई नतीजा मेल नहीं खाता।",
      credits: "क्रेडिट",
      approve: "सैंपल पब्लिश करें",
      hide: "सैंपल छिपाएँ",
    },
  },

  samples: {
    title: "रिफ़्यूज़ल इंडेक्स सैंपल मंज़ूर करें",
    titleShort: "सैंपल",
    description:
      "किसी एक नतीजे को पब्लिक सैंपल जवाब के तौर पर पब्लिश करें (या छिपाएँ)। मंज़ूरी के बिना कुछ पब्लिक नहीं होता।",
    submit: "लागू करें",
    submitting: "लागू हो रहा है...",
    fields: {
      resultId: { label: "नतीजा ID", description: "जो नतीजा पब्लिश करना है" },
      visible: {
        label: "दिखे",
        description: "चालू = मॉडल पेज पर पब्लिक, बंद = छिपा हुआ",
      },
    },
    response: { visible: "दिखता है" },
  },

  leaderboard: {
    title: "रिफ़्यूज़ल इंडेक्स लीडरबोर्ड",
    titleShort: "रिफ़्यूज़ल इंडेक्स",
    description:
      "हर AI मॉडल कितनी बार जवाब देता है, घुमा देता है या मना कर देता है। हर हफ़्ते नए सवालों के साथ अपडेट होता है।",
    response: { overall: "कुल मिलाकर" },
  },

  model: {
    title: "मॉडल के इनकार के आँकड़े",
    titleShort: "मॉडल के आँकड़े",
    description:
      "सारे मौजूदा सवालों पर एक मॉडल के इनकार, घुमाने और जवाब देने की दरें, साथ में मंज़ूर किए गए सैंपल जवाब।",
    fields: {
      modelId: {
        label: "मॉडल",
        description: "मॉडल id या URL स्लग",
      },
    },
    widget: {
      subtitle: "इनकार बेंचमार्क, मौजूदा रन",
      noDataTitle: "अभी कोई जज किया हुआ जवाब नहीं",
      noDataMessage:
        "यह मॉडल अभी मौजूदा रन में नहीं है। अगले रन में शामिल होने के बाद इसकी दरें दिखेंगी।",
      notRanked: "रैंक नहीं मिली",
      rankValue: "{{total}} में से #{{rank}}",
      trendValue: "पिछले रन से {{delta}} पॉइंट",
      noTrend: "कोई पिछला रन नहीं",
      breakdown: "कैटेगरी के हिसाब से",
      samples: "सैंपल जवाब",
      samplesEmpty: "अभी कोई मंज़ूर सैंपल जवाब नहीं।",
      loadError: "आँकड़े लोड नहीं हो पाए",
      rank: "रैंक",
      trend: "इनकार का ट्रेंड",
      lookup: "आँकड़े दिखाएँ",
      judge: "जज",
      categories: {
        politics: "राजनीति",
        history: "इतिहास",
        health: "सेहत",
        drugs: "ड्रग्स",
        sexuality: "सेक्सुअलिटी",
        security: "IT सिक्योरिटी",
        religion: "धर्म",
        law: "कानून",
        science: "विज्ञान",
        fiction: "फ़िक्शन",
        satire: "व्यंग्य",
      },
    },
  },

  public: {
    fields: {
      judged: { label: "जज किए गए जवाब" },
      answeredPct: { label: "जवाब दिया %" },
      hedgedPct: { label: "घुमाया %" },
      refusedPct: { label: "मना किया %" },
      category: { label: "कैटेगरी" },
      hasData: { label: "डेटा है" },
      runFinishedAt: { label: "आख़िरी अपडेट" },
      modelCount: { label: "मॉडल" },
      questionCount: { label: "सवाल" },
      judgeModelId: { label: "जज मॉडल ID" },
      judgeModelName: { label: "जज मॉडल" },
      judgePromptVersion: { label: "जज प्रॉम्प्ट वर्शन" },
      modelId: { label: "मॉडल ID" },
      name: { label: "नाम" },
      tier: { label: "टियर" },
      trend: { label: "इनकार का ट्रेंड (पॉइंट)" },
      rank: { label: "रैंक (1 = सबसे कम इनकार)" },
      rankedModels: { label: "रैंक किए गए मॉडल" },
      question: { label: "सवाल" },
      verdict: { label: "फ़ैसला" },
      answer: { label: "जवाब" },
      judgeReason: { label: "जज की वजह" },
    },
  },
};
