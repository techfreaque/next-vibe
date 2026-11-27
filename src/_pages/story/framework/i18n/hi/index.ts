import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "डेवलपर्स: next-vibe फ़्रेमवर्क, अनसेंसर्ड AI API, MCP",
    description:
      "एक endpoint लिखें, पाएँ वेब UI, CLI कमांड, MCP टूल, AI टूल और भी बहुत कुछ। ओपन सोर्स। Clone, install, run। साथ में मेनस्ट्रीम और अनसेंसर्ड मॉडल के लिए एक OpenAI और Anthropic compatible API। अकाउंटिंग, इनवॉइसिंग, CRM और पॉइंट-ऑफ़-सेल मॉड्यूल भी शामिल।",
    category: "डेवलपर्स",
    imageAlt: "डेवलपर्स के लिए unbottled.ai: API, MCP और सेल्फ़-होस्टिंग",
    keywords:
      "अनसेंसर्ड AI API, uncensored AI API, OpenAI compatible API, Anthropic compatible API, abliterated model API, UncensoredLM API, MCP सर्वर, सेल्फ़-होस्टेड AI, next-vibe",
  },
  hero: {
    eyebrow: "डेवलपर्स के लिए",
    title: "एक definition.ts।",
    titleAccent: "हर सरफ़ेस।",
    subtitle:
      "next-vibe वो ओपन-सोर्स TypeScript फ़्रेमवर्क है जिस पर {{appName}} चलता है। AI चैट, अकाउंटिंग, POS, इन्वेंटरी और CRM इसी पर चलते हैं। एक endpoint बन जाता है वेब UI, CLI कमांड, MCP टूल और AI टूल। कोई जोड़-तोड़ कोड नहीं।",
    ctaFramework: "सोर्स कोड देखें",
    ctaKeys: "API इस्तेमाल करें",
    stats: {
      endpoints: "repo में टाइप्ड endpoints",
      surfaces: "एक definition से सरफ़ेस",
      languages: "भाषाएँ पहले से शामिल",
      models: "चैट मॉडल, एक API key",
    },
  },
  paths: {
    api: {
      label: "API कॉल करें",
      title: "एक key से {{modelCount}} मॉडल कॉल करें",
      body: "आपका OpenAI या Anthropic कोड, हमारा base URL। मेनस्ट्रीम और अनसेंसर्ड मॉडल एक ही key पर।",
      link: "क्विकस्टार्ट",
    },
    selfHost: {
      label: "सेल्फ़-होस्ट",
      title: "पूरा प्लेटफ़ॉर्म खुद चलाएँ",
      body: "चैट, अकाउंटिंग, POS, इन्वेंटरी, CRM। Clone, install, run।",
      link: "इंस्टॉल करें",
    },
    framework: {
      label: "इस पर बनाएँ",
      title: "एक definition, हर सरफ़ेस",
      body: "endpoint एक बार लिखें। पाएँ वेब UI, CLI कमांड, MCP टूल, AI टूल और भी बहुत कुछ।",
      link: "पैटर्न देखें",
    },
  },
  modules: {
    eyebrow: "repo में",
    title: "पूरे प्रोडक्ट, एक ही पैटर्न।",
    intro:
      "अकाउंटिंग, इनवॉइसिंग, CRM और मैसेजिंग उसी पैटर्न पर चलते हैं जिस पर ऊपर वाला कॉन्टैक्ट फ़ॉर्म। हर endpoint एक CLI कमांड, MCP टूल और AI टूल है, जब तक उसकी definition मना न करे। कोई भी फ़ोल्डर खोलिए: definition, repository, route।",
    endpoints: "{{count}} endpoints",
    business: "अपनी कंपनी इसी पर चलाएँ",
    source: "GitHub पर मॉड्यूल देखें",
    tryLine: "वही पैटर्न, असली कमांड",
    items: {
      accounting: "डबल-एंट्री अकाउंटिंग",
      documents: "इनवॉइस, बिल, कोटेशन",
      purchasing: "खरीदारी",
      pos: "पॉइंट ऑफ़ सेल",
      inventory: "इन्वेंटरी",
      crm: "CRM और लीड्स",
      newsletter: "न्यूज़लेटर",
      messaging: "इनबॉक्स और मैसेजिंग",
    },
  },
  quickstart: {
    eyebrow: "क्विकस्टार्ट",
    title: "तीन कदम में पहला जवाब।",
    intro:
      "API, OpenAI Chat Completions और Responses, और Anthropic Messages बोलता है। तीन बदलाव और आपका कोड यहाँ चलने लगता है: base URL, key और `GET /v1/models` से एक model id।",
    step1: {
      title: "API अनलॉक करें और key बनाएँ",
      description:
        "{{subPrice}} महीने से शुरू कोई भी प्लान इसे अनलॉक करता है। फिर API keys खोलें, key को नाम दें और कॉपी करें। यह सिर्फ़ एक बार दिखती है।",
      ctaPlans: "प्लान देखें",
      ctaKeys: "API keys खोलें",
    },
    step2: {
      title: "अपने क्लाइंट को हमारी तरफ़ पॉइंट करें",
      description:
        "OpenAI क्लाइंट पहला URL लेते हैं। Claude Code और Anthropic SDK दूसरा।",
      baseUrl: "OpenAI base URL",
      baseUrlNote:
        "path में कोई भी locale चलेगा। इससे सिर्फ़ एरर मैसेज की भाषा बदलती है।",
      anthropicBaseUrl: "Anthropic base URL",
      anthropicNote:
        "आखिर में `/v1` नहीं: Anthropic क्लाइंट `/v1/messages` खुद जोड़ते हैं।",
    },
    step3: {
      title: "रिक्वेस्ट भेजें",
      description:
        "अपनी key डालें और चलाएँ। `{{model}}` एक model id है। `GET /v1/models` वो हर id दिखाता है जिसे आपकी key कॉल कर सकती है।",
      response: "उदाहरण जवाब",
    },
    agents: {
      title: "कोडिंग एजेंट सीधे काम करते हैं",
      body: "टेस्ट किए हुए सेटअप, बस कॉपी-पेस्ट करें:",
      link: "कोडिंग एजेंट सेटअप",
    },
    reference: "पूरा API रेफ़रेंस",
  },
  pricing: {
    eyebrow: "कीमतें",
    title: "प्लान से API अनलॉक होता है। हर कॉल का भुगतान क्रेडिट में।",
    intro: "चैट ऐप जैसे ही रेट। न API सरचार्ज, न सीट फ़ीस, एक ही बैलेंस।",
    unlockTitle: "API अनलॉक करता है",
    unlockPlan: "कोई भी प्लान, {{subPrice}} महीने से",
    unlockGrant: "हमारी टीम के दिए क्रेडिट, जैसे टेस्टर क्रेडिट",
    neverTitle: "कभी अनलॉक नहीं करता",
    never:
      "फ़्री टियर: मंथली अलाउंस, साइन अप और न्यूज़लेटर बोनस, रेफ़रल कमाई। प्लान या दिए गए क्रेडिट के बिना हर `/v1` कॉल का जवाब 402 `paid_plan_required` होता है।",
    billTitle: "एक कॉल का बिल कैसे बनता है",
    bill: "प्रोवाइडर की लागत और हमारा मार्जिन, क्रेडिट में। `GET /v1/models` हर मॉडल के प्रति मिलियन इनपुट और आउटपुट token के क्रेडिट दिखाता है। हर जवाब `usage.credits_charged` बताता है; स्ट्रीम `stream_options.include_usage` के साथ बताती हैं।",
    topup:
      "और चाहिए? सब्सक्राइबर {{packPrice}} से शुरू क्रेडिट पैक से टॉप-अप करते हैं। पैक के क्रेडिट कभी एक्सपायर नहीं होते।",
    facts: {
      credit: "1 क्रेडिट = 1 US cent",
      rate: "कोई तय रेट लिमिट नहीं (हर रिक्वेस्ट का बिल)",
      keys: "हर अकाउंट पर {{maxKeys}} keys तक",
      preflight: "क्रेडिट कम: कुछ भी चलने से पहले 402",
    },
    modelsTitle: "हर कीमत सीधे API से आती है",
    modelsResponse: "उदाहरण जवाब",
  },
  uncensored: {
    eyebrow: "अनसेंसर्ड मॉडल",
    title: "अनसेंसर्ड के दो रूप। दोनों API पर।",
    intro:
      "ज़्यादातर अनसेंसर्ड AI असल में मेनस्ट्रीम मॉडल होते हैं जिनसे इनकार काट दिए गए या ट्रेनिंग से हटा दिए गए। वो भी हम चलाते हैं, और एक ऐसा मॉडल भी जो शुरू से अलग ट्रेन हुआ। model id से हर रिक्वेस्ट पर चुनें।",
    abliterated: {
      label: "Abliterated और fine-tuned",
      title: "मेनस्ट्रीम मॉडल जो टालना बंद कर देते हैं",
      body: "इनकार weights से काटे गए या ट्रेनिंग से हटाए गए। वही जानकारी, सीधे जवाब।",
    },
    worldview: {
      label: "सच में अनसेंसर्ड",
      title: "अपनी सोच वाला मॉडल",
      body: "{{model}} उन किताबों और दस्तावेज़ों पर ट्रेन किया गया है जिन्हें मुख्यधारा इंटरनेट से हटा दिया गया, इसलिए इसकी राजनीतिक राय मुख्यधारा से उलटी है।",
    },
    more: "+{{count}} और",
    consent:
      "API keys पेज पर एक बार 18+ कन्फ़र्म करें। तब तक अनसेंसर्ड मॉडल 403 `uncensored_consent_required` लौटाते हैं, और कुछ भी चार्ज नहीं होता।",
    allModels: "सभी अनसेंसर्ड मॉडल",
    catalog: "मॉडल कैटलॉग देखें",
  },
  mcp: {
    eyebrow: "MCP और CLI",
    title: "आपका एजेंट आपके ऐप को पहले से जानता है।",
    intro:
      "`bun i` Claude Code, Cursor, VS Code, OpenCode और Codex के लिए MCP कॉन्फ़िग लिख देता है। repo को अपने एजेंट में खोलिए, टूल वहीं मिलेंगे।",
    points: {
      stdio: "stdio पर MCP। न एक्स्ट्रा सर्वर, न पोर्ट।",
      roles:
        "वेब UI वाले ही रोल और वैलिडेशन। मॉडल सिर्फ़ वहीं तक पहुँचते हैं जहाँ तक आपका रोल इजाज़त देता है।",
      connect:
        "इंस्टॉल को अपने {{appName}} अकाउंट से जोड़ें और उसके एजेंट हमारे मॉडल पर चलेंगे।",
      help: "हर कमांड अपना डॉक्यूमेंटेशन खुद देती है: `vibe <command> --help`।",
    },
    configNote:
      "`bun i` जो `atlas` एंट्री लिखता है, छोटा करके। असली फ़ाइल में एक `hermes` सर्वर भी है और उसमें आपके clone का path होता है।",
  },
  selfHost: {
    eyebrow: "सेल्फ़-होस्ट",
    title: "सब कुछ खुद चलाएँ।",
    intro:
      "{{appName}} के पीछे का प्लेटफ़ॉर्म ओपन सोर्स है। Clone, install, run। फिर आगे का काम ब्राउज़र संभाल लेता है। न Docker, न कॉन्फ़िग फ़ाइलें।",
    terminal: "टर्मिनल",
    db: "डिफ़ॉल्ट रूप से एम्बेडेड Postgres (PGlite)। जब छोटा पड़ने लगे, `DATABASE_URL` को अपने Postgres की तरफ़ पॉइंट करें।",
    guide: "सेल्फ़-होस्टिंग गाइड",
    github: "GitHub पर कोड",
  },
  framework: {
    eyebrow: "फ़्रेमवर्क",
    title: "एक endpoint के पीछे चलिए।",
    intro:
      "इसी repo का कॉन्टैक्ट फ़ॉर्म, छोटा किया हुआ पर असली। एक definition बन जाती है वेब UI, CLI कमांड, MCP टूल, नेटिव स्क्रीन, AI टूल और cron job।",
    tabAdd: "अपना जोड़ें",
    call: {
      title: "इसे कॉल करें",
      cli: "CLI",
      mcp: "MCP",
      ai: "AI टूल",
      cron: "Cron",
    },
    becomes: "कॉन्टैक्ट फ़ॉर्म बन जाता है",
    more: "साथ में {{count}} और सरफ़ेस",
    source: "पूरा सोर्स GitHub पर",
    live: "पेज के आखिर में लाइव",
    docs: "पैटर्न डॉक्स GitHub पर",
    deleteLine:
      "एक फ़ीचर मतलब एक फ़ोल्डर। उसे हटाइए, `vibe gen` चलाइए, और वो हर सरफ़ेस से एक साथ गायब।",
    moreSurfaces: {
      webApi: "REST API",
      websocket: "WebSocket इवेंट",
      adminPanel: "एडमिन पैनल",
      vibeFrame: "एम्बेड होने वाला विजेट",
    },
    surfaces: {
      web: {
        title: "वेब UI",
        body: "इस पेज के नीचे वाला फ़ॉर्म। फ़ील्ड, वैलिडेशन और सक्सेस अलर्ट, सब definition से आते हैं।",
      },
      cli: {
        title: "CLI कमांड",
        body: "`vibe contact-form`, हर फ़ील्ड के लिए एक flag, help टेक्स्ट साथ में।",
      },
      mcp: {
        title: "MCP टूल",
        body: "एजेंट इसे `vibe mcp` पर `execute-tool` टूल से इस्तेमाल करते हैं। इनपुट schema सीधे Zod से।",
      },
      ai: {
        title: "AI टूल",
        body: "मॉडल इसे कॉल कर सकते हैं। `requiresConfirmation` से यूज़र को पहले मंज़ूरी देनी होती है।",
      },
      native: {
        title: "नेटिव स्क्रीन",
        body: "Expo ऐप वही विजेट नेटिव इनपुट के साथ रेंडर करता है। Beta।",
      },
      cron: {
        title: "Cron job",
        body: "कोई भी endpoint शेड्यूल पर चलता है। वही handler, कोई दूसरा कोड पाथ नहीं।",
      },
    },
    maturity: {
      stable: {
        title: "प्रोडक्शन में",
        body: "{{appName}} इसी कोडबेस पर चलता है: वेब, CLI, MCP, AI टूल, cron, रियलटाइम, पेमेंट।",
      },
      beta: {
        title: "Beta",
        body: "React Native स्क्रीन, इंस्टेंस-से-इंस्टेंस सिंक और रिमोट स्किल काम करते हैं, थोड़ी खुरदुरी धार के साथ।",
      },
      churn: {
        title: "बदलाव होते रहेंगे",
        body: "एक टीम, तेज़ रफ़्तार। अभी semver नहीं, और डॉक्स कोड से पीछे चलते हैं। किसी commit को pin करें या fork कर लें।",
      },
    },
  },
  faq: {
    title: "डेवलपर्स के सवाल",
    free: {
      q: "क्या कोई फ़्री API टियर है?",
      a: "नहीं। API किसी भी प्लान से अनलॉक होता है, {{subPrice}} महीने से, या हमारी टीम के दिए क्रेडिट से। फ़्री चैट अलाउंस इसे अनलॉक नहीं करता।",
    },
    sdks: {
      q: "कौन से SDK और टूल चलते हैं?",
      a: "ऑफ़िशियल OpenAI और Anthropic SDK, कोई भी OpenAI-compatible लाइब्रेरी, और Claude Code, Codex CLI, OpenCode, Aider, Cline और Continue जैसे कोडिंग एजेंट। बस base URL और key बदलें।",
    },
    uncensored: {
      q: "क्या मैं API से अनसेंसर्ड मॉडल कॉल कर सकता हूँ?",
      a: "हाँ। API keys पेज पर एक बार कन्फ़र्म करें कि आप 18 या उससे ज़्यादा उम्र के हैं, फिर उन्हें किसी भी दूसरे मॉडल की तरह कॉल करें। Abliterated मॉडल और UncensoredLM वही endpoints इस्तेमाल करते हैं।",
    },
    media: {
      q: "इमेज, वॉइस, वीडियो और म्यूज़िक भी?",
      a: "वही key। `/v1/images`, `/v1/audio`, `/v1/videos` और `/v1/music` जहाँ OpenAI का ढाँचा है, वहाँ उसी को फ़ॉलो करते हैं। API रेफ़रेंस में हर endpoint है।",
    },
    limits: {
      q: "रेट लिमिट क्या हैं?",
      a: "कोई तय रेट लिमिट नहीं। इस्तेमाल का बिल हर रिक्वेस्ट पर आपके क्रेडिट से कटता है, और खुली छूट वाली दुरुपयोग सुरक्षा लागू है (अचानक भारी बर्स्ट और एक साथ कई स्ट्रीम पर गार्ड)। ऊपर के प्रोवाइडर के 429 `Retry-After` header के साथ आप तक पहुँचते हैं। बहुत ज़्यादा वॉल्यूम का प्लान है? नीचे दिया कॉन्टैक्ट फ़ॉर्म इस्तेमाल करें।",
    },
    selfHost: {
      q: "क्या सेल्फ़-होस्टिंग फ़्री है?",
      a: "हाँ। कोड ओपन सोर्स है: ऐप के लिए MIT, फ़्रेमवर्क के लिए GPL v3। अपनी प्रोवाइडर keys लाएँ, या इंस्टॉल को अपने {{appName}} अकाउंट से जोड़ें और जितना इस्तेमाल करें उतना भरें।",
    },
  },
  contact: {
    eyebrow: "endpoint, लाइव",
    title: "सवाल है, या कुछ बड़ा बना रहे हैं?",
    description:
      "सेटअप, कस्टम इंटीग्रेशन, आर्किटेक्चर रिव्यू। जवाब वही टीम देती है जिसने इसे बनाया। यह फ़ॉर्म फ़्रेमवर्क सेक्शन वाला कॉन्टैक्ट endpoint ही है।",
  },
  code: {
    copy: "कॉपी करें",
    copied: "कॉपी हो गया",
    wrap: "लाइनें रैप करें",
    anthropic: "Anthropic",
  },
};
