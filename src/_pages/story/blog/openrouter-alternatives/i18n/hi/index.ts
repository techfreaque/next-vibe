import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "OpenRouter के अनसेंसर्ड विकल्प, तुलना | {{appName}}",
    description:
      "OpenRouter पर कोई abliterated मॉडल नहीं है। OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice और {{appName}} की तुलना: फ़ीस, प्राइवेसी और API।",
    category: "डेवलपर गाइड",
    imageAlt: "डेवलपर्स के लिए OpenRouter के अनसेंसर्ड विकल्पों की तुलना",
    keywords:
      "uncensored OpenRouter alternative, OpenRouter alternative, OpenRouter alternatives, OpenRouter uncensored models, abliterated model API, uncensored LLM API, OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, Featherless, OpenRouter vs NanoGPT, OpenRouter जैसी साइट, LLM API gateway, OpenAI compatible API, Anthropic compatible API, {{appName}}",
  },
  hero: {
    backToBlog: "ब्लॉग पर वापस",
    category: "डेवलपर गाइड",
    readTime: "11 मिनट में पढ़ें",
    title: "OpenRouter के अनसेंसर्ड विकल्प",
    subtitle:
      "{{count}} विकल्प और {{appName}}, अनसेंसर्ड कवरेज, API फ़ॉर्मेट और फ़ीस पर तुलना। {{date}} को जाँचा गया।",
  },
  intro: {
    lead: "OpenRouter एक key के पीछे 477 मॉडल रखता है। अनसेंसर्ड काम के लिए शेल्फ़ पतली है: 17 रोलप्ले या अनसेंसर्ड ट्यून, और एक भी abliterated मॉडल नहीं।",
    p2: "इसलिए हमने अनसेंसर्ड API होस्ट, फ़्लैट-रेट रोलप्ले होस्ट, गेटवे और ऐप्स को उनके अपने डॉक्स, प्राइसिंग और मॉडल लिस्ट से जाँचा। हम ख़ुद भी OpenRouter से मॉडल एक्सेस खरीदते हैं: हमारे {{openRouterModels}} मॉडल उसी से गुज़रते हैं।",
  },
  shelf: {
    title: "अनसेंसर्ड काम के लिए OpenRouter क्या रखता है",
    intro: "उसकी पब्लिक मॉडल लिस्ट और टर्म्स से, {{orDate}} को पढ़ा गया।",
    tunes:
      "477 में से 17 मॉडल नाम या डिस्क्रिप्शन से रोलप्ले या अनसेंसर्ड हैं: Venice Uncensored (Dolphin Mistral 24B का ट्यून), Hermes 4 405B, Cydonia, Skyfall, Magnum v4 72B, Euryale, MythoMax और कुछ Aion RP मॉडल।",
    abliterated:
      "किसी भी मॉडल ID में abliterated या uncensored नहीं है। अनसेंसर्ड राउटर जो abliterated GLM 5.3, DeepSeek V4.1 Flash और Kimi K3.1 Pro बिल्ड बेचते हैं, वो वहाँ नहीं हैं।",
    rules:
      "नियम: 18+, ऑटोमेटेड CSAM स्क्रीनिंग, बाकी हर मॉडल के अपने टर्म्स। स्टॉक मॉडल वही मना करते रहते हैं जो उनके वेंडर मना करते हैं।",
    callout:
      "abliterated weights चाहिए? OpenRouter गलत राउटर है। रोलप्ले fine-tune चाहिए? उसकी शेल्फ़ ठीक-ठाक है।",
  },
  apis: {
    title: "अनसेंसर्ड API विकल्प, एक-एक करके",
    intro:
      "API-पहले वाली सर्विस जो abliterated या अनसेंसर्ड weights बेचती हैं। उनके अपने पेजों से, {{marketDate}} को पढ़ा गया।",
    visit: "{{name}} पर जाएँ",
    openUncensored: {
      heading: "OpenUncensored: सिर्फ़ अनसेंसर्ड मॉडल का राउटर",
      body: "58 टेक्स्ट, 20 इमेज और 3 वीडियो मॉडल, लगभग सब abliterated, Venice, NanoGPT, Refuseless और दूसरों तक रूट होते हैं। प्रोवाइडर की कीमतों पर कोई कमीशन नहीं, $5 से टॉप-अप जो कभी एक्सपायर नहीं होते, और अकाउंट नहीं: आपकी API key ही अकाउंट है। OpenAI, Responses और Anthropic Messages एक ही base URL पर।",
      catch:
        "कमी: फ़्री टियर नहीं, वेब चैट नहीं (सिर्फ़ डेस्कटॉप ऐप), और रिक्वेस्ट मेटाडेटा दो साल तक रखा जाता है।",
    },
    refuseless: {
      heading: "Refuseless: हमें मिले सबसे सस्ते abliterated बिल्ड",
      body: "1M कॉन्टेक्स्ट के साथ abliterated GLM 5.3, GLM 5.3 Flash, DeepSeek V4.1 Flash और Kimi K3.1 Pro। DeepSeek V4.1 Flash abliterated प्रति मिलियन टोकन $0.12 इन और $0.45 आउट पर लिस्टेड है। Chat completions, Responses और Anthropic Messages, Claude Code समेत।",
      catch:
        "कमी: सिर्फ़ API, वेरिफ़ाइड ईमेल ज़रूरी, और उसके प्राइसिंग, प्राइवेसी और टर्म्स पेजों ने हमारे रीडर को ब्लॉक कर दिया।",
    },
    nearAi: {
      heading: "NEAR AI Cloud: कॉन्फ़िडेंशियल कंप्यूट में abliterated मॉडल",
      body: "हार्डवेयर attestation, इसलिए उसके मुताबिक न NEAR और न क्लाउड होस्ट आपके प्रॉम्प्ट पढ़ सकता है। दो abliterated मॉडल: Qwen 3.8 27B प्रति मिलियन टोकन $0.04 इन और $1.35 आउट पर, और DeepSeek V4.1 Flash 1017। कोई आवेदन नहीं, कोई पहचान जाँच नहीं, प्रति टोकन पेमेंट।",
      catch: "कमी: सिर्फ़ OpenAI फ़ॉर्मेट, और अनसेंसर्ड शेल्फ़ बहुत छोटी।",
    },
    uncensoredLlmAi: {
      heading: "UncensoredLLM.ai: सबसे बड़ा अनसेंसर्ड कैटलॉग",
      body: "332 चैट मॉडल और 13 इमेज और वीडियो मॉडल, रोज़ की refusal जाँच के साथ। एक प्रीपेड key पर OpenAI, Anthropic और Gemini फ़ॉर्मेट। $3 से कार्ड या क्रिप्टो, और बैलेंस कभी एक्सपायर नहीं होता।",
      catch:
        "कमी: लिखित इजाज़त के बिना रीसेल या री-बिल्ड API नहीं। हमारे पढ़े पेजों पर प्राइवेसी टर्म्स पब्लिश नहीं थे।",
    },
    abliterationAi: {
      heading: "abliteration.ai: अपने abliterated मॉडल, लिखित प्राइवेसी",
      body: "OpenAI और Anthropic फ़ॉर्मेट पर इसके अपने abliterated मॉडल। ये कहता है कि प्रॉम्प्ट और आउटपुट मेमोरी में प्रोसेस होते हैं, डिफ़ॉल्ट रूप से कभी स्टोर नहीं होते और ट्रेनिंग में कभी इस्तेमाल नहीं होते। EU रीजन का विकल्प, और आपके अपने नियमों के लिए पॉलिसी गेटवे।",
      catch:
        "कमी: मिलते-जुलते weights के लिए Refuseless या NEAR AI से महँगा, और बेस मॉडल का नाम नहीं बताया जाता।",
    },
    flatRate: {
      heading: "Featherless, Infermatic, Arli AI: भारी रोलप्ले के लिए फ़्लैट रेट",
      body: "Featherless पर 50,000 से ज़्यादा Hugging Face मॉडल लिस्टेड हैं, 1,398 abliterated टैग वाले, और $25 का फ़्लैट Chat प्लान। Infermatic चुने हुए 70B रोलप्ले ट्यून $9 महीने से बेचता है। Arli AI derestricted fine-tune के साथ $15 से अनलिमिटेड-टोकन प्लान चलाता है। तीनों कहते हैं कि वो प्रॉम्प्ट लॉग नहीं रखते।",
      catch: "कमी: पर्सनल प्लान से ऐप्स नहीं चल सकते, और 1 से 6 पैरेलल रिक्वेस्ट मिलती हैं।",
    },
    deepInfra: {
      heading: "DeepInfra: सस्ते स्टॉक मॉडल, कोई अनसेंसर्ड नहीं",
      body: "स्टॉक ओपन मॉडल के लिए प्रति टोकन सबसे सस्तों में: DeepSeek V4.1 Flash प्रति मिलियन टोकन $0.14 इन और $0.42 आउट पर, हर मॉडल पर 200 कंकरेंट रिक्वेस्ट। ये कहता है कि API इनपुट कभी डिस्क पर स्टोर नहीं होते।",
      catch: "कमी: इसके कैटलॉग में कोई अनसेंसर्ड या रोलप्ले मॉडल नहीं।",
    },
  },
  gateways: {
    title: "अगर आपको सिर्फ़ राउटर चाहिए",
    intro:
      "गेटवे उन्हीं प्रोवाइडर तक रूट करते हैं जो आप कॉन्फ़िगर करें। इनमें से कोई अनसेंसर्ड मॉडल नहीं जोड़ता।",
    vercel:
      "Vercel AI Gateway: होस्टेड, प्रोवाइडर की टोकन कीमत पर बिना मार्कअप, AI SDK के लिए बना।",
    selfHost:
      "LiteLLM या Bifrost: ओपन सोर्स, सेल्फ़-होस्टेड, आपकी अपनी प्रोवाइडर keys, बजट और fallback के साथ।",
    control:
      "Portkey, Cloudflare AI Gateway, Helicone: ऊपर से गार्डरेल, कैशिंग, रिक्वेस्ट लॉग और स्पेंड कंट्रोल।",
  },
  criteria: {
    title: "बदलने से पहले क्या तुलना करें",
    intro: "छह सवाल तय करते हैं।",
    catalog:
      "कैटलॉग: कितने मॉडल, कितनी लैब्स से, और क्या वो मॉडल हैं जो आप आज इस्तेमाल करते हैं?",
    uncensored: "अनसेंसर्ड कवरेज: refusals हटाए गए कितने मॉडल, और किस तरह के?",
    formats:
      "फ़ॉर्मेट: सिर्फ़ OpenAI chat completions, या Responses API और Anthropic Messages API भी जो कोडिंग एजेंट इस्तेमाल करते हैं?",
    billing:
      "बिलिंग: लिस्ट प्राइस और एक फ़ीस, मार्कअप, या सब्सक्रिप्शन? और बैलेंस ज़ीरो होने पर क्या होता है?",
    data: "डेटा: क्या प्रॉम्प्ट स्टोर, लॉग या ट्रेनिंग में इस्तेमाल होते हैं, और क्या वो opt-in है?",
    chat: "चैट: क्या जो लोग कभी कोड नहीं लिखते, वो उन्हीं मॉडल को ब्राउज़र में इस्तेमाल कर सकते हैं?",
  },
  table: {
    title: "सब एक साथ, आमने-सामने",
  },
  us: {
    title: "{{appName}}: एक key, हर तरह का मॉडल",
    intro: "एक key के पीछे {{modelCount}} चैट मॉडल, उनमें {{uncensored}} अनसेंसर्ड।",
    models:
      "मॉडल: {{uncensored}} अनसेंसर्ड मॉडल के साथ Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM और Qwen। {{ownModel}} उन किताबों और दस्तावेज़ों पर ट्रेन किया गया है जिन्हें मुख्यधारा इंटरनेट से हटा दिया गया, इसलिए इसकी राजनीतिक राय मुख्यधारा से उलटी है।",
    formats:
      "फ़ॉर्मेट: OpenAI chat completions, OpenAI Responses API और Anthropic Messages API। किसी भी SDK या कोडिंग एजेंट को एक base URL पर पॉइंट कीजिए।",
    billing:
      "बिलिंग: एक क्रेडिट बैलेंस, हम जो चुकाते हैं उस पर हमारा {{markup}}% मार्कअप। आपकी पहली खरीद API keys खोल देती है, प्लान {{apiSubPrice}} महीने से शुरू।",
    chat: "चैट: वही मॉडल एक वेब चैट में, फ़ोल्डर, टूल्स, इमेज, वीडियो और म्यूज़िक जनरेशन के साथ। आपकी टीम के नॉन-डेवलपर्स को भी मॉडल मिलते हैं।",
    openRouter:
      "अंदर OpenRouter: हमारे {{openRouterModels}} मॉडल OpenRouter से गुज़रते हैं। वही मॉडल, और अनसेंसर्ड वाले भी, एक अकाउंट में।",
    weak: "हम कहाँ कमज़ोर हैं: OpenRouter इनफ़रेंस पर कोई मार्कअप नहीं लेता, सिर्फ़ क्रेडिट खरीद पर 5.5% फ़ीस। हम जो चुकाते हैं उस पर {{markup}}% जोड़ते हैं। वो आपको अपनी प्रोवाइडर keys लाने देता है, सिर्फ़ zero-data-retention endpoints पर रूट करने देता है और हर रिक्वेस्ट पर प्रोवाइडर चुनने देता है। हमारे पास इनमें से कुछ नहीं। और ऊपर के abliterated राउटर हमारे साझा हर मॉडल पर हमसे सस्ते हैं।",
    codeLabel: "OpenAI SDK क्लाइंट को यहाँ लाना: base URL और key बदल दीजिए",
    docsLink: "API डॉक्स: endpoints, ऑथ और सीमाएँ",
    formatsLink: "OpenAI और Anthropic कम्पैटिबल API, समझाया गया",
    toolsLink: "Claude Code, Codex CLI, Aider और बाकी में एक key इस्तेमाल करें",
  },
  models: {
    title: "{{apiUncensored}} अनसेंसर्ड मॉडल जिन्हें आप आज कॉल कर सकते हैं",
    intro:
      "API पर हर अनसेंसर्ड मॉडल, उस id के साथ जो आप model में देते हैं। सबसे सस्ता पहले।",
    colModel: "मॉडल",
    colId: "API id",
    colContext: "कॉन्टेक्स्ट",
    colPrice: "प्रति मैसेज",
    footnote:
      "एक रेफ़रेंस मैसेज की कीमत, हमारा {{markup}}% मार्कअप शामिल। हर नाम के नीचे का लेबल बताता है कि मॉडल कैसे बना।",
  },
  list: {
    title: "अनसेंसर्ड API वाले ऐप्स, एक-एक करके",
    intro:
      "उनके अपने पेजों से, {{date}} को जाँचे गए। हर एक क्या है, उसका API कैसे काम करता है, कौन से मॉडल हैं और कीमत क्या है।",
    heading: "{{number}}. {{name}}: {{kind}}",
    api: "API:",
    models: "मॉडल:",
    price: "कीमत:",
    priceValue: "फ़्री टियर: {{free}}। पेड: {{plans}}।",
    pro: "सबसे अच्छी बात:",
    con: "कमी:",
    forWho: "इसे चुनिए अगर:",
    versusLink: "{{appName}} बनाम {{name}}: पूरी तुलना",
    visit: "{{name}} पर जाएँ",
  },
  stay: {
    title: "जब OpenRouter अब भी सही चुनाव है",
    intro: "कभी-कभी ओरिजिनल ही बेहतर टूल होता है।",
    rare: "आपको कोई नीश मॉडल या कोई ख़ास प्रोवाइडर चाहिए जिसे इस लिस्ट में कोई और नहीं देता।",
    callout:
      "कई टीमें दो चलाती हैं: लंबी पूँछ के लिए OpenRouter, और अनसेंसर्ड मॉडल और पूरी टीम के चैट के लिए दूसरी key।",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "OpenRouter का सबसे अच्छा विकल्प कौन सा है?",
      a: "इस पर निर्भर है कि आपके लिए OpenRouter में क्या कम है। प्रोवाइडर प्राइस पर abliterated weights: OpenUncensored, Refuseless या NEAR AI Cloud। सबसे बड़ा अनसेंसर्ड कैटलॉग: UncensoredLLM.ai या Featherless। क्रिप्टो से पे-पर-यूज़: NanoGPT। Venice के अपने मॉडल और प्राइवेसी मोड: Venice। लोकल और फ़्री: Ollama। एक key पर अनसेंसर्ड, ओपन और मेनस्ट्रीम मॉडल, साथ में मीडिया और टीम चैट: {{appName}}।",
    },
    cheaper: {
      q: "क्या OpenRouter का कोई सस्ता विकल्प है?",
      a: "फ़ीस नहीं, हर मॉडल की कीमत की तुलना कीजिए। OpenRouter इनफ़रेंस पर मार्कअप नहीं जोड़ता, OpenUncensored कमीशन नहीं लेता, और Refuseless और NEAR AI Cloud हमें मिले सबसे सस्ते abliterated बिल्ड लिस्ट करते हैं। {{appName}} पर आप वही चुकाते हैं जो हम चुकाते हैं और ऊपर {{markup}}% मार्कअप, और हर मॉडल पेज प्रति मैसेज कीमत दिखाता है।",
    },
    uncensored: {
      q: "OpenRouter के किस विकल्प में अनसेंसर्ड मॉडल हैं?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, NanoGPT, Venice, uncensored.ai, Gab AI और {{appName}}, सब API पर अनसेंसर्ड मॉडल देते हैं। {{appName}} के API पर अभी {{apiUncensored}} हैं, {{ownModel}} के साथ abliterated और fine-tuned मॉडल।",
    },
    sdk: {
      q: "क्या मैं अपना OpenAI SDK कोड रख सकता हूँ?",
      a: "हाँ। base URL और API key बदलिए, बाकी रखिए। मॉडल id हर गेटवे पर अलग होते हैं, इसलिए उन्हें भी बदलिए। उदाहरण: {{example}}।",
    },
    anthropic: {
      q: "क्या ये Anthropic SDK और कोडिंग एजेंट्स के साथ चलता है?",
      a: "{{appName}} पर हाँ: Anthropic Messages API OpenAI फ़ॉर्मेट के साथ चलता है, इसलिए Claude Code और दूसरे एजेंट एक key से जुड़ते हैं, अनसेंसर्ड मॉडल समेत। OpenUncensored, Refuseless, NanoGPT और UncensoredLLM.ai भी Anthropic Messages बोलते हैं। Venice में नेटिव endpoint नहीं है और वो Claude Code को लोकल प्रॉक्सी पर पॉइंट करता है।",
    },
    free: {
      q: "क्या OpenRouter का कोई फ़्री विकल्प है?",
      a: "आपका हार्डवेयर मॉडल सँभाल सके तो Ollama फ़्री है। OpenRouter में ख़ुद 11 फ़्री मॉडल हैं, रोज़ की सीमा के साथ, और Infermatic का फ़्री वेब प्लान है। {{appName}} हर महीने फ़्री चैट क्रेडिट देता है, API आपकी पहली खरीद से खुलता है।",
    },
    apiLink: "अनसेंसर्ड LLM API: मॉडल id, कोड और सीमाएँ",
    veniceLink: "Venice AI के विकल्प, तुलना",
    nanoGptLink: "NanoGPT के विकल्प, तुलना",
    keysLink: "अपनी API keys मैनेज करें",
  },
  cta: {
    title: "एक key। हर मॉडल। कम refusals।",
    subtitle:
      "पहले चैट में मॉडल आज़माइए, महीने के {{guestCredits}} फ़्री क्रेडिट, अकाउंट नहीं चाहिए।",
    start: "अनसेंसर्ड मॉडल आज़माएँ",
    docs: "API डॉक्स पढ़ें",
  },
};
