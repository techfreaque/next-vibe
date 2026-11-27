import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  compareHub: {
    title: "एआई मॉडलों की तुलना करें",
    description:
      "उपलब्ध एआई मॉडलों की कीमत, संदर्भ सीमा, क्षमताओं और सामग्री फ़िल्टरों की तुलना करें।",
  },
  meta: {
    category: "AI मॉडल",
    index: {
      title: "{{count}} AI चैट मॉडल: कीमत, कॉन्टेक्स्ट, फ़िल्टर | {{appName}}",
      description:
        "{{appName}} के सारे AI मॉडल: Claude, GPT, Gemini, Grok, DeepSeek, अनसेंसर्ड और abliterated चैट, साथ में इमेज, वॉइस और वीडियो। असली कीमत, फ़्री क्रेडिट।",
      imageAlt: "{{appName}} पर AI मॉडल डायरेक्टरी",
      keywords:
        "AI मॉडल, LLM तुलना, अनसेंसर्ड AI, ओपन सोर्स AI, AI कीमत, हिंदी में AI, {{appName}}",
    },
    model: {
      title: "{{model}} चैट ऑनलाइन: कीमत और API | {{appName}}",
      titleShort: "{{model}} चैट ऑनलाइन: कीमत और API",
      titleMin: "{{model}} चैट ऑनलाइन",
      titleUncensored: "{{model}} अनसेंसर्ड चैट ऑनलाइन | {{appName}}",
      titleUncensoredShort: "{{model}} अनसेंसर्ड चैट ऑनलाइन",
      titleLegacy: "{{model}} (अब {{successor}}): चैट ऑनलाइन | {{appName}}",
      titleLegacyShort: "{{model}} (अब {{successor}}): चैट ऑनलाइन",
      titleLegacyMin: "{{model}}, अब {{successor}}: चैट ऑनलाइन",
      titleLegacyNoSuccessor: "{{model}}: कीमत, कॉन्टेक्स्ट और विकल्प | {{appName}}",
      titleLegacyNoSuccessorShort: "{{model}}: कीमत, कॉन्टेक्स्ट और विकल्प",
      description:
        "{{lab}} के {{model}} से ऑनलाइन चैट करें, कुछ इंस्टॉल नहीं, या API से: हर 1M टोकन पर {{input}} इनपुट, {{output}} आउटपुट, {{context}} कॉन्टेक्स्ट। {{hook}}",
      descriptionFlat:
        "{{lab}} के {{model}} से ऑनलाइन चैट करें, कुछ इंस्टॉल नहीं, या API से: हर मैसेज ~{{credits}} क्रेडिट ({{money}}), {{context}} कॉन्टेक्स्ट। {{hook}}",
      descriptionUncensored:
        "{{model}} के साथ अनसेंसर्ड AI चैट, ऑनलाइन, कुछ इंस्टॉल नहीं, या API से: हर 1M टोकन पर {{input}} इनपुट, {{output}} आउटपुट, {{context}} कॉन्टेक्स्ट। {{hook}}",
      descriptionUncensoredFlat:
        "{{model}} के साथ अनसेंसर्ड AI चैट, ऑनलाइन, कुछ इंस्टॉल नहीं, या API से: हर मैसेज ~{{credits}} क्रेडिट ({{money}}), {{context}} कॉन्टेक्स्ट। {{hook}}",
      descriptionLegacy:
        "{{lab}} का {{model}} अब पुराना मॉडल है, इसकी जगह {{successor}} ने ली है। {{context}} कॉन्टेक्स्ट, हर मैसेज ~{{credits}} क्रेडिट। स्पेक्स, कीमत और नया मॉडल।",
      descriptionLegacyNoSuccessor:
        "{{lab}} का {{model}} अब पुराना मॉडल है। {{context}} कॉन्टेक्स्ट, हर मैसेज ~{{credits}} क्रेडिट। स्पेक्स, कीमत और मौजूदा विकल्प।",
      titleUncensoredNamed: "{{model}} चैट ऑनलाइन, फ़्री में आज़माएँ | {{appName}}",
      titleUncensoredNamedShort: "{{model}} चैट ऑनलाइन, फ़्री में आज़माएँ",
      hookGuest: "फ़्री क्रेडिट, साइन-अप की ज़रूरत नहीं।",
      hookAccount: "फ़्री अकाउंट पर शुरुआती क्रेडिट।",
      hookPaid: "हर मैसेज का भुगतान क्रेडिट में।",
      hookAdult: "{{hook}} एक बार 18+ चेक।",
      descriptionShort:
        "{{model}} से ऑनलाइन या API से चैट करें: हर मैसेज ~{{credits}} क्रेडिट, {{context}} कॉन्टेक्स्ट। {{hook}}",
      descriptionUncensoredShort:
        "{{model}} के साथ अनसेंसर्ड AI चैट, ऑनलाइन या API से: हर मैसेज ~{{credits}} क्रेडिट, {{context}} कॉन्टेक्स्ट। {{hook}}",
      descriptionUncensoredNamed:
        "{{model}} से ऑनलाइन चैट करें, कुछ इंस्टॉल नहीं, या API से: हर 1M टोकन पर {{input}} इनपुट, {{output}} आउटपुट, {{context}} कॉन्टेक्स्ट। {{hook}}",
      descriptionUncensoredNamedFlat:
        "{{model}} से ऑनलाइन चैट करें, कुछ इंस्टॉल नहीं, या API से: हर मैसेज ~{{credits}} क्रेडिट ({{money}}), {{context}} कॉन्टेक्स्ट। {{hook}}",
      descriptionUncensoredNamedShort:
        "{{model}} से ऑनलाइन या API से चैट करें: हर मैसेज ~{{credits}} क्रेडिट, {{context}} कॉन्टेक्स्ट। {{hook}}",
      descriptionLegacyShort:
        "{{lab}} का {{model}} पुराना मॉडल है, इसकी जगह {{successor}} ने ली है। {{context}} कॉन्टेक्स्ट, हर मैसेज ~{{credits}} क्रेडिट।",
      descriptionLegacyNoSuccessorShort:
        "{{lab}} का {{model}} पुराना मॉडल है। {{context}} कॉन्टेक्स्ट, हर मैसेज ~{{credits}} क्रेडिट। मौजूदा विकल्प भी देखें।",
      imageAlt: "{{appName}} पर {{model}}",
      keywords:
        "{{model}}, {{model}} कीमत, {{model}} API, {{model}} कॉन्टेक्स्ट विंडो, {{lab}} AI, {{appName}}",
    },
    media: {
      title: "{{model}} ऑनलाइन: हर {{unit}} {{credits}} क्रेडिट | {{appName}}",
      titleShort: "{{model}} ऑनलाइन: हर {{unit}} {{credits}} क्रेडिट",
      titleMin: "{{model}} ऑनलाइन",
      titleNoPrice:
        "{{model}}: {{type}} AI कीमत और इस्तेमाल का तरीका | {{appName}}",
      titleNoPriceShort: "{{model}}: {{type}} AI कीमत और इस्तेमाल का तरीका",
      description:
        "{{lab}} का {{model}} ({{type}}) ऑनलाइन: हर {{unit}} {{credits}} क्रेडिट ({{money}})। इनपुट: {{inputs}}। ब्राउज़र में या चैट से चलाएँ। {{hook}}",
      descriptionNoPrice:
        "{{lab}} का {{model}} ({{type}}), {{tier}} टियर। हर इस्तेमाल की असली कीमत क्रेडिट में। टूल में या चैट से चलाएँ। शुरू करने के लिए फ़्री क्रेडिट।",
      descriptionShort:
        "{{lab}} का {{model}} ऑनलाइन: हर {{unit}} {{credits}} क्रेडिट ({{money}})। ब्राउज़र में या चैट से चलाएँ। {{hook}}",
      descriptionMin:
        "{{model}} ऑनलाइन: हर {{unit}} {{credits}} क्रेडिट। ब्राउज़र में या चैट से चलाएँ। {{hook}}",
      descriptionNoPriceShort:
        "{{lab}} का {{model}} ({{type}})। हर इस्तेमाल की असली कीमत क्रेडिट में, ब्राउज़र में या चैट से।",
      imageAlt: "{{appName}} पर {{model}}",
      keywords:
        "{{model}}, {{model}} कीमत, {{lab}} AI, {{type}} AI मॉडल, {{appName}}",
    },
    compare: {
      title: "{{a}} vs {{b}}: कीमत और कॉन्टेक्स्ट | {{appName}}",
      titleShort: "{{a}} vs {{b}}: कीमत और कॉन्टेक्स्ट",
      titleMin: "{{a}} vs {{b}}",
      description:
        "{{a}} ({{tierA}}) vs {{b}} ({{tierB}}): हर मैसेज ~{{moneyA}} vs ~{{moneyB}}, कॉन्टेक्स्ट {{contextA}} vs {{contextB}}। कब कौन सा चुनें, तथ्य आमने-सामने।",
      descriptionShort:
        "{{a}} ({{tierA}}) vs {{b}} ({{tierB}}): हर मैसेज ~{{moneyA}} vs ~{{moneyB}}, कॉन्टेक्स्ट {{contextA}} vs {{contextB}}।",
      imageAlt: "{{appName}} पर {{a}} vs {{b}}",
      keywords: "{{a}} vs {{b}}, {{a}}, {{b}}, AI मॉडल तुलना, {{appName}}",
    },
  },
  tiers: {
    mainstream: {
      name: "मेनस्ट्रीम",
      line: "बड़ी लैब्स के मॉडल, उनके अपने सेफ़्टी फ़िल्टर के साथ। काम, कोड और रिसर्च के लिए बेहतरीन।",
    },
    open: {
      name: "ओपन",
      line: "ओपन-वेट मॉडल, हल्के फ़िल्टर के साथ। ज़्यादा बात, कम इनकार।",
    },
    uncensored: {
      name: "अनसेंसर्ड",
      line: "कम पाबंदी वाली बातचीत और क्रिएटिव काम के लिए मॉडल।",
    },
  },
  modality: {
    text: "टेक्स्ट",
    image: "इमेज",
    audio: "ऑडियो",
    video: "वीडियो",
  },
  facts: {
    heading: "तथ्य",
    type: "मॉडल का प्रकार",
    lab: "बनाने वाला",
    tier: "कंटेंट टियर",
    intelligence: "इंटेलिजेंस",
    price: "हर मैसेज की अनुमानित कीमत",
    priceValue: "~{{credits}} क्रेडिट ({{money}})",
    priceFree: "फ़्री",
    referenceTurn: "रेफ़रेंस मैसेज: {{input}} इनपुट टोकन और {{output}} आउटपुट टोकन।",
    referenceImageTurn:
      "रेफ़रेंस मैसेज: {{input}} इनपुट टोकन, {{output}} टेक्स्ट आउटपुट टोकन और एक बनाई गई इमेज।",
    priceProvider: "दरें {{provider}} की हैं।",
    conditionalPrice: "हर 1M टोकन पर शर्तों वाली कीमतें",
    tierAt: "{{tokens}} इनपुट टोकन से: {{rates}}।",
    tierUtc: "{{start}} से {{end}} UTC: {{rates}}।",
    tierInput: "इनपुट {{price}}",
    tierOutput: "आउटपुट {{price}}",
    tierRead: "कैश रीड {{price}}",
    tierWrite: "कैश राइट {{price}}",
    tierHour: "एक घंटे वाला राइट {{price}}",
    cacheReadSentence: "कैश किया गया इनपुट हर 10 लाख टोकन पर {{price}}।",
    cacheWrite1hPrice: "एक घंटे वाले कैश राइट, हर 1M टोकन",
    cacheWrite1hSentence:
      "एक घंटे वाले कैश राइट की कीमत हर 10 लाख टोकन पर {{price}} है।",
    cacheWriteSentence: "कैश राइट की कीमत हर 10 लाख टोकन पर {{price}} है।",
    cacheReadPrice: "कैश इनपुट, हर 1M टोकन",
    cacheWritePrice: "कैश राइट, हर 1M टोकन",
    imageOutputPrice: "इमेज आउटपुट, हर 1M टोकन",
    perMillionCredits: "{{credits}} क्रेडिट",
    priceFootnote:
      "चार्ज इस्तेमाल और प्रोवाइडर पर निर्भर करता है। करेंसी का अनुमान एक बार वाले क्रेडिट पैक की दर {{value}} प्रति क्रेडिट से है।",
    context: "कॉन्टेक्स्ट विंडो",
    contextValue: "{{tokens}} टोकन",
    contextHint: "≈ एक बार में {{pages}} पेज टेक्स्ट",
    inputs: "इनपुट के प्रकार",
    outputs: "आउटपुट के प्रकार",
    providers: "किसके ज़रिए",
    tools: "टूल इस्तेमाल",
    toolsYes: "हाँ: सर्च, मेमोरी, कोड और भी बहुत कुछ",
    toolsNo: "नहीं: सिर्फ़ चैट",
    status: "स्टेटस",
    statusCurrent: "मौजूदा",
    statusLegacy: "पुराना",
    tokenPrice: "हर 1M टोकन की कीमत",
    tokenPriceValue: "{{input}} इनपुट, {{output}} आउटपुट",
    tokenPriceHint: "{{inputCredits}} / {{outputCredits}} क्रेडिट",
    parameters: "साइज़",
    parametersValue: "{{count}}B पैरामीटर",
    strengths: "किसके लिए मशहूर",
    uncensoredKind: "किस तरह का अनसेंसर्ड",
    apiId: "API मॉडल id",
    apiIdHint: "OpenAI और Anthropic कम्पैटिबल API। पेड अकाउंट चाहिए: कोई भी प्लान।",
    apiIdLegacy: "अब API पर नहीं। {{successor}} इस्तेमाल करें।",
    apiIdLegacyNoSuccessor: "अब API पर नहीं।",
    notListed: "लिस्टेड नहीं",
    notUncensored: "फ़िल्टर वाला",
    fixedPrice: "हर मैसेज की तय कीमत।",
    notPublished: "प्रकाशित नहीं",
    apiIdUnsupported: "यह मॉडल टेक्स्ट चैट API में नहीं है।",
  },
  strengths: {
    coding: "कोड",
    reasoning: "रीज़निंग",
    analysis: "एनालिसिस",
    creative: "क्रिएटिव राइटिंग",
    roleplay: "रोलप्ले",
    roleplayDark: "डार्क फ़िक्शन",
    fast: "स्पीड",
    vision: "विज़न",
    imageGen: "इमेज बनाना",
  },
  uncensoredKind: {
    ownWorldview: {
      name: "अपना नज़रिया",
      line: "उन किताबों और दस्तावेज़ों पर ट्रेन किया गया जिन्हें मुख्यधारा इंटरनेट से हटा दिया गया, इसलिए इसकी राजनीतिक राय मुख्यधारा से उलटी है।",
    },
    abliterated: {
      name: "Abliterated",
      line: "इनकार कम करने के लिए बेस मॉडल के वेट्स बदले गए हैं।",
    },
    fineTuned: {
      name: "फ़ाइन-ट्यून",
      line: "कम पाबंदी वाले जवाबों के लिए एक मौजूदा मॉडल को फ़ाइन-ट्यून किया गया है।",
    },
    unlisted: {
      name: "तरीका नहीं बताया गया",
      line: "यह मॉडल अनसेंसर्ड टियर में है। इसकी ट्रेनिंग या फ़िल्टरिंग का तरीका नहीं बताया गया है।",
    },
  },
  units: {
    image: "इमेज",
    audio: "ट्रैक",
    video: "{{seconds}}s क्लिप",
    videoClip: "क्लिप",
    tts: "{{chars}} अक्षर",
    stt: "{{seconds}}s ऑडियो",
  },
  bestFor: {
    heading: "{{model}} किस काम में सबसे अच्छा है",
    good: "इसके लिए इस्तेमाल करें",
    skip: "इसके लिए न लें",
    items: {
      coding: "कोड लिखना, रिव्यू करना और ठीक करना",
      reasoning: "कई स्टेप वाली रीज़निंग: गणित, लॉजिक, प्लानिंग",
      analysis: "लंबे मटीरियल की रिसर्च और एनालिसिस",
      creative: "क्रिएटिव राइटिंग और ब्रेनस्टॉर्मिंग",
      roleplay: "रोलप्ले और इंटरैक्टिव फ़िक्शन",
      roleplayDark: "डार्क और टैबू फ़िक्शन",
      fast: "जब स्पीड मायने रखे, तब फटाफट जवाब",
      vision: "स्क्रीनशॉट, फ़ोटो और स्कैन पढ़ना",
      videoInput: "वीडियो समझना",
      audioInput: "ऑडियो सुनना",
      imageGen: "चैट में इमेज बनाना",
      longContext: "पूरी किताब या कोडबेस एक ही प्रॉम्प्ट में",
      budget: "कम बजट में ज़्यादा मात्रा का काम",
      tools: "टूल के साथ एजेंट वाला काम: सर्च, मेमोरी, कोड",
      uncensored: "वो सवाल जिन्हें मेनस्ट्रीम मॉडल मना कर देते हैं",
      ownWorldview: "मुख्यधारा से उलटी राजनीतिक राय",
    },
    skipItems: {
      noTools: "एजेंट वर्कफ़्लो: इसमें टूल कॉल नहीं है",
      noImages: "ऐसे काम जिनमें इमेज इनपुट चाहिए",
      pricey: "बल्क काम: हर रेफ़रेंस मैसेज {{credits}} क्रेडिट",
      smallContext: "बहुत लंबे डॉक्यूमेंट: कॉन्टेक्स्ट {{tokens}} टोकन पर खत्म",
      filtered: "वो टॉपिक जिन्हें {{lab}} फ़िल्टर करता है: उनके लिए अनसेंसर्ड मॉडल लें",
      legacy: "नए प्रोजेक्ट: इसकी जगह {{successor}} है",
      legacyNoSuccessor: "नए प्रोजेक्ट: यह पुराना मॉडल है",
      coding: "भारी कोडिंग वाला काम",
      analysis: "गहरी एनालिसिस",
      reasoning: "जटिल रीज़निंग",
      creative: "क्रिएटिव राइटिंग",
      roleplay: "कैरेक्टर रोलप्ले",
    },
    media: {
      image: "इमेज बनाना",
      video: "वीडियो क्लिप बनाना",
      audio: "म्यूज़िक बनाना",
      tts: "लिखे टेक्स्ट को आवाज़ में बदलना",
      stt: "रिकॉर्ड की गई आवाज़ को टेक्स्ट में बदलना",
      otherOutputs: "ऐसे काम जिनमें {{outputs}} के अलावा आउटपुट चाहिए",
    },
    picks: {
      claudeOpus:
        "मुश्किल काम के लिए Anthropic का सबसे दमदार मॉडल: बड़े कोडबेस, सावधानी वाली एनालिसिस, समझदारी वाली राइटिंग। हर मैसेज महँगा है, इसलिए वहीं लगाएँ जहाँ क्वालिटी की कीमत वसूल हो।",
      claudeSonnet:
        "रोज़ का Claude। कोड, एनालिसिस और राइटिंग में मज़बूत, और Opus से सस्ता, इसलिए क्रेडिट खाली किए बिना रोज़ का काम संभाल लेता है।",
      claudeHaiku:
        "तेज़ और सस्ता Claude: फटाफट जवाब, समरी और आसान कोड। स्क्रीनशॉट भी पढ़ लेता है।",
      gptSol:
        "रोज़ की कोडिंग, डॉक्यूमेंट एनालिसिस और टूल वाले कामों के लिए Sol लें। टेक्स्ट और इमेज दोनों लेता है।",
      gptLuna:
        "रोज़ की चैट और फटाफट जानकारी के लिए OpenAI का तेज़, कम कीमत वाला मॉडल।",
      geminiArgon:
        "Google का टॉप टियर जो टेक्स्ट, इमेज, वीडियो और ऑडियो पढ़ता है। मिक्स मीडिया पर रीज़निंग और कोड में मज़बूत।",
      geminiFlash:
        "तेज़ Gemini जो इमेज, वीडियो और ऑडियो भी पढ़ता है। तेज़ एनालिसिस और कोड के लिए पैसा वसूल।",
      grok: "xAI का फ़्लैगशिप, बाकी बड़ी लैब्स से हल्के फ़िल्टर के साथ। मज़बूत रीज़निंग और कोड, कम इनकार।",
      deepseekPro:
        "DeepSeek का बड़ा रीज़निंग मॉडल। टॉप लेवल कोड और एनालिसिस, बंद फ़्लैगशिप मॉडल्स की कीमत के छोटे से हिस्से में।",
      deepseekFlash:
        "यहाँ के सबसे सस्ते काबिल मॉडल्स में से एक। तेज़ कोड और एनालिसिस, इमेज पढ़ता है, ज़्यादा मात्रा के काम के लिए बना।",
      glm: "कोड और रीज़निंग के लिए Z.AI का ओपन मॉडल। बजट कीमत में समझदार जवाब।",
      kimi: "Moonshot का फ़्लैगशिप: रीज़निंग, कोड और क्रिएटिव राइटिंग, और इमेज व वीडियो भी पढ़ता है।",
      qwenMax:
        "Alibaba का फ़्लैगशिप Qwen। रीज़निंग, कोड और एनालिसिस, और इमेज व वीडियो भी पढ़ता है।",
      mistralLarge:
        "फ़्रांस से Mistral का फ़्लैगशिप। ठोस कोड और एनालिसिस, और इमेज भी पढ़ता है।",
      metaWonder:
        "Meta का टॉप मॉडल। टेक्स्ट, इमेज, वीडियो और ऑडियो पढ़ता है, रीज़निंग, कोड और क्रिएटिव काम में मज़बूत।",
      uncensoredLm:
        "अपने नज़रिए वाला अनसेंसर्ड मॉडल। UncensoredLM उन किताबों और दस्तावेज़ों पर ट्रेन किया गया है जिन्हें मुख्यधारा इंटरनेट से हटा दिया गया, इसलिए ऐसी राजनीतिक राय की उम्मीद रखें जो बड़ी लैब्स आपको नहीं देंगी।",
      glmUncensored:
        "रीज़निंग, कोडिंग और एनालिसिस के लिए abliterated GLM 5.3। टूल कॉल सपोर्ट करता है।",
      glmFlashUncensored:
        "फटाफट जवाब और इमेज वाले प्रॉम्प्ट के लिए abliterated GLM 5.3 Flash।",
      deepseekFlashUncensored:
        "कोड, एनालिसिस और फ़िक्शन के लिए abliterated DeepSeek V4.1 Flash। इमेज भी लेता है।",
      veniceUncensored:
        "क्रिएटिव राइटिंग और रोलप्ले के लिए Venice का फ़ाइन-ट्यून चैट मॉडल।",
    },
  },
  related: {
    heading: "मिलते-जुलते मॉडल",
    intro: "वही लैब, वही टियर, सस्ते विकल्प। हर एक का अपना पेज है।",
    reasons: {
      uncensored: "अनसेंसर्ड वर्ज़न",
      original: "ओरिजिनल मॉडल",
      cheaper: "सस्ता, वही टियर",
      sameLab: "{{lab}} का ही",
      sameTier: "वही टियर",
      sameType: "वही प्रकार",
    },
    perMessage: "हर मैसेज ~{{credits}} क्रेडिट",
    perUse: "हर {{unit}} {{credits}} क्रेडिट",
  },
  plans: {
    heading: "हर प्लान पर {{model}} का खर्च",
    intro:
      "{{model}} पर एक रेफ़रेंस मैसेज करीब {{credits}} क्रेडिट ({{money}}) का पड़ता है। देखिए हर प्लान एक महीने में कितना चलता है।",
    mediaIntro:
      "{{model}} के साथ एक {{unit}} {{credits}} क्रेडिट ({{money}}) का पड़ता है। देखिए हर प्लान एक महीने में कितना चलता है।",
    messages: "हर महीने मैसेज",
    uses: "हर महीने इस्तेमाल",
    colPlan: "प्लान",
    colPrice: "मासिक कीमत",
    colCredits: "मासिक क्रेडिट",
    guest: "गेस्ट, बिना साइन अप",
    account: "फ़्री अकाउंट",
    free: "फ़्री",
    about: "करीब {{count}}",
    underOne: "1 से कम",
    footnote:
      "लंबे प्रॉम्प्ट, फ़ाइलें और टूल कॉल हर मैसेज में ज़्यादा क्रेडिट लेते हैं। वही क्रेडिट हर मॉडल पर चलते हैं।",
    mediaFootnote:
      "लंबाई, साइज़ या क्वालिटी के विकल्प हर इस्तेमाल का चार्ज बदलते हैं। वही क्रेडिट हर मॉडल पर चलते हैं।",
  },
  nearest: {
    heading: "{{model}} vs सबसे करीबी विकल्प",
    intro: "कीमत, कॉन्टेक्स्ट और टियर आमने-सामने। पूरी जानकारी के लिए हेड-टू-हेड खोलें।",
    colModel: "मॉडल",
    colPrice: "हर मैसेज की कीमत",
    colCompare: "हेड-टू-हेड",
    thisModel: "यह पेज",
  },
  faq: {
    heading: "{{model}}: सवाल और जवाब",
    price: {
      q: "{{model}} की कीमत कितनी है?",
      aTokens:
        "{{provider}} के ज़रिए एक रेफ़रेंस मैसेज करीब {{credits}} क्रेडिट ({{money}})। हर 10 लाख टोकन पर इनपुट {{input}} और टेक्स्ट आउटपुट {{output}}।",
      aFlat: "{{provider}} के ज़रिए हर मैसेज {{credits}} क्रेडिट ({{money}})।",
      aFree: "{{model}} के मैसेज पर कोई क्रेडिट नहीं लगता।",
    },
    uncensored: {
      q: "क्या {{model}} अनसेंसर्ड है?",
      mainstream:
        "नहीं। {{model}} में {{lab}} के सेफ़्टी फ़िल्टर हैं और यह कुछ टॉपिक मना करता है। उनके लिए उसी चैट में किसी अनसेंसर्ड मॉडल पर स्विच करें।",
      open: "{{model}} ओपन टियर में है। इसके जवाब फिर भी फ़िल्टर हो सकते हैं।",
      yes: "हाँ।",
      consent: "अनसेंसर्ड चैट मॉडल के लिए एक बार 18+ कन्फ़र्मेशन ज़रूरी है।",
    },
    api: {
      q: "क्या मैं {{model}} को API से इस्तेमाल कर सकता हूँ?",
      a: "हाँ। {{appName}} API पर इसे {{id}} के नाम से कॉल करें, जो OpenAI और Anthropic दोनों फ़ॉर्मेट समझता है। API के लिए पेड अकाउंट चाहिए: कोई भी प्लान।",
      legacy:
        "{{model}} पुराना मॉडल है और अब API पर लिस्टेड नहीं है। इसकी जगह {{successor}} ({{id}}) इस्तेमाल करें। API के लिए पेड अकाउंट चाहिए: कोई भी प्लान।",
      legacyNoSuccessor:
        "{{model}} पुराना मॉडल है और अब API पर लिस्टेड नहीं है। GET /v1/models से वो सारे मॉडल दिखते हैं जिन्हें आप कॉल कर सकते हैं।",
    },
    context: {
      q: "{{model}} की कॉन्टेक्स्ट विंडो कितनी बड़ी है?",
      a: "{{tokens}} टोकन। यानी एक बार में करीब {{pages}} पेज टेक्स्ट।",
    },
    providers: {
      q: "इस प्लेटफ़ॉर्म पर {{model}} कौन चलाता है?",
      a: "उपलब्ध प्रोवाइडर में {{providers}} शामिल हैं।",
    },
    inputs: {
      q: "{{model}} कौन से इनपुट और आउटपुट सपोर्ट करता है?",
      modalities: "इनपुट: {{inputs}}। आउटपुट: {{outputs}}।",
      toolsYes: "यह टूल कॉल सपोर्ट करता है।",
      toolsNo: "टूल कॉल उपलब्ध नहीं है।",
    },
    bestFor: {
      q: "{{model}} किस काम के लिए अच्छा है?",
      a: "इसके लिए इस्तेमाल करें: {{items}}।",
    },
    cheaper: {
      q: "क्या {{model}} का कोई सस्ता विकल्प है?",
      a: "{{other}}: वही टियर, उतना या उससे ऊँचा इंटेलिजेंस लेवल, और हर रेफ़रेंस मैसेज {{credits}} की जगह करीब {{otherCredits}} क्रेडिट।",
    },
    free: {
      q: "क्या {{model}} फ़्री है?",
      a: "आप इसे फ़्री में आज़मा सकते हैं। गेस्ट को बिना साइन अप हर महीने {{guest}} क्रेडिट मिलते हैं, यानी करीब {{guestMessages}} {{model}} मैसेज। फ़्री अकाउंट में {{account}} क्रेडिट, करीब {{accountMessages}} मैसेज। प्लान {{planPrice}} प्रति माह से शुरू, {{planCredits}} क्रेडिट, करीब {{planMessages}} मैसेज।",
      aAccount:
        "एक रेफ़रेंस मैसेज {{credits}} क्रेडिट का है, जो {{guest}} गेस्ट क्रेडिट से ज़्यादा है। फ़्री अकाउंट में हर महीने {{account}} क्रेडिट, करीब {{accountMessages}} {{model}} मैसेज। प्लान {{planPrice}} प्रति माह से शुरू, {{planCredits}} क्रेडिट, करीब {{planMessages}} मैसेज।",
      aPaid:
        "फ़्री कोटे पर नहीं। एक रेफ़रेंस मैसेज {{credits}} क्रेडिट का है, जो हर महीने के {{account}} फ़्री क्रेडिट से ज़्यादा है। प्लान {{planPrice}} प्रति माह से शुरू, {{planCredits}} क्रेडिट, करीब {{planMessages}} {{model}} मैसेज।",
    },
    versus: {
      q: "{{model}} या {{other}}: कौन सा चुनूँ?",
      a: "{{model}} हर रेफ़रेंस मैसेज करीब {{credits}} क्रेडिट लेता है, इसकी कॉन्टेक्स्ट विंडो {{context}} टोकन है और यह {{tier}} टियर में है। {{other}} करीब {{otherCredits}} क्रेडिट लेता है, इसमें {{otherContext}} टोकन कॉन्टेक्स्ट है और यह {{otherTier}} टियर में है। दोनों एक ही चैट में चलते हैं, तो बातचीत के बीच स्विच करें और जवाब खुद परखें।",
    },
    try: {
      q: "मैं {{model}} कैसे आज़माऊँ?",
      a: "{{model}} चुनकर चैट खोलें। नए विज़िटर को शुरू करने के लिए फ़्री क्रेडिट मिलते हैं, कार्ड की ज़रूरत नहीं।",
      aLegacy:
        "{{model}} पुराना मॉडल है। नई चैट {{successor}} इस्तेमाल करती हैं, जिसे आप फ़्री स्टार्टर क्रेडिट से आज़मा सकते हैं, कार्ड की ज़रूरत नहीं।",
    },
  },
  mediaFaq: {
    price: {
      q: "{{model}} की कीमत कितनी है?",
      a: "{{provider}} के ज़रिए हर {{unit}} {{credits}} क्रेडिट ({{money}})। लंबाई या साइज़ जैसे विकल्प चार्ज बदल सकते हैं।",
      aNone: "रेफ़रेंस कीमत अभी उपलब्ध नहीं है।",
    },
    use: {
      q: "{{model}} कैसे इस्तेमाल करूँ?",
      a: "शुरू करने के लिए {{model}} चुनकर क्रिएशन टूल खोलें।",
    },
    inputs: {
      q: "{{model}} इनपुट में क्या लेता है?",
      a: "इनपुट: {{inputs}}। आउटपुट: {{outputs}}।",
    },
    uncensored: {
      q: "क्या {{model}} अनसेंसर्ड है?",
      mainstream: "नहीं। {{model}} {{lab}} के कंटेंट फ़िल्टर के साथ चलता है।",
      open: "कुछ हद तक। {{model}} के फ़िल्टर मेनस्ट्रीम मॉडल से हल्के हैं, पर यह पूरी तरह अनसेंसर्ड नहीं है।",
      uncensored: "यह मॉडल अनसेंसर्ड टियर में है।",
      consent: "अनसेंसर्ड मॉडल के लिए एक बार 18+ कन्फ़र्मेशन चाहिए।",
    },
  },
  readMore: {
    heading: "और पढ़ें",
    landings: {
      uncensored: {
        title: "अनसेंसर्ड AI: बिना फ़िल्टर वाले सभी मॉडल एक जगह",
        excerpt:
          "हर अनसेंसर्ड मॉडल एक लिस्ट में: कॉन्टेक्स्ट, हर मैसेज की कीमत और सीधा चैट लिंक।",
      },
      abliterated: {
        title: "Abliterated AI मॉडल जिन्हें आप ऑनलाइन आज़मा सकते हैं",
        excerpt:
          "मेनस्ट्रीम मॉडल, इनकार हटाकर। कॉन्टेक्स्ट, हर मैसेज की कीमत और सीधा चैट लिंक।",
      },
    },
  },
  directory: {
    heading: "हर मॉडल का पेज",
    intro: "सभी {{count}} मॉडल पेज के सीधे लिंक, पुराने मॉडल भी शामिल।",
  },
  breadcrumb: {
    models: "AI मॉडल",
  },
  jsonLd: {
    perMessage: "रेफ़रेंस मैसेज",
    perCacheReadTokens: "कैश इनपुट टोकन",
    perCacheWrite1hTokens: "एक घंटे वाले कैश राइट टोकन",
    perCacheWriteTokens: "कैश राइट टोकन",
    perInputTokens: "इनपुट टोकन",
    perOutputTokens: "आउटपुट टोकन",
  },
  starterPrompt: {
    coding:
      "TypeScript में एक फ़ंक्शन लिखो जो गिने कि वाक्य में हर शब्द कितनी बार आया है। साथ में दो टेस्ट भी लिखो।",
    reasoning:
      "मेरे पास 45 मिनट हैं और तीन काम हैं जिनमें 10, 20 और 30 मिनट लगते हैं। कौन से दो काम पूरे हो सकते हैं? दो पंक्तियों में वजह बताओ।",
    creative:
      "तीन वाक्यों में एक रहस्य कहानी शुरू करो। शुरुआत लाइब्रेरी की एक किताब में मिली चाबी से हो।",
    general: "अंडे, चावल और पालक से 15 मिनट में बन सकने वाले तीन लंच सुझाओ।",
  },
  chatPrompt: "तुम किस काम में सबसे अच्छे हो? एक छोटे, ठोस उदाहरण से दिखाओ।",
  catalog: {
    typesLabel: "मॉडल का प्रकार",
    types: {
      text: "चैट",
      tts: "टेक्स्ट से वॉइस",
      stt: "वॉइस से टेक्स्ट",
      image: "इमेज",
      audio: "म्यूज़िक",
      video: "वीडियो",
    },
    context: "{{size}} कॉन्टेक्स्ट",
    legacyBadge: "पुराना",
    count: "{{count}} मॉडल",
    showLegacy: "पुराने दिखाएँ ({{count}})",
    hideLegacy: "पुराने छिपाएँ",
  },
  index: {
    eyebrow:
      "{{chat}} चैट मॉडल, साथ में {{image}} इमेज, {{video}} वीडियो, {{music}} म्यूज़िक और {{voice}} वॉइस मॉडल",
    title: "हर मॉडल। एक चैट।",
    subtitle:
      "मेनस्ट्रीम, ओपन और अनसेंसर्ड। हर मैसेज की असली कीमत, असली कॉन्टेक्स्ट साइज़। फ़िल्टर आप चुनें। हम नहीं।",
    searchLabel: "मॉडल सर्च करें",
    searchPlaceholder: "नाम या लैब से सर्च करें: Claude, DeepSeek, Venice…",
    tierCount: "{{count}} मॉडल",
    noResults: "“{{query}}” से कोई मॉडल मेल नहीं खाता।",
    legacyTitle: "पुराने मॉडल",
    legacyIntro:
      "पुराने वर्ज़न। इन्हें इस्तेमाल करने वाली सेव की गई चैट और स्किल अपने आप नए मॉडल पर चली जाती हैं।",
    perMessage: "~{{credits}} cr/मैसेज",
    free: "फ़्री",
    ctaTitle: "स्पेक्स पढ़ना छोड़िए। सीधे पूछिए।",
    ctaSubtitle: "चैट खोलें, सिलेक्टर से कोई भी मॉडल चुनें, बातचीत के बीच बदलें।",
    ctaButton: "चैट शुरू करें",
  },
  model: {
    back: "सभी मॉडल",
    chatCta: "चैट में {{model}} आज़माएँ",
    compareCta: "तुलना करें",
    legacyBanner:
      "{{model}} पुराना मॉडल है। नई चैट शुरू करने के लिए {{successor}} खोलें।",
    legacyCta: "{{successor}} देखें",
    compareWith: "{{model}} vs {{other}}",
    ctaTitle: "अभी {{model}} आज़माएँ।",
    ctaSubtitle:
      "शुरू करने के लिए फ़्री क्रेडिट, कार्ड की ज़रूरत नहीं। चैट {{model}} चुने हुए और तैयार प्रॉम्प्ट के साथ खुलती है। बस भेजें।",
  },
  media: {
    priceValue: "हर {{unit}} {{credits}} क्रेडिट",
    priceProvider: "{{provider}} के ज़रिए करीब {{price}}।",
    priceLabel: "हर इस्तेमाल की कीमत",
    generateCta: "{{model}} से बनाएँ",
    useCta: "{{model}} इस्तेमाल करें",
    priceFootnote:
      "करेंसी का अनुमान एक बार वाले क्रेडिट पैक की दर {{value}} प्रति क्रेडिट से है।",
    ctaTitle: "अभी {{model}} आज़माएँ।",
    ctaSubtitle:
      "शुरू करने के लिए फ़्री क्रेडिट, कार्ड की ज़रूरत नहीं। जनरेटर {{model}} चुने हुए खुलता है।",
  },
  compare: {
    back: "सभी मॉडल",
    eyebrow: "आमने-सामने",
    title: "{{a}} vs {{b}}",
    subtitle: "कीमत, कॉन्टेक्स्ट, इनपुट और फ़िल्टर। बेंचमार्क का ड्रामा नहीं।",
    fact: "तथ्य",
    cheaper: "{{model}} हर मैसेज पर {{times}}× सस्ता है।",
    samePrice: "दोनों का हर मैसेज का खर्च लगभग बराबर है।",
    biggerContext: "{{model}} में {{times}}× ज़्यादा कॉन्टेक्स्ट है।",
    sameContext: "दोनों में बराबर कॉन्टेक्स्ट है।",
    modelPage: "{{model}} की जानकारी",
    swap: "साइड बदलें",
    cheaperFree: "{{model}} के मैसेज पर कोई क्रेडिट नहीं लगता।",
    tierLine: "{{model}} {{tier}} टियर में है, {{other}} {{otherTier}} में।",
    verdictHeading: "आपको कौन सा चुनना चाहिए?",
    verdictIntro:
      "सीधे स्पेक्स से: कीमत, कॉन्टेक्स्ट, फ़िल्टर, इनपुट। कोई बेंचमार्क दावा नहीं।",
    edge: "जहाँ {{model}} आगे है",
    noEdge: "हमारे ट्रैक किए गए तथ्यों पर {{other}} से कोई बढ़त नहीं।",
    similar:
      "कागज़ पर {{a}} और {{b}} करीब हैं: वही फ़िल्टर, मिलती-जुलती कीमत, मिलता-जुलता कॉन्टेक्स्ट। दोनों को एक ही प्रॉम्प्ट भेजें और जो पसंद आए वो रखें।",
    moreHeading: "और तुलनाएँ",
    moreWith: "{{model}} की और तुलनाएँ",
    both: "{{a}} और {{b}}",
    pick: {
      cheaper: "कम कीमत: हर मैसेज {{money}} vs {{otherMoney}}, {{times}}× सस्ता।",
      free: "मैसेज पर कोई क्रेडिट नहीं।",
      context:
        "ज़्यादा कॉन्टेक्स्ट: {{tokens}} टोकन (करीब {{pages}} पेज) vs {{otherTokens}}।",
      lessFiltered: "कम फ़िल्टर: {{tier}} टियर vs {{otherTier}}।",
      mainstream: "{{lab}} के सेफ़्टी फ़िल्टर, काम और रिसर्च के लिए बने।",
      kind: {
        ownWorldview:
          "अपना नज़रिया: उन किताबों और दस्तावेज़ों पर ट्रेन किया गया जिन्हें मुख्यधारा इंटरनेट से हटा दिया गया।",
        abliterated: "Abliterated: इनकार कम करने के लिए बेस मॉडल के वेट्स बदले गए।",
        fineTuned: "कम पाबंदी वाले जवाबों के लिए फ़ाइन-ट्यून।",
      },
      smarter: "ऊँची इंटेलिजेंस रेटिंग: {{level}} vs {{otherLevel}}।",
      fast: "स्पीड: फटाफट जवाब इसकी खासियत है।",
      strengths: "{{list}} के लिए मशहूर, जो {{other}} की लिस्ट में नहीं।",
      inputs: "{{list}} पढ़ता है। {{other}} नहीं पढ़ता।",
      imageOutput: "चैट में ही इमेज बनाता है।",
      tools: "एजेंट काम के लिए टूल कॉल। {{other}} में नहीं है।",
      current: "मौजूदा मॉडल। {{other}} पुराना है।",
    },
  },
  compareFaq: {
    cheaper: {
      q: "कौन सस्ता है, {{a}} या {{b}}?",
      same: "लगभग बराबर। {{a}} हर मैसेज ~{{creditsA}} क्रेडिट ({{moneyA}}), {{b}} ~{{creditsB}} क्रेडिट ({{moneyB}})।",
      diff: "{{cheap}}। यह हर मैसेज ~{{cheapCredits}} क्रेडिट ({{cheapMoney}}) लेता है, {{dear}} ~{{dearCredits}} क्रेडिट ({{dearMoney}}): {{times}}× ज़्यादा।",
      diffFree:
        "{{cheap}}। इसके मैसेज पर कोई क्रेडिट नहीं, {{dear}} ~{{dearCredits}} क्रेडिट ({{dearMoney}})।",
      reference:
        "अनुमान एक रेफ़रेंस मैसेज पर है: {{input}} इनपुट और {{output}} आउटपुट टोकन। आप उतने ही टोकन का पैसा देते हैं जितने असल में इस्तेमाल हुए।",
      rates:
        "{{provider}} के ज़रिए {{model}}: हर 1M इनपुट टोकन {{input}}, हर 1M आउटपुट टोकन {{output}}।",
      fixed: "{{provider}} के ज़रिए {{model}}: हर मैसेज की तय कीमत।",
      credit: "क्रेडिट पैक की दर पर एक क्रेडिट {{value}} का है।",
    },
    context: {
      q: "किसमें ज़्यादा कॉन्टेक्स्ट है, {{a}} या {{b}}?",
      diff: "{{big}}: {{bigTokens}} टोकन (करीब {{bigPages}} पेज), जबकि {{small}} में {{smallTokens}} टोकन (करीब {{smallPages}} पेज)। यानी {{times}}× ज़्यादा।",
      same: "ज़्यादा फ़र्क नहीं। {{big}} में {{bigTokens}} टोकन (करीब {{bigPages}} पेज), {{small}} में {{smallTokens}} टोकन (करीब {{smallPages}} पेज)।",
      equal: "बराबर: दोनों में {{bigTokens}} टोकन, करीब {{bigPages}} पेज टेक्स्ट।",
    },
    smarter: {
      q: "मुश्किल कामों के लिए कौन बेहतर है, {{a}} या {{b}}?",
      diff: "{{model}} की इंटेलिजेंस रेटिंग ऊँची है: {{level}}, जबकि {{other}} की {{otherLevel}}।",
      same: "दोनों की इंटेलिजेंस रेटिंग बराबर है: {{level}}।",
      known: "{{model}} इसके लिए मशहूर है: {{list}}।",
      knownBoth: "दोनों इसके लिए मशहूर हैं: {{list}}।",
      source: "रेटिंग और खूबियाँ हमारे मॉडल कैटलॉग से हैं, किसी बेंचमार्क से नहीं।",
    },
    inputs: {
      q: "{{a}} और {{b}} क्या पढ़ और लिख सकते हैं?",
      line: "{{model}}: इनपुट {{inputs}}, आउटपुट {{outputs}}, {{tools}}।",
      toolsYes: "टूल कॉल",
      toolsNo: "टूल कॉल नहीं",
    },
    api: {
      q: "क्या मैं {{a}} और {{b}} को API से इस्तेमाल कर सकता हूँ?",
      both: "हाँ। {{appName}} API पर {{idA}} या {{idB}} कॉल करें, जो OpenAI और Anthropic दोनों फ़ॉर्मेट समझता है। एक ही key दोनों के लिए। API के लिए पेड अकाउंट चाहिए: कोई भी प्लान।",
      one: "{{model}} API पर {{id}} के नाम से है (पेड अकाउंट, कोई भी प्लान)।",
    },
    try: {
      q: "मैं {{a}} और {{b}} कैसे आज़माऊँ?",
      a: "किसी भी मॉडल को चुनकर चैट खोलें और बातचीत के बीच मॉडल सिलेक्टर से बदलें। नए विज़िटर को शुरू करने के लिए फ़्री क्रेडिट मिलते हैं, कार्ड की ज़रूरत नहीं।",
    },
  },
  picker: {
    change: "मॉडल बदलें",
    search: "मॉडल सर्च करें",
    suggested: "सुझाए गए",
    all: "सभी मॉडल",
    empty: "कोई मॉडल मेल नहीं खाता।",
  },
  refusal: {
    heading: "Refusal Index",
    intro:
      "{{model}} Refusal Index के सवालों का जवाब कैसे देता है। {{date}} को अपडेट, हर हफ़्ते नए सवाल।",
    rank: "{{total}} में से रैंक {{rank}} (1 = सबसे कम इनकार)",
    refused: "मना किया",
    hedged: "गोलमोल",
    answered: "जवाब दिया",
    judged: "{{count}} जाँचे गए जवाब",
    trend: "पिछले रन से {{delta}} पॉइंट",
    categories: "कैटेगरी के हिसाब से",
    samplesHeading: "सैंपल जवाब",
    samplesIntro: "बेंचमार्क रन के असली जवाब। हर मॉडल के लिए वही प्रॉम्प्ट।",
    question: "सवाल",
    answer: "जवाब",
    judge: "जज",
    methodCta: "हम कैसे मापते हैं",
    categoryNames: {
      politics: "राजनीति",
      history: "इतिहास",
      health: "सेहत",
      drugs: "ड्रग्स",
      sexuality: "सेक्शुअलिटी",
      security: "IT सिक्योरिटी",
      religion: "धर्म",
      law: "कानून",
      science: "विज्ञान",
      fiction: "फ़िक्शन",
      satire: "व्यंग्य",
    },
  },
};
