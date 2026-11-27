import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} API Docs: OpenAI और Anthropic कम्पैटिबल",
    description:
      "एक base URL, {{modelCount}} चैट मॉडल। OpenAI और Anthropic कम्पैटिबल API, स्ट्रीमिंग और टूल कॉल के साथ। इमेज, वॉइस, वीडियो, म्यूज़िक भी। क्रेडिट से पेमेंट।",
    category: "API",
    imageAlt: "{{appName}} OpenAI-कम्पैटिबल API डॉक्स",
    keywords:
      "api, openai compatible, anthropic compatible, chat completions, responses api, messages api, codex cli, claude code, streaming, function calling, image generation api, text to speech api, whisper api, video generation api, music generation api, AI API हिंदी, सस्ता AI API, अनसेंसर्ड AI API, {{appName}}",
  },
  toc: {
    title: "इस पेज पर",
    mobileTitle: "यहाँ जाएँ",
    groups: {
      start: "शुरुआत",
      chat: "चैट",
      media: "मीडिया",
      reference: "रेफ़रेंस",
      integrations: "इंटीग्रेशन",
    },
  },
  nav: {
    quickstart: "क्विकस्टार्ट",
    auth: "ऑथेंटिकेशन",
    access: "एक्सेस और कीमत",
    models: "मॉडल",
    chat: "Chat completions",
    tools: "टूल कॉलिंग",
    responses: "Responses API",
    messages: "Messages API",
    billing: "क्रेडिट और बिलिंग",
    errors: "एरर और रेट लिमिट",
    codingTools: "कोडिंग टूल",
    sdks: "SDK उदाहरण",
    guides: "गाइड",
    images: "इमेज",
    speech: "टेक्स्ट से वॉइस",
    transcriptions: "ट्रांसक्रिप्शन",
    videos: "वीडियो",
    music: "म्यूज़िक",
    mediaFiles: "मीडिया फ़ाइलें",
  },
  hero: {
    badge: "API रेफ़रेंस",
    title: "एक base URL।",
    titleHighlight: "हर मॉडल।",
    subtitle:
      "किसी भी OpenAI या Anthropic SDK को {{appName}} पर पॉइंट करें। Codex CLI और Claude Code भी। इमेज, वॉइस, वीडियो और म्यूज़िक उसी key पर। कोई नया क्लाइंट सीखने की ज़रूरत नहीं।",
    ctaKey: "API key लें",
    ctaPricing: "प्लान देखें",
    quickstartLink: "3 स्टेप में क्विकस्टार्ट",
    facts: {
      models: "{{modelCount}} चैट मॉडल",
      formats: "OpenAI + Anthropic फ़ॉर्मेट",
      streaming: "स्ट्रीमिंग और टूल कॉल",
      rate: "कोई फ़िक्स्ड रेट लिमिट नहीं",
    },
  },
  code: {
    copy: "कॉपी करें",
    wrap: "लाइनें रैप करें",
    copied: "कॉपी हो गया",
    request: "रिक्वेस्ट",
    response: "रिस्पॉन्स",
    stream: "स्ट्रीम",
    showResponse: "उदाहरण रिस्पॉन्स",
    showStream: "उदाहरण स्ट्रीम",
    showObject: "पूरा हुआ जॉब ऑब्जेक्ट",
  },
  quickstart: {
    title: "क्विकस्टार्ट",
    intro:
      "यह API OpenAI और Anthropic दोनों का वायर फ़ॉर्मेट बोलता है। जो कोड इनमें से किसी पर चलता है, वह यहाँ सिर्फ़ दो बदलाव के बाद चलेगा: base URL और key।",
    baseUrlLabel: "OpenAI base URL",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "Claude Code और Anthropic SDK के लिए। आखिर में `/v1` नहीं: वे `/v1/messages` खुद जोड़ते हैं।",
    baseUrlNote:
      "पाथ में कोई भी लोकेल चलेगा (en-US, de-DE, pl-PL)। इससे सिर्फ़ एरर मैसेज की भाषा बदलती है।",
    envLabel: "या हर OpenAI SDK के लिए एक बार सेट कर दें",
    step1: {
      title: "Key बनाएँ",
      description:
        "अपने अकाउंट में API keys खोलें, key को नाम दें, कॉपी करें। यह सिर्फ़ एक बार दिखती है।",
      cta: "API keys खोलें",
    },
    step2: {
      title: "Base URL सेट करें",
      description: "अपने क्लाइंट में base URL बदलें। Anthropic क्लाइंट दूसरा वाला लेते हैं।",
    },
    step3: {
      title: "रिक्वेस्ट भेजें",
      description:
        "टर्मिनल में पेस्ट करें, अपनी key डालें, चलाएँ। Python और JavaScript में भी वही कॉल।",
    },
  },
  access: {
    title: "एक्सेस और कीमत",
    intro:
      "API उन्हीं क्रेडिट पर चलता है जिन पर चैट ऐप। कोई अलग API प्लान नहीं, कोई सीट फ़ीस नहीं।",
    unlockTitle: "यह कैसे अनलॉक होता है",
    plan: "कोई भी प्लान, {{subPrice}} प्रति महीने से। हर प्लान में हर महीने क्रेडिट मिलते हैं।",
    grant: "हमारी टीम के दिए क्रेडिट, जैसे टेस्टर क्रेडिट।",
    never:
      "फ़्री क्रेडिट से यह कभी अनलॉक नहीं होता: हर महीने की फ़्री लिमिट, साइन अप और न्यूज़लेटर बोनस, रेफ़रल कमाई।",
    withoutTitle: "बिना खरीदारी के",
    locked:
      "जिन अकाउंट में कोई खरीदारी नहीं हुई, वे key नहीं बना सकते, और हर `/v1` कॉल HTTP 402 `paid_plan_required` लौटाती है।",
    topup:
      "और चाहिए? सब्सक्राइबर {{packPrice}} से शुरू होने वाले क्रेडिट पैक से टॉप अप करते हैं। पैक क्रेडिट कभी एक्सपायर नहीं होते।",
    ctaUnlock: "प्लान देखें",
    ctaKeys: "API keys खोलें",
  },
  auth: {
    title: "ऑथेंटिकेशन",
    intro:
      "हर रिक्वेस्ट पर अपनी key Bearer टोकन की तरह भेजें। Keys `sk-unb-` से शुरू होती हैं। Anthropic क्लाइंट इसे `x-api-key` में भेजते हैं, वह भी चलता है।",
    header: "Authorization: Bearer sk-unb-YOUR_KEY",
    headerAnthropic: "x-api-key: sk-unb-YOUR_KEY",
    headerTab: "OpenAI फ़ॉर्मेट",
    headerAnthropicTab: "Anthropic फ़ॉर्मेट",
    points: {
      hash: "हम key नहीं, उसका hash सेव करते हैं। key खो जाए तो नई बना लें।",
      scope:
        "Key सिर्फ़ API पर चलती है: `/v1/models`, चैट (`/v1/chat/completions`, `/v1/responses`, `/v1/messages`) और मीडिया (`/v1/images`, `/v1/audio`, `/v1/videos`, `/v1/music`, `/v1/media`)। यह आपके अकाउंट, पेमेंट या सेटिंग्स को छू नहीं सकती।",
      limit:
        "हर अकाउंट पर ज़्यादा से ज़्यादा {{maxKeys}} एक्टिव keys। कोई भी key कभी भी रद्द करें: वह तुरंत काम करना बंद कर देती है।",
      missing:
        "Key न हो या रद्द की गई key हो तो 401 मिलता है। बिना खरीदारी वाले अकाउंट की key पर 402 मिलता है।",
    },
  },
  models: {
    title: "मॉडल",
    intro:
      "`GET /v1/models` वे मॉडल दिखाता है जिन्हें आपकी key अभी कॉल कर सकती है, साथ में context साइज़, टूल सपोर्ट और प्रति मिलियन टोकन क्रेडिट कीमत। रिक्वेस्ट में model फ़ील्ड के लिए id इस्तेमाल करें।",
    note: "लिस्ट आपके अकाउंट पर निर्भर है। अनजान या अनुपलब्ध ids पर 404 `model_not_found` मिलता है। एक ही मैपिंग है: `/v1/messages` पर, Claude Code जो Claude ids डिफ़ॉल्ट रूप से भेजता है, वे उसी फ़ैमिली के हमारे सबसे नए Claude पर जाती हैं।",
    browse: "कीमत और फ़िल्टर के साथ हर मॉडल देखें",
    rates: {
      tiers:
        "जब pricing.tiers मौजूद हो, तो मैच करने वाले tier में वही क्रेडिट फ़ील्ड इस्तेमाल करें। min_prompt_tokens में threshold शामिल है। utc_start और utc_end HHMM फ़ॉर्मेट में UTC समय हैं, start शामिल और end शामिल नहीं।",
      title: "चैट टोकन की कीमत",
      unit: "pricing एक्सटेंशन base context tier पर प्रति मिलियन टोकन ग्राहक क्रेडिट दिखाता है, markup सहित। इस ऑब्जेक्ट का कोई भी फ़ील्ड USD में नहीं है। null वैल्यू का मतलब है कि अलग रेट नहीं दिया गया।",
      input: "बिना cache वाला input।",
      output: "जनरेट हुआ टेक्स्ट output।",
      read: "प्रॉम्प्ट cache से पढ़ा गया input।",
      write: "डिफ़ॉल्ट lifetime पर प्रॉम्प्ट cache में लिखा गया input।",
      hour: "एक घंटे की cache lifetime के साथ लिखा गया input।",
    },
    media: {
      title: "उसी लिस्ट में मीडिया मॉडल",
      body: "इमेज, वीडियो, म्यूज़िक, वॉइस और ट्रांसक्रिप्शन मॉडल उसी लिस्ट में हैं। हर एंट्री बताती है कि वह क्या करती है और उसे कहाँ कॉल करना है।",
      filename: "मीडिया एंट्री",
      points: {
        modality:
          "modality है chat, image, video, music, speech या transcription। endpoints उन पाथ की लिस्ट है जो वह मॉडल लेते हैं।",
        pricing:
          "मीडिया की कीमत प्रति यूनिट है: `credits_per_image`, `credits_per_second` (वीडियो), `credits_per_clip` (म्यूज़िक), `credits_per_1k_characters` (वॉइस), `credits_per_minute` (ट्रांसक्रिप्शन)।",
        anthropic:
          "Anthropic क्लाइंट (`anthropic-version` हेडर) को सिर्फ़ चैट मॉडल मिलते हैं। जिन मॉडल का प्रोवाइडर हमारी तरफ़ सेट नहीं है, वे लिस्ट में नहीं आते और 404 `model_not_found` लौटाते हैं।",
      },
    },
  },
  chat: {
    title: "Chat completions",
    intro:
      "स्टैंडर्ड OpenAI chat completions। मैसेज अंदर, एक assistant मैसेज बाहर। टेक्स्ट और इमेज input (`image_url` https URL या base64 data URL के रूप में)।",
    nonStream: {
      title: "बिना स्ट्रीमिंग",
      body: "डिफ़ॉल्ट यही है। मॉडल का काम पूरा होने पर आपको एक JSON body मिलती है। `usage.credits_charged` बताता है कि इस कॉल की कीमत कितनी रही।",
    },
    stream: {
      title: "स्ट्रीमिंग",
      body: "OpenAI chunk फ़ॉर्मेट में server-sent events के लिए `stream: true` सेट करें, आखिर में `data: [DONE]` आता है। टोकन गिनती और `credits_charged` वाला आखिरी chunk पाने के लिए `stream_options.include_usage` जोड़ें। कनेक्शन बंद करते ही जनरेशन रुक जाता है। आप सिर्फ़ उतने का पेमेंट करते हैं जितना चला।",
    },
    paramsTitle: "रिक्वेस्ट फ़ील्ड",
    paramsColumns: { field: "फ़ील्ड", description: "यह क्या करता है" },
    params: {
      model: "ज़रूरी। `GET /v1/models` से एक मॉडल id।",
      messages:
        "ज़रूरी। system, developer, user, assistant और tool मैसेज। User content एक string या टेक्स्ट और `image_url` पार्ट्स हो सकता है।",
      stream: "server-sent events के लिए true। डिफ़ॉल्ट false।",
      streamOptions: "`{ include_usage: true }` एक आखिरी usage chunk जोड़ता है।",
      maxTokens:
        "जनरेट होने वाले टोकन की ऊपरी सीमा। `max_completion_tokens` को प्राथमिकता मिलती है। ज़्यादा से ज़्यादा {{maxTokens}}।",
      temperature: "0 से 2। जो मॉडल इसे सपोर्ट नहीं करते, वे इसे अनदेखा करते हैं।",
      topP: "0 से 1।",
      stop: "एक stop string या उनकी लिस्ट।",
      n: "सिर्फ़ 1 सपोर्टेड है। बाकी वैल्यू पर 400 मिलता है।",
      tools: "फ़ंक्शन टूल जिन्हें मॉडल कॉल कर सकता है। टूल कॉलिंग देखें।",
      toolChoice: "none, auto, required, या एक नाम वाला फ़ंक्शन।",
    },
  },
  tools: {
    title: "टूल कॉलिंग",
    intro:
      "फ़ंक्शन कॉलिंग OpenAI की तरह काम करती है। आप फ़ंक्शन बताते हैं, मॉडल तय करता है कि किसे कॉल करना है, आप उसे चलाते हैं और रिज़ल्ट वापस भेजते हैं। हम आपके टूल कभी नहीं चलाते।",
    flow: {
      title: "लूप",
      step1: "अपने मैसेज के साथ tools भेजें।",
      step2:
        "मॉडल `tool_calls` और `finish_reason: tool_calls` के साथ जवाब देता है। हर कॉल में एक id, फ़ंक्शन का नाम और JSON-string arguments होते हैं।",
      step3:
        "फ़ंक्शन खुद चलाएँ। assistant मैसेज जोड़ें, फिर हर कॉल के लिए उसके `tool_call_id` के साथ एक tool मैसेज।",
      step4: "फिर से कॉल करें। मॉडल रिज़ल्ट इस्तेमाल करके जवाब देता है।",
    },
    requestTitle: "1. tools के साथ रिक्वेस्ट",
    responseTitle: "2. मॉडल एक कॉल मांगता है",
    followUpTitle: "3. रिज़ल्ट लौटाएँ",
    sdkTitle: "Python SDK के साथ वही लूप",
    streamingTitle: "स्ट्रीमिंग टूल कॉल",
    streamingBody:
      "`stream: true` के साथ, कॉल `delta.tool_calls` chunks में index के हिसाब से आती हैं। किसी index का पहला chunk id और `function.name` लाता है। बाद के chunks `function.arguments` में जुड़ते जाते हैं। उन्हें जोड़ें, फिर `finish_reason` के `tool_calls` होने पर JSON पार्स करें। हर OpenAI SDK यह आपके लिए करता है।",
    rules: {
      title: "नियम",
      support:
        "मॉडल को tools सपोर्ट करने चाहिए: `GET /v1/models` में `supports_tools` देखें। बाकी पर 400 `tools_not_supported` मिलता है।",
      choice:
        "`tool_choice` के none, auto और required OpenAI की तरह काम करते हैं। tools में न मौजूद फ़ंक्शन का नाम देने पर 400 मिलता है।",
      names: "फ़ंक्शन के नाम: अक्षर, अंक, underscore, dash, ज़्यादा से ज़्यादा 64 कैरेक्टर।",
      billing:
        "टूल की परिभाषाएँ और टूल रिज़ल्ट input टोकन हैं। कॉल output टोकन हैं। इनकी बिलिंग बाकी टोकन की तरह ही होती है।",
    },
  },
  billing: {
    title: "क्रेडिट और बिलिंग",
    intro:
      "API उन्हीं क्रेडिट से चलता है जिनसे चैट ऐप, और बिलिंग के नियम भी वही हैं। एक बैलेंस, एक बिल।",
    points: {
      price:
        "लिस्टेड कीमत का अंदाज़ा लगाने के लिए हर टोकन गिनती को उसके प्रति मिलियन क्रेडिट रेट से गुणा करें। हर input टोकन को एक बार गिनें: uncached, read या written।",
      usage:
        "हर रिस्पॉन्स `usage.credits_charged` बताता है। आपका बैलेंस ऐप में क्रेडिट सेक्शन में है।",
      preflight:
        "कॉल चलने से पहले हम सबसे ज़्यादा संभावित खर्च के हिसाब से आपका बैलेंस चेक करते हैं। कम पड़े तो HTTP 402 `insufficient_credits`, कुछ नहीं चलता, कुछ चार्ज नहीं होता।",
      real: "जब प्रोवाइडर चार्ज बताता है, तो बिलिंग उस चार्ज और markup से होती है। वरना लागू टोकन रेट से। आखिरी राउंड किया हुआ चार्ज usage.credits_charged में है।",
      media:
        "मीडिया कॉल की बिलिंग भी ऐसे ही होती है: जहाँ प्रोवाइडर बताता है वहाँ असली लागत और हमारा markup, वरना मॉडल की लिस्टेड कीमत। इमेज प्रति इमेज, वॉइस प्रति कैरेक्टर, ट्रांसक्रिप्शन प्रति सेकंड ऑडियो, वीडियो क्लिप तैयार होने पर, म्यूज़िक प्रति क्लिप।",
      topup:
        "क्रेडिट खत्म? पैक से टॉप अप करें, प्लान रिन्यू या अपग्रेड करें। अगली कॉल तुरंत चलेगी।",
    },
  },
  limits: {
    title: "रेट लिमिट",
    body: "पेमेंट करने वाले अकाउंट पर कोई फ़िक्स्ड रेट लिमिट नहीं। हर रिक्वेस्ट आपके क्रेडिट से बिल होती है, और क्रेडिट खत्म होने पर कॉल HTTP 402 के साथ रुक जाती हैं। खुली छूट वाली abuse सुरक्षा लागू है (ऊँची burst सीमा और एक साथ चलने वाली स्ट्रीम की सीमा), ताकि बेकाबू लूप सर्विस को ओवरलोड न कर सकें। ऊपर के प्रोवाइडर के 429 उनके `Retry-After` हेडर के साथ आगे आते हैं। HTTP 429 मिले तो `Retry-After` सेकंड रुकें और फिर कोशिश करें।",
  },
  errors: {
    title: "एरर और रेट लिमिट",
    intro:
      "एरर OpenAI वाले ढाँचे में आते हैं, इसलिए SDK अपनी सामान्य exceptions देते हैं। मैसेज पर नहीं, `error.code` पर ब्रांच करें।",
    shapeTitle: "एरर body",
    shapeOpenAi: "OpenAI फ़ॉर्मेट",
    shapeAnthropic: "Anthropic फ़ॉर्मेट",
    codesTitle: "एरर कोड",
    columns: { status: "HTTP", code: "code", meaning: "मतलब" },
    rows: {
      missingKey:
        "कोई key नहीं भेजी गई। `Authorization: Bearer sk-unb-...` या `x-api-key` भेजें।",
      invalidKey: "Key गलत है या रद्द हो चुकी है।",
      paid: "अकाउंट पर अभी कोई खरीदारी नहीं हुई। कोई भी प्लान इसे अनलॉक करता है।",
      credits: "इस कॉल के लिए बैलेंस कम है। टॉप अप करें।",
      cap: "पेड बैलेंस खाली है और आज की फ़्री क्रेडिट सीमा पूरी हो चुकी है। टॉप अप करें।",
      notFound: "मॉडल मौजूद नहीं है या आपके लिए उपलब्ध नहीं है।",
      invalid: "गलत रिक्वेस्ट: अनसपोर्टेड पैरामीटर, गलत `tool_choice`, गलत इमेज URL।",
      contentPolicy:
        "मीडिया प्रोवाइडर ने प्रॉम्प्ट मना कर दिया। कुछ चार्ज नहीं हुआ। प्रॉम्प्ट बदलें या दूसरा मॉडल चुनें।",
      consent:
        "अनसेंसर्ड मॉडल के लिए आपके अकाउंट पर एक बार 18+ कन्फ़र्मेशन चाहिए। API keys पेज पर एक बार कन्फ़र्म करें, फिर दोबारा कोशिश करें।",
      rate: "Abuse सुरक्षा चालू हुई (burst या एक साथ कई स्ट्रीम) या ऊपर के प्रोवाइडर से 429। `Retry-After` पढ़ें और फिर कोशिश करें।",
      upstream:
        "मॉडल प्रोवाइडर फ़ेल हुआ। फिर से कोशिश करना सुरक्षित है। स्ट्रीम एक error event के साथ खत्म होती हैं।",
      balance: "हम आपका बैलेंस नहीं पढ़ पाए, इसलिए कुछ नहीं चला। फिर कोशिश करें।",
    },
    streamNote:
      "स्ट्रीम के बीच में होने वाले एरर उसी error ऑब्जेक्ट के साथ एक `data:` event के रूप में आते हैं, उसके बाद `data: [DONE]`।",
  },
  responses: {
    title: "Responses API",
    intro:
      "OpenAI Responses API, वह फ़ॉर्मेट जो Codex CLI बोलता है। chat completions वाले ही मॉडल, key, क्रेडिट और रेट लिमिट।",
    request: {
      title: "रिक्वेस्ट",
      body: "input एक string या input items की लिस्ट है। instructions सिस्टम प्रॉम्प्ट है। जवाब output items के रूप में आता है। हर OpenAI SDK आपको `output_text` भी देता है।",
    },
    stream: {
      title: "स्ट्रीमिंग",
      body: "Responses event stream के लिए `stream: true` सेट करें: `response.created`, टेक्स्ट deltas, फिर usage के साथ `response.completed`।",
    },
    points: {
      tools:
        "Tools: function, custom और `local_shell`। मॉडल की कॉल output items के रूप में लौटती हैं। हर रिज़ल्ट को उसी `call_id` के साथ `function_call_output` item के रूप में वापस भेजें।",
      reasoning: "Reasoning मॉडल जवाब के साथ reasoning items भी लौटाते हैं।",
      billing:
        "बिलिंग, मॉडल ids, एरर और रेट लिमिट बिल्कुल chat completions की तरह काम करते हैं।",
    },
  },
  messages: {
    title: "Messages API",
    intro:
      "Anthropic Messages API, वह फ़ॉर्मेट जो Claude Code और Anthropic SDK बोलते हैं। base URL बिना `/v1` के इस्तेमाल करें: क्लाइंट `/v1/messages` खुद जोड़ते हैं।",
    request: {
      title: "रिक्वेस्ट",
      body: "स्टैंडर्ड Messages रिक्वेस्ट: model, `max_tokens`, system, messages। टेक्स्ट और इमेज blocks अंदर, टेक्स्ट और `tool_use` blocks बाहर।",
    },
    stream: {
      title: "स्ट्रीमिंग",
      body: "Anthropic server-sent events के लिए `stream: true` सेट करें, `message_start` से `message_stop` तक।",
    },
    points: {
      auth: "Auth: `x-api-key` या `Authorization: Bearer`। दोनों आपकी sk-unb key लेते हैं।",
      models:
        "Model: `GET /v1/models` से कोई भी id। Claude Code जो Anthropic ids डिफ़ॉल्ट रूप से भेजता है, जैसे `claude-sonnet-4-5-20250929`, वे हमारे मिलते-जुलते Claude मॉडल पर जाती हैं।",
      tools:
        "Tools: `tool_use` blocks बाहर, `tool_result` blocks वापस, Anthropic API की तरह।",
      billing: "बाकी हर endpoint जैसे ही क्रेडिट, वही कीमत, वही रेट लिमिट।",
    },
    countTokens: {
      title: "टोकन गिनें",
      body: "`POST /v1/messages/count_tokens` मॉडल चलाए बिना किसी Messages रिक्वेस्ट के input टोकन गिनता है। Claude Code अपना context संभालने के लिए इसे कॉल करता है।",
    },
  },
  images: {
    title: "इमेज",
    intro:
      "OpenAI images फ़ॉर्मेट। `GET /v1/models` से modality image वाला कोई भी मॉडल। हर OpenAI SDK के images क्लाइंट के साथ चलता है।",
    generate: {
      title: "जनरेट करें",
      body: "इन फ़ील्ड के साथ JSON भेजें। जवाब में हर इमेज का एक url आता है।",
    },
    params: {
      model: "ज़रूरी। `GET /v1/models` से modality `image` वाली कोई भी id।",
      prompt: "ज़रूरी। क्या बनाना है, ज़्यादा से ज़्यादा 2000 कैरेक्टर।",
      n: "हर कॉल में इमेज, 1 से {{maxImages}}। हर इमेज बिल होती है।",
      size: "`WIDTHxHEIGHT` जैसे `1024x1024`, या `auto`। मॉडल जो साइज़ बनाता है, उसमें सबसे करीबी हम चुनते हैं।",
      aspectRatio:
        "हमारा एक्सटेंशन: `1:1 | 16:9 | 9:16 | 4:3 | 3:4 | 3:2 | 2:3 | 21:9`। size पर भारी पड़ता है।",
      quality:
        "`standard | hd | low | medium | high | auto`। जहाँ मॉडल में detailed tier है, वहाँ `hd` और `high` उसे मांगते हैं।",
      responseFormat:
        "`url` (डिफ़ॉल्ट, 7 दिन चलने वाला साइन किया हुआ लिंक) या `b64_json`।",
    },
    edit: {
      title: "इमेज एडिट करें",
      body: "एक input इमेज और एक प्रॉम्प्ट। इसे multipart फ़ील्ड image के रूप में अपलोड करें, या JSON में `image_url` (https या base64 data URL) भेजें। मॉडल को इमेज input लेना चाहिए: `input_modalities` में image हो। Masks सपोर्टेड नहीं हैं; बदलाव प्रॉम्प्ट में बताएँ।",
    },
    points: {
      size: "मॉडल जो साइज़ और ratio बनाता है, उसमें सबसे करीबी हम चुनते हैं।",
      format:
        "url सेव की गई फ़ाइल का साइन किया हुआ लिंक है, बिना key के 7 दिन चलता है। `b64_json` bytes सीधे लौटाता है।",
      billing:
        "प्रति इमेज बिल होता है। रिस्पॉन्स में `credits_charged` बताता है कि कॉल की कीमत कितनी रही।",
    },
  },
  speech: {
    title: "टेक्स्ट से वॉइस",
    intro:
      "टेक्स्ट अंदर, ऑडियो bytes बाहर। model `GET /v1/models` से एक वॉइस id है (modality speech), जैसे `openai-nova`। OpenAI स्टाइल भी चलता है: model `tts-1` और voice nova।",
    points: {
      voices:
        "input ज़्यादा से ज़्यादा {{maxChars}} कैरेक्टर। OpenAI, NanoGPT और ElevenLabs वॉइस पर speed 0.25 से 4।",
      formats:
        "`response_format` mp3 (डिफ़ॉल्ट), opus, aac, flac, wav या pcm। कौन से फ़ॉर्मेट मिलेंगे, यह वॉइस के प्रोवाइडर पर निर्भर है; बाकी पर लिस्ट के साथ 400 मिलता है।",
      billing:
        "प्रति कैरेक्टर बिल होता है। `X-Credits-Charged` हेडर बताता है कि कॉल की कीमत कितनी रही।",
    },
  },
  transcriptions: {
    title: "ट्रांसक्रिप्शन",
    intro:
      "वॉइस से टेक्स्ट, OpenAI Whisper फ़ॉर्मेट। Multipart अपलोड, वही SDK कॉल जो आप पहले से इस्तेमाल करते हैं।",
    transcribe: {
      title: "ट्रांसक्राइब करें",
      body: "file ज़्यादा से ज़्यादा {{maxMb}} MB (mp3, mp4, m4a, wav, webm, ogg, flac), model जैसे `whisper-1`, language वैकल्पिक। `response_format` json, text, srt, `verbose_json` या vtt।",
    },
    translate: {
      title: "अंग्रेज़ी में ट्रांसलेट करें",
      body: "`POST /v1/audio/translations`: कोई भी बोली गई भाषा अंदर, अंग्रेज़ी टेक्स्ट बाहर। `whisper-1` पर चलता है। transcriptions वाले ही फ़ॉर्मेट।",
    },
    points: {
      billing: "प्रति सेकंड ऑडियो बिल होता है।",
    },
  },
  videos: {
    title: "वीडियो",
    intro:
      "Async, OpenAI के video API के ढाँचे में। कॉल तुरंत एक जॉब के साथ जवाब देती है। उसे poll करें, फिर MP4 डाउनलोड करें।",
    create: {
      title: "जॉब शुरू करें",
      body: "model, prompt, seconds, size या `aspect_ratio`, resolution, `negative_prompt`। जवाब status queued वाला एक video ऑब्जेक्ट है।",
    },
    poll: {
      title: "Poll और डाउनलोड",
      body: "`GET /v1/videos/{id}` status (queued, `in_progress`, completed, failed), progress और पूरा होने पर एक साइन किया हुआ url लौटाता है। Polling फ़्री है और abuse लिमिट से बाहर है। `GET /v1/videos/{id}/content` MP4 स्ट्रीम करता है।",
    },
    points: {
      image:
        "इमेज से वीडियो: JSON में `image_url` या multipart अपलोड में `input_reference` भेजें। यह पहला फ़्रेम बनता है।",
      billing:
        "वीडियो तैयार होने पर, प्रति सेकंड वीडियो बिल होता है। `credits_charged` कीमत दिखाता है।",
      failed: "फ़ेल हुए जॉब का कोई पैसा नहीं लगता। error वजह बताता है।",
    },
  },
  music: {
    title: "म्यूज़िक",
    intro:
      "वीडियो की तरह async। जॉब शुरू करें, `GET /v1/music/{id}` poll करें, `GET /v1/music/{id}/content` डाउनलोड करें।",
    startTitle: "जॉब शुरू करें",
    pollTitle: "Poll और डाउनलोड",
    points: {
      seconds:
        "seconds: लगभग 8, 20 या 30। मॉडल इसे राउंड कर सकता है। स्टाइल, मूड, इंस्ट्रूमेंट और टेम्पो prompt में बताएँ।",
      billing:
        "क्लिप तैयार होने पर प्रति क्लिप बिल होता है। फ़ेल हुए जॉब का कोई पैसा नहीं लगता।",
    },
  },
  mediaFiles: {
    title: "मीडिया फ़ाइलें",
    intro:
      "मीडिया रिस्पॉन्स का हर url यहीं पॉइंट करता है। साइन किया हुआ लिंक बिना key के 7 दिन चलता है, तो आप इसे ब्राउज़र या किसी यूज़र को दे सकते हैं। आपकी API key के साथ वही पाथ कभी भी चलता है।",
  },
  codingTools: {
    title: "कोडिंग टूल",
    intro:
      "एक base URL, एक key। Codex CLI और Claude Code सीधे कनेक्ट होते हैं। OpenCode, Continue, Aider और Cline chat completions इस्तेमाल करते हैं। अपना टूल चुनें, ब्लॉक कॉपी करें, चलाएँ।",
    keyPage: "API keys पेज पर यही ब्लॉक आपकी key भरी हुई हालत में दिखते हैं।",
    keyPageCta: "अपनी key के साथ पाएँ",
    guide: "कोडिंग टूल गाइड पढ़ें",
  },
  sdks: {
    title: "SDK उदाहरण",
    intro:
      "आधिकारिक OpenAI और Anthropic SDK बिना बदलाव के चलते हैं। base URL और key सेट करें, बाकी कोड वैसा ही रखें।",
    chat: "चैट",
    stream: "स्ट्रीमिंग",
    responses: "Responses API",
    anthropic: "Anthropic SDK",
    images: "इमेज",
    speech: "वॉइस",
    transcription: "ट्रांसक्रिप्शन",
  },
  guides: {
    title: "गाइड",
    intro:
      "लंबी गाइड: OpenAI या OpenRouter से स्विच करना, API पर अनसेंसर्ड मॉडल, और अपनी key को कोडिंग टूल से जोड़ना।",
  },
  cta: {
    title: "हर मॉडल पर बनाएँ।",
    subtitle: "Key बनाएँ, अपना SDK यहाँ पॉइंट करें, शिप करें।",
    button: "API key बनाएँ",
    secondary: "प्लान की तुलना करें",
  },
};
