import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंट",

  widget: {
    adminOverview: "अपने अकाउंट की कीज़ मैनेज करें। ऐप जोड़ने के लिए API डॉक्स देखें।",
    loadFailed: "आपकी API कीज़ लोड नहीं हो सकीं",
    retry: "दोबारा कोशिश करें",
    revokeNamed: "{{name}} रिवोक करें",
    revokeConfirm: "इस की का इस्तेमाल करने वाले ऐप्स का एक्सेस तुरंत बंद हो जाएगा।",
    cancel: "रद्द करें",
    upgradeTitle: "API एक्सेस हर प्लान के साथ मिलता है, महीने के {{subPrice}} से शुरू",
    upgradeBody: "कोई भी प्लान API कीज़ अनलॉक करता है। फ़्री और बोनस क्रेडिट नहीं करते।",
    upgradeCta: "API अनलॉक करें",
    createInactiveHint: "की बनाने के लिए प्लान चुनें।",
    docsLink: "API डॉक्स पढ़ें",
    back: "वापस",
    loading: "API कीज़ लोड हो रही हैं…",
    intro:
      "अपने कोड और कोडिंग एजेंट से {{modelCount}} मॉडल कॉल करें। OpenAI और Anthropic फ़ॉर्मैट। चैट वाली कीमत पर आपके क्रेडिट से बिल होता है।",
    baseUrlTitle: "बेस URL",
    baseUrlHint: "OpenAI SDKs, Codex, OpenCode, Continue, Aider, Cline।",
    anthropicBaseUrlTitle: "Anthropic बेस URL",
    anthropicBaseUrlHint:
      "Claude Code और Anthropic SDKs। वही URL बिना /v1 के, क्योंकि वे /v1/messages ख़ुद जोड़ते हैं।",
    setupTitle: "कोई टूल कनेक्ट करें",
    setupKeyFilled:
      "आपकी नई की हर ब्लॉक में पहले से भरी है। कॉपी करें, पेस्ट करें, चलाएँ। बंद करने के बाद ब्लॉक फिर प्लेसहोल्डर दिखाएँगे।",
    setupKeyMissing:
      "ब्लॉक में {{placeholder}} दिखता है। की बनाएँ, तो वे उससे भर जाएँगे।",
    copy: "कॉपी करें",
    copied: "कॉपी हो गया",
    keysTitle: "आपकी कीज़",
    empty: "अभी कोई API की नहीं",
    emptyHint: "API कॉल शुरू करने के लिए एक बनाएँ।",
    nameLabel: "की का नाम",
    namePlaceholder: "जैसे Claude Code लैपटॉप",
    create: "की बनाएँ",
    creating: "बन रहा है…",
    createFailed: "की नहीं बन सकी। फिर कोशिश करें।",
    newKeyTitle: "अपनी की अभी कॉपी कर लें",
    newKeyHint:
      "पूरी की सिर्फ़ इसी बार दिखती है। हम की नहीं, उसका हैश रखते हैं। खो गई तो नई बनानी होगी।",
    dismiss: "मैंने सेव कर ली",
    lastUsed: "आख़िरी इस्तेमाल",
    neverUsed: "कभी इस्तेमाल नहीं हुई",
    created: "बनाया गया",
    revoke: "रद्द करें",
    revoking: "रद्द हो रहा है…",
    revokeFailed: "वह की रिवोक नहीं हो सकी। फिर कोशिश करें।",
    maskedKey: "{{prefix}}…",
    meta: "{{lastUsed}} · बनाई गई {{created}}",
    uncensoredLabel: "मेरी कीज़ पर अनसेंसर्ड मॉडल की अनुमति दें",
    uncensoredHint:
      "मेरी उम्र 18+ है और मैं मानता/मानती हूँ कि अनसेंसर्ड मॉडल बिना फ़िल्टर के आपत्तिजनक, झूठा, ख़तरनाक, अवैध या दुर्भावनापूर्ण कंटेंट दे सकते हैं। इसका इस्तेमाल कैसे करना है, यह मेरी ज़िम्मेदारी है। इसके बिना अनसेंसर्ड मॉडल ID पर HTTP 403 आता है।",
    uncensoredFailed: "सेव नहीं हो पाया। दोबारा कोशिश करें।",
    billingNote:
      "कोई तय रेट लिमिट नहीं। यूसेज हर रिक्वेस्ट पर आपके क्रेडिट से बिल होता है, साथ में दुरुपयोग से सुरक्षा। क्रेडिट ख़त्म होने पर HTTP 402 आता है। हर एंडपॉइंट पर स्ट्रीमिंग काम करती है।",
  },

  codingTools: {
    blocks: {
      oneCommand: "एक कमांड",
      config: "स्थायी सेटअप",
      run: "फिर इसे शुरू करें",
      fields: "सेटिंग्स",
      check: "अपनी की जाँचें",
      request: "पहली रिक्वेस्ट",
    },
    tested: "{{name}} {{version}} के साथ टेस्ट किया गया",
    anyModel:
      "{{model}} की जगह GET /v1/models से कोई भी ID लगाएँ, जैसे {{examples}}।",
    tools: {
      codex: {
        hint: "कमांड पेस्ट करें और Codex unbottled.ai पर चलने लगेगा। इसे स्थायी रखने के लिए ब्लॉक को ~/.codex/config.toml में जोड़ें और Codex को --profile unbottled के साथ शुरू करें।",
      },
      claudeCode: {
        hint: "कमांड पेस्ट करें और Claude Code unbottled.ai पर चलने लगेगा। इसे स्थायी रखने के लिए यही वैल्यू ~/.claude/settings.json के env ब्लॉक में पहले से मौजूद चीज़ों के पास रखें। मॉडल वाली लाइनें हटा दें तो Claude Code हमारे Claude मॉडल पर उन्हीं नामों से चलेगा जिन्हें वह पहले से जानता है।",
      },
      opencode: {
        hint: "अपने प्रोजेक्ट में opencode.json के नाम से सेव करें, या हर प्रोजेक्ट के लिए ~/.config/opencode/opencode.json में। models मैप में कोई भी मॉडल ID जोड़ें।",
      },
      continue: {
        hint: "Continue CLI चलाता है। IDE एक्सटेंशन ~/.continue/config.yaml पढ़ता है: वहाँ वही मॉडल एंट्री जोड़ें।",
      },
      aider: {
        hint: "एक कमांड। Aider को मॉडल ID के आगे openai/ चाहिए। कमांड के बाद एडिट करने वाली फ़ाइलों के नाम दें, हमेशा की तरह।",
      },
      cline: {
        hint: "Cline CLI के साथ दो कमांड: पहले प्रोवाइडर एक बार सेव करें, फिर cline चलाएँ।",
      },
      openaiCompatible: {
        hint: "कोई भी टूल या SDK जिसमें base URL फ़ील्ड हो। OpenAI-स्टाइल टूल /v1 वाला URL लेते हैं। Anthropic-स्टाइल टूल बिना /v1 वाला URL लेते हैं। की वही, मॉडल वही।",
      },
      curl: {
        hint: "परखें कि की काम करती है और जो भी मॉडल ID आप कॉल कर सकते हैं उनकी सूची देखें। फिर पहली रिक्वेस्ट भेजें।",
      },
    },
  },

  list: {
    title: "API key",
    titleShort: "API key",
    description:
      "API कीज़ बनाएँ और रिवोक करें। बेस URL, कोडिंग टूल के लिए तैयार सेटअप और आपकी कीज़ दिखाता है।",
    tag: "API",
    response: {
      baseUrl: "बेस URL",
      isPaid: "पेड प्लान",
      keys: "कीज़",
    },
    success: {
      title: "API कीज़ लोड हो गईं",
      description: "आपकी API कीज़ मिल गईं",
    },
  },

  create: {
    title: "API की बनाएँ",
    titleShort: "नई की",
    description:
      "API के लिए की बनाएँ। OpenAI और Anthropic क्लाइंट के साथ काम करती है। पूरी की सिर्फ़ एक बार मिलती है।",
    tag: "API",
    form: {
      name: "की का नाम",
      namePlaceholder: "यह की किसलिए है?",
    },
    response: {
      key: "API की (सिर्फ़ एक बार दिखेगी)",
      id: "की ID",
      keyPrefix: "की प्रीफ़िक्स",
    },
    success: {
      title: "की बन गई",
      description: "की अभी कॉपी कर लें। यह दोबारा नहीं दिखेगी।",
    },
    errors: {
      limit: "आपके पास पहले से {{max}} सक्रिय कीज़ हैं। पहले एक रिवोक करें।",
      paidRequired:
        "API कीज़ के लिए पेड अकाउंट चाहिए: कोई भी प्लान, महीने के {{subPrice}} से शुरू। {{url}} पर जोड़ें।",
    },
  },

  revoke: {
    title: "API की रिवोक करें",
    titleShort: "रद्द करें",
    description: "API की हमेशा के लिए बंद करें। इससे होने वाली कॉल तुरंत फ़ेल हो जाएँगी।",
    tag: "API",
    response: {
      message: "की रिवोक हो गई। इससे होने वाली कॉल अब फ़ेल होंगी।",
    },
    success: {
      title: "की रिवोक हो गई",
      description: "यह API की अब इस्तेमाल नहीं हो सकती",
    },
    errors: {
      notFound: {
        detail: "आपके अकाउंट में उस ID की कोई सक्रिय की नहीं है।",
      },
    },
  },

  errors: {
    validation: { title: "वैलिडेशन एरर", description: "रिक्वेस्ट गलत है" },
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    server: {
      title: "सर्वर एरर",
      description: "आंतरिक सर्वर एरर",
      detail: "API की रिक्वेस्ट फ़ेल हुई: {{error}}",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर आया",
    },
    network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर आया" },
    forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
    notFound: { title: "नहीं मिला", description: "API की नहीं मिली" },
    conflict: {
      title: "टकराव",
      description: "रिक्वेस्ट स्टेट से टकराती है",
    },
  },
};
