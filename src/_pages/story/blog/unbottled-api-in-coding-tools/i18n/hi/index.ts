import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "हर मॉडल पर Codex CLI और Claude Code: {{appName}} API",
    description:
      "Codex CLI, Claude Code, OpenCode, Continue, Aider और Cline, एक {{appName}} key पर। Claude, GPT, DeepSeek, GLM और अनसेंसर्ड मॉडल। एक base URL।",
    category: "डेवलपर गाइड",
    imageAlt: "कोडिंग टूल के अंदर {{appName}} API",
    keywords:
      "{{appName}}, Codex CLI, Claude Code, OpenCode, Continue, Aider, Cline, OpenAI compatible API, Responses API, Anthropic Messages API, कोडिंग एजेंट, अनसेंसर्ड मॉडल, कस्टम प्रोवाइडर",
  },
  hero: {
    backToBlog: "ब्लॉग पर वापस",
    category: "डेवलपर गाइड",
    readTime: "8 मिनट में पढ़ें",
    title: "एक key। हर मॉडल। Codex और Claude Code भी।",
    subtitle:
      "Codex CLI और Claude Code अब सीधे {{appName}} से जुड़ते हैं, OpenCode, Continue, Aider और Cline के साथ। एक base URL, एक key, हर टूल के लिए एक कमांड।",
  },
  intro: {
    lead: "आपका कोडिंग एजेंट एक वेंडर के मॉडल से बँधा है। दूसरी लैब से दूसरी राय चाहिए, भारी-भरकम काम के लिए सस्ता मॉडल चाहिए, या ऐसा मॉडल जो मना न करे? तब मतलब है नया अकाउंट, नई key, नया बिल।",
    p2: "{{appName}} कोडिंग एजेंट के इस्तेमाल किए तीनों फ़ॉर्मैट बोलता है: OpenAI chat completions, OpenAI Responses API और Anthropic Messages API। बीच में कुछ इंस्टॉल नहीं करना। टूल को एक बार हमारी तरफ़ मोड़िए, फिर एक model id बदलकर Claude, GPT, DeepSeek, GLM, Kimi, Qwen और अनसेंसर्ड मॉडल के बीच बदलते रहिए।",
    access:
      "शुरू करने से पहले: API के लिए पेड अकाउंट चाहिए। {{subPrice}} महीना से शुरू कोई भी प्लान इसे अनलॉक करता है। फ़्री और बोनस क्रेडिट नहीं करते।",
    accessLink: "API अनलॉक करें",
  },
  why: {
    title: "यह सब क्यों",
    oneKey:
      "एक key, एक बैलेंस। Anthropic, OpenAI, DeepSeek, Moonshot और Z.ai पर अलग-अलग अकाउंट नहीं।",
    uncensored:
      "आपके एडिटर में अनसेंसर्ड मॉडल। सिक्योरिटी रिसर्च, रेड-टीम प्रॉम्प्ट, फ़िक्शन टूलिंग, वह डेटा जो मुख्यधारा फ़िल्टर को चौंका देता है। फ़िल्टर का स्तर आप चुनते हैं, वेंडर नहीं।",
    switch:
      "हर काम के लिए सही मॉडल। मुश्किल रीफ़ैक्टर के लिए फ़्रंटियर मॉडल, रीनेम और टेस्ट स्कैफ़ोल्डिंग के लिए flash मॉडल। वही कॉन्फ़िग, अलग id।",
    billing:
      "चैट ऐप वाले ही क्रेडिट, वही कीमतें। हर जवाब बताता है कि उसकी लागत क्या रही।",
  },
  setup: {
    title: "key और base URL लीजिए",
    intro: "दो वैल्यू। नीचे के हर टूल को ठीक यही चाहिए।",
    p1: "सेटिंग्स > API keys में key बनाइए। वह sk-unb- से शुरू होती है और सिर्फ़ एक बार दिखती है।",
    shortcut:
      "सबसे तेज़ रास्ता: key बनाते ही API keys पेज नीचे का हर ब्लॉक आपकी key भरकर दिखाता है। अपना टूल चुनिए, कॉपी कीजिए, चलाइए।",
    baseUrlLabel: "Base URL",
    baseUrlNote:
      "OpenAI-स्टाइल टूल के लिए: Codex, OpenCode, Continue, Aider, Cline। पाथ में लोकेल सिर्फ़ एरर मैसेज की भाषा बदलता है।",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "Claude Code और Anthropic SDK के लिए। वही URL, /v1 के बिना: वे /v1/messages खुद जोड़ लेते हैं।",
    p2: "key को एनवायरनमेंट वेरिएबल में रखिए, कभी ऐसी फ़ाइल में नहीं जिसे आप कमिट करें। curl कॉल साबित करती है कि key चल रही है और आपके अकाउंट से कॉल हो सकने वाला हर model id दिखाती है: कॉन्टेक्स्ट साइज़, टूल सपोर्ट और क्रेडिट कीमतों के साथ।",
  },
  compat: {
    title: "हर टूल सीधे जुड़ता है",
    intro:
      "कोडिंग एजेंट तीन अलग वायर फ़ॉर्मैट बोलते हैं। हम तीनों परोसते हैं, एक ही key और एक ही मॉडल पर।",
    codex: "Codex CLI: OpenAI Responses API।",
    claudeCode: "Claude Code: Anthropic Messages API।",
    chat: "OpenCode, Continue, Aider, Cline: OpenAI chat completions।",
    other:
      "base URL फ़ील्ड वाला कोई भी और टूल इसी तरह चलता है: base URL, key, model id।",
  },
  wire: {
    responses: "Responses API",
    messages: "Messages API",
    chat: "Chat completions",
  },
  codex: {
    intro:
      "OpenAI का टर्मिनल एजेंट। आपका रेपो पढ़ता है, कमांड चलाता है, फ़ाइलें एडिट करता है।",
    p1: "Codex Responses API बोलता है, और हम भी। एक कमांड प्रोवाइडर को इनलाइन परिभाषित करती है: कुछ एडिट नहीं करना, कुछ इंस्टॉल नहीं करना। रोज़ के इस्तेमाल के लिए कॉन्फ़िग एक बार जोड़ दीजिए और Codex को प्रोफ़ाइल के साथ शुरू कीजिए।",
    p2: 'मॉडल -m से या प्रोफ़ाइल की model लाइन से बदलिए। wire_api = "responses" रखिए: मौजूदा Codex और कुछ नहीं मानता।',
  },
  claudeCode: {
    intro:
      "Anthropic का टर्मिनल एजेंट। प्लान बनाता है, एडिट करता है, टेस्ट चलाता है, सबएजेंट शुरू करता है।",
    p1: "Claude Code अपना गेटवे एनवायरनमेंट वेरिएबल से पढ़ता है। ANTHROPIC_BASE_URL /v1 के बिना base URL है। ANTHROPIC_MODEL मुख्य मॉडल तय करता है। OPUS और SONNET डिफ़ॉल्ट मॉडल पिकर और प्लान मोड संभालते हैं, HAIKU डिफ़ॉल्ट बैकग्राउंड काम, जैसे सेशन टाइटल, को सस्ते मॉडल पर ले जाता है, और CLAUDE_CODE_SUBAGENT_MODEL सबएजेंट संभालता है। CLAUDE_CODE_MAX_CONTEXT_TOKENS Claude Code को गैर-Claude मॉडल का असली कॉन्टेक्स्ट साइज़ बताता है, ताकि वह सही बिंदु पर कॉम्पैक्ट करे।",
    p2: "खुद Claude चाहिए? model लाइनें हटा दीजिए। Claude Code अपने आम Claude id माँगता है और हम उन्हें अपने मिलते-जुलते Claude मॉडल पर भेज देते हैं, क्रेडिट में बिल होकर।",
    p3: "Claude Code बड़ा सिस्टम प्रॉम्प्ट भेजता है, मामूली काम के लिए भी 30k से ऊपर इनपुट टोकन। सस्ता डिफ़ॉल्ट मॉडल इसे किफ़ायती रखता है।",
  },
  opencode: {
    intro: "ओपन-सोर्स टर्मिनल एजेंट, TUI और बिना स्क्रीन वाले रन मोड के साथ।",
    p1: "कॉन्फ़िग को अपने प्रोजेक्ट में opencode.json के नाम से सेव कीजिए, या हर प्रोजेक्ट के लिए ~/.config/opencode/opencode.json में। key आपके एनवायरनमेंट में रहती है। GET /v1/models का कोई भी id models मैप में जोड़िए, फिर TUI में /models से चुनिए।",
    gotcha:
      "पहले OpenCode अपडेट कीजिए। पुराने 1.0.x बिल्ड सबसे नया @ai-sdk/openai-compatible पैकेज खींचते हैं और पहली टूल कॉल के बाद DecimalError: Invalid argument के साथ क्रैश हो जाते हैं। 1.19.5 वही कॉन्फ़िग साफ़ चलाता है।",
  },
  continue: {
    intro: "VS Code और JetBrains के लिए कोडिंग असिस्टेंट, साथ में cn CLI।",
    p1: "secrets.UNBOTTLED_API_KEY आपके एनवायरनमेंट से रिज़ॉल्व होता है। बिना स्क्रीन के रन के लिए प्रॉम्प्ट के साथ -p जोड़िए। IDE एक्सटेंशन ~/.continue/config.yaml पढ़ता है: वहाँ भी यही model एंट्री रखिए।",
  },
  aider: {
    intro: "आपके टर्मिनल में पेयर प्रोग्रामिंग, कमिट समेत।",
    p1: "एक कमांड, कोई कॉन्फ़िग फ़ाइल नहीं। Aider को model id के आगे openai/ चाहिए और हमें कॉल करने से पहले वह उसे हटा देता है। --edit-format diff एडिट छोटे रखता है; इसके बिना अनजान model id के लिए Aider पूरी फ़ाइलें दोबारा भेजने पर लौट आता है। एडिट होने वाली फ़ाइलों के नाम कमांड लाइन पर दीजिए, Aider में हमेशा की तरह।",
  },
  cline: {
    intro: "VS Code में और CLI के रूप में खुद चलने वाला कोडिंग एजेंट।",
    p1: "Cline CLI के साथ दो कमांड: प्रोवाइडर एक बार सेव कीजिए, फिर cline चलाइए। base URL, key और model id वही तीन वैल्यू हैं जो बाकी हर जगह।",
  },
  models: {
    title: "कौन सा मॉडल किस काम के लिए",
    intro:
      "ये सब टूल कॉल करते हैं, जो एजेंट को चाहिए। आपके कॉन्फ़िग में वही id जाते हैं जो यहाँ हैं।",
    strong: {
      title: "मुश्किल समस्याएँ",
      body: "बड़े रीफ़ैक्टर, अनजाने कोडबेस, कई स्टेप की डीबगिंग। क्रेडिट कीमतें ऊँची, गलत मोड़ कम।",
    },
    cheap: {
      title: "सस्ता और तेज़",
      body: "रीनेम, टेस्ट, बॉयलरप्लेट, बैकग्राउंड काम। फ़्रंटियर मॉडल की कीमत का छोटा हिस्सा। बड़े प्रॉम्प्ट भेजने वाले एजेंट के लिए अच्छा डिफ़ॉल्ट।",
    },
    uncensored: {
      title: "अनसेंसर्ड",
      body: "वही एजेंट वर्कफ़्लो, इनकार की आदत नहीं। एक्सप्लॉइट विश्लेषण, रेड-टीम टूलिंग, एडल्ट फ़िक्शन पाइपलाइन, वे स्क्रैपर जिन पर दूसरे मॉडल भाषण देते हैं। आप जो बनाते हैं उसकी ज़िम्मेदारी आपकी रहती है।",
    },
    listNote:
      "मॉडल बदलते हैं तो id भी बदलते हैं। GET /v1/models ही असली स्रोत है: कोई id आपकी key के लिए लिस्टेड नहीं है तो API 404 model_not_found लौटाती है। एक ही मैपिंग है, Claude Code के लिए: उसके बिल्ट-इन Claude id उसी परिवार के हमारे सबसे नए Claude पर जाते हैं।",
  },
  gotchas: {
    title: "जिन पेचों से हम टकराए",
    intro: "ताकि आपको न टकराना पड़े।",
    localeUrl:
      "base URL ठीक वैसे ही कॉपी कीजिए, /api/<locale>/v1 समेत। लोकेल के बिना रीडायरेक्ट मिलता है जिसे कुछ क्लाइंट छोड़ देते हैं। /api के बिना JSON की जगह HTML पेज मिलता है।",
    anthropicUrl:
      "Claude Code को base URL /v1 के बिना दीजिए। /v1 के साथ वह /v1/v1/messages कॉल करता है और 404 पाता है।",
    modelId:
      "GET /v1/models से ठीक वही id लीजिए, जैसे {{model}}। Aider को आगे openai/ चाहिए। Claude Code के बिल्ट-इन Claude id आपके लिए उसी परिवार के हमारे सबसे नए Claude पर मैप होते हैं। कोई भी और अनजान id 404 model_not_found लौटाता है।",
    paid: "paid_plan_required के साथ HTTP 402 का मतलब है कि अकाउंट में न कोई प्लान है, न कोई क्रेडिट खरीद। कोई भी प्लान इसे ठीक कर देता है।",
    tools:
      "टूल सपोर्ट के बिना मॉडल, एजेंट के टूल भेजते ही 400 tools_not_supported लौटाता है। GET /v1/models में supports_tools देखिए।",
    rateLimit:
      "कोई तय रेट लिमिट नहीं। इस्तेमाल हर रिक्वेस्ट पर आपके क्रेडिट से बिल होता है, अनियंत्रित लूप के लिए उदार दुरुपयोग सुरक्षा के साथ। अपस्ट्रीम प्रोवाइडर के 429 अपने Retry-After हेडर के साथ आगे पहुँचते हैं, ताकि आपका एजेंट रुककर दोबारा कोशिश कर सके।",
  },
  cta: {
    title: "एक कमांड में जुड़ गया।",
    subtitle:
      "key बनाइए, अपने टूल का ब्लॉक कॉपी कीजिए, मॉडल चुनिए। API डॉक्स हर एंडपॉइंट, फ़ील्ड, एरर कोड और स्ट्रीमिंग की बारीकी बताते हैं।",
    key: "API key बनाएँ",
    docs: "API डॉक्स पढ़ें",
  },
};
