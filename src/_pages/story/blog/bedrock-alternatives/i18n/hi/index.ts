import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "अनसेंसर्ड AWS Bedrock विकल्प: APIs की तुलना | {{appName}}",
    description:
      "Bedrock Guardrails वैकल्पिक हैं, पर मॉडल का मना करना और AWS पॉलिसी रहती है। abliterated weights के लिए Custom Model Import बनाम {{appName}} और Venice।",
    category: "डेवलपर गाइड",
    imageAlt: "AWS Bedrock के अनसेंसर्ड विकल्प, तुलना के साथ",
    keywords:
      "अनसेंसर्ड AWS Bedrock विकल्प, Bedrock alternative, Bedrock without guardrails, Bedrock Custom Model Import abliterated, Bedrock uncensored model, Claude on Bedrock alternative, Bedrock Converse API alternative, Anthropic Messages API, uncensored LLM API, abliterated model API, {{appName}}",
  },
  hero: {
    backToBlog: "ब्लॉग पर वापस",
    category: "डेवलपर गाइड",
    readTime: "8 मिनट में पढ़ें",
    title: "अनसेंसर्ड AWS Bedrock विकल्प",
    subtitle:
      "Guardrails, मॉडल का मना करना, AWS पॉलिसी और Custom Model Import, सीधे स्रोत से पढ़े गए। फिर {{count}} विकल्प। जाँच की तारीख़: {{date}}।",
  },
  intro: {
    lead: "Bedrock आप पर कोई फ़िल्टर थोपता नहीं। Guardrail छोड़ दें तो Bedrock कुछ नहीं जोड़ता। फिर भी मॉडल मना करता है, AWS पॉलिसी लागू रहती है और कैटलॉग में कोई अनसेंसर्ड weights नहीं हैं।",
    p2: "तो असली सवाल यह है कि abliterated मॉडल कहाँ चलें और वहाँ जाने की क़ीमत क्या है। ये रहे AWS के अपने डॉक्स के तथ्य, Custom Model Import का रास्ता, और Claude-on-Bedrock यूज़र्स के {{appName}} पर आने के लिए कोड में बदलाव।",
  },
  bedrock: {
    title: "Bedrock क्या फ़िल्टर करता है और क्या नहीं",
    intro: "सीधे AWS के डॉक्स और पॉलिसी से।",
    guardrails:
      "Guardrails अपनी मर्ज़ी से चुनने वाले हैं: ये तभी चलते हैं जब आप कॉल में guardrail ID और वर्ज़न देते हैं।",
    refusals:
      "Guardrail न होने का मतलब अनसेंसर्ड नहीं है: मॉडल वैसे ही परोसे जाते हैं जैसे उनके प्रोवाइडर भेजते हैं, इसलिए Claude, Llama और बाक़ी अपना सीखा हुआ मना करना बनाए रखते हैं।",
    csam: "हमेशा चालू: इमेज इनपुट और आउटपुट पर ऑटोमैटिक CSAM डिटेक्शन किसी रिक्वेस्ट को HTTP 400 से रोक सकता है।",
    policy:
      "पॉलिसी: AWS Responsible AI Policy सेफ़्टी फ़िल्टर जानबूझकर बायपास करने के लिए सर्विस के इस्तेमाल पर रोक लगाती है, साथ ही दुष्प्रचार, बिना सहमति की यौन इमेजरी और नाबालिगों को नुकसान पर भी।",
    retention:
      "दुरुपयोग की पहचान: AWS सीमित मामलों में इनपुट और आउटपुट स्टोर या रिव्यू कर सकता है। Claude Fable 5, 5.1 और 5.2 सारा ट्रैफ़िक 30 दिन तक रखते हैं, gpt-oss के बाहर के OpenAI मॉडल फ़्लैग किया गया ट्रैफ़िक 30 दिन तक रखते हैं। मॉडल प्रोवाइडर्स को इसमें से कुछ नहीं मिलता।",
    models:
      "अनसेंसर्ड weights नहीं: कैटलॉग में DeepSeek, Llama, Qwen, Mistral, gpt-oss, Kimi, GLM, MiniMax, Gemma और Nemotron हैं। कोई भी abliterated नहीं।",
  },
  import: {
    title: "अपने abliterated weights लाएँ: Custom Model Import",
    intro:
      "Bedrock आपके अपलोड किए weights होस्ट कर सकता है। वहाँ abliterated मॉडल चलाने का यही अकेला रास्ता है।",
    architectures:
      "सपोर्टेड आर्किटेक्चर: Mistral, Mixtral, Flan, Llama 2 से 3.3, GPTBigCode, Qwen2 से Qwen3 और gpt-oss 20B व 120B। abliterated Llama, Qwen या gpt-oss चलेगा।",
    excluded:
      "सपोर्ट नहीं: DeepSeek V3, Kimi और GLM आर्किटेक्चर। Qwen3 इम्पोर्ट Converse API सपोर्ट नहीं करते।",
    format:
      "सीमाएँ: Hugging Face safetensors, टेक्स्ट मॉडल के लिए 200 GB से कम, कॉन्टेक्स्ट 128K से कम, बैच इन्फ़रेंस नहीं। रीजन: eu-central-1, us-east-1, us-east-2, us-west-2।",
    cost: "लागत: US East और Oregon में $0.05718 प्रति Custom Model Unit प्रति मिनट, 5 मिनट की विंडो में बिल, ऊपर से स्टोरेज $1.95 प्रति यूनिट प्रति माह। Frankfurt में $0.07144 प्रति मिनट।",
    callout:
      "आप मॉडल की क्षमता का पैसा मिनट के हिसाब से देते हैं, टोकन के हिसाब से नहीं। और सेफ़्टी फ़िल्टर बायपास करने के ख़िलाफ़ AWS पॉलिसी आपके अकाउंट पर तब भी लागू है।",
  },
  prices: {
    title: "Bedrock के अपने ओपन-मॉडल के दाम",
    intro:
      "स्टैंडर्ड टियर, US East, प्रति 1M टोकन, इनपुट / आउटपुट। सिर्फ़ स्टॉक weights।",
    list: "DeepSeek v3.2 $0.62 / $1.85। Qwen3 Next 80B A3B $0.15 / $1.20। Mistral Large 3 $0.50 / $1.50। Kimi K2.5 $0.60 / $3.00। GLM 5 $1.00 / $3.20। GLM 4.7 Flash $0.07 / $0.40।",
    oursTitle: "अनसेंसर्ड weights कहीं और, प्रति टोकन",
    oursIntro:
      "वे abliterated मॉडल जो Bedrock में नहीं हैं: हमारे दाम बनाम सबसे सस्ते होस्ट।",
  },
  apis: {
    title: "Converse बनाम OpenAI और Anthropic फ़ॉर्मेट",
    intro:
      "Bedrock, bedrock-runtime पर InvokeModel और Converse बोलता है, और अपने bedrock-mantle एंडपॉइंट पर Messages, Chat Completions और Responses जोड़ता है। हम एक ही बेस URL और एक ही key पर OpenAI chat completions, Responses API और Anthropic Messages बोलते हैं।",
    claude:
      "Claude-on-Bedrock यूज़र्स के लिए मतलब यह है कि Anthropic SDK चलता रहता है। Bedrock क्लाइंट की जगह सादा क्लाइंट लगाएँ, बेस URL और key सेट करें। Claude Code यही बेस URL ANTHROPIC_BASE_URL के रूप में लेता है।",
    before: "पहले: Bedrock क्लाइंट से Claude",
    after: "बाद में: वही Messages कॉल {{appName}} पर",
    swap: "वही कोड, कोई भी मॉडल: model फ़ील्ड में {{uncensoredExample}} डालें और कॉल अनसेंसर्ड मॉडल पर चली जाएगी।",
    converse:
      "आज Converse पर हैं? एक बार OpenAI या Anthropic SDK पर आ जाइए, फिर इस पेज का हर गेटवे, हम समेत, बस एक बेस URL बदलने की दूरी पर है।",
  },
  rules: {
    title: "Bedrock, Azure, Vertex और Together आमने-सामने",
    intro:
      "हर हाइपरस्केलर कहीं न कहीं फ़िल्टर घटाने देता है। कोई भी यूसेज पॉलिसी नहीं बदलता, और कोई भी अनसेंसर्ड weights नहीं देता।",
  },
  us: {
    title: "{{appName}}: weights इम्पोर्ट किए बिना अनसेंसर्ड मॉडल",
    intro:
      "एक key के पीछे {{modelCount}} चैट मॉडल, जिनमें {{uncensored}} अनसेंसर्ड। प्रति टोकन पेमेंट, कोई कैपेसिटी मिनट नहीं।",
    models:
      "मॉडल: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM और Qwen, साथ में {{uncensored}} अनसेंसर्ड मॉडल, जिनमें abliterated GLM, DeepSeek और Kimi भी हैं जो Custom Model Import नहीं ले सकता। {{ownModel}} उन किताबों और दस्तावेज़ों पर ट्रेन किया गया है जिन्हें मुख्यधारा इंटरनेट से हटा दिया गया, इसलिए इसकी राजनीतिक राय मुख्यधारा से उलटी है।",
    formats:
      "फ़ॉर्मेट: OpenAI chat completions, Responses API और Anthropic Messages, साथ में इमेज, वीडियो, म्यूज़िक, स्पीच और ट्रांसक्रिप्शन।",
    consent: "नियम: अनसेंसर्ड मॉडल आपके अकाउंट पर एक बार 18+ सहमति देने के बाद खुलते हैं।",
    billing:
      "बिलिंग: एक क्रेडिट बैलेंस, अपस्ट्रीम में हम जो देते हैं उस पर हमारा {{markup}}% मार्कअप। {{apiSubPrice}} प्रति माह से शुरू होने वाला कोई भी प्लान API keys अनलॉक करता है।",
    weak: "जहाँ Bedrock हमसे आगे है: IAM, VPC, रीजन, AWS बिल, ISO, SOC, CSA STAR, HIPAA पात्रता और GovCloud में FedRAMP High। हमारे पास SOC 2 रिपोर्ट, BAA, SLA या रीजन चुनने का विकल्प नहीं है, और हर प्रॉम्प्ट हमसे होकर उस प्रोवाइडर तक जाता है जो मॉडल चलाता है।",
    docsLink: "API डॉक्स: एंडपॉइंट, ऑथ और लिमिट",
    toolsLink: "Claude Code, Codex CLI, Aider और बाक़ी में एक ही key इस्तेमाल करें",
  },
  models: {
    title: "आज API पर {{apiUncensored}} अनसेंसर्ड मॉडल",
    intro:
      "हर अनसेंसर्ड मॉडल जिसे आप कॉल कर सकते हैं, उस id के साथ जो आप model में देते हैं। सबसे सस्ता पहले।",
    colModel: "मॉडल",
    colId: "API id",
    colContext: "कॉन्टेक्स्ट",
    colPrice: "प्रति मैसेज",
  },
  list: {
    title: "विकल्प, एक-एक करके",
    intro:
      "उनके अपने पेज और मॉडल लिस्ट से, {{date}} को पढ़े गए। हर एक क्या है, कहाँ जीतता है और पेच क्या है।",
  },
  stay: {
    title: "Bedrock पर कब टिके रहें",
    intro: "अगर आपका वर्कलोड AWS में रहता है, तो फ़िल्टर का सवाल शायद छोटा है।",
    compliance: "आपको कंप्लायंस स्कोप, IAM और VPC कंट्रोल और एक AWS इनवॉइस चाहिए।",
    retention:
      "आपको हर रीजन में ज़ीरो रिटेंशन चाहिए: Bedrock का retention mode none, API से सेट होता है।",
    weights:
      "आपका abliterated मॉडल Llama, Qwen या gpt-oss है और लगातार ट्रैफ़िक कैपेसिटी मिनट के ख़र्च को सही ठहराता है।",
    callout:
      "कई टीमें दोनों रखती हैं: AWS के अंदर प्रोडक्शन के लिए Bedrock, और फ़िक्शन, रोलप्ले, रिसर्च और रेड-टीमिंग के लिए दूसरी key।",
  },
  faq: {
    title: "अक्सर पूछे जाने वाले सवाल",
    guardrails: {
      q: "क्या Bedrock बिना Guardrails के कंटेंट फ़िल्टर करता है?",
      a: "इमेज पर ऑटोमैटिक CSAM डिटेक्शन को छोड़कर, Guardrail जोड़े बिना Bedrock कोई फ़िल्टर लेयर नहीं जोड़ता। मॉडल अपना सीखा हुआ मना करना रखते हैं, और AWS Responsible AI Policy लागू रहती है।",
    },
    uncensored: {
      q: "क्या Bedrock में अनसेंसर्ड या abliterated मॉडल हैं?",
      a: "इसके कैटलॉग में नहीं। अकेला रास्ता है अपने weights का Custom Model Import, Llama, Qwen और gpt-oss जैसे सपोर्टेड आर्किटेक्चर के लिए।",
    },
    cost: {
      q: "Custom Model Import की लागत कितनी है?",
      a: "US East और Oregon में $0.05718 प्रति Custom Model Unit प्रति मिनट, 5 मिनट की विंडो में बिल, ऊपर से स्टोरेज $1.95 प्रति यूनिट प्रति माह। आप कैपेसिटी का पैसा देते हैं, प्रति टोकन नहीं।",
    },
    claude: {
      q: "क्या मैं Claude-on-Bedrock का कोड बिना दोबारा लिखे ले जा सकता हूँ?",
      a: "हाँ। AnthropicBedrock की जगह सादा Anthropic क्लाइंट लगाएँ, base_url को {{appName}} के बेस URL पर /v1 के बिना सेट करें, अपनी key और हमारा मॉडल id इस्तेमाल करें। Messages रिक्वेस्ट और रिस्पॉन्स का ढाँचा वही रहता है।",
    },
    converse: {
      q: "क्या {{appName}} Bedrock Converse API सपोर्ट करता है?",
      a: "नहीं। हम OpenAI chat completions, Responses API और Anthropic Messages बोलते हैं। Converse से एक बार निकलने पर हर OpenAI या Anthropic कम्पैटिबल प्रोवाइडर बस एक बेस URL बदलने की दूरी पर होता है।",
    },
    enterprise: {
      q: "क्या {{appName}} SOC 2, BAA या SLA देता है?",
      a: "नहीं। ये चाहिए तो रेगुलेटेड वर्कलोड Bedrock पर रखें और {{appName}} वहाँ इस्तेमाल करें जहाँ मॉडल का मना करना रुकावट बनता है।",
    },
    apiLink: "Uncensored LLM API: मॉडल id, कोड और लिमिट",
    azureLink: "अनसेंसर्ड Azure OpenAI विकल्प",
    openRouterLink: "OpenRouter के विकल्प, तुलना के साथ",
    keysLink: "अपनी API keys मैनेज करें",
  },
  cta: {
    title: "कोई कैपेसिटी मिनट नहीं। कोई मना करने की आदत नहीं।",
    subtitle:
      "पहले चैट में मॉडल आज़माएँ, हर महीने {{guestCredits}} फ़्री क्रेडिट, अकाउंट की ज़रूरत नहीं। फिर अपना SDK API पर लगाएँ।",
    start: "अनसेंसर्ड मॉडल आज़माएँ",
    docs: "API डॉक्स पढ़ें",
  },
};
