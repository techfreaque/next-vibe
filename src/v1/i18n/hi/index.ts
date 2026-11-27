import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  promptCache: {
    label: "प्रॉम्प्ट कैश",
    description: "साझा प्रॉम्प्ट प्रीफ़िक्स को कैश करें और चाहें तो उसकी अवधि तय करें।",
  },
  category: "AI",

  tags: {
    api: "OpenAI-कम्पैटिबल API",
  },

  openai: {
    missingKey:
      "API key नहीं मिली। उसे 'Authorization: Bearer <key>' या 'x-api-key: <key>' के रूप में भेजें। key Settings > API keys में बनाएँ।",
    invalidKey:
      "API key गलत है या रद्द हो चुकी है। key जाँचें या Settings > API keys में नई बनाएँ।",
    authUnavailable:
      "अभी आपकी API key की जाँच नहीं हो सकी। आपकी key रिजेक्ट नहीं हुई। {{seconds}} सेकंड में दोबारा कोशिश करें।",
    modelNotFound:
      "मॉडल '{{model}}' मौजूद नहीं है या आपके लिए उपलब्ध नहीं है। अपने मॉडल GET /v1/models से देखें।",
    paidRequired:
      "API के लिए पेड अकाउंट चाहिए: कोई भी प्लान, {{subPrice}} महीने से। {{url}} पर जोड़ें।",
    toolsUnsupportedByModel:
      "ये मॉडल टूल कॉलिंग सपोर्ट नहीं करता। टूल सपोर्ट वाला मॉडल चुनें या 'tools' हटा दें।",
    badToolArguments: "टूल कॉल '{{name}}' के आर्गुमेंट वैध JSON नहीं हैं।",
    toolChoiceUnknown: "tool_choice '{{name}}' बताता है, जो 'tools' में नहीं है।",
    toolMessageNeedsId: "टूल मैसेज {{param}} को tool_call_id चाहिए।",
    nUnsupported: "सिर्फ़ n=1 सपोर्टेड है।",
    badImageUrl: "image_url एक http(s) URL या base64 data: URL होना चाहिए।",
    insufficientCredits:
      "क्रेडिट कम हैं। इस कॉल में लगभग {{cost}} लगेंगे, आपके पास {{balance}} है। जारी रखने के लिए टॉप अप करें।",
    rateLimited:
      "इस key पर थोड़े समय में बहुत ज़्यादा रिक्वेस्ट आईं। {{seconds}} सेकंड में दोबारा कोशिश करें।",
    tooManyStreams:
      "इस key पर बहुत ज़्यादा कंकरेंट स्ट्रीम खुली हैं (सीमा {{limit}})। कोई एक्टिव स्ट्रीम बंद करें या {{seconds}} सेकंड में दोबारा कोशिश करें।",
    upstreamRateLimited:
      "मॉडल प्रोवाइडर अभी अस्थायी रूप से रिक्वेस्ट सीमित कर रहा है: {{error}}",
    upstreamFailed: "मॉडल प्रोवाइडर फ़ेल हुआ: {{error}}",
    balanceCheckFailed:
      "आपका क्रेडिट बैलेंस जाँचा नहीं जा सका। कुछ नहीं चला। दोबारा कोशिश करें।",
  },

  models: {
    get: {
      title: "OpenAI-कम्पैटिबल मॉडल",
      titleShort: "v1 मॉडल",
      description:
        "वो मॉडल दिखाएँ जिन्हें आपकी API key कॉल कर सकती है। OpenAI लिस्ट फ़ॉर्मेट। Authorization: Bearer <key> से ऑथेंटिकेट करें।",
      response: { object: "ऑब्जेक्ट टाइप" },
      success: {
        title: "लिस्ट किए मॉडल",
        description: "इस API key के लिए उपलब्ध मॉडल",
      },
    },
  },

  completions: {
    post: {
      title: "OpenAI-कम्पैटिबल चैट कम्प्लीशन",
      titleShort: "v1 चैट कम्प्लीशन",
      description:
        "OpenAI चैट कम्प्लीशन फ़ॉर्मेट से कोई भी मॉडल कॉल करें। बिल आपके क्रेडिट से चैट की कीमतों पर बनता है। stream: true सपोर्टेड है।",
      fields: {
        model: {
          label: "मॉडल",
          description: "GET /v1/models से मॉडल ID",
        },
        messages: {
          label: "मैसेज",
          description: "OpenAI मैसेज ऐरे (system, user, assistant)",
        },
        stream: {
          label: "स्ट्रीम",
          description: "जवाब server-sent events के रूप में भेजें",
        },
        streamOptions: {
          label: "स्ट्रीम विकल्प",
          description: "{ include_usage: true } आख़िर में एक usage चंक जोड़ता है",
        },
        maxTokens: {
          label: "अधिकतम टोकन",
          description: "जनरेट होने वाले टोकन की ऊपरी सीमा",
        },
        maxCompletionTokens: {
          label: "अधिकतम कम्प्लीशन टोकन",
          description: "max_tokens जैसा ही; इसे प्राथमिकता मिलती है",
        },
        temperature: {
          label: "तापमान",
          description: "सैंपलिंग तापमान, 0 से 2",
        },
        topP: {
          label: "Top P",
          description: "न्यूक्लियस सैंपलिंग, 0 से 1",
        },
        stop: {
          label: "स्टॉप",
          description: "स्टॉप सीक्वेंस या उनकी लिस्ट",
        },
        n: {
          label: "विकल्प",
          description: "सिर्फ़ 1 सपोर्टेड है",
        },
        tools: {
          label: "टूल",
          description:
            "OpenAI फ़ंक्शन टूल जिन्हें मॉडल कॉल कर सकता है: [{type:'function', function:{name, description, parameters}}]",
        },
        toolChoice: {
          label: "टूल चुनाव",
          description:
            "none, auto, required, या {type:'function', function:{name}}",
        },
        parallelToolCalls: {
          label: "पैरेलल टूल कॉल",
          description: "कम्पैटिबिलिटी के लिए स्वीकार; फ़ैसला मॉडल करता है",
        },
      },
      response: { object: "ऑब्जेक्ट टाइप" },
      success: {
        title: "कम्प्लीशन बन गया",
        description: "मॉडल ने जवाब दिया",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id सपोर्टेड नहीं है: जवाब स्टोर नहीं होते। store: false के साथ पूरी बातचीत 'input' में भेजें (Codex CLI डिफ़ॉल्ट रूप से यही करता है)।",
    badInputItem:
      "{{param}} इस्तेमाल लायक नहीं है: इमेज http(s) या base64 data: URL होनी चाहिए और टूल आइटम को call_id चाहिए।",
    post: {
      title: "OpenAI Responses API",
      titleShort: "v1 रिस्पॉन्स",
      description:
        "OpenAI Responses फ़ॉर्मेट से कोई भी मॉडल कॉल करें, जो Codex CLI बोलता है। स्टेटलेस: पूरी बातचीत input में भेजें। स्ट्रीमिंग, function, custom और local_shell टूल, और रीज़निंग आइटम सपोर्टेड हैं।",
      fields: {
        model: { label: "मॉडल", description: "GET /v1/models से मॉडल ID" },
        input: {
          label: "इनपुट",
          description:
            "एक स्ट्रिंग, या Responses आइटम के रूप में बातचीत (message, function_call, function_call_output, reasoning, ...)",
        },
        instructions: {
          label: "निर्देश",
          description: "मॉडल के लिए सिस्टम निर्देश",
        },
        stream: {
          label: "स्ट्रीम",
          description: "जवाब Responses server-sent events के रूप में भेजें",
        },
        tools: {
          label: "टूल",
          description:
            "function, custom और local_shell टूल। होस्टेड टूल (web_search, ...) छोड़ दिए जाते हैं।",
        },
        toolChoice: {
          label: "टूल चुनाव",
          description: "none, auto, required, या {type:'function', name}",
        },
        parallelToolCalls: {
          label: "पैरेलल टूल कॉल",
          description: "कम्पैटिबिलिटी के लिए स्वीकार; फ़ैसला मॉडल करता है",
        },
        maxOutputTokens: {
          label: "अधिकतम आउटपुट टोकन",
          description: "जनरेट होने वाले टोकन की ऊपरी सीमा",
        },
        temperature: {
          label: "तापमान",
          description: "सैंपलिंग तापमान, 0 से 2",
        },
        topP: { label: "Top P", description: "न्यूक्लियस सैंपलिंग, 0 से 1" },
        reasoning: {
          label: "रीज़निंग",
          description:
            "कम्पैटिबिलिटी के लिए स्वीकार। रीज़निंग मॉडल दोनों तरह से रीज़निंग आइटम लौटाते हैं।",
        },
        text: {
          label: "टेक्स्ट फ़ॉर्मेट",
          description:
            "{format:{type:'json_schema', schema}} JSON आउटपुट माँगता है",
        },
        store: {
          label: "स्टोर",
          description: "जवाब कभी स्टोर नहीं होते; false भेजें",
        },
        previousResponseId: {
          label: "पिछले जवाब की ID",
          description: "सपोर्टेड नहीं: इसकी जगह पूरी बातचीत भेजें",
        },
        include: {
          label: "शामिल करें",
          description:
            "कम्पैटिबिलिटी के लिए स्वीकार। रीज़निंग आइटम रीप्ले के लिए हमेशा encrypted_content रखते हैं।",
        },
      },
      response: { object: "ऑब्जेक्ट टाइप" },
      success: {
        title: "रिस्पॉन्स बन गया",
        description: "मॉडल ने जवाब दिया",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} में ऐसा कंटेंट ब्लॉक है जो हम इस्तेमाल नहीं कर सकते: इमेज base64 या http(s) URL होनी चाहिए।",
    post: {
      title: "Anthropic Messages API",
      titleShort: "v1 मैसेज",
      description:
        "Anthropic Messages फ़ॉर्मेट से कोई भी मॉडल कॉल करें, जो Claude Code बोलता है। key को x-api-key या Authorization: Bearer के रूप में दें। स्ट्रीमिंग, टूल और थिंकिंग ब्लॉक सपोर्टेड हैं।",
      fields: {
        model: {
          label: "मॉडल",
          description:
            "GET /v1/models से मॉडल ID। claude-sonnet-4-5-20250929 जैसे Claude id हमारे मेल खाते Claude मॉडल से जुड़ते हैं।",
        },
        messages: {
          label: "मैसेज",
          description:
            "Anthropic मैसेज: text, image, tool_use, tool_result और thinking ब्लॉक के साथ user और assistant टर्न",
        },
        system: {
          label: "सिस्टम",
          description: "सिस्टम प्रॉम्प्ट: स्ट्रिंग या टेक्स्ट ब्लॉक",
        },
        maxTokens: {
          label: "अधिकतम टोकन",
          description: "जनरेट होने वाले टोकन की ऊपरी सीमा",
        },
        stream: {
          label: "स्ट्रीम",
          description: "जवाब Anthropic server-sent events के रूप में भेजें",
        },
        tools: {
          label: "टूल",
          description:
            "क्लाइंट टूल: [{name, description, input_schema}]। सर्वर टूल (web_search, ...) छोड़ दिए जाते हैं।",
        },
        toolChoice: {
          label: "टूल चुनाव",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "स्टॉप सीक्वेंस",
          description: "वो स्ट्रिंग जो जवाब ख़त्म करती हैं",
        },
        temperature: {
          label: "तापमान",
          description: "सैंपलिंग तापमान",
        },
        topP: { label: "Top P", description: "न्यूक्लियस सैंपलिंग, 0 से 1" },
        thinking: {
          label: "थिंकिंग",
          description:
            "कम्पैटिबिलिटी के लिए स्वीकार। रीज़निंग मॉडल दोनों तरह से थिंकिंग ब्लॉक लौटाते हैं।",
        },
      },
      response: { type: "ऑब्जेक्ट टाइप" },
      success: { title: "मैसेज बन गया", description: "मॉडल ने जवाब दिया" },
    },
  },

  countTokens: {
    post: {
      title: "Anthropic टोकन गिनती",
      titleShort: "v1 टोकन गिनती",
      description:
        "Anthropic Messages रिक्वेस्ट के इनपुट टोकन का अनुमान लगाएँ। कोई मॉडल कॉल नहीं, कोई क्रेडिट नहीं।",
      fields: {
        action: { label: "कार्रवाई", description: "हमेशा count_tokens" },
        model: { label: "मॉडल", description: "मॉडल ID" },
        messages: { label: "मैसेज", description: "Anthropic मैसेज" },
        system: { label: "सिस्टम", description: "सिस्टम प्रॉम्प्ट" },
        tools: { label: "टूल", description: "टूल डेफ़िनिशन" },
      },
      response: { inputTokens: "इनपुट टोकन" },
      success: {
        title: "गिने गए टोकन",
        description: "अनुमानित इनपुट टोकन",
      },
    },
  },

  media: {
    images: {
      generations: {
        title: "OpenAI-कम्पैटिबल इमेज जनरेशन",
        titleShort: "v1 इमेज",
        description:
          "GET /v1/models के किसी भी इमेज मॉडल से इमेज बनाएँ। OpenAI इमेज फ़ॉर्मेट: url (साइन किया हुआ, 7 दिन वैध) या b64_json। हर इमेज पर बिल।",
        success: {
          title: "इमेज बन गईं",
          description: "इमेज स्टोर होकर लिंक हो गई हैं",
        },
      },
      edits: {
        title: "OpenAI-कम्पैटिबल इमेज एडिट",
        titleShort: "v1 इमेज एडिट",
        description:
          "इमेज इनपुट लेने वाले मॉडल पर प्रॉम्प्ट से एक इमेज एडिट करें। उसे multipart 'image' के रूप में अपलोड करें या 'image_url' भेजें। हर इमेज पर बिल।",
        success: {
          title: "इमेज एडिट हो गई",
          description: "एडिट की इमेज स्टोर होकर लिंक हो गई है",
        },
      },
    },
    speech: {
      title: "OpenAI-कम्पैटिबल टेक्स्ट टू स्पीच",
      titleShort: "v1 स्पीच",
      description:
        "टेक्स्ट को स्पीच में बदलें। जवाब में ऑडियो बाइट मिलते हैं (डिफ़ॉल्ट mp3)। हर कैरेक्टर पर बिल।",
      success: { title: "स्पीच बन गई", description: "ऑडियो फ़ाइल" },
    },
    transcriptions: {
      title: "OpenAI-कम्पैटिबल ट्रांसक्रिप्शन",
      titleShort: "v1 ट्रांसक्रिप्शन",
      description:
        "ऑडियो फ़ाइल ट्रांसक्राइब करें (multipart 'file', 25 MB तक)। JSON, टेक्स्ट, SRT, WebVTT या सेगमेंट के साथ verbose JSON। ऑडियो के हर सेकंड पर बिल।",
      success: { title: "ऑडियो ट्रांसक्राइब हो गया", description: "ट्रांसक्रिप्ट" },
    },
    translations: {
      title: "OpenAI-कम्पैटिबल ऑडियो ट्रांसलेशन",
      titleShort: "v1 ट्रांसलेशन",
      description:
        "Whisper से ऑडियो फ़ाइल को सीधे अंग्रेज़ी टेक्स्ट में ट्रांसक्राइब करें। ट्रांसक्रिप्शन जैसे ही फ़ॉर्मेट और बिलिंग।",
      success: {
        title: "ऑडियो ट्रांसलेट हो गया",
        description: "अंग्रेज़ी ट्रांसक्रिप्ट",
      },
    },
    videos: {
      create: {
        title: "वीडियो जनरेशन (async)",
        titleShort: "v1 वीडियो",
        description:
          "OpenAI के वीडियो API की शक्ल में वीडियो जॉब शुरू करें। जॉब के साथ तुरंत जवाब मिलता है; GET /v1/videos/{id} से पोल करें, GET /v1/videos/{id}/content से डाउनलोड करें। वीडियो तैयार होने पर बिल।",
        success: { title: "वीडियो जॉब क्यू में", description: "id से पोल करें" },
      },
      get: {
        title: "वीडियो जॉब स्टेटस",
        titleShort: "v1 वीडियो स्टेटस",
        description:
          "वीडियो जॉब का स्टेटस, प्रोग्रेस और नतीजे का URL। पोलिंग फ़्री है और दुरुपयोग की सीमा में नहीं गिनी जाती।",
        success: { title: "वीडियो जॉब", description: "जॉब की मौजूदा स्थिति" },
      },
      content: {
        title: "वीडियो डाउनलोड",
        titleShort: "v1 वीडियो कंटेंट",
        description: "पूरी हुई जॉब की तैयार वीडियो फ़ाइल।",
        success: { title: "वीडियो फ़ाइल", description: "MP4 बाइट" },
      },
    },
    music: {
      create: {
        title: "म्यूज़िक जनरेशन (async)",
        titleShort: "v1 म्यूज़िक",
        description:
          "म्यूज़िक जॉब शुरू करें। जॉब के साथ तुरंत जवाब मिलता है; GET /v1/music/{id} से पोल करें, GET /v1/music/{id}/content से डाउनलोड करें। क्लिप तैयार होने पर हर क्लिप का बिल।",
        success: { title: "म्यूज़िक जॉब क्यू में", description: "id से पोल करें" },
      },
      get: {
        title: "म्यूज़िक जॉब स्टेटस",
        titleShort: "v1 म्यूज़िक स्टेटस",
        description:
          "म्यूज़िक जॉब का स्टेटस और नतीजे का URL। पोलिंग फ़्री है और दुरुपयोग की सीमा में नहीं गिनी जाती।",
        success: { title: "म्यूज़िक जॉब", description: "जॉब की मौजूदा स्थिति" },
      },
      content: {
        title: "म्यूज़िक डाउनलोड",
        titleShort: "v1 म्यूज़िक कंटेंट",
        description: "पूरी हुई म्यूज़िक जॉब की तैयार ऑडियो फ़ाइल।",
        success: { title: "म्यूज़िक फ़ाइल", description: "ऑडियो बाइट" },
      },
    },
    file: {
      title: "मीडिया फ़ाइल डाउनलोड",
      titleShort: "v1 मीडिया फ़ाइल",
      description:
        "मीडिया कॉल से बनी फ़ाइल डाउनलोड करें। साइन किया URL 7 दिन तक बिना key के चलता है; आपकी API key कभी भी चलती है।",
      success: { title: "फ़ाइल", description: "फ़ाइल बाइट" },
    },
    fields: {
      model: {
        label: "मॉडल",
        imageDescription: "GET /v1/models से इमेज मॉडल ID (modality: image)",
        speechDescription:
          "GET /v1/models से वॉइस ID (modality: speech), जैसे openai-nova। या tts-1 के साथ वॉइस।",
        transcriptionDescription:
          "GET /v1/models से ट्रांसक्रिप्शन मॉडल ID (modality: transcription)। whisper-1 चलता है।",
        translationDescription:
          "OpenAI का Whisper मॉडल: whisper-1 या openai-whisper",
        videoDescription: "GET /v1/models से वीडियो मॉडल ID (modality: video)",
        musicDescription: "GET /v1/models से म्यूज़िक मॉडल ID (modality: music)",
      },
      prompt: {
        label: "प्रॉम्प्ट",
        imageDescription: "क्या बनाना है, 2000 कैरेक्टर तक",
        editDescription: "इमेज में क्या बदलना है",
        transcriptionDescription:
          "कम्पैटिबिलिटी के लिए स्वीकार; हर प्रोवाइडर को नहीं भेजा जाता",
        videoDescription: "क्लिप में क्या होता है, 2000 कैरेक्टर तक",
        musicDescription: "स्टाइल, मूड, वाद्य, टेम्पो",
      },
      n: {
        label: "इमेज",
        description: "कितनी इमेज, 1 से 4। हर एक का बिल बनता है।",
      },
      size: {
        label: "साइज़",
        imageDescription:
          "WIDTHxHEIGHT जैसे 1024x1024 या 1536x1024, या auto। मॉडल के सपोर्टेड सबसे नज़दीकी साइज़ और अनुपात को चुनता है।",
        videoDescription:
          "WIDTHxHEIGHT जैसे 1280x720। आस्पेक्ट रेशियो तय करता है और जहाँ मॉडल देता है, रेज़ोल्यूशन भी।",
      },
      aspectRatio: {
        label: "आस्पेक्ट रेशियो",
        imageDescription:
          "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 या 21:9। size पर भारी।",
        videoDescription:
          "16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9 या 9:21। size पर भारी।",
      },
      quality: {
        label: "क्वालिटी",
        description:
          "standard, hd, low, medium, high या auto। जहाँ मॉडल में विस्तृत टियर है, वहाँ hd और high उसी को माँगते हैं।",
      },
      style: {
        label: "स्टाइल",
        description: "कम्पैटिबिलिटी के लिए स्वीकार। स्टाइल प्रॉम्प्ट में लिखें।",
      },
      responseFormat: {
        label: "रिस्पॉन्स फ़ॉर्मेट",
        imageDescription: "url (डिफ़ॉल्ट, 7 दिन वैध साइन किया लिंक) या b64_json",
        speechDescription:
          "mp3 (डिफ़ॉल्ट), opus, aac, flac, wav या pcm। कोई वॉइस कौन से दे सकती है, ये उसके प्रोवाइडर पर निर्भर है।",
        transcriptionDescription:
          "json (डिफ़ॉल्ट), text, srt, verbose_json या vtt",
      },
      user: {
        label: "यूज़र",
        description: "आपके एंड-यूज़र की ID। कम्पैटिबिलिटी के लिए स्वीकार।",
      },
      image: {
        label: "इमेज",
        description: "एडिट करने वाली इमेज, multipart फ़ाइल अपलोड के रूप में",
      },
      imageUrl: {
        label: "इमेज URL",
        description:
          "JSON रिक्वेस्ट के लिए एडिट करने वाली इमेज, http(s) URL या base64 data: URL के रूप में",
        videoDescription:
          "पहला फ़्रेम http(s) URL या base64 data: URL के रूप में (image-to-video)",
      },
      mask: {
        label: "मास्क",
        description: "सपोर्टेड नहीं। बदलाव प्रॉम्प्ट में बताएँ।",
      },
      input: {
        label: "इनपुट",
        description: "बोलने वाला टेक्स्ट, 4096 कैरेक्टर तक",
      },
      voice: {
        label: "वॉइस",
        description:
          "OpenAI मॉडल नाम (tts-1) के साथ: alloy, nova, onyx, echo, shimmer या fable। या GET /v1/models से कोई भी वॉइस ID।",
      },
      speed: {
        label: "स्पीड",
        description: "0.25 से 4.0। OpenAI, NanoGPT और ElevenLabs वॉइस पर लागू।",
      },
      instructions: {
        label: "निर्देश",
        description:
          "कम्पैटिबिलिटी के लिए स्वीकार; वॉइस इनपुट को जैसा लिखा है वैसा पढ़ती हैं",
      },
      file: {
        label: "फ़ाइल",
        description:
          "ऑडियो फ़ाइल: mp3, mp4, m4a, wav, webm, ogg या flac, 25 MB तक",
      },
      language: {
        label: "भाषा",
        description:
          "बोली जाने वाली भाषा का ISO-639-1 कोड, जैसे en या de। डिफ़ॉल्ट: URL की लोकेल।",
      },
      temperature: {
        label: "तापमान",
        description: "कम्पैटिबिलिटी के लिए स्वीकार",
      },
      seconds: {
        label: "सेकंड",
        videoDescription: "क्लिप की लंबाई। मॉडल जो लंबाई देता है, उस पर स्नैप होती है।",
        musicDescription:
          "चाही गई लंबाई: लगभग 8, 20 या 30 सेकंड। मॉडल उसे राउंड कर सकता है।",
      },
      resolution: {
        label: "रेज़ोल्यूशन",
        description: "जैसे 720p या 1080p, जहाँ मॉडल विकल्प देता है",
      },
      negativePrompt: {
        label: "नेगेटिव प्रॉम्प्ट",
        description: "क्लिप से क्या बाहर रखना है, जहाँ मॉडल सपोर्ट करता है",
      },
      inputReference: {
        label: "इनपुट रेफ़रेंस",
        description: "पहला फ़्रेम multipart इमेज अपलोड के रूप में (image-to-video)",
      },
      jobId: { label: "जॉब ID", description: "वो id जो POST ने लौटाई" },
      threadId: { label: "फ़ोल्डर", description: "फ़ाइल का स्टोरेज फ़ोल्डर" },
      filename: { label: "फ़ाइल का नाम", description: "स्टोर की गई फ़ाइल का नाम" },
      expires: {
        label: "एक्सपायर होता है",
        description: "Unix समय जब साइन किया लिंक काम करना बंद करता है",
      },
      sig: { label: "सिग्नेचर", description: "लिंक का सिग्नेचर" },
    },
    response: {
      created: "बनाया गया",
      object: "ऑब्जेक्ट टाइप",
      text: "टेक्स्ट",
      id: "जॉब ID",
      status: "स्टेटस",
    },
    errors: {
      badSize: "साइज़ '{{size}}' WIDTHxHEIGHT (जैसे 1024x1024) या auto नहीं है।",
      maskUnsupported: "मास्क सपोर्टेड नहीं हैं। बदलाव प्रॉम्प्ट में बताएँ।",
      oneImageOnly: "हर एडिट में एक इमेज। एक 'image' भेजें।",
      imageTooLarge: "इमेज {{max}} MB से बड़ी है।",
      imageRequired:
        "एडिट करने वाली इमेज भेजें: multipart फ़ील्ड 'image', या JSON में 'image_url'।",
      modelCannotEdit:
        "{{model}} इनपुट इमेज नहीं लेता। GET /v1/models से कोई image-to-image मॉडल चुनें (input_modalities में image हो)।",
      storageFailed: "फ़ाइल बन गई पर स्टोर नहीं हो सकी। दोबारा कोशिश करें।",
      voiceNotFound:
        "आपके लिए कोई वॉइस '{{voice}}' उपलब्ध नहीं। GET /v1/models (modality: speech) से वॉइस देखें, या मॉडल tts-1 के साथ वॉइस nova इस्तेमाल करें।",
      formatUnsupported:
        "{{voice}} {{supported}} देती है। response_format के लिए उनमें से कोई माँगें।",
      audioTooLarge: "ऑडियो फ़ाइल 25 MB से बड़ी है।",
      fileRequired: "ऑडियो को multipart फ़ील्ड 'file' के रूप में अपलोड करें।",
      translationUnsupported:
        "{{model}} ट्रांसलेट नहीं कर सकता। अंग्रेज़ी में ट्रांसलेशन whisper-1 पर चलता है।",
      jobNotFound: "इस अकाउंट पर कोई {{kind}} जॉब '{{id}}' नहीं है।",
      jobNotReady:
        "{{kind}} जॉब '{{id}}' {{status}} है। उसका स्टेटस completed होने पर डाउनलोड करें।",
      jobInterrupted:
        "जॉब तब रुकी जब उसका सर्वर रीस्टार्ट हुआ। कुछ चार्ज नहीं हुआ। दोबारा सबमिट करें।",
      jobNotCreated: "जॉब सेव नहीं हो सकी। कुछ चार्ज नहीं हुआ। दोबारा कोशिश करें।",
      mediaNotFound:
        "फ़ाइल नहीं मिली, या लिंक एक्सपायर हो गया। जॉब से नया लिंक लें, या अपनी API key भेजें।",
      modelNoImageInput:
        "{{model}} पहला-फ़्रेम इमेज नहीं लेता। GET /v1/models से कोई image-to-video मॉडल चुनें, या इमेज हटा दें।",
      modelNeedsImage:
        "{{model}} इमेज को एनिमेट करता है। input_reference या image_url भेजें।",
      resolutionUnsupported:
        "{{model}} {{supported}} रेंडर करता है। resolution के लिए उनमें से कोई माँगें।",
    },
  },

  errors: {
    validation: { title: "वैलिडेशन एरर", description: "गलत रिक्वेस्ट" },
    unauthorized: {
      title: "अनधिकृत",
      description: "सही API key ज़रूरी है",
    },
    server: {
      title: "सर्वर एरर",
      description: "इंटरनल सर्वर एरर",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर आया",
    },
    network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर आया" },
    forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
    notFound: { title: "नहीं मिला", description: "मॉडल नहीं मिला" },
    conflict: {
      title: "टकराव",
      description: "रिक्वेस्ट स्टेट से टकराती है",
    },
  },
};
