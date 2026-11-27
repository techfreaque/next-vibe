import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "OpenRouter विकल्प | OpenAI और Anthropic API | {{appName}}",
    description:
      "{{appName}} की तुलना OpenRouter से करें। अपना मौजूदा OpenAI SDK {{modelCount}} चैट मॉडल और {{mediaModelCount}} मीडिया मॉडल की API पर ले आएँ।",
    category: "डेवलपर गाइड",
    imageAlt: "{{appName}}: हर मॉडल के लिए एक API एंडपॉइंट",
    keywords:
      "{{appName}}, OpenRouter alternative, one API for GPT Claude Gemini, OpenAI compatible API, OpenAI compatible API many models, Anthropic API compatible endpoint, Anthropic Messages API, Responses API, use Claude Code with other models, Codex CLI custom provider, LLM API gateway, uncensored models API, OpenAI compatible image API, text to speech API, Whisper API, video generation API, music generation API",
  },
  hero: {
    backToBlog: "ब्लॉग पर वापस",
    category: "डेवलपर गाइड",
    readTime: "11 मिनट में पढ़ें",
    title: "एक API key। {{modelCount}} मॉडल। तीन वायर फ़ॉर्मेट।",
    subtitle:
      "एक {{appName}} key से Chat Completions, Responses या Anthropic Messages इस्तेमाल करें। अपना SDK रखें, उसका बेस URL और key बदलें, और मॉडल ID जाँच लें। वही key {{mediaModelCount}} मीडिया मॉडल पर भी चलती है।",
  },
  intro: {
    lead: "OpenAI का GPT, Anthropic का Claude, Google का Gemini। तीन SDK, तीन key, तीन बिल, तीन डैशबोर्ड। या इससे बुरा: जो टूल आपको पसंद है वह सिर्फ़ एक फ़ॉर्मेट बोलता है, तो उसे सिर्फ़ एक वेंडर के मॉडल मिलते हैं।",
    p2: "{{appName}} {{providerCount}} लैब्स के {{modelCount}} चैट मॉडल को एक key और एक क्रेडिट बैलेंस के पीछे रखता है। उन्हें OpenAI फ़ॉर्मेट, Responses फ़ॉर्मेट या Anthropic फ़ॉर्मेट में कॉल करें। हर एंडपॉइंट पर वही मॉडल। यह रहा ठीक-ठीक कि यह कैसे काम करता है, इसकी लागत क्या है, और कहाँ सीधे वेंडर के पास जाना या राउटर लेना बेहतर है।",
    access:
      "पहले ही साफ़ कर दें: API के लिए पेड अकाउंट चाहिए। {{subPrice}} प्रति माह से शुरू होने वाला कोई भी प्लान इसे अनलॉक करता है। फ़्री और बोनस क्रेडिट नहीं करते।",
    accessLink: "API अनलॉक करें",
  },
  endpoints: {
    title: "हर एंडपॉइंट, एक key",
    intro:
      "हर एंडपॉइंट वही key लेता है और वही बैलेंस काटता है। तीनों चैट फ़ॉर्मेट वही मॉडल परोसते हैं।",
    chat: "POST /v1/chat/completions: OpenAI Chat Completions। SSE पर स्ट्रीमिंग जो data: [DONE] पर ख़त्म होती है, stream_options.include_usage, टूल कॉलिंग। लगभग हर OpenAI कम्पैटिबल क्लाइंट यही फ़ॉर्मेट बोलता है।",
    responses:
      "POST /v1/responses: OpenAI Responses API, वह फ़ॉर्मेट जो Codex CLI बोलता है। स्ट्रीमिंग और टूल। स्टेटलेस: store false है और previous_response_id पर 400 आता है, इसलिए हर टर्न पर पूरा input भेजें।",
    messages:
      "POST /v1/messages: Anthropic Messages API। स्ट्रीमिंग और टूल यूज़। Claude Code और Anthropic SDK इसी से बात करते हैं।",
    countTokens:
      "POST /v1/messages/count_tokens: इसमें क्रेडिट नहीं लगते। यह लोकल अनुमान है, कोई मॉडल कॉल नहीं, और यह दुरुपयोग की सीमाओं में नहीं गिना जाता। Claude Code अपना कॉन्टेक्स्ट नापने के लिए इसे लगातार कॉल करता है।",
    models:
      "GET /v1/models: वे सभी मॉडल जिन्हें आपकी key अभी कॉल कर सकती है, कॉन्टेक्स्ट लंबाई, टूल सपोर्ट और दामों के साथ। एक रिस्पॉन्स बॉडी जिसे OpenAI और Anthropic दोनों के SDK पार्स कर लेते हैं।",
    media:
      "OpenAI फ़ॉर्मेट में मीडिया, {{mediaModelCount}} मॉडल: POST /v1/images/generations और /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions और /v1/audio/translations। वीडियो (POST /v1/videos) और म्यूज़िक (POST /v1/music) एसिंक जॉब की तरह चलते हैं: शुरू करें, पोल करें, डाउनलोड करें। GET /v1/models हर मॉडल पर उसकी मोडैलिटी दिखाता है।",
    auth: "ऑथ हर एंडपॉइंट पर दो तरह से चलता है। OpenAI क्लाइंट और ANTHROPIC_AUTH_TOKEN वाले Claude Code के लिए Authorization: Bearer sk-unb-...। Anthropic SDK के लिए x-api-key: sk-unb-...। Keys sk-unb- से शुरू होती हैं, एक बार दिखती हैं और सिर्फ़ हैश के रूप में स्टोर होती हैं। इन्हें Settings > API keys में बनाएँ, हर अकाउंट पर 20 तक एक्टिव keys।",
    baseUrlLabel: "बेस URL",
    baseUrlNote:
      "OpenAI SDK और OpenAI-स्टाइल टूल के लिए। लोकेल पाथ का हिस्सा है। वह सिर्फ़ एरर मैसेज की भाषा तय करता है और कोई भी सपोर्टेड लोकेल चलता है, पर होना ज़रूर चाहिए।",
    anthropicBaseUrlLabel: "Anthropic बेस URL",
    anthropicBaseUrlNote:
      "Anthropic SDK और Claude Code के लिए। वही URL बिना /v1 के: वे /v1/messages ख़ुद जोड़ लेते हैं।",
  },
  switching: {
    title: "OpenRouter से {{appName}} पर आना",
    intro:
      "OpenRouter का विकल्प ढूँढ रहे हैं? दोनों सर्विस OpenAI-स्टाइल Chat Completions रिक्वेस्ट लेती हैं। आप अपना OpenAI SDK रख सकते हैं और बस उसका कॉन्फ़िगरेशन बदल सकते हैं।",
    key: "अपने {{appName}} अकाउंट में API एक्सेस चालू करें और Settings में नई API key बनाएँ।",
    baseUrl: "अपने OpenAI क्लाइंट को ऊपर दिए लोकलाइज़्ड बेस URL पर सेट करें, /v1 समेत।",
    model:
      "नई API पर GET /v1/models कॉल करें और लौटा हुआ कोई id model फ़ील्ड में डालें।",
    routing:
      "स्विच करने से पहले OpenRouter के किसी भी ख़ास राउटिंग विकल्प को देख लें। आपका ऐप जो फ़ीचर इस्तेमाल करता है, जैसे स्ट्रीमिंग या टूल कॉल, उन्हें अपने चुने मॉडल पर टेस्ट करें।",
    openrouterDocs: "OpenRouter API रेफ़रेंस",
  },
  samples: {
    title: "कोड: आपका SDK, हमारा बेस URL",
    intro:
      "कोई नई क्लाइंट लाइब्रेरी नहीं। आधिकारिक OpenAI और Anthropic SDK जैसे हैं वैसे चलते हैं। sk-unb-YOUR_KEY की जगह अपनी key लगाएँ।",
    curl: {
      title: "curl",
      body: "आपकी key चलती है, इसका सबसे तेज़ सबूत। एक सादा चैट कम्प्लीशन, कुछ इंस्टॉल करने की ज़रूरत नहीं।",
      caption: "curl से chat completions",
    },
    openai: {
      title: "OpenAI Python SDK",
      body: "क्लाइंट पर base_url और api_key सेट करें, फिर chat.completions.create हमेशा की तरह कॉल करें। GET /v1/models का कोई भी मॉडल model फ़ील्ड में जाता है, Claude और Gemini समेत।",
      caption: "OpenAI SDK से chat completions",
      responses:
        "वही क्लाइंट Responses API भी बोलता है। client.responses.create कॉल करें। याद रखें, यहाँ यह स्टेटलेस है: हर टर्न पर पूरी बातचीत input में दें।",
      responsesCaption: "OpenAI SDK से Responses API",
    },
    anthropic: {
      title: "Anthropic Python SDK",
      body: "base_url बिना /v1 के और अपनी key को api_key में सेट करें, फिर messages.create कॉल करें। रीज़निंग मॉडल सबसे पहले एक thinking ब्लॉक देते हैं, इसलिए सैंपल पहला ब्लॉक नहीं, टेक्स्ट ब्लॉक प्रिंट करता है।",
      caption: "Anthropic SDK से Messages API",
      countTokens:
        "भेजने से पहले साइज़ जानना है? count_tokens बिना किसी मॉडल को कॉल किए अनुमान लौटाता है। कोई क्रेडिट ख़र्च नहीं।",
      countTokensCaption: "curl से टोकन गिनें",
    },
    models: {
      title: "मॉडल की सूची",
      body: "GET /v1/models ही सच का स्रोत है। यह ठीक-ठीक दिखाता है कि आपकी key कौन से id कॉल कर सकती है, कॉन्टेक्स्ट लंबाई, टूल सपोर्ट और प्रति टोकन दाम के साथ।",
      caption: "curl से मॉडल की सूची",
    },
    media: {
      title: "इमेज, वॉइस, वीडियो, म्यूज़िक",
      body: "वही key, वही बेस URL, OpenAI के मीडिया ढाँचे। OpenAI SDK के इमेज और ऑडियो क्लाइंट बिना बदलाव चलते हैं। GET /v1/models से मिलती-जुलती मोडैलिटी वाला मॉडल चुनें।",
      imageCaption: "curl से इमेज जनरेट करें",
      async:
        "वीडियो और म्यूज़िक में मिनट लगते हैं, इसलिए वे जॉब की तरह चलते हैं। POST तुरंत एक id लौटाता है। उसे मुफ़्त में पोल करें, फिर फ़ाइल डाउनलोड करें। फ़ेल हुए जॉब का कोई पैसा नहीं।",
      videoCaption: "वीडियो जॉब शुरू करें",
      pollCaption: "पोल करें, फिर MP4 डाउनलोड करें",
    },
  },
  ids: {
    title: "मॉडल id: हमारे, या वेंडर के",
    intro:
      "जिन कॉन्फ़िग में पहले से मॉडल का नाम है, उन्हें दोबारा लिखना नहीं पड़ता। हम आम स्पेलिंग मानते हैं।",
    ours: "हमारे id, जैसे GET /v1/models में हैं: claude-sonnet-5.5, gpt-6.1-sol, glm-5.3। नई शुरुआत में इन्हें इस्तेमाल करें।",
    vendor:
      "वेंडर वाली स्पेलिंग भी चलती हैं। तारीख़ वाले Anthropic id (claude-sonnet-4-5-20250929 से claude-sonnet-4.5 बनता है), डैश वाले वर्ज़न नंबर, -latest सफ़िक्स, [1m] कॉन्टेक्स्ट सफ़िक्स, और gpt-5.5 जैसे डॉट वाले id।",
    prefix:
      "API सपोर्टेड मॉडल के लिए anthropic/ और openai/ जैसे आम वेंडर प्रीफ़िक्स पहचानती है।",
    claudeFallback:
      "सिर्फ़ /v1/messages पर: ऐसा Claude id जो आपका अकाउंट कॉल नहीं कर सकता, जैसे वे बिल्ट-इन id जो Claude Code अपनी बैकग्राउंड कॉल के लिए भेजता है, उसी परिवार (Opus, Sonnet या Haiku) के सबसे नए उस Claude पर चला जाता है जिसे आप कॉल कर सकते हैं। Claude Code बिना अतिरिक्त env वेरिएबल के चलता है। कोई भी और अनजान id 404 model_not_found लौटाता है।",
  },
  tools: {
    title: "Claude Code और Codex CLI को दूसरे मॉडल के साथ इस्तेमाल करें",
    intro:
      "दोनों सीधे कनेक्ट होते हैं। कोई प्रॉक्सी नहीं, कोई ट्रांसलेशन लेयर नहीं, कुछ इंस्टॉल नहीं करना।",
    p1: "हर स्निपेट का डिफ़ॉल्ट {{model}} है। यह असली Claude Code और Codex CLI रन में पास हुआ, टूल भरोसे से कॉल करता है और प्रति आउटपुट टोकन सस्ता है। जब सब चलने लगे, इसे किसी भी id से बदल दें।",
    claudeCode:
      "Claude Code को दूसरे मॉडल के साथ चलाने का पूरा जवाब यही है। ANTHROPIC_BASE_URL उसे हमारी तरफ़ मोड़ता है, ANTHROPIC_AUTH_TOKEN आपकी key ले जाता है, और मॉडल वेरिएबल तय करते हैं कि क्या चलेगा। मॉडल id की जगह GET /v1/models का कोई भी id रखें: GPT, Gemini, Kimi, DeepSeek या कोई अनसेंसर्ड मॉडल। CLAUDE_CODE_MAX_CONTEXT_TOKENS उस मॉडल की असली कॉन्टेक्स्ट विंडो पर सेट है, ताकि Claude Code सही जगह पर कॉम्पैक्ट करे।",
    codex:
      "Codex CLI को wire_api को responses पर सेट करके एक कस्टम मॉडल प्रोवाइडर मिलता है। वह हमसे ठीक वैसे ही Responses API में बात करता है जैसे OpenAI से। मॉडल -m से बदलें।",
    others:
      "OpenCode, Continue, Aider और Cline भी चलते हैं, सब टेस्ट किए हुए। उनके सेटअप, स्थायी कॉन्फ़िग फ़ाइलें और जो पेच हमें मिले, कोडिंग टूल्स गाइड में हैं।",
    guideLink: "हर कोडिंग टूल सेट अप करें",
  },
  picks: {
    title: "कौन सा मॉडल किस काम के लिए",
    intro:
      "नीचे का हर मॉडल टूल कॉलिंग सपोर्ट करता है। दाम और स्पेक के लिए नाम पर क्लिक करें, id अपने कोड में कॉपी करें।",
    frontier: {
      title: "फ़्रंटियर: सबसे कठिन कोड और रीज़निंग",
      body: "बड़े रिफ़ैक्टर, अनजान कोडबेस, लंबी रीज़निंग चेन। प्रति टोकन दाम ज़्यादा, ग़लत मोड़ कम।",
    },
    cheap: {
      title: "सस्ते और तेज़: लूप, बल्क, बैकग्राउंड कॉल",
      body: "बड़े प्रॉम्प्ट भेजने वाले एजेंट लूप, बैच जॉब, क्लासिफ़िकेशन, और वे बैकग्राउंड कॉल जो कोडिंग टूल दिन भर चलाते हैं। फ़्रंटियर दामों का एक छोटा हिस्सा।",
    },
    uncensored: {
      title: "अनसेंसर्ड: मना करने की आदत नहीं",
      body: "GLM 5.3 Uncensored और Qwen 3.6 Plus Uncensored ऐसे मुख्यधारा मॉडल हैं जिनसे मना करना हटा दिया गया है। UncensoredLM v1.2 अलग है: यह उन किताबों और दस्तावेज़ों पर ट्रेन किया गया है जिन्हें मुख्यधारा इंटरनेट से हटा दिया गया, सिर्फ़ छीला हुआ मॉडल नहीं। वही API, वही टूल।",
    },
    compare: "दो में उलझे हैं? तुलना पेज दो मॉडल को आमने-सामने रखते हैं।",
    compareLink: "{{a}} बनाम {{b}}",
    allModels: "सभी {{modelCount}} मॉडल",
  },
  billing: {
    title: "इसकी लागत",
    intro: "क्रेडिट, प्रति टोकन बिल। कोई सीट फ़ीस नहीं।",
    price:
      "ज़्यादातर मॉडल अपने लिस्टेड प्रति टोकन दाम और हमारे मार्कअप पर बिल होते हैं। कैश्ड इनपुट टोकन मॉडल के कैश दाम पर बिल होते हैं। OpenRouter से परोसे गए मॉडल उस कॉल पर OpenRouter ने जो असली लागत ली उस पर और वही मार्कअप जोड़कर बिल होते हैं।",
    reported:
      "हर रिस्पॉन्स usage.credits_charged रिपोर्ट करता है। कॉल की लागत का अंदाज़ा लगाने की ज़रूरत नहीं।",
    preflight:
      "कॉल चलने से पहले आपका बैलेंस सबसे बुरे हाल के अनुमान से जाँचा जाता है। कम पड़ा तो HTTP 402 insufficient_credits: कुछ नहीं चलता, कुछ नहीं कटता।",
    abort:
      "स्ट्रीमिंग: कनेक्शन बंद करें और जनरेशन रुक जाता है। आप सिर्फ़ उसका पैसा देते हैं जो चला। प्रोवाइडर बीच स्ट्रीम में फ़ेल हो तब भी यही।",
    chat: "चैट और API एक ही तरह बिल होते हैं। OpenRouter एक मॉडल को कई होस्ट पर फैलाता है, और कुछ हमारी लिस्ट के सबसे सस्ते से ज़्यादा लेते हैं। इसलिए उन मॉडल के लिए लिस्टेड दाम अनुमान है, और असली संख्या usage.credits_charged है। अगर OpenRouter किसी कॉल की लागत रिपोर्ट नहीं करता, तो वह लिस्टेड दाम पर बिल होती है।",
    media:
      "मीडिया भी वैसे ही बिल होता है: जहाँ प्रोवाइडर रिपोर्ट करे वहाँ उसकी असली लागत और हमारा मार्कअप, वरना लिस्टेड प्रति मॉडल दाम। इमेज प्रति इमेज, वॉइस प्रति अक्षर, ट्रांसक्रिप्शन ऑडियो के प्रति सेकंड, वीडियो और म्यूज़िक फ़ाइल तैयार होने पर।",
    paid: "चैट ऐप वाला ही क्रेडिट बैलेंस। API के लिए पेड अकाउंट चाहिए: कोई भी प्लान। फ़्री क्रेडिट इसे अनलॉक नहीं करते।",
    sub: "मंथली प्लान: चार साइज़, {{subCredits}} क्रेडिट से {{subPrice}} में शुरू।",
    pack: "क्रेडिट पैक: सब्सक्राइबर्स के लिए टॉप-अप, {{packPrice}} में {{packCredits}} क्रेडिट। कभी एक्सपायर नहीं होते। कार्ड, PayPal या क्रिप्टो।",
    link: "प्लान और दाम देखें",
  },
  versus: {
    title: "सीधे वेंडर के पास जाएँ, राउटर लें, या हमें?",
    intro: "तीन ईमानदार विकल्प। हर एक किसी न किसी के लिए सही है।",
    direct: {
      title: "सीधे OpenAI, Anthropic या Google के पास",
      body: "सबसे नए फ़र्स्ट-पार्टी फ़ीचर वहीं पहले आते हैं। बीच में कोई मार्कअप नहीं। पढ़ने के लिए एक ही वेंडर की शर्तें। अगर आप हमेशा एक ही वेंडर के मॉडल इस्तेमाल करते हैं, तो सीधे जाएँ।",
    },
    router: {
      title: "OpenRouter जैसा एग्रीगेटर",
      body: "OpenRouter प्रोवाइडर चुनने और फ़ॉलबैक के साथ मल्टी-मॉडल API देता है। वह हमारे कुछ मॉडल रिक्वेस्ट अपस्ट्रीम भी परोसता है।",
    },
    here: {
      title: "{{appName}}",
      body: "तीन वायर फ़ॉर्मेट पर एक key: chat completions, Responses और count_tokens के साथ Anthropic Messages। Claude Code और Codex CLI बिना प्रॉक्सी के कनेक्ट होते हैं। अनसेंसर्ड मॉडल मुख्यधारा वालों के बग़ल में हैं, एक बार की 18+ पुष्टि के पीछे। चैट ऐप और API दोनों का पेमेंट उसी बैलेंस से होता है, सब्सक्रिप्शन क्रेडिट या पैक से। और {{appName}} ओपन सोर्स और सेल्फ़-होस्ट करने लायक़ है।",
    },
    verdict:
      "मॉडल कैटलॉग और अपनी भरोसे की राउटिंग सुविधाओं की तुलना करें। अगर आपको API में अनसेंसर्ड मॉडल और उसी क्रेडिट बैलेंस पर चैट ऐप चाहिए, तो देखें कि आपकी {{appName}} key क्या कॉल कर सकती है।",
  },
  limits: {
    title: "सीमाएँ जो आपको पता होनी चाहिए",
    intro: "प्रोडक्शन में कोई झटका नहीं। ये रहे सख़्त किनारे।",
    stateless:
      "स्टेटलेस। Responses API store को false पर चलाती है और previous_response_id को नकारती है। हर टर्न पर पूरी हिस्ट्री भेजें। यह हर एंडपॉइंट पर लागू है।",
    maxTokens: "आउटपुट हर रिक्वेस्ट पर {{maxTokens}} टोकन पर सीमित है।",
    rateLimit:
      "कोई तय रेट लिमिट नहीं। इस्तेमाल हर रिक्वेस्ट पर आपके क्रेडिट से बिल होता है, और दुरुपयोग से बचाव उदार रहता है। अपस्ट्रीम प्रोवाइडर के 429 Retry-After हेडर के साथ आगे पहुँचते हैं।",
    countTokens:
      "count_tokens अनुमान है, प्रोवाइडर का सटीक टोकनाइज़र नहीं। कॉन्टेक्स्ट नापने के लिए ठीक, बिलिंग गणित के लिए नहीं।",
    tools:
      "टूल कॉल सिर्फ़ उन मॉडल पर चलते हैं जो उन्हें सपोर्ट करते हैं। वरना 400 tools_not_supported मिलता है। GET /v1/models हर मॉडल का supports_tools दिखाता है।",
    consent:
      "अनसेंसर्ड मॉडल के लिए API keys पेज पर एक बार 18+ पुष्टि चाहिए। उसके बिना 403 uncensored_consent_required मिलता है, और कुछ नहीं कटता।",
    localeUrl:
      "सेटअप की दो पुरानी गलतियाँ, दोनों 404। एक: पाथ से लोकेल हटा देना। बेस URL /api/<locale>/v1 है, /api/v1 नहीं। दो: Anthropic बेस URL पर /v1 रख देना। Claude Code और Anthropic SDK /v1/messages ख़ुद जोड़ते हैं, इसलिए /v1 दो बार होने पर कुछ नहीं मिलता।",
  },
  privacy: {
    title: "आपके प्रॉम्प्ट का क्या होता है",
    intro: "छोटा जवाब: हम बिल रखते हैं, बातचीत नहीं।",
    noStore:
      "API कोई बातचीत सेव नहीं करती और कोई थ्रेड नहीं बनाती। हमारी तरफ़ सिर्फ़ बिलिंग रिकॉर्ड रहता है: कौन सा मॉडल, कितने क्रेडिट।",
    upstream:
      "आपका प्रॉम्प्ट उस प्रोवाइडर तक जाता है जो मॉडल परोसता है। जो उसे मिलता है उस पर उसकी शर्तें लागू होती हैं।",
    incognito:
      "चैट ऐप में इनकॉग्निटो चैट सिर्फ़ आपके ब्राउज़र के लोकल स्टोरेज में रहती है, हमारे सर्वर पर नहीं।",
    selfHost:
      "पूरा कंट्रोल चाहिए? {{appName}} ओपन सोर्स है (MIT और GPL v3)। अपने प्रोवाइडर keys के साथ अपना इंस्टेंस चलाएँ और प्रोवाइडर्स को सीधे पेमेंट करें।",
    selfHostLink: "सेल्फ़-होस्ट करें",
  },
  faq: {
    title: "अक्सर पूछे जाने वाले सवाल",
    openrouter: {
      q: "क्या {{appName}} OpenRouter का विकल्प है?",
      a: "{{appName}} Chat Completions, Responses और Anthropic Messages के लिए एक ही key देता है। 18+ पुष्टि के बाद आप अनसेंसर्ड मॉडल कॉल कर सकते हैं और चैट व API में वही क्रेडिट बैलेंस इस्तेमाल कर सकते हैं। कुछ रिक्वेस्ट अपस्ट्रीम OpenRouter से परोसी जाती हैं।",
    },
    openrouterModels: {
      q: "क्या स्विच करते समय मैं अपने OpenRouter मॉडल ID रख सकता हूँ?",
      a: "कुछ प्रोवाइडर-प्रीफ़िक्स वाले ID तब काम करते हैं जब अंदरूनी मॉडल उपलब्ध हो। उपलब्धता के लिए GET /v1/models जाँचें और नई API का लौटाया हुआ सटीक id कॉपी करें।",
    },
    claudeCode: {
      q: "क्या मैं Claude Code को गैर-Claude मॉडल के साथ चला सकता हूँ?",
      a: "हाँ। ANTHROPIC_BASE_URL को {{appName}} के Anthropic बेस URL पर सेट करें, अपनी key ANTHROPIC_AUTH_TOKEN में डालें और GET /v1/models से कोई भी मॉडल id चुनें। GPT, Gemini, GLM, Kimi, DeepSeek और अनसेंसर्ड मॉडल सब Claude Code में इसी तरह चलते हैं।",
    },
    sdk: {
      q: "क्या मुझे नया SDK चाहिए?",
      a: "आधिकारिक OpenAI या Anthropic SDK इस्तेमाल करें। उस SDK का बेस URL सेट करें, अपनी API key डालें और कोई उपलब्ध मॉडल ID चुनें।",
    },
    free: {
      q: "क्या API का कोई फ़्री टियर है?",
      a: "नहीं। चैट ऐप में फ़्री क्रेडिट हैं, API में नहीं। इसके लिए प्लान चाहिए, {{subPrice}} में हर महीने {{subCredits}} क्रेडिट से। सब्सक्राइबर्स क्रेडिट पैक ({{packPrice}} में {{packCredits}} क्रेडिट) से टॉप-अप कर सकते हैं जो कभी एक्सपायर नहीं होते।",
    },
    pricing: {
      q: "क्या लिस्टेड दाम ही मैं देता हूँ?",
      a: "ज़्यादातर मॉडल के लिए हाँ: लिस्टेड प्रति टोकन दाम और हमारा मार्कअप। OpenRouter से परोसे गए मॉडल उस कॉल पर OpenRouter ने जो असली लागत ली उस पर और वही मार्कअप जोड़कर बिल होते हैं, चैट ऐप और API दोनों में। उनका लिस्टेड दाम अनुमान है। हर रिस्पॉन्स usage.credits_charged में सटीक चार्ज बताता है।",
    },
    models: {
      q: "मैं कौन से मॉडल कॉल कर सकता हूँ?",
      a: "अभी {{modelCount}} चैट मॉडल: Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen और अनसेंसर्ड मॉडल। साथ में {{mediaModelCount}} इमेज, वीडियो, म्यूज़िक, वॉइस और ट्रांसक्रिप्शन मॉडल। GET /v1/models ठीक-ठीक बताता है कि आपकी key क्या कॉल कर सकती है, दामों के साथ।",
    },
    data: {
      q: "क्या {{appName}} मेरे प्रॉम्प्ट स्टोर करता है?",
      a: "API से नहीं। कोई बातचीत स्टोर नहीं होती, सिर्फ़ बिलिंग रिकॉर्ड: मॉडल और काटे गए क्रेडिट। जो प्रोवाइडर मॉडल परोसता है वह प्रॉम्प्ट अपनी शर्तों के तहत देखता है।",
    },
    docsLink: "पूरा API रेफ़रेंस पढ़ें",
    pricingLink: "प्लान और दाम देखें",
  },
  partners: {
    body: "डेवलपर्स के लिए टूल या कंटेंट बना रहे हैं? {{appName}} पार्टनर प्रोग्राम आपके रेफ़र किए हर पेमेंट पर आपको बार-बार मिलने वाला हिस्सा देता है।",
    link: "पार्टनर प्रोग्राम से जुड़ें",
  },
  cta: {
    title: "एक key। हर मॉडल। अभी शुरू करें।",
    subtitle:
      "एक key बनाएँ, एक बेस URL बदलें, अपना SDK रखें। API डॉक्स हर एंडपॉइंट, फ़ील्ड और एरर कोड को कवर करते हैं।",
    key: "API key बनाएँ",
    docs: "API डॉक्स पढ़ें",
  },
};
