import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "एक कोडबेस। 13 प्लेटफ़ॉर्म। कोई समझौता नहीं।",
    category: "आर्किटेक्चर",
    description:
      "Unified Surface सिद्धांत कैसे तीन फ़ाइलों को अपने आप वेब ऐप, CLI कमांड, MCP टूल, नेटिव स्क्रीन और cron जॉब में बदल देता है।",
    imageAlt: "next-vibe Unified Surface आर्किटेक्चर",
    keywords:
      "next-vibe, unified surface, endpoint pattern, MCP, CLI, TypeScript, SaaS फ्रेमवर्क, फुल-स्टैक",
  },
  readingTime: "12 मिनट का पढ़ना",
  category: "आर्किटेक्चर",
  backToBlog: "ब्लॉग पर वापस",

  hero: {
    eyebrow: "Unified Surface सिद्धांत",
    title: "एक कोडबेस। 13 प्लेटफ़ॉर्म। कोई समझौता नहीं।",
    subtitle:
      "तीन फ़ाइलें एक साथ वेब फ़ॉर्म, CLI कमांड, MCP टूल, नेटिव स्क्रीन और ऑटोमेटेड जॉब कैसे बन जाती हैं।",
    fileBarLabel: "definition.ts → web · cli · mcp · native · cron · 10 और",
    theaCardTitle: "Thea कौन है?",
    fileTreePath: "~/src/explain-to-my-boss/",
    codeBlockLabel: "allowedRoles: [",
    closingBracket: "]",
    vibeCliCommand:
      "vibe analytics/indicators/ema --source=leads_created --period=7",
  },

  intro: {
    hook: "5,802 TypeScript फ़ाइलें। करीब 2.1 मिलियन लाइनें। शून्य `any`। शून्य रनटाइम टाइप एरर। एक पैटर्न। 374 बार दोहराया गया।",
    para1:
      "यह {{appName}} और उसे चलाने वाले फ्रेमवर्क next-vibe का कोडबेस है। वही आर्किटेक्चर वेब ऐप, मोबाइल ऐप, CLI, AI एजेंट इंटरफ़ेस, MCP सर्वर, cron सिस्टम, websocket इवेंट बस और लाइव डेटाफ़्लो इंजन चलाता है।",
    para2:
      "इस पैटर्न का नाम Unified Surface है। एक बार समझ आ जाए कि यह कैसे काम करता है, तो पीछे लौटना मुश्किल लगेगा।",
  },

  fileTreeSection: {
    title: "फ़ीचर यानी एक फ़ोल्डर",
    intro:
      "next-vibe में हर फ़ीचर एक फ़ोल्डर में रहता है। तीन फ़ाइलें ज़रूरी हैं। बाकी सब वैकल्पिक।",
    fileTree: {
      line1: "explain-to-my-boss/",
      line2: "  definition.ts    ← यह क्या करता है",
      line3: "  repository.ts    ← यह कैसे करता है",
      line4: "  route.ts         ← इसे हर जगह मौजूद बनाता है",
      line5: "  widget.tsx       ← कस्टम React UI (वैकल्पिक)",
      line6: "  widget.cli.tsx   ← कस्टम टर्मिनल UI (वैकल्पिक)",
    },
    explanation:
      "बस इतना। एक फ़ोल्डर। तीन ज़रूरी फ़ाइलें। और उन तीन फ़ाइलों से वह फ़ीचर एक साथ 13 प्लेटफ़ॉर्म तक पर मौजूद होता है।",
  },

  platformsSection: {
    title: "3 फ़ाइलों से 13 प्लेटफ़ॉर्म",
    subtitle:
      "next-vibe में फ़ीचर जोड़ें तो वह सिर्फ़ API एंडपॉइंट नहीं बनता। वह एक साथ सब कुछ बन जाता है।",
    platforms: {
      webApi: {
        label: "Web API",
        description: "REST एंडपॉइंट, अपने आप वैलिडेटेड, पूरी तरह टाइप्ड",
      },
      reactUi: {
        label: "React UI",
        description: "definition से अपने आप बनता है: एक भी JSX नहीं लिखना",
      },
      cli: {
        label: "CLI",
        description: "हर एंडपॉइंट एक कमांड है, फ़्लैग अपने आप बनते हैं",
      },
      aiTool: {
        label: "AI Tool Schema",
        description: "फ़ंक्शन कॉलिंग स्कीमा अपने आप बनता है",
      },
      mcpServer: {
        label: "MCP Server",
        description: "Claude Desktop, Cursor या किसी भी MCP क्लाइंट में जोड़ें",
      },
      reactNative: {
        label: "React Native",
        description: "उसी definition से iOS और Android स्क्रीन",
      },
      cron: {
        label: "Cron जॉब",
        description: "किसी भी एंडपॉइंट को टाइमर पर चलाने के लिए शेड्यूल करें",
      },
      websocket: {
        label: "WebSocket इवेंट",
        description: "पूरा होते ही जुड़े क्लाइंट को अपडेट भेजें",
      },
      electron: {
        label: "Electron डेस्कटॉप",
        description: "उन्हीं एंडपॉइंट कॉन्ट्रैक्ट से नेटिव डेस्कटॉप ऐप",
      },
      adminPanel: {
        label: "एडमिन पैनल",
        description: "अपने आप बना एडमिन UI, कस्टम कोड की ज़रूरत नहीं",
      },
      vibeFrame: {
        label: "VibeFrame विजेट",
        description: "किसी भी वेबसाइट पर लगाने लायक iframe विजेट",
      },
      remoteSkill: {
        label: "एजेंट स्किल",
        description: "AI एजेंट इसे स्ट्रक्चर्ड स्किल की तरह बुला सकते हैं",
      },
      vibeBoard: {
        label: "Vibe Sense नोड",
        description: "लाइव डेटाफ़्लो ग्राफ़ में एक नोड: वही एंडपॉइंट",
      },
    },
  },

  deleteFolderQuote: "फ़ोल्डर हटाइए। फ़ीचर हर जगह से एक साथ गायब हो जाता है।",

  platformMarkersSection: {
    title: "प्लेटफ़ॉर्म एक्सेस एक enum ऐरे है",
    para1:
      "हर प्लेटफ़ॉर्म के लिए अलग परमिशन लेयर नहीं लिखनी पड़ती। प्लेटफ़ॉर्म एक्सेस definition में ही तय होता है: एक enum ऐरे जिसे हर प्लेटफ़ॉर्म रनटाइम पर सीधे पढ़ता है।",
    codeComment: "// यह एक ऐरे तय करता है कि फ़ीचर कहाँ दिखेगा",
    cliOff: "  CLI_OFF,         // CLI को बंद करता है",
    mcpVisible: "  MCP_VISIBLE,     // MCP टूल सूची में शामिल करता है",
    remoteSkill: "  REMOTE_SKILL,    // एजेंट स्किल फ़ाइल में रखता है",
    productionOff: "  PRODUCTION_OFF,  // प्रोडक्शन में बंद करता है",
    para2:
      "वही definition। वही जगह। सिंक करने को कोई कॉन्फ़िग फ़ाइल नहीं। हर प्लेटफ़ॉर्म की अलग परमिशन व्यवस्था नहीं।",
  },

  noApiSplitQuote:
    "इंसानों के लिए एक API और AI के लिए दूसरी API नहीं होती। बस टूल होता है।",

  demoSection: {
    title: "लाइव डेमो: Thea एक एंडपॉइंट बनाती है",
    subtitle:
      "पैटर्न को अमूर्त ढंग से समझाने की जगह मैं दिखाता हूँ कि असल में यह कैसा दिखता है।",
    theaIntro:
      "Thea इस प्लेटफ़ॉर्म की AI एडमिन है। वह प्रोडक्शन पर 24/7 चलती है, हर यूज़र वाले एंडपॉइंट कॉन्ट्रैक्ट से ही काम करती है: वही वैलिडेशन, वही परमिशन, कोई बैकडोर नहीं। और वह काम किसी लोकल मशीन को सौंप सकती है।",
    demoStory:
      "मैंने Thea से कहा कि मेरे PC पर चल रहे Claude Code के साथ explain-to-my-boss नाम का एंडपॉइंट बनाए। उसे कोई तकनीकी फ़ैसला दीजिए और वह ऐसा तर्क लौटाता है जिस पर आपका मैनेजर सच में यकीन करे। हर डेवलपर को कभी न कभी इसकी ज़रूरत पड़ी है।",

    flow: {
      step1: {
        actor: "आप",
        label: "Thea से कहें",
        description:
          "चैट में काम लिखें: दो इनपुट फ़ील्ड, एक AI-जनित जवाब, सभी प्लेटफ़ॉर्म, MCP_VISIBLE, कस्टम React और CLI विजेट।",
      },
      step2: {
        actor: "Thea",
        label: "टास्क बनाती है",
        description:
          'Thea ज़ोर से सोचती है, targetInstance="hermes" (आपकी लोकल मशीन) के साथ टास्क बनाती है, और सो जाती है।',
      },
      step3: {
        actor: "लोकल Hermes",
        label: "टास्क उठाता है",
        description:
          "लोकल इंस्टेंस हर 60 सेकंड में सिंक करता है। कोई पोर्ट खुला नहीं। कनेक्शन आपकी मशीन शुरू करती है।",
      },
      step4: {
        actor: "Claude Code",
        label: "एंडपॉइंट बनाता है",
        description:
          "इंटरैक्टिव सेशन। पहले मौजूदा पैटर्न पढ़ता है, पाँच फ़ाइलें बनाता है, vibe check चलाता है। शून्य एरर।",
      },
      step5: {
        actor: "Claude Code",
        label: "पूरा होने की रिपोर्ट",
        description:
          "टास्क ID के साथ complete-task बुलाता है। स्टेटस: पूरा। सारांश जुड़ा हुआ।",
      },
      step6: {
        actor: "Thea",
        label: "जाग जाती है",
        description:
          "wakeUp चलता है। Thea websocket से बातचीत के बीच से लौटती है, जवाब स्ट्रीम करती है, TTS बोलता है।",
      },
      step7: {
        actor: "नतीजा",
        label: "हर जगह मौजूद",
        description:
          "वेब फ़ॉर्म। CLI कमांड। MCP टूल। React Native स्क्रीन। सब लाइव। पाँच फ़ाइलों से।",
      },
    },

    proofTitle: "सबूत",
    proofPara:
      "Claude Code के complete-task बुलाते ही तीन चीज़ें मौजूद थीं जो पाँच मिनट पहले नहीं थीं:",
    proof1:
      "एक कस्टम React विजेट: नाटकीय हेडिंग, AI आउटपुट पर एनिमेटेड ग्रेडिएंट, और एक नकली कॉर्पोरेट अलाइनमेंट स्कोर।",
    proof2:
      "एक CLI विजेट: ASCII बैनर, AI के सोचते समय स्पिनर, और तर्क हरे रंग में लाइन-दर-लाइन छपा हुआ।",
    proof3:
      "explain-to-my-boss_POST टूल MCP में दिखने लगा क्योंकि definition में MCP_VISIBLE था। अब Claude Desktop आपकी तरफ़ से आपके फ़ैसले आपके बॉस को समझा सकता है।",
    proofClosing:
      "एक definition। कुल पाँच फ़ाइलें। तीन बिल्कुल अलग UI। एंडपॉइंट कॉन्ट्रैक्ट नहीं बदला। सिर्फ़ प्रस्तुति की लेयर बदली।",
  },

  underTheHoodSection: {
    title: "अंदर क्या है",
    definitionTitle: "definition.ts: जीता-जागता कॉन्ट्रैक्ट",
    definitionPara:
      "definition एक जीता-जागता कॉन्ट्रैक्ट है जिसे हर प्लेटफ़ॉर्म रनटाइम पर पढ़ता है। उसे बदलिए और सब कुछ अपडेट हो जाता है। फ़ोल्डर हटाइए और आगे कुछ नहीं टूटता। साफ़ करने को कोई जनरेटेड कोड नहीं।",
    repositoryTitle: "repository.ts: कभी throw नहीं",
    repositoryPara:
      "रिपॉज़िटरी फ़ंक्शन कभी throw नहीं करते। एरर डेटा की तरह आगे जाते हैं: टाइप्ड, साफ़, और कॉलर के पकड़ने लायक। AI असफलता के रास्तों पर सोच सकता है। कोई चौंकाने वाले एक्सेप्शन नहीं।",
    repositoryCodeComment: "// ResponseType<T> लौटाता है - कभी throw नहीं करता",
    routeTitle: "route.ts: पूरा पुल",
    routePara:
      "route.ts definition को हैंडलर से जोड़ता है। endpointsHandler वैलिडेशन, ऑथ, लॉगिंग और सभी 13 प्लेटफ़ॉर्म पर एक्सपोज़र संभालता है। असली बिज़नेस लॉजिक एक लाइन का है।",
    statsTitle: "आँकड़े",
    statEndpoints: "374 एंडपॉइंट",
    statEndpointsDetail: "एक पैटर्न, 374 बार लगाया गया",
    statAny: "शून्य `any`",
    statAnyDetail: "बिल्ड टाइम पर लागू, रिवाज़ से नहीं",
    statLanguages: "तीन भाषाएँ",
    statLanguagesDetail: 'कंपाइल टाइम पर जाँची गई: t("typo.here") कंपाइलर एरर है',
    statsClosing: "यह रिवाज़ नहीं है। यह बिल्ड टाइम पर लागू होता है।",
  },

  onePatternQuote: "एक पैटर्न। 374 बार दोहराया गया।",

  vibeSenseTeaser: {
    eyebrow: "आगे",
    title: "Vibe Sense: पाइपलाइन ही प्लेटफ़ॉर्म है",
    description:
      "Vibe Sense ग्राफ़ का हर नोड एक सामान्य next-vibe एंडपॉइंट है। वही createEndpoint()। वही 3-फ़ाइल ढाँचा। EMA इंडिकेटर एक एंडपॉइंट है। थ्रेशोल्ड इवैल्युएटर एक एंडपॉइंट है। और एंडपॉइंट होने की वजह से आप उसे CLI से, AI से, कहीं से भी बुला सकते हैं।",
    calloutLine: "पाइपलाइन ही प्लेटफ़ॉर्म है।",
    teaser:
      "Vibe Sense बस... और एंडपॉइंट है। वही चीज़, टाइम सीरीज़ डेटा पर लगी हुई। लीड फ़नल। क्रेडिट इकॉनमी। यूज़र ग्रोथ। आपका प्लेटफ़ॉर्म खुद को देखता हुआ।",
    cta: "ब्लॉग पर वापस",
  },

  closing: {
    title: "एक बार परिभाषित कीजिए। हर जगह मौजूद।",
    para: "WordPress ने सबको पब्लिश करने की ताकत दी। next-vibe आपको वेब, मोबाइल, CLI, AI एजेंट और ऑटोमेशन के लिए प्लेटफ़ॉर्म बनाने देता है। वे खुद पर नज़र रखते हैं, अपने डेटा पर सोचते हैं, और जो पाते हैं उस पर काम करते हैं।",
    cta: "GitHub पर next-vibe को स्टार करें",
    frameworkCta: "next-vibe देखें",
  },
};
