// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/hi";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एजेंट",
  tags: {
    streaming: "स्ट्रीमिंग",
    chat: "चैट",
    ai: "AI",
  },
  run: {
    task: {
      name: "AI हार्टबीट",
      description:
        "बैकग्राउंड AI एजेंट जो सिस्टम की सेहत जाँचता है, टास्क निपटाता है और ज़रूरत पड़ने पर इंसान से संपर्क करता है",
    },
    post: {
      title: "AI एजेंट चलाएँ",
      titleShort: "एजेंट चलाएँ",
      dynamicTitle: "AI रन{{suffix}}: {{prompt}}",
      description:
        "कोई टास्क स्पेशलिस्ट AI एजेंट को सौंपें और उसका जवाब पाएँ। AI स्किल/पर्सोना बनाने या एडिट करने के लिए हमेशा skill='skill-creator' को सौंपें, खुद कभी न करें। skill + prompt दें; बाकी सब एजेंट संभालता है। क्रेडिट मॉडल के हिसाब से लगते हैं।",
      container: {
        title: "AI एजेंट रन",
        description: "हेडलेस AI एक्ज़ीक्यूशन के लिए प्री-कॉल और प्रॉम्प्ट कॉन्फ़िगर करें",
      },
      fields: {
        favoriteId: {
          label: "पसंदीदा ID",
          description:
            "सेव किए पसंदीदा का slug (जैसे 'thea-cheap')। स्किल slug नहीं, उसके लिए skill फ़ील्ड इस्तेमाल करें। स्किल, मॉडल और टूल कॉन्फ़िग एक साथ लोड करता है। कई सेट हों तो प्राथमिकता: model > favoriteId > skill।",
          placeholder: "thea-cheap",
        },
        model: {
          label: "मॉडल (सिर्फ़ CLI)",
          description:
            "LLM को सीधे बदलें। सिर्फ़ CLI पर, बाकी प्लेटफ़ॉर्म favoriteId या skill इस्तेमाल करते हैं। तेज़: claude-haiku-4.5, gemini-2.5-flash। संतुलित: claude-sonnet-4.6, gpt-5। ताकतवर: claude-opus-4.7। फ़्री: qwen3_235b-free।",
        },
        skill: {
          label: "स्किल",
          description:
            "स्किल slug (जैसे 'thea', 'thea__cheap-smart')। पसंदीदा slug नहीं, उसके लिए favoriteId इस्तेमाल करें। AI पर्सोना और सिस्टम प्रॉम्प्ट तय करता है। स्किल बनाने/एडिट करने के लिए 'skill-creator' इस्तेमाल करें।",
          placeholder: "default",
        },
        prompt: {
          label: "प्रॉम्प्ट",
          description:
            "AI के लिए मुख्य निर्देश या सवाल। सटीक रहें: preCalls के नतीजे दिए हों तो AI उन्हें कॉन्टेक्स्ट की तरह इस्तेमाल करेगा।",
          placeholder: "अपना प्रॉम्प्ट लिखें...",
        },
        instructions: {
          label: "अतिरिक्त सिस्टम निर्देश",
          description:
            "सिस्टम प्रॉम्प्ट में जुड़ने वाले वैकल्पिक अतिरिक्त निर्देश। फ़ॉर्मेट, लहजा या आउटपुट की लंबाई तय करने के लिए (जैसे 'Be concise. JSON only.')।",
          placeholder: "Be concise. One paragraph max.",
        },
        preCalls: {
          label: "प्री-कॉल",
          description:
            "प्रॉम्प्ट से पहले चलने वाले टूल कॉल। नतीजे कॉन्टेक्स्ट के तौर पर जुड़ते हैं। उपलब्ध टूल और उनके आर्ग्युमेंट खोजने के लिए tool-help इस्तेमाल करें।",
          routeId: {
            label: "टूल ID",
            description:
              "बुलाने वाले टूल का alias या पूरा नाम (जैसे 'web-search', 'agent_skills_GET')। टूल खोजने के लिए tool-help इस्तेमाल करें।",
            placeholder: "web-search",
          },
          args: {
            label: "आर्ग्युमेंट",
            description:
              'टूल के लिए सीधे key-value आर्ग्युमेंट: urlPathParams और body फ़ील्ड को एक ऑब्जेक्ट में मिलाएँ (जैसे {"query": "latest news", "maxResults": 5})।',
          },
        },
        availableTools: {
          label: "चलाने की अनुमति",
          description:
            "इस रन के टूल। [] = सिर्फ़ टेक्स्ट: कोई टूल नहीं, मॉडल बस लिखता है (ड्राफ़्ट के लिए)। स्किल या पसंदीदा के टूल इस्तेमाल करने के लिए छोड़ दें। दूसरी सूचियाँ अभी लागू नहीं।",
          toolId: {
            label: "टूल ID",
            description:
              "टूल का alias या पूरा नाम (जैसे 'execute-tool', 'tool-help', 'web-search')",
          },
          requiresConfirmation: {
            label: "पुष्टि ज़रूरी",
            description: "इस टूल को चलाने से पहले यूज़र की पुष्टि के लिए रुकें",
          },
        },
        pinnedTools: {
          label: "कॉन्टेक्स्ट में (मॉडल इन्हें देखता है)",
          description:
            "मॉडल कॉन्टेक्स्ट में लोड हुए टूल। null = यूज़र का डिफ़ॉल्ट सेट। सिर्फ़ इसे प्रभावित करता है कि मॉडल क्या देखता है, यह नहीं कि वह क्या चला सकता है।",
          toolId: {
            label: "टूल ID",
            description: "कॉन्टेक्स्ट में लोड करने वाले टूल का alias या पूरा नाम",
          },
          requiresConfirmation: {
            label: "पुष्टि ज़रूरी",
            description: "क्या इस टूल को चलाने से पहले यूज़र की पुष्टि चाहिए",
          },
        },
        maxTurns: {
          label: "अधिकतम टर्न",
          description:
            "इस रन के लिए मॉडल के अधिकतम स्टेप। चैट सेटिंग्स की सीमा इस्तेमाल करने के लिए खाली छोड़ें।",
        },
        appendThreadId: {
          label: "थ्रेड ID (जारी रखें)",
          description:
            "जारी रखने वाले मौजूदा थ्रेड का UUID। नया मैसेज उसी बातचीत में जुड़ता है। नया थ्रेड शुरू करने के लिए छोड़ दें।",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        rootFolderId: {
          label: "स्टोरेज फ़ोल्डर",
          description:
            "थ्रेड कहाँ स्टोर हो। Background = सभी ऑटोमेटेड रन (Dreamer, Autopilot, शेड्यूल्ड टास्क)। Private = आपका फ़ोल्डर। Shared = टीम। Incognito = कोई स्टोरेज नहीं।",
          placeholder: "background",
          options: {
            background: "बैकग्राउंड",
            private: "प्राइवेट",
            shared: "शेयर्ड",
            public: "पब्लिक",
            incognito: "इनकॉग्निटो (कोई स्टोरेज नहीं)",
          },
        },
        subFolderId: {
          label: "सब-फ़ोल्डर ID",
          description:
            "रूट फ़ोल्डर के अंदर के सब-फ़ोल्डर का वैकल्पिक UUID। सिर्फ़ हाथ से व्यवस्थित करने के लिए: ai-run को प्रोग्राम से या AI टूल से बुलाते समय इसे न दें। सभी ऑटोमेटेड/एजेंट संदर्भों में खाली छोड़ें।",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        excludeMemories: {
          label: "मेमोरी बाहर रखें",
          description:
            "सेव की गई मेमोरी को कॉन्टेक्स्ट में न जोड़ें। पब्लिक बॉट या अलग-थलग टास्क के लिए इस्तेमाल करें। डिफ़ॉल्ट: false।",
        },
      },
      response: {
        text: "AI का जवाब (think-टैग हटाकर)। मॉडल ने कुछ न लिखा हो तो Null।",
        promptTokens: "खर्च हुए प्रॉम्प्ट टोकन (इनपुट लागत)",
        completionTokens: "बने कंप्लीशन टोकन (आउटपुट लागत)",
        creditCost: "इस रन के लिए लगे क्रेडिट। इनकॉग्निटो रन के लिए Null।",
        threadId:
          "वह थ्रेड UUID जिसमें रन स्टोर हुआ। rootFolderId 'incognito' था तो Null। बातचीत को appendThreadId से जारी रखने के लिए इसे इस्तेमाल करें।",
        lastAiMessageId:
          "आख़िरी असिस्टेंट मैसेज का UUID। ब्रांचिंग या जवाब का हवाला देने के काम आता है।",
        threadTitle: "इस थ्रेड का अपने आप बना शीर्षक",
        threadCreatedAt: "थ्रेड बनने का टाइमस्टैम्प (ISO 8601)",
        preCallResults: {
          title: "प्री-कॉल के नतीजे",
          routeId: "जो टूल बुलाया गया",
          succeeded: "कॉल सफल रहा या नहीं",
          errorMessage: "कॉल फ़ेल होने पर एरर मैसेज",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "पैरामीटर गलत दिए गए",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "प्रतिबंधित",
          description: "एक्सेस अस्वीकृत",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रूट या रिसोर्स नहीं मिला",
        },
        internal: {
          title: "सर्वर एरर",
          description: "AI रन के दौरान आंतरिक सर्वर एरर",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "AI रन के दौरान नेटवर्क एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर हुई",
        },
        unsaved: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव बदलावों में टकराव",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा में टकराव हुआ",
        },
      },
      requireFavOrSkill:
        "इनमें से कम से कम एक दें: favoriteId, skill या model (सिर्फ़ CLI)। तय हो सकने वाले मॉडल और स्किल के बिना नहीं चल सकता।",
      skillNotFound:
        "स्किल '{{skill}}' नहीं मिला। यह पसंदीदा slug है (जैसे 'thea-cheap') तो --skill की जगह --favoriteId इस्तेमाल करें।",
      success: {
        title: "AI रन पूरा हुआ",
        description: "AI एजेंट सफलतापूर्वक पूरा हुआ",
      },
      backButton: {
        label: "वापस",
      },
    },
  },
  route: {
    debug: {
      userObject: "AI स्ट्रीम रूट: यूज़र ऑब्जेक्ट",
      extracted: "AI स्ट्रीम रूट: निकाले गए मान",
    },
    errors: {
      invalidJson: "रिक्वेस्ट बॉडी में JSON गलत है",
      invalidRequestData: "रिक्वेस्ट डेटा गलत है ({{issue}})",
      modelAdminOnly: "{{model}} आपके अकाउंट पर उपलब्ध नहीं है। कोई दूसरा मॉडल चुनें।",
      threadPostForbidden:
        "इस थ्रेड में पोस्ट करने का अधिकार नहीं है। जारी रखने के लिए नई चैट शुरू करें।",
      fileTypeNotAllowed: "फ़ाइल का प्रकार अनुमत नहीं: {{fileType}}",
      uncensoredApiKeyMissing: "Uncensored.ai API key कॉन्फ़िगर नहीं है",
      openrouterApiKeyMissing: "OpenRouter API key कॉन्फ़िगर नहीं है",
      streamCreationFailed: "AI सर्विस से कनेक्ट नहीं हो सका। दोबारा कोशिश करें।",
      unknownError: "कोई एरर हुई",
      creditValidationFailed: "क्रेडिट बैलेंस जाँचा नहीं जा सका",
      noIdentifier: "कोई यूज़र या लीड पहचान नहीं दी गई",
      insufficientCredits:
        "क्रेडिट कम हैं: इस रिक्वेस्ट की लागत {{cost}} है, आपका बैलेंस {{balance}} है। टॉप अप करें या सस्ता मॉडल चुनें।",
      noResponseBody: "स्ट्रीम से कोई रिस्पॉन्स बॉडी नहीं मिली",
      authenticationRequired:
        "स्थायी फ़ोल्डर इस्तेमाल करने के लिए लॉग इन करें। गुमनाम चैट के लिए इनकॉग्निटो मोड इस्तेमाल करें।",
    },
  },
  post: {
    title: "AI स्ट्रीम चैट",
    titleShort: "AI चैट",
    description:
      "किसी भी चैट मॉडल (Claude, GPT, Gemini, Llama और बाकी) से AI चैट जवाब स्ट्रीम करें। टेक्स्ट, वॉइस, फ़ाइल अटैचमेंट और एजेंटिक टूल इस्तेमाल सपोर्ट करता है।",
    form: {
      title: "AI चैट कॉन्फ़िगरेशन",
      description: "AI चैट के पैरामीटर और मैसेज कॉन्फ़िगर करें",
    },
    operation: {
      label: "कार्रवाई",
      description: "मैसेज की कार्रवाई का प्रकार",
      options: {
        send: "मैसेज भेजें",
        retry: "मैसेज दोबारा भेजें",
        edit: "मैसेज एडिट करें",
        answerAsAi: "AI की तरह जवाब दें",
      },
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "मैसेज का रूट फ़ोल्डर संदर्भ",
      options: {
        private: "प्राइवेट",
        shared: "शेयर्ड",
        public: "पब्लिक",
        incognito: "इनकॉग्निटो (कोई स्टोरेज नहीं)",
        background: "बैकग्राउंड",
      },
    },
    subFolderId: {
      label: "सब-फ़ोल्डर",
      description: "रूट फ़ोल्डर के अंदर वैकल्पिक सब-फ़ोल्डर",
    },
    threadId: {
      label: "थ्रेड ID",
      description:
        "जिस थ्रेड में यह मैसेज भेजना है उसका UUID। मान्य UUID होना ज़रूरी है: न हो तो पहले थ्रेड बनाएँ।",
    },
    userMessageId: {
      label: "यूज़र मैसेज ID",
      description: "क्लाइंट का बनाया यूज़र मैसेज ID",
    },
    parentMessageId: {
      label: "पैरेंट मैसेज ID",
      description: "ब्रांचिंग/थ्रेडिंग के लिए पैरेंट मैसेज ID",
    },
    leafMessageId: {
      label: "लीफ़ मैसेज ID",
      description:
        "मौजूदा ब्रांच का लीफ़ मैसेज ID: URL पर निर्भर हुए बिना सक्रिय ब्रांच को ट्रैक करता है",
    },
    incognitoThreadTitle: {
      label: "इनकॉग्निटो थ्रेड का शीर्षक",
      description:
        "इनकॉग्निटो थ्रेड का मौजूदा शीर्षक: क्लाइंट भेजता है क्योंकि इनकॉग्निटो थ्रेड की सर्वर पर कोई पंक्ति नहीं होती",
    },
    incognitoThreadDescription: {
      label: "इनकॉग्निटो थ्रेड का विवरण",
      description: "इनकॉग्निटो थ्रेड का मौजूदा विवरण",
    },
    messageHistory: {
      label: "मैसेज हिस्ट्री",
      description: "इनकॉग्निटो मोड के लिए वैकल्पिक मैसेज हिस्ट्री",
      item: {
        title: "मैसेज",
        description: "हिस्ट्री में चैट मैसेज",
        role: {
          label: "भूमिका",
        },
        content: {
          label: "कंटेंट",
        },
        metadata: {
          toolCall: {
            toolName: {
              label: "टूल का नाम",
            },
            args: {
              label: "टूल आर्ग्युमेंट",
            },
            result: {
              label: "टूल का नतीजा",
            },
            error: {
              label: "टूल एरर",
            },
            executionTime: {
              label: "एक्ज़ीक्यूशन समय (ms)",
            },
            creditsUsed: {
              label: "खर्च हुए क्रेडिट",
            },
          },
        },
      },
    },
    content: {
      label: "मैसेज कंटेंट",
      description: "भेजे जाने वाले मैसेज का कंटेंट",
      placeholder: "अपना मैसेज लिखें...",
    },
    role: {
      label: "भूमिका",
      description: "मैसेज भेजने वाले की भूमिका",
      options: {
        user: "यूज़र",
        assistant: "असिस्टेंट",
        system: "सिस्टम",
        tool: "टूल",
        error: "एरर",
      },
    },
    model: {
      label: "मॉडल",
      description: "जनरेशन के लिए AI मॉडल",
    },
    skill: {
      label: "स्किल",
      description:
        'स्किल सूची से स्किल id या slug (वैकल्पिक रूप से slug__variant)। कोई नहीं के लिए छोड़ें या "default" दें। अज्ञात id डिफ़ॉल्ट पर लौट जाते हैं।',
    },
    systemPrompt: {
      label: "सिस्टम प्रॉम्प्ट",
      description: "वैकल्पिक सिस्टम निर्देश",
      placeholder: "सिस्टम प्रॉम्प्ट लिखें...",
      now: "अभी",
      minutesAgo: "{{minutes}} मिनट पहले",
      hoursAgo: "{{hours}} घंटे पहले",
      daysAgo: "{{days}} दिन पहले",
    },
    enableSearch: {
      label: "वेब सर्च चालू करें",
      description: "ताज़ा जानकारी के लिए AI को वेब सर्च करने दें",
    },
    timezone: {
      label: "टाइमज़ोन",
      description: "कैश-स्थिर टाइमस्टैम्प के लिए यूज़र का टाइमज़ोन",
    },
    imageSize: {
      label: "इमेज साइज़",
      description: "बनी इमेज का साइज़ (जैसे स्क्वेयर, लैंडस्केप, पोर्ट्रेट)",
    },
    imageQuality: {
      label: "इमेज क्वालिटी",
      description: "बनी इमेज की क्वालिटी सेटिंग (standard या hd)",
    },
    musicDuration: {
      label: "म्यूज़िक की अवधि",
      description: "बनी ऑडियो क्लिप की अवधि",
    },
    favoriteConfig: {
      label: "पसंदीदा कॉन्फ़िग",
      description:
        "सक्रिय पसंदीदा का पूरा कॉन्फ़िगरेशन: मॉडल चयन, टूल कॉन्फ़िग, कॉन्टेक्स्ट सेटिंग्स। null = कोई पसंदीदा सक्रिय नहीं, स्किल/सिस्टम डिफ़ॉल्ट इस्तेमाल करें।",
    },
    enabledToolIds: {
      label: "चालू टूल ID",
      description: "इस बातचीत के लिए चालू करने वाले AI टूल ID की सूची",
    },
    toolConfirmation: {
      label: "टूल पुष्टि",
      description: "यूज़र की ओर से टूल पुष्टि का जवाब",
      success: "टूल पुष्टि सफलतापूर्वक प्रोसेस हुई",
      messageId: {
        label: "मैसेज ID",
        description: "टूल कॉल वाले मैसेज का ID",
      },
      confirmed: {
        label: "पुष्टि हुई",
        description: "क्या यूज़र ने टूल चलाने की पुष्टि की",
      },
      updatedArgs: {
        label: "अपडेट किए आर्ग्युमेंट",
        description: "टूल कॉल के लिए वैकल्पिक अपडेट किए आर्ग्युमेंट",
      },
      errors: {
        messageNotFound: "टूल मैसेज नहीं मिला",
        toolCallMissing: "ToolCall मेटाडेटा नहीं है",
        toolNotFound: "टूल नहीं मिला",
      },
    },
    resumeToken: {
      label: "रिज्यूम टोकन",
      description: "रुकी हुई स्ट्रीम दोबारा शुरू करने का टोकन",
    },
    voiceMode: {
      label: "वॉइस मोड",
      description: "वॉइस आधारित बातचीत का कॉन्फ़िगरेशन",
      enabled: {
        label: "वॉइस मोड चालू करें",
        description: "टेक्स्ट-टू-स्पीच के साथ वॉइस आधारित बातचीत चालू करें",
      },
      voice: {
        label: "वॉइस",
        description:
          'टेक्स्ट-टू-स्पीच के लिए आवाज़ का प्रकार चुनें। पुरुष आवाज़ के लिए "voices.MALE" या महिला आवाज़ (डिफ़ॉल्ट) के लिए "voices.FEMALE" दें।',
        male: "पुरुष आवाज़",
        female: "महिला आवाज़",
      },
    },
    audioInput: {
      title: "ऑडियो इनपुट",
      description: "वॉइस-टू-वॉइस मोड के लिए ऑडियो फ़ाइल अपलोड करें",
      file: {
        label: "ऑडियो फ़ाइल",
        description: "ट्रांसक्राइब और प्रोसेस होने वाली ऑडियो फ़ाइल",
      },
    },
    attachments: {
      label: "फ़ाइल अटैचमेंट",
      description: "मैसेज से जुड़ी फ़ाइलें (इमेज, दस्तावेज़ आदि)",
    },
    executionContext: {
      label: "एक्ज़ीक्यूशन कॉन्टेक्स्ट",
      description:
        "यह स्ट्रीम कैसे चलती है: लोकल, रिमोट रिले या इन्फ़रेंस-प्रोवाइडर। सामान्य चैट रिक्वेस्ट लोकल (डिफ़ॉल्ट) इस्तेमाल करती हैं।",
    },
    response: {
      title: "स्ट्रीम रिस्पॉन्स",
      description: "AI का बनाया स्ट्रीमिंग जवाब",
      success: "स्ट्रीम सफलतापूर्वक पूरी हुई",
      messageId: "मैसेज ID",
      threadId: "थ्रेड ID",
      totalTokens: "कुल इस्तेमाल हुए टोकन",
      finishReason: "पूरा होने का कारण",
      lastAiMessageContent: "आख़िरी AI मैसेज का कंटेंट",
      lastGeneratedMediaUrl: "बने मीडिया का URL",
      totalCreditsDeducted: "काटे गए क्रेडिट",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "AI स्ट्रीमिंग के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत दिए गए",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "स्ट्रीमिंग के दौरान नेटवर्क एरर हुई",
      },
      serviceUnavailable: {
        title: "रिमोट इंस्टेंस उपलब्ध नहीं",
        description: "जिस जुड़े हुए इंस्टेंस पर यह थ्रेड निर्भर है वह नहीं मिल सका",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "AI स्ट्रीमिंग का एक्सेस प्रतिबंधित है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "AI स्ट्रीमिंग एंडपॉइंट नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव हैं जिन्हें पहले सेव करना होगा",
      },
      conflict: {
        title: "टकराव",
        description: "स्ट्रीमिंग के दौरान डेटा में टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "AI स्ट्रीम सफलतापूर्वक बनी",
    },
  },
  enums: {
    role: {
      user: "यूज़र",
      assistant: "असिस्टेंट",
      system: "सिस्टम",
    },
  },
  streamingErrors: {
    aiStream: {
      error: {
        apiKey: {
          missing: "OpenAI API key नहीं है",
          invalid: "OpenAI API key गलत है",
        },
        configuration: "AI स्ट्रीमिंग कॉन्फ़िगरेशन एरर",
        processing: "AI स्ट्रीम प्रोसेस करने में एरर",
      },
    },
  },
  debugView: {
    systemPromptTitle: "सिस्टम प्रॉम्प्ट",
    copied: "कॉपी हुआ!",
  },
  errorTypes: {
    streamError: "स्ट्रीम एरर",
  },
  errorThread: {
    title: "एरर",
  },
  error: {
    title: "स्ट्रीम एरर",
  },
  info: {
    streamInterrupted: "जनरेशन रोक दिया गया। अधूरा जवाब सेव कर लिया गया है।",
    billingFailed:
      "रुका: इस जवाब के लिए हम क्रेडिट नहीं काट सके। कुछ खोया नहीं, थोड़ी देर में अपना मैसेज फिर भेजें।",
    budgetExceeded:
      "रुका: इस बैकग्राउंड टास्क ने अपनी क्रेडिट सीमा छू ली। जारी रखने के लिए Task Budget Caps में सीमा बढ़ाएँ।",
    taskWatchdog:
      "रुका: टास्क वॉचडॉग ने इस रन को खत्म किया क्योंकि उसने समय, टर्न या टूल-कॉल की सीमा पार कर ली।",
    turnStepLimit:
      "AI {{steps}} स्टेप के बाद रुक गया। जहाँ छोड़ा था वहीं से शुरू करने के लिए “continue” लिखें।",
    raiseTurnStepLimit: "चैट सेटिंग्स में स्टेप सीमा बढ़ाएँ",
  },
  errors: {
    toolExecutionError: "कोई टूल ठीक से नहीं चल सका। दोबारा कोशिश करें।",
    toolExecutionErrorDetail: "टूल एरर: {{error}}",
    toolExecutionFailed: "टूल चलाना फ़ेल हुआ। दोबारा कोशिश करें।",
    toolDisabledByUser:
      "यह टूल यूज़र ने बंद कर दिया है। इसे दोबारा बुलाने की कोशिश न करें।",
    userDeclinedTool: "टूल का चलना रद्द हुआ।",
    streamError: "AI का जवाब पूरा नहीं हो सका। दोबारा कोशिश करें।",
    pendingToolCall:
      "कोई टूल अभी बैकग्राउंड में चल रहा है। आगे बढ़ने से पहले उसके पूरा होने का इंतज़ार करें।",
    streamProcessingError: "AI का जवाब प्रोसेस नहीं हो सका। दोबारा कोशिश करें।",
    timeout: "AI ने जवाब देना बंद कर दिया। दोबारा कोशिश करें।",
    noResponse: "AI ने कोई जवाब नहीं बनाया। दोबारा कोशिश करें।",
    creditBudgetReached:
      "क्रेडिट खत्म। आपका बैलेंस जहाँ खत्म हुआ वहीं जवाब रुक गया। जारी रखने के लिए टॉप अप करें।",
    emptyAnswer:
      "मॉडल ने बिना जवाब लिखे खत्म कर दिया। आपने सिर्फ़ वही दिया जो प्रोवाइडर ने लिया, प्लेटफ़ॉर्म की कोई फ़ीस नहीं। दोबारा कोशिश करें या दूसरा मॉडल चुनें।",
    contentFiltered:
      "इस जवाब को प्रोवाइडर के कंटेंट फ़िल्टर ने रोक दिया। कोई दूसरा मॉडल आज़माएँ।",
    contextTooLong:
      "इस मॉडल की कॉन्टेक्स्ट विंडो के लिए बहुत लंबा। मैसेज छोटा करें, नई चैट शुरू करें, या बड़ी कॉन्टेक्स्ट विंडो वाला मॉडल चुनें।",
    imageTooLarge:
      "यह इमेज मॉडल की साइज़ सीमा से बड़ी है। छोटी इमेज भेजें और दोबारा कोशिश करें।",
    malformedToolCall:
      "मॉडल ने गड़बड़ टूल कॉल भेजा, इसलिए वह चलाया नहीं गया। Continue दबाएँ, वह फिर कोशिश करेगा।",
    providerBusy:
      "यह मॉडल अभी ओवरलोड है। कुछ सेकंड में दोबारा कोशिश करें या दूसरा मॉडल चुनें।",
    modelRetired: "{{model}} बंद हो चुका है। जारी रखने के लिए दूसरा मॉडल चुनें।",
    modelUnavailable: "चुना हुआ AI मॉडल अभी उपलब्ध नहीं है। कोई दूसरा मॉडल आज़माएँ।",
    rateLimitExceeded: "बहुत ज़्यादा रिक्वेस्ट। थोड़ा रुकें और दोबारा कोशिश करें।",
    insufficientCredits: "इस रिक्वेस्ट को पूरा करने के लिए क्रेडिट कम हैं।",
    connectionFailed:
      "AI सर्विस से कनेक्ट नहीं हो सका। अपना कनेक्शन जाँचें और दोबारा कोशिश करें।",
    invalidRequest: "रिक्वेस्ट गलत है। अपना इनपुट जाँचें और दोबारा कोशिश करें।",
    compactingStreamError:
      "कॉन्टेक्स्ट सीमा पूरी: आपकी बातचीत ऑटोमैटिक कॉम्पैक्टिंग के लिए बहुत लंबी है। पुराने मैसेज से ब्रांच करें, बड़ी कॉन्टेक्स्ट विंडो वाला मॉडल चुनें, या अपनी पसंदीदा सेटिंग्स में कॉन्टेक्स्ट विंडो बदलें।",
    compactingStreamErrorExpensive:
      "कॉन्टेक्स्ट सीमा पूरी ({{tokens}} टोकन)। कॉन्टेक्स्ट विंडो बढ़ाना संभव है पर महँगा पड़ सकता है। पहले पुराने मैसेज से ब्रांच करें या मॉडल बदलें।",
    compactingException:
      "बातचीत की हिस्ट्री कॉम्पैक्ट नहीं हो सकी। बातचीत के किसी पुराने बिंदु से ब्रांच करें या दूसरा मॉडल चुनें।",
    compactingRebuildFailed:
      "कॉम्पैक्ट करने के बाद बातचीत दोबारा नहीं बन सकी। पुराने मैसेज से ब्रांच करें।",
    unexpectedError: "अनपेक्षित एरर हुई: {{error}}। दोबारा कोशिश करें।",
  },
  modelRetiredNotice:
    "{{model}} बंद हो चुका है। उसकी जगह {{successor}} है। आपकी चैट हिस्ट्री यहीं है।",
  headless: {
    errors: {
      missingModelOrSkill:
        "model या skill ज़रूरी है: एक सीधे दें, या ऐसा favoriteId दें जिससे मॉडल तय हो सके",
      favoriteNotFound: "पसंदीदा नहीं मिला या इस यूज़र का नहीं है",
      ambiguousModel: "या तो सीधा model दें या पसंदीदा/स्किल, दोनों नहीं",
    },
  },
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Uncensored.ai API एरर ({{status}}): {{errorText}}",
      },
    },
  },
  onboarding: {
    signin: {
      title: "अपना सेटअप सुरक्षित रखें",
      subtitle: "एक बार साइन इन करें। यहाँ जो भी बनाएँगे वह आपके साथ चलेगा।",
      benefits: {
        sync: {
          title: "सभी डिवाइस पर सिंक",
          body: "आपका कंपैनियन, स्पेशलिस्ट और चैट, हर उस डिवाइस पर जो आप इस्तेमाल करते हैं।",
        },
        keep: {
          title: "अपना काम कभी न खोएँ",
          body: "गेस्ट सेटअप सिर्फ़ इसी ब्राउज़र में रहता है। साइन इन करें तो वह बना रहता है।",
        },
        private: {
          title: "डिफ़ॉल्ट रूप से प्राइवेट",
          body: "आपका डेटा और फ़िल्टर का स्तर आपके हाथ में। हमेशा।",
        },
      },
      cta: "साइन इन करें या अकाउंट बनाएँ",
      continueAsGuest: "गेस्ट के तौर पर जारी रखें",
      note: "आप बाद में कभी भी मेनू से साइन इन कर सकते हैं।",
    },
    setup: {
      title: "अपना AI सेट करें",
      subtitle:
        "चुनिए आप किससे बात करेंगे। चाहें तो स्पेशलिस्ट जोड़ें। सब कुछ बाद में बदल सकते हैं।",
      arrivalTitle: "{{skill}} से शुरू करें",
      arrivalSubtitle:
        "इस चैट में {{skill}} जवाब देता है। बाकी सब आपका कंपैनियन संभालता है।",
      arrivalLabel: "आपका स्किल",
      arrivalBadge: "शामिल",
      companionLabel: "आपका कंपैनियन",
      specialistsLabel: "स्पेशलिस्ट जोड़ें",
      optional: "वैकल्पिक",
      start: "चैट शुरू करें",
      saving: "सेट हो रहा है...",
      failed: "आपका सेटअप सेव नहीं हो सका। कनेक्शन जाँचें और दोबारा कोशिश करें।",
      retry: "दोबारा कोशिश करें",
      noProviderAvailable:
        "कोई AI प्रोवाइडर कॉन्फ़िगर नहीं है। जारी रखने के लिए OPENROUTER_API_KEY जोड़ें या Claude Code (CLAUDE_CODE_ENABLED=true) चालू करें।",
    },
    usecases: {
      coding: "कोडिंग और टेक",
      research: "रिसर्च और एनालिसिस",
      writing: "लेखन और एडिटिंग",
      business: "बिज़नेस और रणनीति",
      creative: "क्रिएटिव और कहानियाँ",
      learning: "सीखना और पढ़ाई",
      health: "सेहत और करियर",
      controversial: "आज़ाद सोच",
      roleplay: "रोलप्ले और करैक्टर",
    },
  },
  input: {
    placeholder: "मैसेज भेजें...",
    imagePlaceholder: "बनाने के लिए इमेज का वर्णन करें...",
    audioPlaceholder: "बनाने के लिए ऑडियो या म्यूज़िक का वर्णन करें...",
    noPermission: "आपको यहाँ पोस्ट करने की अनुमति नहीं है",
    signInToPost: {
      title: "पोस्ट करने के लिए फ़्री अकाउंट",
      description:
        "पब्लिक थ्रेड कोई भी पढ़ सकता है। थ्रेड शुरू करने या जवाब देने के लिए फ़्री अकाउंट चाहिए, और आप सीधे यहीं वापस आते हैं।",
    },
    noCredits: {
      title: "क्रेडिट नहीं बचे",
      addCredits: "क्रेडिट जोड़ें",
      description: "आपका बैलेंस खाली है। चैट जारी रखने के लिए टॉप अप करें।",
    },
    creditsLoadFailed: {
      title: "आपका बैलेंस लोड नहीं हो सका।",
      retry: "दोबारा कोशिश करें",
    },
    insufficientCredits: {
      title: "क्रेडिट कम हैं (चाहिए {{cost}}, हैं {{balance}})",
      description: "टॉप अप करें या सस्ता मॉडल चुनें।",
    },
    noModel: {
      title: "कोई मॉडल नहीं चुना",
      description:
        "पहले कोई मॉडल चुनें। कोई सूची में नहीं? अपने प्रोवाइडर की API key जाँचें।",
    },
    keyboardShortcuts: {
      enter: "Enter",
      toSend: "भेजने के लिए",
      shiftEnter: "Shift+Enter",
      forNewLine: "नई लाइन के लिए",
      ctrlV: "Ctrl+V",
      orPasteFiles: "या फ़ाइलें पेस्ट करें",
    },
    speechInput: {
      transcribing: "ट्रांसक्राइब हो रहा है...",
    },
    attachments: {
      uploadFile: "फ़ाइलें जोड़ें",
      attachedFiles: "जुड़ी हुई फ़ाइलें",
      addMore: "और जोड़ें",
      unreadable: "आपका ब्राउज़र एक अटैचमेंट नहीं पढ़ सका। उसे हटाएँ और फ़ाइल दोबारा चुनें।",
    },
  },
  outOfCredits: {
    dismiss: "बंद करें",
    dailyLimit: {
      title: "आज की फ़्री सीमा पूरी हो गई",
      whyCaller: "फ़्री क्रेडिट की हर डिवाइस और नेटवर्क पर एक दैनिक सीमा है।",
      whyPool:
        "सभी विज़िटर फ़्री क्रेडिट की एक ही दैनिक सीमा साझा करते हैं, और आज की सीमा खत्म हो चुकी है।",
      kept: "आपके {{balance}} फ़्री क्रेडिट आपके ही रहेंगे और {{time}} ({{relative}}) से फिर काम करेंगे।",
      keptNoBalance:
        "आपके फ़्री क्रेडिट आपके ही रहेंगे और {{time}} ({{relative}}) से फिर काम करेंगे।",
      lighterFits: "आज की सीमा में {{model}} अभी भी चल सकता है।",
      pickLighter: "हल्का मॉडल चुनें",
      guestPlan:
        "इंतज़ार नहीं करना? प्लान के लिए फ़्री अकाउंट चाहिए। पेड क्रेडिट तुरंत काम करते हैं।",
    },
    inFlight: {
      title: "एक जवाब अभी चल रहा है",
      description: "आपके फ़्री क्रेडिट उसे कवर कर रहे हैं। उसे पूरा होने दें, फिर दोबारा भेजें।",
    },
    guest: {
      title: "फ़्री क्रेडिट खत्म",
      description:
        "फ़्री अकाउंट: हर महीने {{signedIn}} क्रेडिट, न्यूज़लेटर के साथ {{max}}। आप सीधे इसी चैट में लौटते हैं।",
      privacy: "ईमेल सिर्फ़ लॉगिन के लिए। न फ़ोन, न कार्ड, न थर्ड-पार्टी ट्रैकर।",
      signUp: "फ़्री साइन अप करें",
      haveAccount: "अकाउंट है?",
      logIn: "लॉग इन करें",
    },
    member: {
      title: "आपके क्रेडिट खत्म हो गए",
      shortTitle: "इस मैसेज के लिए क्रेडिट कम हैं",
      shortDescription:
        "आपके पास {{balance}} क्रेडिट हैं। लंबी चैट में हर मैसेज महँगा पड़ता है: नई चैट शुरू करें या सस्ता मॉडल चुनें। या टॉप अप करें:",
      description:
        "फ़्री क्रेडिट {{date}} को दोबारा भरेंगे। या कोई प्लान चुनकर अभी जारी रखें:",
      subscriberDescription:
        "प्लान के क्रेडिट {{date}} को रिन्यू होंगे। उससे पहले और चाहिए? टॉप अप करें या बड़ा प्लान लें:",
      orTopUp: "या इंतज़ार छोड़ें:",
      newsletter: {
        title: "हर महीने +{{bonus}} फ़्री क्रेडिट",
        consent:
          "{{email}} से न्यूज़लेटर से जुड़ें: प्रोडक्ट की ख़बरें और नए मॉडल, कभी भी अनसब्सक्राइब करें। पहले हम कन्फ़र्म लिंक ईमेल करेंगे।",
        claim: "+{{bonus}}/महीना के लिए जुड़ें",
        claiming: "भेजा जा रहा है...",
        pending:
          "{{email}} देखें और +{{bonus}} क्रेडिट/महीना अनलॉक करने के लिए कन्फ़र्म लिंक पर क्लिक करें।",
      },
    },
  },
  imageGen: {
    sizeSquare: "स्क्वेयर (1024×1024)",
    sizeLandscape: "लैंडस्केप (1792×1024)",
    sizePortrait: "पोर्ट्रेट (1024×1792)",
    qualityStandard: "स्टैंडर्ड",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "छोटा (~8 सेकंड)",
    durationMedium: "मध्यम (~15 सेकंड)",
    durationLong: "लंबा (~30 सेकंड)",
  },
  voiceMode: {
    unconfiguredTitle: "वॉइस कॉन्फ़िगर नहीं है",
    unconfiguredDescription: "इस स्किल के लिए टेक्स्ट-टू-स्पीच उपलब्ध नहीं है।",
    callMode: "कॉल मोड",
    callModeDescription: "AI आवाज़ में जवाब देगा",
    tapToRecord: "रिकॉर्ड करने के लिए टैप करें",
    recording: {
      paused: "रुका हुआ",
      resume: "फिर शुरू करें",
      pause: "रोकें",
    },
    callOverlay: {
      listening: "सुन रहा है...",
    },
    actions: {
      cancel: "रद्द करें",
      toInput: "इनपुट में",
      sendVoice: "वॉइस भेजें",
      retry: "दोबारा कोशिश करें",
      download: "ऑडियो डाउनलोड करें",
      downloadHint: "फ़ाइल डाउनलोड करें और उसे अपने अगले मैसेज में जोड़ दें।",
    },
  },
  actions: {
    cancellingGeneration: "रद्द हो रहा है...",
    stopGeneration: "रोकें",
    sendMessage: "भेजें",
    openThread: "थ्रेड खोलें",
  },
  toolsButton: {
    title: "AI टूल",
    tools: "टूल",
  },
  config: {
    folders: {
      private: "प्राइवेट",
      shared: "शेयर्ड",
      public: "पब्लिक",
      background: "बैकग्राउंड",
      incognito: "इनकॉग्निटो",
      remote: "रिमोट",
    },
  },
  models: { names: modelTranslations.names },
};
