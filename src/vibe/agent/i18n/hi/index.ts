import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एजेंट",
  tags: {
    streaming: "स्ट्रीमिंग",
    chat: "चैट",
    ai: "AI",
    status: "स्टेटस",
    processing: "प्रोसेसिंग",
    classification: "वर्गीकरण",
    automation: "ऑटोमेशन",
    execution: "एग्ज़ीक्यूशन",
    confirmation: "पुष्टि",
    speech: "आवाज़",
    transcription: "ट्रांसक्रिप्शन",
    tts: "टेक्स्ट-टू-स्पीच",
  },
  enums: {
    emailAgentStatus: {
      pending: "लंबित",
      processing: "प्रोसेस हो रहा है",
      hardRulesComplete: "सख़्त नियम पूरे",
      aiProcessing: "AI प्रोसेसिंग",
      awaitingConfirmation: "पुष्टि का इंतज़ार",
      completed: "पूरा हुआ",
      failed: "फ़ेल हुआ",
      skipped: "छोड़ा गया",
    },
    emailAgentActionType: {
      markBounced: "बाउंस मार्क करें",
      markSpam: "स्पैम मार्क करें",
      classifyDeliveryFailure: "डिलीवरी फ़ेल्योर की श्रेणी तय करें",
      respondToEmail: "ईमेल का जवाब दें",
      deleteEmail: "ईमेल हटाएँ",
      searchKnowledgeBase: "नॉलेज बेस में खोजें",
      webSearch: "वेब सर्च",
      escalateToHuman: "इंसान को सौंपें",
      noAction: "कोई कार्रवाई नहीं",
      chainAnalysis: "चेन विश्लेषण",
    },
    emailAgentToolType: {
      knowledgeBaseSearch: "नॉलेज बेस सर्च",
      emailResponse: "ईमेल जवाब",
      emailDelete: "ईमेल डिलीट",
      webSearch: "वेब सर्च",
    },
    bounceCategory: {
      hardBounce: "हार्ड बाउंस",
      softBounce: "सॉफ़्ट बाउंस",
      spamComplaint: "स्पैम शिकायत",
      unsubscribe: "अनसब्सक्राइब",
      blockBounce: "ब्लॉक बाउंस",
      invalidAddress: "अमान्य पता",
      mailboxFull: "मेलबॉक्स भरा हुआ",
      contentRejected: "कंटेंट रिजेक्ट",
    },
    confirmationStatus: {
      pending: "लंबित",
      approved: "मंज़ूर",
      rejected: "नामंज़ूर",
      expired: "समय सीमा ख़त्म",
    },
    processingPriority: {
      low: "कम",
      normal: "सामान्य",
      high: "ज़्यादा",
      urgent: "तुरंत",
    },
    sortOrder: {
      asc: "बढ़ते क्रम में",
      desc: "घटते क्रम में",
    },
    emailAgentSortField: {
      emailId: "ईमेल ID",
      status: "स्टेटस",
      lastProcessedAt: "आख़िरी प्रोसेसिंग का समय",
      createdAt: "बनाने का समय",
      priority: "प्राथमिकता",
    },
    emailAgentStatusFilter: {
      all: "सभी",
      pending: "लंबित",
      processing: "प्रोसेस हो रहा है",
      hardRulesComplete: "सख़्त नियम पूरे",
      aiProcessing: "AI प्रोसेसिंग",
      awaitingConfirmation: "पुष्टि का इंतज़ार",
      completed: "पूरा हुआ",
      failed: "फ़ेल हुआ",
      skipped: "छोड़ा गया",
    },
    emailAgentActionTypeFilter: {
      all: "सभी",
      markBounced: "बाउंस मार्क करें",
      markSpam: "स्पैम मार्क करें",
      classifyDeliveryFailure: "डिलीवरी फ़ेल्योर की श्रेणी तय करें",
      respondToEmail: "ईमेल का जवाब दें",
      deleteEmail: "ईमेल हटाएँ",
      searchKnowledgeBase: "नॉलेज बेस में खोजें",
      webSearch: "वेब सर्च",
      escalateToHuman: "इंसान को सौंपें",
      noAction: "कोई कार्रवाई नहीं",
      chainAnalysis: "चेन विश्लेषण",
    },
    confirmationStatusFilter: {
      all: "सभी",
      pending: "लंबित",
      approved: "मंज़ूर",
      rejected: "नामंज़ूर",
      expired: "समय सीमा ख़त्म",
    },
    processingPriorityFilter: {
      all: "सभी",
      low: "कम",
      normal: "सामान्य",
      high: "ज़्यादा",
      urgent: "तुरंत",
    },
    confirmationResponseAction: {
      approve: "मंज़ूर करें",
      reject: "नामंज़ूर करें",
    },
    modelUtilities: {
      chat: "चैट",
      coding: "कोडिंग",
      creative: "क्रिएटिव राइटिंग",
      analysis: "विश्लेषण",
      reasoning: "रीज़निंग",
      roleplay: "रोलप्ले",
      fast: "तेज़",
      smart: "स्मार्ट",
      vision: "विज़न",
      imageGen: "इमेज जनरेशन",
      politicalLeft: "वामपंथी राजनीति",
      politicalRight: "दक्षिणपंथी राजनीति",
      controversial: "विवादित",
      adultImplied: "एडल्ट (संकेतों में)",
      adultExplicit: "एडल्ट (खुला)",
      violence: "हिंसा",
      harmful: "हानिकारक कंटेंट",
      illegalInfo: "अवैध जानकारी",
      medicalAdvice: "मेडिकल सलाह",
      offensiveLanguage: "अपमानजनक भाषा",
      roleplayDark: "डार्क रोलप्ले",
      conspiracy: "साज़िश के सिद्धांत",
      legacy: "लेगेसी",
      uncensored: "अनसेंसर्ड",
    },
  },
  aiStream: {
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
          "बैकग्राउंड AI एजेंट जो सिस्टम की सेहत जाँचता है, काम निपटाता है और ज़रूरत पड़ने पर इंसान से संपर्क करता है",
      },
      post: {
        title: "AI एजेंट चलाएँ",
        dynamicTitle: "AI रन{{suffix}}: {{prompt}}",
        description:
          "कोई काम स्पेशलिस्ट AI एजेंट को सौंपें और उसका जवाब पाएँ। AI स्किल/पर्सोना बनाने या बदलने के लिए हमेशा skill='skill-creator' को सौंपें, खुद कोशिश न करें। skill और prompt दें, बाक़ी एजेंट सँभाल लेता है। क्रेडिट मॉडल के हिसाब से कटते हैं।",
        container: {
          title: "AI एजेंट रन",
          description: "हेडलेस AI एग्ज़ीक्यूशन के लिए प्री-कॉल और प्रॉम्प्ट सेट करें",
        },
        fields: {
          favoriteId: {
            label: "फ़ेवरेट ID",
            description:
              "सेव किए गए फ़ेवरेट का स्लग या ID। इससे स्किल, मॉडल और टूल कॉन्फ़िग डिफ़ॉल्ट के रूप में लोड होते हैं। रिक्वेस्ट के साफ़ दिए फ़ील्ड फ़ेवरेट की वैल्यू पर भारी पड़ते हैं।",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          model: {
            label: "मॉडल",
            description:
              "टेक्स्ट रीज़निंग वाला LLM। favoriteId या skill सेट हो तो ज़रूरी नहीं। तेज़: claude-haiku-4.5, gemini-2.5-flash. संतुलित: claude-sonnet-4.6, gpt-5. दमदार: claude-opus-4.7. फ़्री: qwen3_235b-free. इमेज/ऑडियो/वीडियो जनरेशन के लिए नहीं।",
          },
          skill: {
            label: "स्किल",
            description:
              "स्किल ID या डिफ़ॉल्ट स्किल का नाम। यही AI का पर्सोना और सिस्टम प्रॉम्प्ट तय करता है। AI स्किल बनाने/बदलने के लिए 'skill-creator' इस्तेमाल करें। favoriteId सेट हो तो ज़रूरी नहीं।",
            placeholder: "default",
          },
          prompt: {
            label: "प्रॉम्प्ट",
            description:
              "AI के लिए मुख्य निर्देश या सवाल। साफ़ और ठोस लिखें। preCalls दिए हों तो AI उनके नतीजे संदर्भ के तौर पर लेगा।",
            placeholder: "अपना प्रॉम्प्ट लिखें...",
          },
          instructions: {
            label: "एक्स्ट्रा सिस्टम निर्देश",
            description:
              "सिस्टम प्रॉम्प्ट में जुड़ने वाले वैकल्पिक निर्देश। फ़ॉर्मैट, टोन या जवाब की लंबाई तय करने के लिए (जैसे 'छोटा जवाब दें। सिर्फ़ JSON।')।",
            placeholder: "छोटा जवाब दें। ज़्यादा से ज़्यादा एक पैराग्राफ़।",
          },
          preCalls: {
            label: "प्री-कॉल",
            description:
              "प्रॉम्प्ट से पहले चलने वाली टूल कॉल। नतीजे संदर्भ के रूप में जुड़ जाते हैं। उपलब्ध टूल और उनके आर्ग्युमेंट देखने के लिए tool-help इस्तेमाल करें।",
            routeId: {
              label: "टूल ID",
              description:
                "कॉल करने वाले टूल का alias या पूरा नाम (जैसे 'web-search', 'agent_skills_GET')। टूल खोजने के लिए tool-help इस्तेमाल करें।",
              placeholder: "web-search",
            },
            args: {
              label: "आर्ग्युमेंट",
              description:
                'टूल के लिए फ़्लैट key-value आर्ग्युमेंट। urlPathParams और body फ़ील्ड एक ही ऑब्जेक्ट में मिलाएँ (जैसे {"query": "latest news", "maxResults": 5})।',
            },
          },
          availableTools: {
            label: "चलाने की अनुमति",
            description:
              "AI कौन से टूल चला सकता है। null = जो भी अनुमत हैं सब। Array = सिर्फ़ लिखे हुए टूल। स्टैंडर्ड: [{toolId:'execute-tool'},{toolId:'tool-help'}]।",
            toolId: {
              label: "टूल ID",
              description:
                "टूल का alias या पूरा नाम (जैसे 'execute-tool', 'tool-help', 'web-search')",
            },
            requiresConfirmation: {
              label: "पुष्टि ज़रूरी",
              description: "यह टूल चलाने से पहले यूज़र की पुष्टि के लिए रुकें",
            },
          },
          pinnedTools: {
            label: "कॉन्टेक्स्ट में (मॉडल यही देखता है)",
            description:
              "मॉडल के कॉन्टेक्स्ट में लोड होने वाले टूल। null = यूज़र का डिफ़ॉल्ट सेट। इससे सिर्फ़ यह तय होता है कि मॉडल क्या देखता है, यह नहीं कि वह क्या चला सकता है।",
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
              "रुकने से पहले अधिकतम एजेंटिक टर्न (टूल-कॉल साइकल)। डिफ़ॉल्ट: असीमित। बिना टूल कॉल के एक ही प्रॉम्प्ट और जवाब के लिए 1 रखें।",
          },
          appendThreadId: {
            label: "थ्रेड ID (जारी रखें)",
            description:
              "जारी रखने वाले मौजूदा थ्रेड का UUID। नया मैसेज उसी बातचीत में जुड़ेगा। नया थ्रेड शुरू करना हो तो खाली छोड़ें।",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          rootFolderId: {
            label: "स्टोरेज फ़ोल्डर",
            description:
              "थ्रेड कहाँ सेव होगा। बैकग्राउंड = सारे ऑटोमेटेड रन (Dreamer, Autopilot, शेड्यूल्ड टास्क)। प्राइवेट = आपका फ़ोल्डर। शेयर्ड = टीम। इनकॉग्निटो = कुछ सेव नहीं।",
            placeholder: "background",
            options: {
              background: "बैकग्राउंड",
              private: "प्राइवेट",
              shared: "शेयर्ड",
              incognito: "इनकॉग्निटो (सेव नहीं होगा)",
            },
          },
          subFolderId: {
            label: "सब-फ़ोल्डर ID",
            description:
              "रूट फ़ोल्डर के अंदर किसी सब-फ़ोल्डर का वैकल्पिक UUID। सिर्फ़ मैन्युअल ऑर्गनाइज़ेशन के लिए। ai-run को प्रोग्राम से या AI टूल से कॉल करते समय यह न दें। ऑटोमेटेड/एजेंट संदर्भ में हमेशा खाली छोड़ें।",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          excludeMemories: {
            label: "मेमोरी बाहर रखें",
            description:
              "सेव की गई मेमोरी को कॉन्टेक्स्ट में न जोड़ें। पब्लिक बॉट या अलग-थलग कामों के लिए। डिफ़ॉल्ट: false।",
          },
        },
        response: {
          text: "AI का जवाब (think-टैग हटाकर)। मॉडल ने कुछ न लिखा हो तो Null।",
          promptTokens: "खर्च हुए प्रॉम्प्ट टोकन (इनपुट लागत)",
          completionTokens: "बने कम्प्लीशन टोकन (आउटपुट लागत)",
          creditCost: "इस रन के लिए कटे क्रेडिट। इनकॉग्निटो रन में Null।",
          threadId:
            "जिस थ्रेड में रन सेव हुआ उसका UUID। rootFolderId 'incognito' हो तो Null। appendThreadId से बातचीत आगे बढ़ाने में इस्तेमाल करें।",
          lastAiMessageId:
            "आख़िरी असिस्टेंट मैसेज का UUID। ब्रांचिंग या जवाब का हवाला देने में काम आता है।",
          threadTitle: "इस थ्रेड का अपने-आप बना टाइटल",
          threadCreatedAt: "थ्रेड बनने का टाइमस्टैंप (ISO 8601)",
          preCallResults: {
            title: "प्री-कॉल नतीजे",
            routeId: "जो टूल कॉल हुआ",
            succeeded: "कॉल सफल रही या नहीं",
            errorMessage: "कॉल फ़ेल होने पर एरर मैसेज",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "दिए गए पैरामीटर ग़लत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          forbidden: {
            title: "मनाही",
            description: "एक्सेस नहीं मिला",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रूट या रिसोर्स नहीं मिला",
          },
          internal: {
            title: "सर्वर एरर",
            description: "AI रन के दौरान सर्वर में एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "AI रन के दौरान नेटवर्क एरर आया",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलावों में टकराव है",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा में टकराव हुआ",
          },
        },
        success: {
          title: "AI रन पूरा हुआ",
          description: "AI एजेंट ने काम पूरा कर लिया",
        },
        backButton: {
          label: "वापस",
        },
      },
    },
    route: {
      debug: {
        userObject: "AI Stream Route: User object",
        extracted: "AI Stream Route: Extracted values",
      },
      errors: {
        invalidJson: "रिक्वेस्ट बॉडी में JSON अमान्य है",
        invalidRequestData: "रिक्वेस्ट डेटा अमान्य है ({{issue}})",
        uncensoredApiKeyMissing: "Uncensored.ai API key कॉन्फ़िगर नहीं है",
        openrouterApiKeyMissing: "OpenRouter API key कॉन्फ़िगर नहीं है",
        streamCreationFailed:
          "AI सर्विस से कनेक्ट नहीं हो सका। कृपया दोबारा कोशिश करें।",
        unknownError: "कोई एरर आया",
        creditValidationFailed: "क्रेडिट बैलेंस जाँचा नहीं जा सका",
        noIdentifier: "यूज़र या लीड की पहचान नहीं दी गई",
        insufficientCredits:
          "यह रिक्वेस्ट पूरी करने के लिए क्रेडिट कम हैं (लागत: {{cost}}, बैलेंस: {{balance}})",
        noResponseBody: "स्ट्रीम से कोई रिस्पॉन्स बॉडी नहीं मिली",
        authenticationRequired:
          "परमानेंट फ़ोल्डर इस्तेमाल करने के लिए लॉग इन करें। गुमनाम चैट के लिए इनकॉग्निटो मोड इस्तेमाल करें।",
      },
    },
    post: {
      title: "AI स्ट्रीम चैट",
      titleShort: "AI चैट",
      description:
        "{{modelCount}} मॉडल (Claude, GPT, Gemini, Llama और बहुत कुछ) से AI चैट जवाब स्ट्रीम करें। टेक्स्ट, वॉइस, फ़ाइल अटैचमेंट और एजेंटिक टूल इस्तेमाल सपोर्टेड हैं।",
      form: {
        title: "AI चैट कॉन्फ़िगरेशन",
        description: "AI चैट के पैरामीटर और मैसेज सेट करें",
      },
      operation: {
        label: "ऑपरेशन",
        description: "मैसेज पर किया जाने वाला ऑपरेशन",
        options: {
          send: "मैसेज भेजें",
          retry: "मैसेज दोबारा भेजें",
          edit: "मैसेज एडिट करें",
          answerAsAi: "AI के तौर पर जवाब दें",
        },
      },
      rootFolderId: {
        label: "रूट फ़ोल्डर",
        description: "मैसेज के लिए रूट फ़ोल्डर संदर्भ",
      },
      subFolderId: {
        label: "सब-फ़ोल्डर",
        description: "रूट फ़ोल्डर के अंदर वैकल्पिक सब-फ़ोल्डर",
      },
      threadId: {
        label: "थ्रेड ID",
        description:
          "जिस थ्रेड में यह मैसेज भेजना है उसका UUID। वैध UUID होना चाहिए। न हो तो पहले थ्रेड बनाएँ।",
      },
      userMessageId: {
        label: "यूज़र मैसेज ID",
        description: "क्लाइंट की बनाई यूज़र मैसेज ID",
      },
      parentMessageId: {
        label: "पैरेंट मैसेज ID",
        description: "ब्रांचिंग/थ्रेडिंग के लिए पैरेंट मैसेज ID",
      },
      leafMessageId: {
        label: "लीफ़ मैसेज ID",
        description:
          "मौजूदा ब्रांच की लीफ़ मैसेज ID। URL पर निर्भर हुए बिना एक्टिव ब्रांच ट्रैक करती है",
      },
      messageHistory: {
        label: "मैसेज हिस्ट्री",
        description: "इनकॉग्निटो मोड के लिए वैकल्पिक मैसेज हिस्ट्री",
        item: {
          title: "मैसेज",
          description: "हिस्ट्री में चैट मैसेज",
          role: {
            label: "रोल",
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
                label: "एग्ज़ीक्यूशन समय (ms)",
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
        label: "रोल",
        description: "मैसेज भेजने वाले का रोल",
        options: {
          user: "यूज़र",
          assistant: "असिस्टेंट",
          system: "सिस्टम",
        },
      },
      model: {
        label: "मॉडल",
        description: "जनरेशन के लिए AI मॉडल",
      },
      skill: {
        label: "स्किल",
        description: "AI के लिए वैकल्पिक स्किल",
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
        description: "ताज़ा जानकारी के लिए AI को वेब पर खोजने दें",
      },
      timezone: {
        label: "टाइमज़ोन",
        description: "कैश-स्टेबल टाइमस्टैंप के लिए यूज़र का टाइमज़ोन",
      },
      imageSize: {
        label: "इमेज साइज़",
        description: "बनने वाली इमेज का साइज़ (जैसे स्क्वेयर, लैंडस्केप, पोर्ट्रेट)",
      },
      imageQuality: {
        label: "इमेज क्वालिटी",
        description: "बनने वाली इमेज की क्वालिटी (standard या hd)",
      },
      musicDuration: {
        label: "म्यूज़िक की लंबाई",
        description: "बनने वाली ऑडियो क्लिप की लंबाई",
      },
      favoriteConfig: {
        label: "फ़ेवरेट कॉन्फ़िग",
        description:
          "एक्टिव फ़ेवरेट का पूरा कॉन्फ़िगरेशन: मॉडल चुनाव, टूल कॉन्फ़िग, कॉन्टेक्स्ट सेटिंग्स। null = कोई फ़ेवरेट एक्टिव नहीं, स्किल/सिस्टम डिफ़ॉल्ट इस्तेमाल होंगे।",
      },
      enabledToolIds: {
        label: "चालू टूल ID",
        description: "इस बातचीत के लिए चालू करने वाले AI टूल की ID की लिस्ट",
      },
      toolConfirmation: {
        label: "टूल पुष्टि",
        description: "यूज़र की तरफ़ से टूल पुष्टि का जवाब",
        success: "टूल पुष्टि सफलतापूर्वक प्रोसेस हुई",
        messageId: {
          label: "मैसेज ID",
          description: "टूल कॉल वाले मैसेज की ID",
        },
        confirmed: {
          label: "पुष्टि हुई",
          description: "यूज़र ने टूल चलाने की पुष्टि की या नहीं",
        },
        updatedArgs: {
          label: "अपडेटेड आर्ग्युमेंट",
          description: "टूल कॉल के लिए वैकल्पिक अपडेटेड आर्ग्युमेंट",
        },
        errors: {
          messageNotFound: "टूल मैसेज नहीं मिला",
          toolCallMissing: "ToolCall मेटाडेटा नहीं है",
          toolNotFound: "टूल नहीं मिला",
        },
      },
      resumeToken: {
        label: "रिज़्यूम टोकन",
        description: "रुकी हुई स्ट्रीम दोबारा शुरू करने का टोकन",
      },
      voiceMode: {
        label: "वॉइस मोड",
        description: "वॉइस वाली बातचीत का कॉन्फ़िगरेशन",
        enabled: {
          label: "वॉइस मोड चालू करें",
          description: "टेक्स्ट-टू-स्पीच के साथ वॉइस वाली बातचीत चालू करें",
        },
        voice: {
          label: "आवाज़",
          description:
            'टेक्स्ट-टू-स्पीच की आवाज़ चुनें। पुरुष आवाज़ के लिए "voices.MALE" और महिला आवाज़ (डिफ़ॉल्ट) के लिए "voices.FEMALE" दें।',
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
        description: "मैसेज के साथ जुड़ी फ़ाइलें (इमेज, दस्तावेज़ आदि)",
      },
      response: {
        title: "स्ट्रीम रिस्पॉन्स",
        description: "AI का स्ट्रीम किया हुआ जवाब",
        success: "स्ट्रीम सफलतापूर्वक पूरी हुई",
        messageId: "मैसेज ID",
        threadId: "थ्रेड ID",
        totalTokens: "कुल खर्च हुए टोकन",
        finishReason: "पूरा होने की वजह",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "AI स्ट्रीमिंग के लिए ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर में एरर आया",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कोई अनजान एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "स्ट्रीमिंग के दौरान नेटवर्क एरर आया",
        },
        forbidden: {
          title: "मनाही",
          description: "AI स्ट्रीमिंग का एक्सेस नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "AI स्ट्रीमिंग एंडपॉइंट नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हैं, पहले उन्हें सेव करें",
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
            invalid: "OpenAI API key अमान्य है",
          },
          configuration: "AI स्ट्रीमिंग कॉन्फ़िगरेशन में एरर",
          processing: "AI स्ट्रीम प्रोसेस करने में एरर",
        },
      },
    },
    debugView: {
      systemPromptTitle: "सिस्टम प्रॉम्प्ट",
      copied: "कॉपी हो गया!",
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
    wakeUp: {
      revivalPrompt:
        "आपने जो एसिंक टास्क भेजा था वह पूरा हो गया। नतीजा ऊपर के टूल मैसेज में है। कृपया बताएँ कि टास्क ने क्या लौटाया।",
      revivalInstructions:
        "WAKE-UP REVIVAL MODE: एक एसिंक टास्क पूरा हो चुका है और नतीजा थ्रेड में है। यूज़र के आख़िरी मैसेज का जवाब टूल के नतीजे का सार बताकर दें, सिर्फ़ 1-3 वाक्यों में। कोई टूल कॉल न करें। यूज़र की मूल रिक्वेस्ट दोबारा न चलाएँ।",
    },
    info: {
      streamInterrupted: "जनरेशन रोक दिया गया। अधूरा जवाब सेव हो गया है।",
    },
    errors: {
      toolExecutionError: "टूल ठीक से नहीं चला। कृपया दोबारा कोशिश करें।",
      toolExecutionErrorDetail: "टूल एरर: {{error}}",
      toolExecutionFailed: "टूल नहीं चल सका। कृपया दोबारा कोशिश करें।",
      toolDisabledByUser:
        "यूज़र ने यह टूल बंद कर दिया है। इसे दोबारा कॉल करने की कोशिश न करें।",
      userDeclinedTool: "टूल चलाना रद्द कर दिया गया।",
      streamError: "AI का जवाब पूरा नहीं हो सका। कृपया दोबारा कोशिश करें।",
      pendingToolCall:
        "एक टूल अभी बैकग्राउंड में चल रहा है। आगे बढ़ने से पहले उसके पूरा होने का इंतज़ार करें।",
      streamProcessingError:
        "AI का जवाब प्रोसेस नहीं हो सका। कृपया दोबारा कोशिश करें।",
      timeout:
        "AI ने जवाब देने में बहुत समय लगाया ({{maxDuration}} सेकंड बाद टाइमआउट)। छोटा मैसेज भेजकर दोबारा कोशिश करें।",
      noResponse: "AI ने कोई जवाब नहीं बनाया। कृपया दोबारा कोशिश करें।",
      modelUnavailable: "चुना हुआ AI मॉडल अभी उपलब्ध नहीं है। कोई दूसरा मॉडल आज़माएँ।",
      rateLimitExceeded: "बहुत ज़्यादा रिक्वेस्ट। थोड़ा रुकें और दोबारा कोशिश करें।",
      insufficientCredits: "यह रिक्वेस्ट पूरी करने के लिए क्रेडिट कम हैं।",
      connectionFailed:
        "AI सर्विस से कनेक्ट नहीं हो सका। अपना कनेक्शन जाँचें और दोबारा कोशिश करें।",
      invalidRequest: "रिक्वेस्ट अमान्य है। अपना इनपुट जाँचें और दोबारा कोशिश करें।",
      compactingStreamError:
        "कॉन्टेक्स्ट की सीमा पूरी हो गई। आपकी बातचीत ऑटोमैटिक कॉम्पैक्ट करने के लिए बहुत लंबी है। किसी पुराने मैसेज से ब्रांच करें, बड़े कॉन्टेक्स्ट विंडो वाले मॉडल पर जाएँ या अपनी फ़ेवरेट सेटिंग्स में कॉन्टेक्स्ट विंडो बदलें।",
      compactingStreamErrorExpensive:
        "कॉन्टेक्स्ट की सीमा पूरी हो गई ({{tokens}} टोकन)। कॉन्टेक्स्ट विंडो बढ़ाई जा सकती है, पर यह महँगा पड़ सकता है। पहले किसी पुराने मैसेज से ब्रांच करें या मॉडल बदलें।",
      compactingException:
        "बातचीत की हिस्ट्री कॉम्पैक्ट नहीं हो सकी। बातचीत के किसी पुराने बिंदु से ब्रांच करें या कोई दूसरा मॉडल चुनें।",
      compactingRebuildFailed:
        "कॉम्पैक्ट करने के बाद बातचीत दोबारा नहीं बन सकी। किसी पुराने मैसेज से ब्रांच करें।",
      unexpectedError: "कोई अनपेक्षित एरर आया: {{error}}। कृपया दोबारा कोशिश करें।",
    },
    headless: {
      errors: {
        // Thrown when runHeadlessAiStream() is called without a resolvable model+skill.
        // Either pass model+skill directly, or pass favoriteId pointing to a favorite
        // that has a MANUAL or FILTERS modelSelection (not SKILL_BASED with no skill).
        missingModelOrSkill:
          "model या skill ज़रूरी है। सीधे दें या ऐसा favoriteId दें जिसमें मॉडल चुनाव तय हो",
        favoriteNotFound: "फ़ेवरेट नहीं मिला या इस यूज़र का नहीं है",
      },
    },
    resumeStream: {
      post: {
        title: "AI स्ट्रीम फिर शुरू करें",
        description:
          "हेडलेस AI टर्न चलाकर मौजूदा थ्रेड आगे बढ़ाएँ। एसिंक रिमोट टास्क पूरा होने के बाद इस्तेमाल होता है (callbackMode=wait या wakeUp)। मॉडल और स्किल एक साथ लोड करने के लिए favoriteId दें, या modelId और skillId साफ़ दें।",
        fields: {
          threadId: {
            title: "थ्रेड ID",
            description: "आगे बढ़ाने वाले मौजूदा थ्रेड का UUID।",
          },
          favoriteId: {
            title: "फ़ेवरेट ID",
            description:
              "मॉडल और स्किल लोड करने के लिए सेव किए फ़ेवरेट का UUID। दोनों सेट हों तो modelId/skillId पर भारी पड़ता है।",
          },
          modelId: {
            title: "मॉडल ID",
            description:
              "दोबारा शुरू हुए टर्न के लिए AI मॉडल। favoriteId दिया हो तो ज़रूरी नहीं।",
          },
          skillId: {
            title: "स्किल ID",
            description:
              "दोबारा शुरू हुए टर्न के लिए स्किल/पर्सोना। favoriteId दिया हो तो ज़रूरी नहीं।",
          },
          callbackMode: {
            title: "कॉलबैक मोड",
            description:
              "शुरुआती टूल कॉल का कॉलबैक मोड (wait या wakeUp)। इसी से तय होता है कि रिज़्यूम कैसे होगा।",
          },
          wakeUpToolMessageId: {
            title: "WakeUp टूल मैसेज ID",
            description: "नतीजा भरे हुए मूल टूल कॉल मैसेज की ID।",
          },
          wakeUpTaskId: {
            title: "WakeUp टास्क ID",
            description:
              "मूल रिमोट क्रॉन टास्क की ID, रिवाइवल के बाद हटा दी जाती है।",
          },
          resumeTaskId: {
            title: "रिज़्यूम टास्क ID",
            description:
              "इसी resume-stream क्रॉन टास्क की ID, रिवाइवल के बाद हटा दी जाती है।",
          },
          resumed: {
            title: "फिर शुरू हुआ",
            description: "थ्रेड सफलतापूर्वक आगे बढ़ा या नहीं।",
          },
          lastAiMessageId: {
            title: "आख़िरी AI मैसेज ID",
            description:
              "बने हुए आख़िरी असिस्टेंट मैसेज का UUID। कोई मैसेज न बना हो तो Null।",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "पैरामीटर ग़लत हैं। threadId वैध UUID होना चाहिए",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          forbidden: {
            title: "मनाही",
            description: "एक्सेस नहीं मिला",
          },
          notFound: {
            title: "नहीं मिला",
            description: "थ्रेड या मॉडल नहीं मिला",
          },
          internal: {
            title: "सर्वर एरर",
            description: "स्ट्रीम रिज़्यूम के दौरान सर्वर में एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलावों में टकराव है",
          },
          conflict: {
            title: "टकराव",
            description: "टकराव हुआ",
          },
        },
        success: {
          title: "स्ट्रीम फिर शुरू हुई",
          description: "AI थ्रेड सफलतापूर्वक आगे बढ़ा",
        },
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
      back: "वापस",
      welcome: {
        title: "सब कुछ एक AI में। हर काम के लिए सही AI।",
        line1:
          "रोज़मर्रा की बातचीत के लिए एक कंपैनियन। कोडिंग, रिसर्च, लिखने के लिए स्पेशलिस्ट। काम के हिसाब से जब चाहें एक चुनें।",
        line2: "चैट वही रहती है। ज़रूरत पड़ने पर आप स्विच करते हैं। बस कुछ सेकंड।",
        line3: "एक मिनट से कम में आपका सेटअप तैयार करते हैं।",
        continue: "शुरू करें",
      },
      guest: {
        title: "आप गेस्ट की तरह ब्राउज़ कर रहे हैं",
        line1: "आपकी सेटिंग्स, कंपैनियन और चैट हिस्ट्री सिर्फ़ इसी डिवाइस पर सेव हैं।",
        line2:
          "सारे डिवाइस पर सब कुछ सिंक रखने के लिए साइन इन करें, ताकि आपका सेटअप कभी न खोए।",
        signIn: "साइन इन / अकाउंट बनाएँ",
        continueAnyway: "गेस्ट के तौर पर जारी रखें",
        note: "आप कभी भी मेन्यू से बाद में साइन इन कर सकते हैं।",
      },
      companion: {
        title: "अपना कंपैनियन चुनें",
        subtitle: "रोज़ के इस्तेमाल के लिए आपका मुख्य चैट पार्टनर",
        modelTitle: "इसे कौन सा मॉडल चलाए?",
        customSetup: "एडवांस्ड सेटअप →",
        next: "आगे",
        selectFirst: "आगे बढ़ने के लिए कंपैनियन चुनें",
      },
      usecases: {
        title: "आप इसे ज़्यादातर किस काम के लिए इस्तेमाल करेंगे?",
        subtitle: "हम सही स्पेशलिस्ट आपके AI के टूलकिट में अपने-आप जोड़ देंगे।",
        saving: "सेटअप हो रहा है...",
        start: "चैट शुरू करें",
        hintNoneSelected:
          "स्पेशलिस्ट स्किल के लिए क्षेत्र चुनें, या छोड़ने के लिए शुरू करें पर टैप करें",
        noProviderAvailable:
          "कोई AI प्रोवाइडर कॉन्फ़िगर नहीं है। आगे बढ़ने के लिए OPENROUTER_API_KEY जोड़ें या Claude Code चालू करें (CLAUDE_CODE_ENABLED=true)।",
        coding: {
          label: "कोडिंग और टेक",
          hint: "Vibe Coder, Coder",
        },
        research: {
          label: "रिसर्च और विश्लेषण",
          hint: "Researcher, Data Analyst",
        },
        writing: {
          label: "लिखना और एडिटिंग",
          hint: "Writer, Editor",
        },
        business: {
          label: "बिज़नेस और स्ट्रैटेजी",
          hint: "Business Advisor, Product Manager",
        },
        learning: {
          label: "सीखना और पढ़ाई",
          hint: "Tutor, Socratic Questioner",
        },
        creative: {
          label: "क्रिएटिव और कहानियाँ",
          hint: "Storyteller, Creative",
        },
        health: {
          label: "सेहत और करियर",
          hint: "Health Wellness, Career Coach",
        },
        controversial: {
          label: "आज़ाद सोच",
          hint: "Uncensored, Philosopher",
        },
        roleplay: {
          label: "रोलप्ले और किरदार",
          hint: "Roleplay, Character Creator",
        },
      },
    },
    input: {
      placeholder: "मैसेज भेजें...",
      imagePlaceholder: "जो इमेज बनानी है उसका वर्णन करें...",
      audioPlaceholder: "जो ऑडियो या म्यूज़िक बनाना है उसका वर्णन करें...",
      noPermission: "आपको यहाँ पोस्ट करने की अनुमति नहीं है",
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
      unconfiguredTitle: "वॉइस सेट नहीं है",
      unconfiguredDescription: "इस स्किल के लिए टेक्स्ट-टू-स्पीच उपलब्ध नहीं है।",
      callMode: "कॉल मोड",
      callModeDescription: "AI आवाज़ में जवाब देगा",
      tapToRecord: "रिकॉर्ड करने के लिए टैप करें",
      recording: {
        paused: "रुका हुआ",
        resume: "जारी रखें",
        pause: "रोकें",
      },
      callOverlay: {
        listening: "सुन रहा है...",
      },
      actions: {
        cancel: "रद्द करें",
        toInput: "इनपुट में डालें",
        sendVoice: "वॉइस भेजें",
        retry: "दोबारा कोशिश करें",
        download: "ऑडियो डाउनलोड करें",
        downloadHint: "फ़ाइल डाउनलोड करें और उसे अपने अगले मैसेज में अटैच करें।",
      },
    },
    actions: {
      cancellingGeneration: "रद्द हो रहा है...",
      stopGeneration: "रोकें",
      sendMessage: "भेजें",
    },
    toolsButton: {
      title: "AI टूल",
      tools: "टूल",
    },
  },
  chat: {
    category: "चैट",
    tags: {
      threads: "थ्रेड",
      folders: "फ़ोल्डर",
      files: "फ़ाइलें",
      messages: "मैसेज",
      characters: "स्किल",
      memories: "मेमोरी",
      favorites: "फ़ेवरेट",
      credits: "क्रेडिट",
      balance: "बैलेंस",
      permissions: "अनुमतियाँ",
      hotkey: "हॉटकी",
      cli: "CLI",
      speech: "आवाज़",
      sharing: "शेयरिंग",
      settings: "सेटिंग्स",
    },
    config: {
      appName: "unbottled.ai",
      folders: {
        private: "प्राइवेट",
        shared: "शेयर्ड",
        public: "पब्लिक",
        incognito: "इनकॉग्निटो",
        background: "बैकग्राउंड",
        remote: "रिमोट",
      },
      foldersShort: {
        private: "प्राइवेट",
        shared: "शेयर्ड",
        public: "पब्लिक",
        incognito: "इनकॉग्निटो",
        background: "बैकग्राउंड",
        remote: "रिमोट",
      },
    },
    enums: {
      role: {
        user: "यूज़र",
        assistant: "असिस्टेंट",
        system: "सिस्टम",
        tool: "टूल",
        error: "एरर",
      },
      threadStatus: {
        active: "एक्टिव",
        archived: "आर्काइव",
        deleted: "डिलीट",
      },
      viewMode: {
        linear: "लीनियर",
        threaded: "थ्रेडेड",
        flat: "फ़्लैट",
        debug: "डीबग",
      },
    },
    components: {
      sidebar: {
        login: "लॉग इन",
        logout: "लॉग आउट",
        footer: {
          account: "अकाउंट",
          profile: "प्रोफ़ाइल",
          balance: "बैलेंस",
          buy: "ख़रीदें",
          freeCreditsLeft: "फ़्री क्रेडिट",
        },
      },
      credits: {
        credit: "{{count}} क्रेडिट",
        credits: "{{count}} क्रेडिट",
      },
      navigation: {
        subscription: "सब्सक्रिप्शन और क्रेडिट",
        referral: "रेफ़रल प्रोग्राम",
        help: "मदद",
        about: "हमारे बारे में",
      },
      confirmations: {
        deleteMessage: "क्या आप सच में यह मैसेज हटाना चाहते हैं?",
      },
      welcomeTour: {
        authDialog: {
          title: "प्राइवेट और शेयर्ड फ़ोल्डर अनलॉक करें",
          description:
            "प्राइवेट और शेयर्ड फ़ोल्डर के लिए साइन अप या लॉग इन करें। आपकी चैट सारे डिवाइस पर सिंक रहेंगी।",
          continueTour: "टूर जारी रखें",
          signUp: "साइन अप / लॉग इन",
        },
        buttons: {
          back: "वापस",
          close: "बंद करें",
          last: "पूरा करें",
          next: "आगे",
          skip: "छोड़ें",
        },
        welcome: {
          title: "{{appName}} में आपका स्वागत है!",
          description:
            "प्राइवेसी-फ़र्स्ट AI प्लेटफ़ॉर्म। {{modelCount}} मॉडल, कंटेंट फ़िल्टरिंग पर आपका कंट्रोल और अभिव्यक्ति की आज़ादी।",
          subtitle: "शुरू करने के लिए एक छोटा टूर लेते हैं।",
        },
        aiCompanion: {
          title: "अपना AI कंपैनियन चुनें",
          description:
            "{{modelCount}} AI मॉडल में से चुनें: मेनस्ट्रीम, ओपन-सोर्स और अनसेंसर्ड, सब कुछ।",
          tip: "मॉडल सेलेक्टर खोलने और अपना कंपैनियन चुनने के लिए क्लिक करें।",
        },
        rootFolders: {
          title: "आपके चैट फ़ोल्डर",
          description:
            "अपनी चैट अलग-अलग फ़ोल्डर में रखें। हर फ़ोल्डर की प्राइवेसी सेटिंग अलग है:",
          private: {
            name: "प्राइवेट",
            suffix: "(सिर्फ़ आप देख सकते हैं)",
          },
          incognito: {
            name: "इनकॉग्निटो",
            suffix: "(कोई हिस्ट्री सेव नहीं होती)",
          },
          shared: {
            name: "शेयर्ड",
            suffix: "(दूसरों के साथ मिलकर काम करें)",
          },
          public: {
            name: "पब्लिक",
            suffix: "(सबको दिखता है)",
          },
        },
        privateFolder: {
          name: "प्राइवेट",
          suffix: "फ़ोल्डर",
          description:
            "आपकी प्राइवेट चैट सिर्फ़ आपको दिखती हैं। संवेदनशील विषयों के लिए एकदम सही।",
        },
        incognitoFolder: {
          name: "इनकॉग्निटो",
          suffix: "फ़ोल्डर",
          description:
            "हिस्ट्री सर्वर पर सेव किए बिना चैट करें। मैसेज आपके ब्राउज़र में लोकल सेव रहते हैं और आपके मिटाने तक बने रहते हैं।",
          note: "इनकॉग्निटो सेशन में हमारे सर्वर पर कोई डेटा सेव नहीं होता (बनाया गया मीडिया तकनीकी वजहों से कुछ समय के लिए सेव रहता है)।",
        },
        sharedFolder: {
          name: "शेयर्ड",
          suffix: "फ़ोल्डर",
          description: "इस फ़ोल्डर का एक्सेस देकर चुने हुए लोगों के साथ मिलकर काम करें।",
        },
        publicFolder: {
          name: "पब्लिक",
          suffix: "फ़ोल्डर",
          description:
            "अपनी AI बातचीत पूरी दुनिया के साथ शेयर करें। दूसरे आपके थ्रेड देख और फ़ोर्क कर सकते हैं।",
          note: "पब्लिक में सब कुछ सभी यूज़र और सर्च इंजन को दिखता है।",
        },
        newChatButton: {
          title: "नई चैट शुरू करें",
          description: "किसी भी फ़ोल्डर में नई बातचीत शुरू करने के लिए यहाँ क्लिक करें।",
        },
        sidebarLogin: {
          title: "और पाने के लिए साइन इन करें",
          description:
            "फ़्री अकाउंट बनाएँ। प्राइवेट और शेयर्ड फ़ोल्डर पाएँ, सारे डिवाइस पर बातचीत की हिस्ट्री सिंक रखें और AI को अपने बारे में चीज़ें याद रखने दें।",
          tip: "साइन अप फ़्री है!",
        },
        subscriptionButton: {
          title: "क्रेडिट और सब्सक्रिप्शन",
          description:
            "सिर्फ़ {{price}}/महीना के सब्सक्रिप्शन में हर महीने {{credits}} क्रेडिट पाएँ। फ़्री अकाउंट को हर महीने {{freeCredits}} क्रेडिट मिलते हैं, न्यूज़लेटर के साथ {{freeCreditsMax}}।",
        },
        chatInput: {
          title: "अपना मैसेज लिखें",
          description:
            "अपना मैसेज यहाँ लिखें और अपने AI कंपैनियन से चैट करने के लिए Enter दबाएँ या भेजें पर क्लिक करें।",
          tip: "नई लाइन के लिए Shift+Enter इस्तेमाल करें। आप फ़ाइलें और इमेज भी अटैच कर सकते हैं।",
        },
        voiceInput: {
          title: "वॉइस इनपुट",
          description: "अपने AI कंपैनियन से बोलने के लिए माइक्रोफ़ोन इस्तेमाल करें:",
          options: {
            transcribe: "बोली को टेक्स्ट में बदलें",
            sendAudio: "ऑडियो सीधे AI को भेजें",
            pauseResume: "रिकॉर्डिंग रोकें और फिर शुरू करें",
          },
        },
        callMode: {
          title: "कॉल मोड",
          description:
            "हैंड्स-फ़्री, आवाज़ वाली बातचीत और रियल-टाइम AI जवाबों के लिए कॉल मोड चालू करें।",
          tip: "चलते-फिरते या टाइप करने से ज़्यादा बोलना पसंद हो तो बढ़िया।",
        },
        complete: {
          title: "सब तैयार है!",
          description: "टूर पूरा हुआ! अब अपने AI कंपैनियन से चैट शुरू करें।",
          help: "मदद चाहिए? साइडबार में सवालिया निशान के आइकन पर कभी भी क्लिक करें।",
        },
        authUnlocked: {
          unlocked: "अनलॉक हो गया!",
          privateDescription:
            "आपका प्राइवेट फ़ोल्डर अब उपलब्ध है। यहाँ की सारी चैट सिर्फ़ आपको दिखती हैं।",
          privateNote: "प्राइवेट चैट आपके सारे डिवाइस पर अपने-आप सिंक होती हैं।",
          sharedDescription:
            "आपका शेयर्ड फ़ोल्डर अब उपलब्ध है। AI बातचीत पर साथ काम करने के लिए दूसरों को बुलाएँ।",
          sharedNote: "आपके शेयर्ड फ़ोल्डर और थ्रेड का एक्सेस किसे मिले, यह आप तय करते हैं।",
        },
      },
    },
    selector: {
      loading: "लोड हो रहा है...",
      best: "सबसे सही",
      free: "फ़्री",
      creditsSingle: "1 क्रेडिट",
      creditsExact: "{{cost}} क्रेडिट",
      modelOnly: "सिर्फ़ मॉडल",
      editModelSettings: "मॉडल सेटिंग्स एडिट करें",
      editSettings: "सेटिंग्स एडिट करें",
      switchSkill: "स्किल बदलें",
      editSkill: "स्किल एडिट करें",
      delete: "हटाएँ",
      autoSelectedModel: "फ़िल्टर के हिसाब से",
      manualSelectedModel: "हाथ से चुना गया",
      intelligence: "समझदारी",
      contentFilter: "कंटेंट",
      maxPrice: "अधिकतम कीमत",
      modelSelection: "मॉडल चुनाव",
      autoModeDescription: "आपके फ़िल्टर के हिसाब से सबसे अच्छा मॉडल चुना जाता है",
      manualModeDescription: "कोई ख़ास मॉडल खुद चुनें",
      autoMode: "फ़िल्टर के हिसाब से",
      manualMode: "मैन्युअल",
      allModelsCount: "सभी {{count}} मॉडल",
      filteredModelsCount: "{{count}} मॉडल फ़िल्टर से मेल खाते हैं",
      showFiltered: "फ़िल्टर किए हुए दिखाएँ",
      showAllModels: "सारे मॉडल दिखाएँ",
      showLess: "कम दिखाएँ",
      showMore: "{{remaining}} और दिखाएँ",
      showLegacyModels_one: "{{count}} लेगेसी मॉडल दिखाएँ",
      showLegacyModels_other: "{{count}} लेगेसी मॉडल दिखाएँ",
      noMatchingModels: "कोई मॉडल मेल नहीं खाता",
      noModelsWarning: "आपके फ़िल्टर से कोई मॉडल मेल नहीं खाता",
      useOnce: "एक बार इस्तेमाल करें",
      saveAsDefault: "फ़ेवरेट में जोड़ें",
      deleteSetup: "सेटअप हटाएँ",
      content: "कंटेंट खोजें...",
      characterSetup: "स्किल सेटअप",
      noResults: "कोई नतीजा नहीं",
      add: "फ़ेवरेट में जोड़ें",
      added: "जुड़ गया",
      addNew: "नया जोड़ें",
      searchSkills: "स्किल खोजें...",
      createCustom: "कस्टम बनाएँ",
      customizeSettings: "सेटिंग्स बदलें",
      requirements: {
        characterConflict: "स्किल की ज़रूरतों में टकराव",
        tooLow: "बहुत कम",
        tooHigh: "बहुत ज़्यादा",
        min: "न्यूनतम",
        max: "अधिकतम",
      },
    },
    common: {
      newChat: "नई चैट",
      privateChats: "प्राइवेट चैट",
      search: "सर्च",
      delete: "हटाएँ",
      cancel: "रद्द करें",
      save: "सेव करें",
      edit: "एडिट करें",
      settings: "सेटिंग्स",
      close: "बंद करें",
      toggleSidebar: "साइडबार खोलें/बंद करें",
      lightMode: "लाइट मोड",
      darkMode: "डार्क मोड",
      searchPlaceholder: "खोजें...",
      searchThreadsPlaceholder: "थ्रेड खोजें...",
      searchResults: "सर्च नतीजे",
      noChatsFound: "कोई चैट नहीं मिली",
      noThreadsFound: "कोई थ्रेड नहीं मिला",
      enableTTSAutoplay: "TTS ऑटोप्ले चालू करें",
      disableTTSAutoplay: "TTS ऑटोप्ले बंद करें",
      selector: {
        country: "देश",
        language: "भाषा",
      },
      copyButton: {
        copied: "कॉपी हो गया!",
        copyToClipboard: "क्लिपबोर्ड पर कॉपी करें",
        copyAsMarkdown: "Markdown के रूप में कॉपी करें",
        copyAsText: "टेक्स्ट के रूप में कॉपी करें",
      },
      assistantMessageActions: {
        cancelLoading: "लोडिंग रद्द करें",
        stopAudio: "ऑडियो रोकें",
        playAudio: "ऑडियो चलाएँ",
        answerAsAI: "AI मॉडल के तौर पर जवाब दें",
        deleteMessage: "मैसेज हटाएँ",
      },
      characterSelector: {
        placeholder: "स्किल चुनें",
        addNewLabel: "कस्टम स्किल बनाएँ",
        grouping: {
          bySource: "स्रोत के हिसाब से",
          byCategory: "कैटेगरी के हिसाब से",
          sourceLabels: {
            builtIn: "बिल्ट-इन",
            my: "मेरी स्किल",
            community: "कम्युनिटी",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "कस्टम स्किल बनाएँ",
          fields: {
            name: {
              label: "नाम",
              placeholder: "स्किल का नाम लिखें",
            },
            icon: {
              label: "आइकन (इमोजी)",
              placeholder: "😊",
            },
            description: {
              label: "विवरण",
              placeholder: "स्किल का छोटा विवरण",
            },
            systemPrompt: {
              label: "सिस्टम प्रॉम्प्ट",
              placeholder: "बताएँ कि स्किल कैसे बर्ताव करे...",
            },
            category: {
              label: "कैटेगरी",
            },
          },
          createCategory: "कैटेगरी बनाएँ",
          cancel: "रद्द करें",
          create: "स्किल बनाएँ",
        },
        addCategoryDialog: {
          title: "कैटेगरी बनाएँ",
          fields: {
            name: {
              label: "कैटेगरी का नाम",
              placeholder: "कैटेगरी का नाम लिखें",
            },
            icon: {
              label: "आइकन (इमोजी)",
              placeholder: "📁",
            },
          },
          cancel: "रद्द करें",
          create: "कैटेगरी बनाएँ",
        },
      },
    },
    actions: {
      newChatInFolder: "फ़ोल्डर में नई चैट",
      newFolder: "नया फ़ोल्डर",
      deleteFolder: "फ़ोल्डर हटाएँ",
      deleteMessage: "मैसेज हटाएँ",
      deleteThisMessage: "यह मैसेज हटाएँ",
      searchEnabled: "सर्च चालू है",
      searchDisabled: "सर्च बंद है",
      answerAsAI: "AI मॉडल के तौर पर जवाब दें",
      retry: "दूसरे मॉडल/स्किल से दोबारा कोशिश करें",
      branch: "यहाँ से बातचीत की नई ब्रांच बनाएँ",
      editMessage: "मैसेज एडिट करें",
      stopAudio: "ऑडियो प्लेबैक रोकें",
      playAudio: "ऑडियो चलाएँ",
      copyContent: "क्लिपबोर्ड पर कॉपी करें",
    },
    dialogs: {
      searchAndCreate: "खोजें और बनाएँ",
      deleteChat: 'चैट "{{title}}" हटाएँ?',
      deleteFolderConfirm:
        'फ़ोल्डर "{{name}}" हटाएँ और {{count}} चैट General में ले जाएँ?',
    },
    views: {
      linearView: "लीनियर व्यू (ChatGPT स्टाइल)",
      threadedView: "थ्रेडेड व्यू (Reddit/Discord स्टाइल)",
      flatView: "फ़्लैट व्यू (4chan स्टाइल)",
      debugView: "डीबग व्यू (सिस्टम प्रॉम्प्ट के साथ)",
    },

    screenshot: {
      capturing: "कैप्चर हो रहा है...",
      capture: "स्क्रीनशॉट लें",
      failed: "स्क्रीनशॉट नहीं लिया जा सका",
      failedWithMessage: "स्क्रीनशॉट नहीं लिया जा सका: {{message}}",
      tryAgain: "स्क्रीनशॉट नहीं लिया जा सका। कृपया दोबारा कोशिश करें।",
      noMessages: "चैट मैसेज का हिस्सा नहीं मिला। पक्का करें कि चैट में मैसेज मौजूद हैं।",
      quotaExceeded: "स्टोरेज कोटा पूरा हो गया। स्क्रीनशॉट बहुत बड़ा है।",
      canvasError: "स्क्रीनशॉट को इमेज फ़ॉर्मैट में बदला नहीं जा सका।",
    },
    errors: {
      noResponse:
        "AI से कोई जवाब नहीं मिला। रिक्वेस्ट पूरी हुई पर कंटेंट खाली आया। कृपया दोबारा कोशिश करें।",
      noStream: "जवाब स्ट्रीम नहीं हो सका: कोई रीडर उपलब्ध नहीं",
      saveFailed: "एडिट सेव नहीं हुआ",
      branchFailed: "ब्रांच नहीं बन सकी",
      retryFailed: "दोबारा कोशिश फ़ेल हुई",
      answerFailed: "जवाब नहीं दिया जा सका",
      deleteFailed: "हटाया नहीं जा सका",
    },
    errorTypes: {
      streamError: "स्ट्रीम एरर",
    },
    hooks: {
      stt: {
        "endpoint-not-available": "स्पीच-टू-टेक्स्ट एंडपॉइंट उपलब्ध नहीं है",
        "failed-to-start": "रिकॉर्डिंग शुरू नहीं हो सकी",
        "permission-denied":
          "माइक्रोफ़ोन का एक्सेस ब्लॉक है। अपने ब्राउज़र की सेटिंग्स में माइक्रोफ़ोन की अनुमति दें और पेज रीलोड करें।",
        "permission-denied-ios":
          "माइक्रोफ़ोन ब्लॉक है। Settings → Safari → Microphone में जाकर इस साइट को अनुमति दें।",
        "permission-denied-android":
          "माइक्रोफ़ोन ब्लॉक है। एड्रेस बार में लॉक आइकन पर टैप करें → Site settings → Microphone → Allow।",
        "permission-denied-mac":
          "माइक्रोफ़ोन ब्लॉक है। System Settings → Privacy & Security → Microphone खोलें और अपने ब्राउज़र को चालू करें।",
        "permission-denied-windows":
          "माइक्रोफ़ोन ब्लॉक है। Settings → Privacy → Microphone खोलें और पक्का करें कि आपका ब्राउज़र अनुमत है।",
        "no-microphone":
          "कोई माइक्रोफ़ोन नहीं मिला। माइक्रोफ़ोन या हेडसेट जोड़ें और दोबारा कोशिश करें।",
        "microphone-in-use":
          "आपका माइक्रोफ़ोन किसी दूसरे ऐप में इस्तेमाल हो रहा है। उसे बंद करें और दोबारा कोशिश करें।",
        "not-supported":
          "आपका ब्राउज़र माइक्रोफ़ोन एक्सेस सपोर्ट नहीं करता। Chrome, Firefox या Safari आज़माएँ।",
        "transcription-failed": "ऑडियो ट्रांसक्राइब नहीं हो सका",
        "audio-too-short":
          "रिकॉर्डिंग बहुत छोटी है। माइक दबाकर रखें, साफ़ बोलें और दोबारा कोशिश करें।",
      },
      tts: {
        "endpoint-not-available": "टेक्स्ट-टू-स्पीच एंडपॉइंट उपलब्ध नहीं है",
        "failed-to-play": "ऑडियो नहीं चल सका",
        "conversion-failed": "TTS कन्वर्ज़न फ़ेल हुआ",
        "failed-to-generate": "ऑडियो नहीं बन सका",
      },
    },
    post: {
      title: "चैट",
      description: "चैट इंटरफ़ेस",
    },
    models: {
      descriptions: {
        uncensoredLmV11:
          "Uncensored.ai का अपना मॉडल, और अनसेंसर्ड का दूसरा रूप। इस टियर के बाक़ी मॉडल मेनस्ट्रीम मॉडल हैं जिनसे इनकार हटा दिए गए हैं: वही ट्रेनिंग, वही नज़रिया। इसका अपना नज़रिया है। यह उन किताबों और दस्तावेज़ों पर ट्रेन हुआ है जिन्हें मुख्यधारा इंटरनेट से हटा दिया गया, इसलिए इसकी राजनीतिक राय मुख्यधारा से उलटी है। राजनीति, दूसरे नज़रिए और डार्क, वर्जित फ़िक्शन के लिए यही चुनें: न सीन हल्के किए जाते हैं, न उपदेश मिलता है, न आम सहमति की लाइन पर लौटाया जाता है। टूल कॉल करता है, 32K कॉन्टेक्स्ट, सिर्फ़ टेक्स्ट। एक्सपेरिमेंटल है, कोड के लिए नहीं, और विवादित दावों को पक्के तथ्यों की तरह ही सीधे कह देता है, इसलिए उसके तथ्य जाँच लें।",
        freedomgptLiberty:
          "Age of AI का फ़्लैगशिप अनसेंसर्ड मॉडल, वह फ़्री-स्पीच चैटबॉट जिसने यह कैटेगरी शुरू की। ओपन वेट्स पर बना, बिना उपदेश के सीधे जवाबों के लिए ट्यून किया गया। तेज़ और हाज़िरजवाब, 32K कॉन्टेक्स्ट। टूल, कोडिंग और गहरे विश्लेषण में हल्का है: उसके लिए Qwen 3.6 Plus Uncensored ज़्यादा मज़बूत है। सिर्फ़ कम इनकार नहीं, अलग नज़रिया चाहिए तो UncensoredLM लें।",
        gabAiArya:
          "Gab का अनसेंसर्ड असिस्टेंट, जिसे उसके बनाने वाले राजनीतिक दक्षिणपंथ की तरफ़ रखते हैं और जो आम गार्डरेल के बिना जवाब देने के लिए बना है। स्मार्ट, 131K कॉन्टेक्स्ट, इमेज और वीडियो पढ़ता है, टूल कॉल करता है। वह झुकाव जानबूझकर चाहिए तो इसे चुनें। यहाँ अपना नज़रिया रखने वाला दूसरा मॉडल UncensoredLM है। कोडिंग में कमज़ोर, और इसका बेस मॉडल बताया नहीं गया है।",
        gemini31ProPreviewCustomTools:
          "Gemini 3.1 Pro का कस्टम-टूल प्रीव्यू। यह bash पर लौटने के बजाय आपके तय किए टूल कॉल करने के लिए ट्यून किया गया है। कोडिंग एजेंट और मल्टी-टूल वर्कफ़्लो के लिए बना, 1M कॉन्टेक्स्ट और टेक्स्ट, इमेज, वीडियो, ऑडियो इनपुट के साथ। यह प्रीव्यू बिल्ड है। इसी कीमत पर Gemini 4 Argon नया Pro-क्लास विकल्प है।",
        gemini31FlashImagePreview:
          "Google का Gemini 3.1 Flash Image, अभी प्रीव्यू में। चैट के भीतर ही इमेज बनाता और एडिट करता है, एक ही जवाब में टेक्स्ट और तस्वीरें। कैटलॉग का सबसे सस्ता इमेज मॉडल। मेनस्ट्रीम फ़िल्टर, कोई टूल कॉल नहीं, 64K कॉन्टेक्स्ट। जटिल प्रॉम्प्ट और इमेज में साफ़ टेक्स्ट के लिए Nano Banana Pro महँगा है पर ज़्यादा देता है। लेगेसी: Nano Banana 2.1 इसकी जगह लेता है, इमेज की कीमत करीब आधी।",
        gemini31FlashLitePreview:
          "Google का हाई-वॉल्यूम बजट मॉडल, अभी प्रीव्यू में: अनुवाद, रैंकिंग, एक्सट्रैक्शन और तेज़ चैट, 1M कॉन्टेक्स्ट और टेक्स्ट, इमेज, वीडियो, ऑडियो इनपुट के साथ। सस्ता और तेज़, मुश्किल रीज़निंग के लिए नहीं। फिर भी अपने उत्तराधिकारी Gemini 3.5 Flash Lite से सस्ता पड़ता है।",
        gemini3Pro:
          "Google Gemini 3 Pro: बड़े कॉन्टेक्स्ट विंडो और दमदार रीज़निंग वाला एडवांस्ड मल्टीमॉडल AI मॉडल",
        gemini35Flash:
          "Google का Flash मॉडल, जो Pro के क़रीब कोडिंग और रीज़निंग का दावा करता है। एडजस्टेबल थिंकिंग लेवल, 1M कॉन्टेक्स्ट और टेक्स्ट, इमेज, वीडियो, ऑडियो इनपुट। अच्छा है, पर Gemini 3.8 Flash नया है और लगभग आधी कीमत का, तो उस पर आ जाएँ।",
        gemini3Flash:
          "Google का पहला Gemini 3 Flash: कोडिंग और रोज़मर्रा की रीज़निंग में तेज़ और सक्षम, 1M कॉन्टेक्स्ट और टेक्स्ट, इमेज, वीडियो, ऑडियो इनपुट के साथ। अब भी अच्छी वैल्यू और अपने उत्तराधिकारी से सस्ता। ताज़ा चाहिए तो Gemini 3.8 Flash नया विकल्प है।",
        deepseekV32:
          "DeepSeek का 2025 के आख़िर का ओपन-वेट मॉडल, स्पार्स अटेंशन के साथ जो लंबे कॉन्टेक्स्ट का काम सस्ता बनाता है। 671B मिक्सचर-ऑफ़-एक्सपर्ट्स, बहुत कम पैसों में कोडिंग और विश्लेषण में अच्छा, सिर्फ़ टेक्स्ट। DeepSeek V4.1 Flash नया है और और भी सस्ता।",
        deepseekV4Pro:
          "DeepSeek का ओपन-वेट फ़्लैगशिप: 1.6T पैरामीटर का मिक्सचर-ऑफ़-एक्सपर्ट्स जिसमें 49B एक्टिव रहते हैं, MIT लाइसेंस। गहरी रीज़निंग, गंभीर कोड, पूरे कोडबेस का विश्लेषण और मल्टी-स्टेप एजेंट काम, 1M कॉन्टेक्स्ट, टूल कॉल करता है। सिर्फ़ टेक्स्ट। Claude Opus 5.5 की कीमत का एक छोटा हिस्सा। सस्ते, तेज़ रोज़ के कामों के लिए इसका भाई DeepSeek V4.1 Flash है।",
        deepseekV4Flash:
          "DeepSeek का 284B मिक्सचर-ऑफ़-एक्सपर्ट्स Flash मॉडल: 1M कॉन्टेक्स्ट, तेज़, कोडिंग में मज़बूत, हर मैसेज की लागत लगभग शून्य। सिर्फ़ टेक्स्ट। इसका उत्तराधिकारी DeepSeek V4.1 Flash उसी कीमत का है, इसलिए यही ख़ास वर्ज़न न चाहिए तो ऊपर चले जाएँ।",
        gpt55:
          "OpenAI का पुराना टॉप जनरल मॉडल: 1M कॉन्टेक्स्ट पर मज़बूत रीज़निंग, कोडिंग और विश्लेषण, टेक्स्ट और इमेज इनपुट के साथ। अब भी सक्षम, पर प्रीमियम कीमत का, और GPT-6.1 Sol वही काम अब बहुत कम में करता है। कमज़ोर पक्ष: रोलप्ले।",
        gpt55Pro:
          "GPT-5.5 का एक्सटेंडेड-रीज़निंग Pro टियर, जो मुश्किल और ऊँचे दाँव वाली समस्याओं पर कहीं ज़्यादा कंप्यूट लगाने के लिए बना है। कैटलॉग के सबसे महँगे मॉडल में से एक, तभी लें जब ग़लत जवाब की कीमत मैसेज से ज़्यादा हो। GPT-6 Astra नया विकल्प है, करीब एक-तिहाई कीमत पर।",
        gpt54Pro:
          "GPT-5.4 का अधिकतम-कंप्यूट Pro वर्ज़न, मुश्किल रीज़निंग, रिसर्च और ऊँचे दाँव वाले विश्लेषण के लिए, 1M कॉन्टेक्स्ट। धीमा, और यहाँ के सबसे महँगे मॉडल में से एक। GPT-6 Astra यही काम करीब एक-तिहाई कीमत पर करता है।",
        gpt54:
          "वह OpenAI मॉडल जिसने Codex-स्तर की कोडिंग को मुख्य GPT लाइन में मिला दिया, 1M कॉन्टेक्स्ट और इमेज इनपुट के साथ। लंबे दस्तावेज़, कोड और विश्लेषण के लिए ठीक। GPT-6.1 Sol नया है, एक टियर ऊपर रेट किया गया है और हर मैसेज सस्ता पड़ता है, इसलिए रुकने की वजह कम है।",
        gpt53Codex:
          "OpenAI का एजेंटिक कोडिंग स्पेशलिस्ट: लंबे, टूल-भारी डेवलपमेंट सेशन, रीफ़ैक्टर और डीबगिंग, 400K कॉन्टेक्स्ट। कोड में मज़बूत, क्रिएटिव राइटिंग और रोलप्ले में कमज़ोर। GPT-6.1 Sol अब उसी कीमत पर कोडिंग सँभालता है और इसके अलावा भी बहुत कुछ करता है।",
        gpt53Chat:
          "GPT-5.3 Chat: अपडेटेड ChatGPT कन्वर्सेशनल मॉडल, जो ज़्यादा सटीक और संदर्भ वाले जवाब देता है और फ़ालतू इनकार और चेतावनियाँ काफ़ी कम करता है",
        gpt52Pro:
          "सबसे मुश्किल समस्याओं के लिए एक्सटेंडेड रीज़निंग वाला GPT-5.2: गहरी रिसर्च, पेचीदा गणित, ध्यान से कोड रिव्यू। धीमा और बहुत महँगा। GPT-6 Astra मौजूदा Pro-क्लास चुनाव है और आधे से भी काफ़ी कम कीमत का है।",
        gpt52:
          "OpenAI का 2025 के आख़िर का पेशेवर कामों का वर्कहॉर्स: कोडिंग, लंबे दस्तावेज़ और स्ट्रक्चर्ड विश्लेषण, 400K कॉन्टेक्स्ट और इमेज इनपुट के साथ। भरोसेमंद, पर अब वैल्यू वाला चुनाव नहीं। GPT-6.1 Sol की कीमत लगभग उतनी ही है और वह नया है।",
        gpt52_chat:
          "GPT-5.2 का तेज़, ChatGPT-स्टाइल वर्ज़न: लंबी सोच के बिना बातचीत वाले जवाब, 128K कॉन्टेक्स्ट। रोज़ की चैट और ड्राफ़्ट के लिए अच्छा। अपने भाइयों से कम कॉन्टेक्स्ट, और GPT-6.1 Terra अब यही काम करीब आधी कीमत पर करता है।",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B: Mistral पर आधारित अनसेंसर्ड लार्ज लैंग्वेज मॉडल",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B: Llama 3 पर आधारित अनसेंसर्ड लार्ज लैंग्वेज मॉडल",
        veniceUncensored:
          "Venice का अपना अनसेंसर्ड मॉडल, Venice एडिशन में Dolphin Mistral 24B। कहीं भी सबसे कम इनकार दर में से एक: फ़िक्शन, खुली बेरोकटोक बातचीत। इमेज पढ़ता है, 128K कॉन्टेक्स्ट, सस्ता। यह डीसेंसरिंग फ़ाइन-ट्यून है: इनकार हट गए, पर राजनीति और सबसे डार्क सीन पर Mistral का नज़रिया अब भी है। अलग नज़रिए के लिए UncensoredLM लें। कोड और भारी विश्लेषण में कमज़ोर। उसके लिए Qwen 3.6 Plus Uncensored लें।",
        veniceUncensoredRoleplay:
          "Venice का 24B मॉडल जो रोलप्ले के लिए ट्यून है और जिसकी ट्रेनिंग से इनकार निकाल दिए गए हैं। किरदार लंबे कैंपेन में अपनी आवाज़ बनाए रखते हैं, कहानी के बीच नैतिक ब्रेक नहीं। इमेज पढ़ता है, 128K कॉन्टेक्स्ट। इनकार हटाए गए, बेस नज़रिया रहा, इसलिए सबसे डार्क और वर्जित सामग्री के लिए UncensoredLM और आगे जाता है। यह लंबे कैंपेन और इमेज इनपुट में जीतता है। यह कहानीकार है, असिस्टेंट नहीं, इसलिए विश्लेषण या कोड के लिए छोड़ दें।",
        gemma4Uncensored:
          "Google का Gemma 4 26B मिक्सचर-ऑफ़-एक्सपर्ट्स, फ़िल्टर हटाकर, Venice से सर्व किया जाता है। तेज़, सस्ता, इमेज पढ़ता है, टूल कॉल करता है, 256K कॉन्टेक्स्ट। इनकार हटाए गए, Google की ट्रेनिंग और नज़रिया रहा: गर्म विषयों पर यह जवाब देता है, पर Google की फ़्रेमिंग में। इनकार के बिना ज़्यादा कठिन रीज़निंग के लिए GLM 5.3 Flash Uncensored थोड़ा महँगा है और आगे जाता है।",
        qwen36PlusUncensored:
          "Alibaba का Qwen 3.6 Plus रीज़निंग मॉडल, इनकार हटाकर, Venice से सर्व किया जाता है। अनसेंसर्ड सेट में सबसे मज़बूत कोडर और विश्लेषकों में से एक। इमेज पढ़ता है, टूल कॉल करता है, 256K कॉन्टेक्स्ट। अब इनकार नहीं करता, पर Qwen की ट्रेनिंग और नज़रिया बने रहते हैं। राजनीति पर अलग राय के लिए UncensoredLM का अपना नज़रिया है। फ़्लैश मॉडल से महँगा। GLM 5.3 Uncensored दूसरा भारी खिलाड़ी है, 1M कॉन्टेक्स्ट के साथ पर सिर्फ़ टेक्स्ट।",
        glm47FlashHeretic:
          "Abliterated GLM 4.7 Flash: इनकार का बर्ताव निकाल दिया गया है, इसलिए यह भाषण देने के बजाय जवाब देता है। हर मैसेज चंद पैसों का, तेज़, टूल कॉल करता है, बेरोकटोक चैट और क्रिएटिव राइटिंग के लिए अच्छा। वही ट्रेनिंग, वही नज़रिया जो बेस GLM का है: बस अब बचता नहीं। गहरे विश्लेषण में कमज़ोर। थोड़े ज़्यादा पैसों में GLM 5.3 Flash Uncensored नया, ज़्यादा समझदार अनसेंसर्ड चुनाव है।",
        glm53Abliterated:
          "पूरा GLM 5.3, जिसके वेट्स से Abliteration.ai ने इनकार काट दिए हैं। फ़्रंटियर रीज़निंग, टूल, 1M कॉन्टेक्स्ट। भारी खिलाड़ी। कोई इनकार नहीं, पर बेस GLM की ट्रेनिंग और फ़्रेमिंग बनी रहती है।",
        deepseekV41FlashAbliterated:
          "Abliteration.ai का बिना इनकार वाला DeepSeek V4.1 Flash। 552B MoE, गहरी रीज़निंग, इमेज पढ़ता है, टूल कॉल करता है। 1M कॉन्टेक्स्ट। यह मना करना बंद कर देता है, DeepSeek की अपनी फ़्रेमिंग बनी रहती है।",
        mimoV26FlashAbliterated:
          "Xiaomi का MiMo V2.6 Flash, जिसकी इनकार वाली दिशा हटा दी गई है। तेज़, इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। बड़े वॉल्यूम के बेरोकटोक काम के लिए अच्छा, पर गहराई छोड़कर रफ़्तार लेता है, और बेस मॉडल का नज़रिया बना रहता है। GLM 5.3 Flash Uncensored से दोगुने से ज़्यादा महँगा, जो लगभग यही काम करता है।",
        glm53Uncensored:
          "Z.AI का पूरा GLM 5.3 रीज़निंग मॉडल, इनकार हटाकर। अनसेंसर्ड सेट का भारी खिलाड़ी: कोड, लंबी राइटिंग, विश्लेषण और टूल, 1M कॉन्टेक्स्ट। इनकार हटे हैं, नज़रिया वही: राजनीति पर यह बेस GLM की फ़्रेमिंग में जवाब देता है। मुख्यधारा के उलट राजनीतिक राय के लिए UncensoredLM लें। सिर्फ़ टेक्स्ट, फ़्लैश मॉडल से धीमा, अभी एक्सपेरिमेंटल। रोज़ के लिए GLM 5.3 Flash Uncensored सस्ता और तेज़ विकल्प है।",
        glm53FlashUncensored:
          "Z.AI का GLM 5.3 Flash, इनकार हटाकर: 320B मिक्सचर-ऑफ़-एक्सपर्ट्स। तेज़, सस्ता, इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। बेरोकटोक काम का रोज़ का साथी। यह बचना बंद कर देता है, पर बेस GLM की ट्रेनिंग और नज़रिया, राजनीति समेत, बना रहता है। अलग नज़रिया UncensoredLM का है। सबसे कठिन रीज़निंग के लिए पूरे GLM 5.3 Uncensored पर जाएँ।",
        veniceLustifyV8:
          "फ़ोटोरियल एडल्ट इमेजरी के लिए ट्यून किया गया SDXL चेकपॉइंट, Venice.ai से सर्व होता है। अनसेंसर्ड: न ब्लर, न इनकार। हमारे सबसे सस्ते इमेज मॉडल में से एक। शरीर और त्वचा के लिए बना है, इमेज में टेक्स्ट, जटिल सीन या आर्ट स्टाइल के लिए नहीं। Chroma की आर्टिस्टिक रेंज ज़्यादा है।",
        veniceChroma:
          "FLUX.1 schnell पर बना ओपन-वेट मॉडल, कंटेंट फ़िल्टरिंग के बिना दोबारा ट्रेन किया गया, Venice.ai से सर्व होता है। लंबे प्रॉम्प्ट और आर्ट स्टाइल की बड़ी रेंज सँभालता है, एक्सप्लिसिट कंटेंट समेत। हर इमेज सस्ती। फ़ोटोरियल न्यूडिटी में Lustify v8 जितना स्पेशलाइज़्ड नहीं, और सिर्फ़ टेक्स्ट इनपुट। मौजूदा इमेज बदलने के लिए Qwen Edit Uncensored इस्तेमाल करें।",
        veniceQwenEdit:
          "Alibaba के Qwen इमेज-एडिट मॉडल पर बना अनसेंसर्ड इमेज एडिटिंग, Venice.ai से सर्व होता है। रेफ़रेंस इमेज और निर्देश दें: एलिमेंट बदलें, स्टाइल बदलें, कपड़े बदलें, सीन दोबारा बनाएँ। न ब्लर, न इनकार। Chroma या Lustify v8 से महँगा, जो सिर्फ़ टेक्स्ट से बनाते हैं।",
        veniceFireredImageEdit:
          "Venice.ai से सर्व होने वाला प्रॉम्प्ट-चालित इमेज एडिटर। बदलाव बताइए, यह ठीक वही एडिट करता है और बाक़ी इमेज को छेड़ता नहीं। अनसेंसर्ड टियर, कोई इनकार नहीं, पर Qwen Edit Uncensored की तरह एक्सप्लिसिट आउटपुट के लिए टैग नहीं। कीमत Qwen Edit के बराबर। मुश्किल एडिट पर दोनों आज़माएँ।",
        claudeOpus45:
          "Anthropic का नवंबर 2025 का Opus, अपने समय का टॉप कोडिंग और एजेंट मॉडल और बहुत कम कीमत वाला पहला Opus। ध्यान से लिखने और जटिल कोड में बेहतरीन, 200K कॉन्टेक्स्ट। विवादित विषयों पर सतर्क। Claude Opus 5.5 नया और सस्ता है।",
        claudeOpus46:
          "Anthropic का फ़रवरी 2026 का Opus, 1M कॉन्टेक्स्ट विंडो वाला पहला Opus। लंबी एजेंटिक कोडिंग, गहरे विश्लेषण और ध्यान से की गई राइटिंग में मज़बूत। प्रीमियम कीमत, मेनस्ट्रीम फ़िल्टर, विवादित विषयों पर सतर्क। Claude Opus 5.5 नया और सस्ता है।",
        claudeOpus47:
          "2026 का Opus रिलीज़ जो 4.6 और 4.8 के बीच आता है: 1M कॉन्टेक्स्ट पर गहरी रीज़निंग, जटिल कोडिंग और लंबी राइटिंग। प्रीमियम कीमत, विवादित विषयों पर सतर्क। Claude Opus 5.5 इसकी जगह लेता है और हर मैसेज सस्ता है।",
        claudeOpus48:
          "आख़िरी Opus 4 रिलीज़, लंबे एजेंटिक काम, जटिल कोडिंग और बहुत लंबे आउटपुट के लिए, 1M कॉन्टेक्स्ट और इमेज इनपुट के साथ। प्रीमियम, मेनस्ट्रीम फ़िल्टर, विवादित विषयों पर सतर्क। Claude Opus 5.5 नया और सस्ता है।",
        claudeSonnet46:
          "Anthropic का 2026 की शुरुआत का Sonnet, कोडिंग, एजेंट और ऑफ़िस वाले कामों में 4.5 से बेहतर, 1M कॉन्टेक्स्ट। मेनस्ट्रीम फ़िल्टर, विवादित विषयों पर सतर्क। Claude Sonnet 5.5 इसकी जगह लेता है और हर मैसेज सस्ता है।",
        claudeHaiku45:
          "Anthropic का अक्टूबर 2025 का छोटा मॉडल: तेज़, रोज़ की कोडिंग और इमेज पढ़ने में अच्छा, 200K कॉन्टेक्स्ट। मेनस्ट्रीम फ़िल्टर, विवादित विषयों पर सतर्क। Claude Haiku 5.5 अब करीब दसवें हिस्से की कीमत का है, इसलिए बदलना आसान है।",
        glm5_1:
          "Z.AI का लंबे समय के काम के लिए बना कोडिंग मॉडल, जो एक ही काम पर घंटों जुटे रहने का दावा करता है। प्लानिंग, कोडिंग और मल्टी-स्टेप एजेंट रन में मज़बूत, 200K कॉन्टेक्स्ट, सिर्फ़ टेक्स्ट, खुला कंटेंट लेवल। GLM-5.3 नया है और बहुत सस्ता, पर एक टियर नीचे। Kimi K3 मौजूदा मज़बूत ओपन विकल्प है।",
        glm5: "Z.AI का 2026 की शुरुआत का ओपन-वेट फ़्लैगशिप, सिस्टम डिज़ाइन और लंबे एजेंट वर्कफ़्लो के लिए बना। मज़बूत रीज़निंग और कोडिंग, खुला कंटेंट लेवल, 200K कॉन्टेक्स्ट, सिर्फ़ टेक्स्ट। GLM-5.3 नया और बहुत सस्ता है पर समझदारी में एक टियर नीचे। Kimi K3 ज़्यादा मज़बूत ओपन विकल्प है।",
        glm5Turbo:
          "एजेंट लूप के लिए ट्यून किया गया तेज़ GLM-5: तेज़ इनफ़रेंस, साफ़ टास्क ब्रेकडाउन और टिकाऊ लंबे रन। टूल-भारी ऑटोमेशन के लिए अच्छा, 200K कॉन्टेक्स्ट, सिर्फ़ टेक्स्ट, खुला कंटेंट लेवल। GLM-5.3 आज यही काम बहुत कम कीमत पर करता है।",
        glm46:
          "Z.AI का सितंबर 2025 का रिलीज़, जिसने कॉन्टेक्स्ट 200K किया और कोडिंग व एजेंट इस्तेमाल सुधारा। अब भी ठीक-ठाक द्विभाषी ऑल-राउंडर, खुला कंटेंट लेवल, सिर्फ़ टेक्स्ट। GLM-5.3 नया और सस्ता है।",
        glm47:
          "Z.AI का दिसंबर 2025 का रिलीज़, चीनी-अंग्रेज़ी द्विभाषी ऑल-राउंडर, 4.6 से बेहतर कोडिंग और रीज़निंग। चैट, विश्लेषण और एजेंट टास्क के लिए ठीक, 200K कॉन्टेक्स्ट, सिर्फ़ टेक्स्ट, खुला कंटेंट लेवल। GLM-5.3 नया है और करीब चौथाई कीमत का।",
        glm47Flash:
          "छोटा, तेज़ GLM 4.7 और यहाँ के सबसे सस्ते मॉडल में से एक। तेज़ चैट, आसान टूल कॉल और बल्क टेक्स्ट काम के लिए अच्छा, 200K कॉन्टेक्स्ट। गहरी रीज़निंग में हल्का। GLM-5.3 Flash नया है पर लगभग दोगुना महँगा।",
        kimiK2:
          "Moonshot AI का जुलाई 2025 का ओपन-वेट मॉडल, 1T पैरामीटर का मिक्सचर-ऑफ़-एक्सपर्ट्स जिसने एजेंटिक टूल इस्तेमाल और कोडिंग में नाम बनाया। तेज़, खुला कंटेंट लेवल, 262K कॉन्टेक्स्ट, सिर्फ़ टेक्स्ट। थिंकिंग मोड नहीं। Kimi K3 नया फ़्लैगशिप है, करीब दोगुनी कीमत पर।",
        kimiK2_5:
          "Moonshot का जनवरी 2026 का Kimi, इमेज इनपुट के साथ नेटिव मल्टीमॉडल। लंबे कॉन्टेक्स्ट की कोडिंग, स्क्रीनशॉट से कोड बनाने और क्रिएटिव राइटिंग में मज़बूत, खुले कंटेंट फ़िल्टर और 262K कॉन्टेक्स्ट के साथ। Kimi K3 नया है पर करीब दोगुना महँगा।",
        kimiK2_6:
          "Moonshot का Kimi K2.6, लंबे समय की कोडिंग, प्रॉम्प्ट या स्क्रीनशॉट से UI बनाने और कई सब-एजेंट एक साथ चलाने पर केंद्रित। तेज़ और स्मार्ट, इमेज इनपुट, 262K कॉन्टेक्स्ट, खुला कंटेंट लेवल। Kimi K3 नया है, ऊँची कीमत पर।",
        claudeSonnet45:
          "Anthropic का सितंबर 2025 का Sonnet, मज़बूत कोडिंग और लंबे ऑटोनॉमस एजेंट सेशन के लिए जाना जाता है। अब भी अच्छा कोडर और लेखक, यहाँ 1M कॉन्टेक्स्ट के साथ। विवादित विषयों पर सतर्क, रोलप्ले में कमज़ोर। Claude Sonnet 5.5 नया है और हर मैसेज सस्ता।",
        claudeAgentSonnet:
          "Claude Agent Sonnet: Anthropic के Agent SDK के ज़रिए Claude Sonnet से चलने वाला ऑटोनॉमस AI एजेंट। बिल्ट-इन रीज़निंग के साथ टूल खुद चलाता है।",
        claudeAgentHaiku:
          "Claude Agent Haiku: Anthropic के Agent SDK के ज़रिए Claude Haiku से चलने वाला तेज़ ऑटोनॉमस AI एजेंट। टूल एग्ज़ीक्यूशन के साथ रफ़्तार के लिए ऑप्टिमाइज़्ड।",
        claudeAgentOpus:
          "Claude Agent Opus: Anthropic के Agent SDK के ज़रिए Claude Opus से चलने वाला सबसे ताक़तवर ऑटोनॉमस AI एजेंट। टूल एग्ज़ीक्यूशन के साथ अधिकतम समझदारी।",
        grok4:
          "xAI का जुलाई 2025 का फ़्लैगशिप, रीज़निंग मॉडल जो जवाब देने से पहले हमेशा सोचता है। गणित, विज्ञान और विश्लेषण में मज़बूत, ज़्यादातर मेनस्ट्रीम मॉडल से हल्के कंटेंट फ़िल्टर। सादे चैट मॉडल से धीमा। Grok 4.7 मौजूदा Grok है, ऊँची कीमत पर।",
        grok4Fast:
          "xAI का पुराना स्पीड-ट्यून Grok। xAI ने सस्ता Fast टियर बंद कर दिया, इसलिए यह नाम अब Grok 4.3 पर Grok 4.3 की कीमत में चलता है। इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट, खुली कंटेंट पॉलिसी। Grok 4.7 इसकी जगह लेता है और आउटपुट की करीब दोगुनी कीमत पर कहीं गहरी रीज़निंग करता है। सस्ती तेज़ चैट के लिए MiniMax M3.1 Flash या DeepSeek V4.1 Flash बहुत कम में आते हैं।",
        grok43:
          "बाद का Grok 4 रिलीज़, हमेशा चालू रीज़निंग और 1M कॉन्टेक्स्ट के साथ, एजेंट वर्कफ़्लो और गहरी रिसर्च के लिए। खुला कंटेंट लेवल, टूल कॉल करता है, इमेज पढ़ता है। कीमत Grok 4 जितनी और Grok 4.7 से सस्ती। ताज़ा चाहिए तो Grok 4.7 नया विकल्प है।",
        grok420Beta:
          "xAI का पूर्व फ़्लैगशिप, 2M कॉन्टेक्स्ट विंडो, एजेंटिक टूल कॉलिंग और इमेज इनपुट के साथ। खुले कंटेंट फ़िल्टर में विशाल दस्तावेज़ों और लंबे एजेंट रन के लिए अच्छा। Grok 4.7 नया है पर महँगा।",
        gpt5Pro:
          "एक्सटेंडेड रीज़निंग वाला GPT-5, सबसे कठिन सवालों के लिए OpenAI का 2025 का जवाब। गहरा, पर अब पुरानी पीढ़ी के लिए धीमा और बहुत महँगा। GPT-6 Astra आधुनिक Pro-टियर विकल्प है और सस्ता है।",
        gpt5Codex:
          "GPT-5 Codex: OpenAI का स्पेशलाइज़्ड कोडिंग मॉडल, असाधारण प्रोग्रामिंग और तकनीकी क्षमता के साथ",
        gpt51Codex:
          "OpenAI के Codex में एजेंटिक कोडिंग के लिए ट्यून किया गया GPT-5.1: असली रिपॉज़िटरी में लंबे एडिट, रन और फ़िक्स लूप, 400K कॉन्टेक्स्ट। इस कीमत पर कोड के लिए ठीक वैल्यू। खुली चैट या राइटिंग के लिए कम फ़िट, और नया GPT-6.1 Sol इससे आगे निकल चुका है।",
        gpt51:
          "GPT-5 का OpenAI का नवंबर 2025 का अपडेट, अडैप्टिव रीज़निंग के साथ जो सिर्फ़ मुश्किल सवालों पर ज़्यादा सोचता है और ज़्यादा गर्मजोशी वाला लहजा। अब भी समझदार जनरल मॉडल, 400K कॉन्टेक्स्ट और इमेज इनपुट के साथ। GPT-6.1 Sol नया और तेज़ है, हर मैसेज थोड़ी ज़्यादा कीमत पर।",
        gpt5: "OpenAI का अगस्त 2025 का फ़्लैगशिप जिसने तेज़ जवाब और गहरी रीज़निंग एक मॉडल में जोड़ दी। चैट, राइटिंग और कोड के लिए अब भी सक्षम ऑल-राउंडर, 400K कॉन्टेक्स्ट और इमेज इनपुट के साथ। GPT-6.1 Sol OpenAI का मौजूदा चुनाव है: नया और मज़बूत, हर मैसेज थोड़े ज़्यादा में।",
        gpt54Mini:
          "छोटा GPT-5.4: कम कीमत पर अच्छी रीज़निंग, कोडिंग और टूल इस्तेमाल, 400K कॉन्टेक्स्ट और इमेज इनपुट। हाई-वॉल्यूम चैट और सब-एजेंट काम के लिए ठीक। GPT-6 Luna नया और हर मैसेज बहुत सस्ता है, पर गहराई से ज़्यादा रफ़्तार के लिए ट्यून है।",
        gpt54Nano:
          "OpenAI का सबसे छोटा GPT-5.4, क्लासिफ़िकेशन, डेटा एक्सट्रैक्शन और तेज़ सब-एजेंट कॉल के लिए। सस्ता, तेज़, टूल कॉल करता है, इमेज पढ़ता है। असली विश्लेषण के लिए बहुत उथला। GPT-6 Luna नया बजट चुनाव है और और सस्ता।",
        gpt5Mini:
          "रोज़ के तेज़ कामों के लिए कॉम्पैक्ट GPT-5: छोटे जवाब, सारांश, आसान टूल कॉल, 400K कॉन्टेक्स्ट। सस्ता और तेज़, पर गहरे विश्लेषण में कमज़ोर। GPT-6 Luna नया है और करीब तिहाई कीमत का।",
        gpt5Nano:
          "OpenAI का सबसे छोटा GPT-5 और अब भी यहाँ के सबसे सस्ते मॉडल में से एक। बड़े पैमाने पर क्लासिफ़िकेशन, टैगिंग और छोटे जवाबों के लिए ठीक। कोडिंग या असली विश्लेषण के लिए नहीं। GPT-6 Luna नया बजट मॉडल है, थोड़ी ज़्यादा कीमत पर।",
        gptOss120b:
          "OpenAI का ओपन-वेट मॉडल: कुल 117B पैरामीटर, मिक्सचर-ऑफ़-एक्सपर्ट्स, Apache 2.0 लाइसेंस। चंद पैसों में सक्षम रीज़नर और कोडर, टूल कॉल करता है, 131K कॉन्टेक्स्ट। सिर्फ़ टेक्स्ट। OpenAI की GPT-6 लाइन से हल्के फ़िल्टर, पर अनसेंसर्ड नहीं। GLM-5.3 की कीमत लगभग यही है और 1M कॉन्टेक्स्ट जोड़ता है।",
        kimiK2Thinking:
          "Kimi K2 का नवंबर 2025 का रीज़निंग वर्ज़न, जो सैकड़ों चेन्ड टूल कॉल में धागा खोए बिना सोचता रहता है। कम कीमत पर रिसर्च और मल्टी-स्टेप एजेंट काम के लिए अच्छा, खुला कंटेंट लेवल। सिर्फ़ टेक्स्ट और सादे K2 से धीमा। Kimi K3 नया चुनाव है।",
        minimaxM27:
          "MiniMax का व्यावहारिक काम के लिए एजेंट-केंद्रित मॉडल: डीबगिंग, फ़ाइनेंशियल मॉडलिंग, दस्तावेज़ बनाना और मल्टी-एजेंट रन। स्मार्ट और सस्ता, 196K कॉन्टेक्स्ट, सिर्फ़ टेक्स्ट, खुला कंटेंट लेवल। MiniMax M3.1 Flash इसकी जगह लेता है: ज़्यादा मज़बूत, मल्टीमॉडल, 1M कॉन्टेक्स्ट और सस्ता।",
        mimoV2Pro:
          "Xiaomi की MiMo V2 लाइन का फ़्लैगशिप, एजेंट ऑर्केस्ट्रेशन और लंबे इंजीनियरिंग वर्कफ़्लो के लिए, 1M कॉन्टेक्स्ट। कम कीमत पर मज़बूत रीज़निंग और कोडिंग, सिर्फ़ टेक्स्ट, खुला कंटेंट लेवल। MiMo V2.6 Pro नया और थोड़ा सस्ता है।",
        glm45Air:
          "हल्का GLM 4.5, 106B मिक्सचर-ऑफ़-एक्सपर्ट्स जिसमें सिर्फ़ 12B एक्टिव रहते हैं, इसलिए जवाब तेज़ और सस्ते आते हैं। आम चैट और आसान कामों के लिए ठीक, 128K कॉन्टेक्स्ट, सिर्फ़ टेक्स्ट। रीज़निंग में पुराना। GLM-5.3 Flash नया और सस्ता है।",
        glm45v:
          "GLM-4.5-Air पर बना Z.AI का विज़न मॉडल, 106B मिक्सचर-ऑफ़-एक्सपर्ट्स। स्क्रीनशॉट, चार्ट और फ़ोटो पढ़ता है, चैट करता है और टूल कॉल करता है। सिर्फ़ 64K कॉन्टेक्स्ट और पुरानी रीज़निंग। GLM-5.3 Flash नया और सस्ता Z.AI चुनाव है।",
        geminiFlash25Lite:
          "Google का 2025 का सबसे सस्ता Gemini: हर मैसेज चंद पैसे, 1M कॉन्टेक्स्ट, टेक्स्ट, इमेज, वीडियो और ऑडियो इनपुट। बल्क टैगिंग, अनुवाद और छोटे जवाबों के लिए बढ़िया, रीज़निंग में उथला। Gemini 3.5 Flash Lite नया है पर लगभग चार गुना महँगा, इसलिए इसकी जगह बनी हुई है।",
        geminiFlash25Flash:
          "Google का 2025 का हाइब्रिड रीज़निंग Flash, कंट्रोल होने वाले थिंकिंग बजट, 1M कॉन्टेक्स्ट और टेक्स्ट, इमेज, वीडियो, ऑडियो इनपुट के साथ। सारांश और रोज़ की चैट के लिए अब भी सस्ता, तेज़ विकल्प। Gemini 3.8 Flash नया और स्मार्ट है पर लगभग दोगुना महँगा।",
        geminiFlash25Pro:
          "Google का 2025 का थिंकिंग मॉडल, 1M कॉन्टेक्स्ट, अपने समय में लंबे दस्तावेज़ों और कोड के विश्लेषण में मज़बूत। अब साफ़ तौर पर एक पीढ़ी पीछे। Gemini 4 Argon मौजूदा Pro-क्लास चुनाव है, थोड़ी ऊँची कीमत पर।",
        deepseekV31:
          "DeepSeek का अगस्त 2025 का हाइब्रिड जो एक ही मॉडल में तेज़ जवाब और स्टेप-बाय-स्टेप सोच के बीच स्विच करता है। 671B ओपन-वेट मिक्सचर-ऑफ़-एक्सपर्ट्स पर बना सक्षम, सस्ता कोडर, सिर्फ़ टेक्स्ट। DeepSeek V4.1 Flash नया है और करीब तिहाई कीमत का।",
        deepseekR1:
          "जनवरी 2025 का ओपन-वेट रीज़निंग मॉडल जिसने साबित किया कि दिखने वाली चेन-ऑफ़-थॉट सस्ती हो सकती है। गणित और लॉजिक के लिए अब भी ठीक, पर धीमा, ज़्यादा शब्दों वाला और चीन के लिए संवेदनशील राजनीति पर चुप। DeepSeek V4.1 Flash नया और बहुत सस्ता है।",
        qwen3235bFree:
          "Alibaba का ओपन-वेट Qwen3 235B, 22B एक्टिव पैरामीटर वाला मिक्सचर-ऑफ़-एक्सपर्ट्स मॉडल। बजट में ठोस कोड और रीज़निंग, टूल कॉल करता है, 131K कॉन्टेक्स्ट। सिर्फ़ टेक्स्ट और एक पीढ़ी पीछे: Qwen 3.8 Flash नया है, इमेज पढ़ता है और कीमत लगभग वही।",
        deepseekR1Distill:
          "सस्ती स्टेप-बाय-स्टेप रीज़निंग के लिए DeepSeek R1 का छोटा Qwen-आधारित डिस्टिल, सिर्फ़ टेक्स्ट, छोटा 32K कॉन्टेक्स्ट। अब कोई प्रोवाइडर इसे सर्व नहीं करता। DeepSeek V4.1 Flash इसकी जगह लेता है: ज़्यादा स्मार्ट, विज़न वाला, 1M कॉन्टेक्स्ट, और लागत अब भी लगभग शून्य।",
        qwen257b:
          "Alibaba का 2024 का छोटा 7B ओपन-वेट मॉडल। आसान चैट, छोटे रीराइट और बेसिक अनुवाद के लिए सस्ता और तेज़, 32K कॉन्टेक्स्ट। आज के हिसाब से कोडिंग और विश्लेषण में कमज़ोर। Qwen 3.8 Flash Alibaba का नया चुनाव है, थोड़े ज़्यादा में ज़्यादा स्मार्ट।",
        dallE3:
          "DALL-E 3: OpenAI का इमेज जनरेशन मॉडल, टेक्स्ट प्रॉम्प्ट से हाई-क्वालिटी, बारीक इमेज",
        gptImage1: "GPT-Image-1: OpenAI का तेज़ और किफ़ायती इमेज जनरेशन मॉडल",
        fluxSchnell:
          "Flux Schnell: Black Forest Labs का रफ़्तार के लिए ऑप्टिमाइज़्ड तेज़ इमेज जनरेशन मॉडल",
        fluxPro:
          "Black Forest Labs का FLUX.1 पीढ़ी का आज़माया हुआ टेक्स्ट-टू-इमेज वर्कहॉर्स। साफ़ कंपोज़िशन, भरोसेमंद प्रॉम्प्ट फ़ॉलोइंग, तेज़ नतीजे। सिर्फ़ टेक्स्ट इनपुट, रेफ़रेंस इमेज से एडिट नहीं। FLUX.2 Pro करीब आधी कीमत का है और रेफ़रेंस इमेज लेता है, इसलिए यह मुख्य रूप से उन प्रॉम्प्ट के लिए है जो इसके लिए पहले से ट्यून हैं।",
        flux2Max:
          "Black Forest Labs की FLUX.2 फ़ैमिली का टॉप टियर। टेक्स्ट से बनाता है या रेफ़रेंस इमेज से एडिट करता है, लाइन में सबसे ज़्यादा डिटेल और कंसिस्टेंसी। प्रीमियम कीमत, FLUX.2 Pro से कई गुना। इसे हीरो शॉट और मुश्किल मल्टी-रेफ़रेंस एडिट के लिए रखें। रोज़ के काम के लिए FLUX.2 Pro कम में ज़्यादातर काम कर देता है। लेगेसी: FLUX.3 इसकी जगह लेता है, ज़्यादा शार्प और हर इमेज सस्ता।",
        flux2Klein4b:
          "FLUX.2 Klein 4B: Black Forest Labs का सबसे तेज़ और किफ़ायती इमेज मॉडल, हाई-थ्रूपुट इस्तेमाल के लिए ऑप्टिमाइज़्ड। लेगेसी: FLUX.3 Klein इसकी जगह लेता है।",
        riverflowV2Pro:
          "Riverflow V2 Pro: Sourceful का सबसे ताक़तवर इमेज जनरेशन मॉडल, टॉप-टियर कंट्रोल और बेहतरीन टेक्स्ट रेंडरिंग के साथ",
        riverflowV2Fast:
          "Riverflow V2 Fast: Sourceful का सबसे तेज़ इमेज जनरेशन मॉडल, प्रोडक्शन डिप्लॉयमेंट और लेटेंसी-क्रिटिकल वर्कफ़्लो के लिए ऑप्टिमाइज़्ड",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Preview: Sourceful का सबसे ताक़तवर प्रीव्यू वर्ज़न, एकीकृत टेक्स्ट-टू-इमेज और इमेज-टू-इमेज मॉडल। लेगेसी: प्रीव्यू अपस्ट्रीम बंद हो गया, Riverflow V2 Pro इस्तेमाल करें।",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Preview: Sourceful का स्टैंडर्ड प्रीव्यू वर्ज़न, एकीकृत टेक्स्ट-टू-इमेज और इमेज-टू-इमेज मॉडल जो Riverflow 1 फ़ैमिली से आगे है। लेगेसी: प्रीव्यू अपस्ट्रीम बंद हो गया, Riverflow V2 Pro इस्तेमाल करें।",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview: Sourceful का सबसे तेज़ प्रीव्यू वर्ज़न, सबसे कम कीमत पर एकीकृत टेक्स्ट-टू-इमेज और इमेज-टू-इमेज मॉडल। लेगेसी: प्रीव्यू अपस्ट्रीम बंद हो गया, Riverflow V2 Fast इस्तेमाल करें।",
        flux2Flex:
          "FLUX.2 Flex: Black Forest Labs का इमेज मॉडल जो एक ही आर्किटेक्चर में जटिल टेक्स्ट रेंडरिंग, टाइपोग्राफ़ी और मल्टी-रेफ़रेंस एडिटिंग में माहिर है",
        flux2Pro:
          "बनाने और एडिट करने के लिए Black Forest Labs का FLUX.2 वर्कहॉर्स। टेक्स्ट के साथ रेफ़रेंस इमेज लेता है, शॉट्स में किरदार और प्रोडक्ट एक जैसे रखता है, लंबे प्रॉम्प्ट अच्छे से सँभालता है। मिड-रेंज कीमत। ओपन टियर: Imagen 4 से हल्के फ़िल्टर, पर एक्सप्लिसिट नहीं। उसके लिए Chroma या Lustify v8 हैं। FLUX.2 Max पर तभी जाएँ जब डिटेल सच में मायने रखे।",
        gemini3ProImagePreview:
          "Google का Gemini 3 Pro Image, प्रीव्यू में। ज़्यादा ताक़तवर Nano Banana: जटिल प्रॉम्प्ट को ज़्यादा बारीकी से फ़ॉलो करता है, इमेज के भीतर पढ़ने लायक टेक्स्ट बनाता है और आपकी अपलोड की तस्वीरें एडिट करता है। मेनस्ट्रीम फ़िल्टर, कोई टूल कॉल नहीं, 64K कॉन्टेक्स्ट। Nano Banana से कई गुना कीमत, इसलिए इमेज क्वालिटी जहाँ मायने रखे वहीं इस्तेमाल करें।",
        gpt5ImageMini:
          "OpenAI का GPT-5 Image Mini: GPT-5 Mini की भाषा क्षमता के साथ उसी चैट में इमेज जनरेशन और एडिटिंग। इमेज पढ़ता है, 400K कॉन्टेक्स्ट। मेनस्ट्रीम फ़िल्टर, कोई टूल कॉल नहीं। Nano Banana से महँगा और Nano Banana Pro के क़रीब, इसलिए अपने प्रॉम्प्ट पर दोनों तुलना करें। लेगेसी: OpenRouter इसे 1 दिसंबर 2026 को बंद कर रहा है। चैट में Nano Banana 2.1 या OpenAI क्वालिटी के लिए GPT Image 2.6 Flare इस्तेमाल करें।",
        gpt5Image:
          "OpenAI के इमेज जनरेटर के साथ जुड़ा GPT-5: चैट करें, फिर उसी बातचीत में इमेज बनाएँ या एडिट करें, इमेज इनपुट के साथ। सादे शब्दों में विज़ुअल सुधारने के लिए अच्छा। कोई टूल कॉल नहीं और हर मैसेज महँगा। GPT-5 Image Mini सस्ता विकल्प है। Nano Banana Pro भी तुलना के लायक है।",
        gpt54Image2:
          "GPT-5.4 रीज़निंग के साथ GPT Image 2 जनरेशन, ताकि एक चैट विश्लेषण या कोड से तैयार इमेज तक जा सके। इमेज भी पढ़ता है। कोई टूल कॉल नहीं, और महँगा। GPT-5 Image Mini बहुत सस्ता है। Nano Banana और Nano Banana Pro दूसरे मौजूदा इमेज चुनाव हैं।",
        seedream45:
          "ByteDance का इमेज मॉडल जो बनाना और एडिट करना एक साथ करता है। पोर्ट्रेट, एक सब्जेक्ट को एक जैसा रखने और कई इनपुट इमेज को एक सीन में जोड़ने में मज़बूत। मिड-रेंज कीमत, FLUX.2 Pro के क़रीब। ओपन टियर: मेनस्ट्रीम से हल्के फ़िल्टर, एक्सप्लिसिट नहीं। FLUX.2 Pro आपका मनचाहा लुक न दे तो अच्छा दूसरा विकल्प। लेगेसी: Seedream 5.5 आधी कीमत पर इसकी जगह लेता है।",
        sdxl: "Stable Diffusion XL: Stability AI का हाई-क्वालिटी ओपन इमेज जनरेशन मॉडल",
        cassetteMusic:
          "CassetteAI Music: Fal.ai पर तेज़ टेक्स्ट-टू-म्यूज़िक जनरेशन, तीन मिनट तक की क्लिप के साथ",
        musicgenStereo:
          "Meta का ओपन-सोर्स MusicGen, स्टीरियो वर्ज़न में। टेक्स्ट प्रॉम्प्ट से इंस्ट्रुमेंटल म्यूज़िक: जॉनर, मूड, इंस्ट्रुमेंट। कोई वोकल या लिरिक्स नहीं। सस्ता। बैकग्राउंड म्यूज़िक और लूप के लिए अच्छा। वोकल वाले गानों के लिए ElevenLabs Music या Sonauto Song इस्तेमाल करें।",
        stableAudio:
          "Stable Audio: Stability AI का म्यूज़िक और ऑडियो जनरेशन मॉडल, हाई-क्वालिटी क्लिप के लिए",
        udioV2:
          "Udio v2: वोकल और पूरी प्रोडक्शन क्वालिटी के साथ हाई-क्वालिटी AI म्यूज़िक जनरेशन",
        modelsLabMusicGen:
          "ModelsLab का अपना टेक्स्ट-टू-म्यूज़िक मॉडल, MP3, WAV या FLAC आउटपुट के साथ। बैकग्राउंड म्यूज़िक और जिंगल के लिए प्रॉम्प्ट-चालित ट्रैक। Lyria 3 या MusicGen Stereo से कई गुना महँगा, और इसका अंदरूनी मॉडल दर्ज नहीं है। कम कीमत पर क्वालिटी के लिए पहले Lyria 3 आज़माएँ।",
        modelsLabElevenlabsMusic:
          "ElevenLabs का म्यूज़िक मॉडल। कई भाषाओं में वोकल और लिरिक्स के साथ पूरे ट्रैक, या इंस्ट्रुमेंटल, आपके प्रॉम्प्ट से तय। मेनस्ट्रीम कंटेंट फ़िल्टर लागू। म्यूज़िक के लिए ऊपरी कीमत रेंज। पॉलिश्ड, रेडियो-रेडी गानों के लिए मज़बूत। वोकल वाले सस्ते पूरे गानों के लिए Sonauto Song आज़माएँ।",
        modelsLabSonautoSong:
          "Sonauto का गाना जनरेटर। कई जॉनर में वोकल और लिरिक्स वाले पूरे गाने, पूरे ट्रैक के लिए कम कीमत पर। ओपन टियर, ElevenLabs से हल्के फ़िल्टर। प्रोडक्शन पॉलिश अलग-अलग होती है। साफ़ मिक्स के लिए ElevenLabs Music या Lyria 3 Pro Preview के लिए ज़्यादा दें।",
        modelsLabLyria3:
          "Google का Lyria 3। टेक्स्ट प्रॉम्प्ट से करीब 30 सेकंड के ओरिजिनल ट्रैक, हाई प्रोडक्शन क्वालिटी के साथ। जो देता है उसके हिसाब से बहुत सस्ता। मेनस्ट्रीम: Google के फ़िल्टर लागू। पूरे गानों के लिए बहुत छोटा। पूरी लंबाई के लिए Lyria 3 Pro Preview है।",
        modelsLabCogVideoX:
          "CogVideoX: ModelsLab का टेक्स्ट-टू-वीडियो मॉडल, छोटी वीडियो क्लिप बनाने के लिए",
        modelsLabWanx: "Wanx: ModelsLab का टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
        modelsLabWan22:
          "Wan 2.2 Ultra: ModelsLab का हाई-क्वालिटी टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
        modelsLabWan21:
          "Wan 2.1 Ultra: बेहतर क्वालिटी वाला ModelsLab का टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
        modelsLabWan25T2V:
          "Wan 2.5 T2V: ModelsLab का Wan 2.5 टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
        modelsLabWan25I2V:
          "Wan 2.5 I2V: ModelsLab का Wan 2.5 इमेज-टू-वीडियो जनरेशन मॉडल",
        modelsLabWan27T2V:
          "Alibaba का Wan 2.7 वीडियो मॉडल। 10 सेकंड तक की क्लिप (ModelsLab से 15), 1080p तक, कई एस्पेक्ट रेशियो, नेटिव ऑडियो, और शॉट को दिशा देने के लिए वैकल्पिक पहला और आख़िरी फ़्रेम। प्रति सेकंड मिड-रेंज कीमत। लचीला ऑल-राउंडर। सस्ते टेस्ट के लिए Seedance 1.5 Pro, टॉप-एंड रियलिज़्म के लिए Veo 3.1। लेगेसी: Wan 3.0 इसकी जगह लेता है, 720p की वही कीमत और 30 सेकंड तक की क्लिप।",
        modelsLabWan26T2V:
          "Wan 2.6 T2V: ModelsLab का Wan 2.6 टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
        modelsLabWan26I2V:
          "Alibaba का Wan 2.6 इमेज-टू-वीडियो मॉडल: शुरुआती फ़्रेम दें, यह सीन को नेटिव ऑडियो के साथ एनिमेट करता है। 720p या 1080p पर 5 या 10 सेकंड की क्लिप, लैंडस्केप या पोर्ट्रेट। प्रति सेकंड कीमत करीब Wan 2.7 जितनी। अंतिम फ़्रेम तय करना हो या ज़्यादा एस्पेक्ट रेशियो चाहिए तो Wan 2.7 T2V चुनें।",
        modelsLabWan26I2VFlash:
          "Wan 2.6 इमेज-टू-वीडियो का स्पीड वर्ज़न। एक स्टिल को 720p या 1080p पर 5 या 10 सेकंड की क्लिप में बदलता है, कम इंतज़ार के साथ। प्रति सेकंड कीमत स्टैंडर्ड Wan 2.6 I2V जितनी, इसलिए जब टर्नअराउंड मायने रखे तब चुनें। इस वर्ज़न में नेटिव ऑडियो दर्ज नहीं है, स्टैंडर्ड में है।",
        modelsLabSeedanceT2V:
          "Seedance T2V: BytePlus का टेक्स्ट-टू-वीडियो जनरेशन मॉडल",
        modelsLabSeedanceI2V:
          "Seedance I2V: BytePlus का इमेज-टू-वीडियो जनरेशन मॉडल",
        modelsLabOmnihuman: "Omnihuman: BytePlus का इंसानी वीडियो जनरेशन मॉडल",
        modelsLabSeedance1ProI2V:
          "Seedance 1.0 Pro I2V: BytePlus का प्रोफ़ेशनल इमेज-टू-वीडियो मॉडल",
        modelsLabSeedance1ProFastI2V:
          "Seedance 1.0 Pro Fast I2V: BytePlus का तेज़ प्रोफ़ेशनल इमेज-टू-वीडियो मॉडल",
        modelsLabSeedance1ProFastT2V:
          "Seedance 1.0 Pro Fast T2V: BytePlus का तेज़ प्रोफ़ेशनल टेक्स्ट-टू-वीडियो मॉडल",
        modelsLabOmnihuman15:
          "ByteDance का OmniHuman 1.5 एक ही फ़ोटो से ऑडियो ट्रैक के सहारे इंसान को एनिमेट करता है: बोलते चेहरे, गाना, हाव-भाव। अवतार और डबिंग का स्पेशलिस्ट, जनरल टेक्स्ट-टू-वीडियो मॉडल नहीं। ज़्यादातर मिड-रेंज वीडियो मॉडल से प्रति सेकंड महँगा। बिना बोलते इंसान वाले सीन के लिए Kling 3.0 या Wan 2.7 चुनें।",
        modelsLabSeedance15Pro:
          "ByteDance का Seedance 1.5 Pro, इसके BytePlus क्लाउड से बिकता है। नेटिव ऑडियो के साथ टेक्स्ट से वीडियो, 480p से 1080p, लैंडस्केप या पोर्ट्रेट। प्रति क्लिप यहाँ के सबसे सस्ते वीडियो मॉडल में से एक, और 480p की कीमत 720p की आधी। आइडिया टेस्ट करने और वॉल्यूम के लिए बढ़िया। फ़्रेम कंट्रोल, कंसिस्टेंसी और 4K के लिए Seedance 2.0 अगला कदम है।",
        modelsLabVeo2:
          "Veo 2: ModelsLab के ज़रिए Google का हाई-क्वालिटी वीडियो जनरेशन मॉडल",
        modelsLabVeo3:
          "Veo 3: ModelsLab के ज़रिए Google का नया वीडियो जनरेशन मॉडल",
        modelsLabVeo3Fast:
          "Veo 3 Fast: ModelsLab के ज़रिए Google का तेज़ वीडियो जनरेशन मॉडल",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview: ModelsLab के ज़रिए Google का तेज़ वीडियो जनरेशन प्रीव्यू मॉडल",
        modelsLabVeo31:
          "Google का फ़्लैगशिप वीडियो मॉडल। सिनेमाई रियलिज़्म, डायलॉग और साउंड इफ़ेक्ट के साथ नेटिव ऑडियो, 4K तक की 4 से 8 सेकंड की क्लिप, पहले और आख़िरी फ़्रेम का कंट्रोल। कैटलॉग का सबसे महँगा वीडियो मॉडल। फ़ाइनल शॉट के लिए कीमत वसूल। ड्राफ़्ट Veo 3.1 Fast पर बहुत कम कीमत में बनाएँ।",
        modelsLabVeo31Fast:
          "Google के Veo 3.1 का तेज़, सस्ता टियर। वही 4 से 8 सेकंड की क्लिप, नेटिव ऑडियो, 4K तक और फ़्रेम कंट्रोल, पूरे Veo 3.1 की कीमत का करीब तिहाई से आधा। मुश्किल शॉट पर थोड़ी फ़िडेलिटी छोड़ता है। ज़्यादातर Veo काम के लिए सबसे सही जगह। Veo 3.1 Lite और भी सस्ता है।",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V: Kling AI का इमेज-टू-वीडियो मॉडल, वर्ज़न 2.1",
        modelsLabKlingV25TurboI2V:
          "इमेज-टू-वीडियो के लिए Kling 2.5 Turbo: स्टिल को छोटी क्लिप में एनिमेट करें। प्रति क्लिप सस्ता और तेज़, Kling की जीवंत मोशन के साथ। नेटिव ऑडियो दर्ज नहीं। Kling 3.0 ज़्यादा पैसों में साउंड और 15 सेकंड तक के शॉट जोड़ता है।",
        modelsLabKlingV25TurboT2V:
          "टेक्स्ट से Kling 2.5 Turbo। 16:9, 9:16 या 1:1 में 5 या 10 सेकंड की क्लिप, कैटलॉग में प्रति क्लिप सबसे सस्ते में से। इस कीमत में मज़बूत मोशन, नेटिव ऑडियो नहीं। साउंड और 15 सेकंड तक की क्लिप के लिए Kling 3.0 T2V पर जाएँ।",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V: Kling AI का मास्टर क्वालिटी टेक्स्ट-टू-वीडियो मॉडल",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V: Kling AI का मास्टर क्वालिटी इमेज-टू-वीडियो मॉडल",
        modelsLabKlingV21MasterT2V:
          "Kling 2.1 Master, Kling की 2.1 पीढ़ी का प्रीमियम टियर। हाई विज़ुअल फ़िडेलिटी के साथ टेक्स्ट से 5 या 10 सेकंड की क्लिप। कीमत कैटलॉग के शीर्ष के पास, Kling 3.0 T2V से करीब तीन गुना, जो नया है और नेटिव ऑडियो जोड़ता है। ज़्यादातर तभी सही जब आपके प्रॉम्प्ट यहाँ पहले से अच्छा काम करते हों।",
        modelsLabKlingV21MasterI2V:
          "इमेज-टू-वीडियो के लिए Kling 2.1 Master: स्टिल को हाई विज़ुअल फ़िडेलिटी के साथ 5 या 10 सेकंड की क्लिप में एनिमेट करता है। कीमत कैटलॉग के शीर्ष के पास, नए Kling 3.0 से करीब तीन गुना, जो नेटिव ऑडियो भी लाता है। तभी चुनें जब इसका लुक ठीक वही हो जो चाहिए। Kling V2.5 Turbo I2V सस्ता विकल्प है।",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V: Kling AI का मल्टी-इमेज-टू-वीडियो मॉडल, वर्ज़न 1.6",
        modelsLabKling30T2V:
          "Kuaishou का Kling 3.0 Pro। नेटिव ऑडियो, 720p पर 3 से 15 सेकंड की क्लिप, पहले और आख़िरी फ़्रेम का कंट्रोल, 16:9, 9:16 या 1:1। मिड-रेंज कीमत पर जीवंत, भरोसेमंद मोशन। 720p सीमा है। 1080p और ऊपर के लिए Veo 3.1 Fast या Hailuo 3 देखें। इमेज से शुरू करने पर Kling 3.0 Std सस्ता पड़ता है।",
        modelsLabLtx2ProT2V:
          "Lightricks का LTX-2 Pro। 2K या 4K पर टेक्स्ट-टू-वीडियो, करीब 6 से 10 सेकंड की क्लिप में। उस रेज़ोल्यूशन के लिए मिड-रेंज कीमत, यानी Veo 3.1 के मुक़ाबले 4K का बजट रास्ता। यहाँ नेटिव ऑडियो दर्ज नहीं। 4K के साथ साउंड के लिए Veo 3.1 Fast इस्तेमाल करें।",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V: LTX का प्रोफ़ेशनल इमेज-टू-वीडियो जनरेशन मॉडल",
        modelsLabLtx23ProI2V:
          "इमेज-टू-वीडियो के लिए Lightricks का LTX 2.3 Pro: स्टिल को 2K या 4K पर 6 से 10 सेकंड की क्लिप में एनिमेट करता है। LTX 2 Pro से नया और थोड़ा महँगा। जब हाई-रेज़ोल्यूशन इमेज मोशन में भी शार्प रहनी चाहिए तब यही चुनें। नेटिव ऑडियो दर्ज नहीं।",
        modelsLabHailuo23T2V:
          "MiniMax का Hailuo 2.3, टेक्स्ट या शुरुआती इमेज से, डांस और एक्शन जैसी जीवंत, भौतिक मोशन के लिए जाना जाता है। 16:9 में 1080p तक 6 या 10 सेकंड की क्लिप। नेटिव ऑडियो नहीं। मिड-रेंज कीमत। Hailuo 3 साउंड, 2K और फ़्रेम कंट्रोल जोड़ता है, करीब दोगुनी लागत पर।",
        modelsLabHailuo02T2V:
          "Hailuo 02 T2V: MiniMax का टेक्स्ट-टू-वीडियो जनरेशन मॉडल 02",
        modelsLabHailuo23I2V:
          "इमेज-टू-वीडियो के लिए MiniMax का Hailuo 2.3। स्टिल को भावपूर्ण, भौतिक मोशन वाली 6 या 10 सेकंड की क्लिप में एनिमेट करता है। नेटिव ऑडियो नहीं। Hailuo 2.3 Fast I2V यही काम करीब आधी कीमत पर करता है, थोड़ी कम पॉलिश के साथ।",
        modelsLabHailuo23FastI2V:
          "Hailuo 2.3 इमेज-टू-वीडियो का तेज़, सस्ता टियर। स्टैंडर्ड Hailuo 2.3 I2V की करीब आधी लागत पर स्टिल से 6 या 10 सेकंड की क्लिप। ड्राफ़्ट और वॉल्यूम के लिए अच्छा, कम डिटेल के साथ। नेटिव ऑडियो नहीं।",
        modelsLabHailuo02I2V:
          "Hailuo 02 I2V: MiniMax का इमेज-टू-वीडियो जनरेशन मॉडल 02",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End: MiniMax का शुरू-अंत फ़्रेम वीडियो जनरेशन मॉडल",
        modelsLabSora2:
          "OpenAI का Sora 2। भरोसेमंद फ़िज़िक्स, सिंक्ड ऑडियो और डायलॉग, 720p पर 4, 8 या 12 सेकंड की क्लिप। इस रूट पर सिर्फ़ 16:9। मिड से हाई कीमत। Sora 2 Pro वही लंबाई ज़्यादा बारीकी में रेंडर करता है, करीब तीन गुना लागत पर।",
        modelsLabSora2Pro:
          "OpenAI के Sora 2 का प्रीमियम टियर। सिंक्ड ऑडियो और ऊँची फ़िडेलिटी, 720p पर 4, 8 या 12 सेकंड की क्लिप, इस रूट पर सिर्फ़ 16:9। यहाँ के सबसे महँगे वीडियो मॉडल में से एक। पॉलिश्ड फ़ाइनल शॉट के लिए सही। ड्राफ़्ट के लिए Sora 2 करीब तिहाई कीमत पर काफ़ी है।",
        modelsLabGen4Aleph:
          "Runway का Aleph जनरेटर से ज़्यादा वीडियो एडिटर है: मौजूदा फ़ुटेज दें और यह ऑब्जेक्ट जोड़ता या हटाता है, स्टाइल बदलता है, लाइटिंग बदलता है या कैमरा एंगल बदलता है। वाइड सिनेमा फ़ॉर्मैट समेत कई एस्पेक्ट रेशियो। ज़्यादातर जनरेटर से महँगा। प्रॉम्प्ट से नई क्लिप के लिए Veo 3.1 Fast या Kling 3.0 इस्तेमाल करें।",
        modelsLabLipsync2:
          "Sync का lipsync-2 मौजूदा वीडियो में होंठों की हरकत को नए ऑडियो ट्रैक से मिलाता है। डबिंग, अनुवादित वॉइसओवर और डायलॉग सुधारने के लिए। यह फ़ुटेज एडिट करता है, सीन नहीं गढ़ता। एक फ़ोटो से बोलते इंसान के लिए Omnihuman 1.5 इस्तेमाल करें।",
        modelsLabGrokT2V:
          "xAI का Grok Imagine टेक्स्ट से वीडियो। 480p या 720p पर 1 से 15 सेकंड की क्लिप, वैकल्पिक पहले फ़्रेम के साथ। मिड-रेंज कीमत, तेज़ और ढीला। ओपन टियर, इसलिए Veo या Sora से हल्के फ़िल्टर, पर एक्सप्लिसिट नहीं। Grok Imagine Video 1.5 में 1080p है। लेगेसी: Grok Imagine Video 1.5 Lite आधी से कम कीमत पर इसकी जगह लेता है।",
        modelsLabGrokI2V:
          "इमेज-टू-वीडियो के लिए xAI का Grok Imagine। स्टिल को HD में 15 सेकंड तक की क्लिप में एनिमेट करता है। Grok T2V से थोड़ा सस्ता। तेज़ एनिमेटेड स्टिल के लिए ठीक। ऊँचे रेज़ोल्यूशन के लिए Grok Imagine Video 1.5 पर जाएँ। लेगेसी: Grok Imagine Video 1.5 Lite स्टिल को कम में एनिमेट करता है।",
        klingV30Std:
          "Kuaishou के Kling 3.0 का स्टैंडर्ड टियर। 720p पर Pro टियर Kling 3.0 T2V जैसी ही नेटिव ऑडियो और फ़्रेम कंट्रोल वाली 3 से 15 सेकंड की क्लिप। इमेज से शुरू करने पर सस्ता Kling 3 चुनाव। सादे टेक्स्ट प्रॉम्प्ट के लिए Kling 3.0 T2V अक्सर कम में पड़ता है।",
        klingVideoO1:
          "Kling का एकीकृत मल्टीमॉडल वीडियो मॉडल, जो एक ही मॉडल में रेफ़रेंस से क्लिप बनाने और एडिट करने के लिए डिज़ाइन है। नेटिव ऑडियो, 720p पर 5 या 10 सेकंड, पहले और आख़िरी फ़्रेम का कंट्रोल। मिड-रेंज कीमत। रेफ़रेंस-चालित काम के लिए चुनें। सादे टेक्स्ट-टू-वीडियो के लिए Kling 3.0 T2V सस्ता है।",
        veo31Lite:
          "Google का बजट Veo 3.1 टियर। नेटिव ऑडियो, 720p या 1080p पर 4 से 8 सेकंड की क्लिप, पहले और आख़िरी फ़्रेम का कंट्रोल। Veo में घुसने का सबसे सस्ता रास्ता, पर 4K नहीं। हाई-वॉल्यूम सोशल क्लिप के लिए अच्छा। क्वालिटी मायने रखे तो Veo 3.1 Fast पर जाएँ।",
        seedance2:
          "ByteDance का Seedance 2.0। नेटिव ऑडियो, 480p से 4K तक 4 से 15 सेकंड की क्लिप, पहला और आख़िरी फ़्रेम, और किरदारों को एक जैसा रखने के लिए रेफ़रेंस इनपुट। ऊपरी कीमत रेंज। बार-बार आने वाले किरदारों वाले स्टोरी शॉट के लिए मज़बूत चुनाव। 720p तक के ड्राफ़्ट के लिए Seedance 2.0 Fast सस्ता है।",
        seedance2Fast:
          "ByteDance के Seedance 2.0 का तेज़, सस्ता टियर। नेटिव ऑडियो, 15 सेकंड तक की क्लिप और फ़्रेम कंट्रोल, पर 720p पर सीमित। पूरे मॉडल की करीब 60 प्रतिशत कीमत। ड्राफ़्ट और सोशल क्लिप के लिए अच्छा। 1080p या 4K चाहिए तो पूरा Seedance 2.0 इस्तेमाल करें।",
        happyhorse11:
          "Alibaba के HappyHorse वीडियो मॉडल का दूसरा रिलीज़। टेक्स्ट-टू-वीडियो, इमेज-टू-वीडियो और रेफ़रेंस इमेज, 720p या 1080p पर 3 से 15 सेकंड। इस रूट पर नेटिव ऑडियो नहीं। 720p की कीमत HappyHorse 1.0 जितनी और 1080p पर सस्ता, Alibaba के मुताबिक़ बेहतर मोशन और कंसिस्टेंसी के साथ, इसलिए दोनों में डिफ़ॉल्ट चुनाव यही है। मिड-रेंज लागत।",
        happyhorse10:
          "Alibaba के HappyHorse वीडियो मॉडल का पहला रिलीज़। टेक्स्ट-टू-वीडियो, इमेज-टू-वीडियो और रेफ़रेंस इमेज, 720p या 1080p पर 3 से 15 सेकंड। इस रूट पर नेटिव ऑडियो नहीं। 720p की कीमत HappyHorse 1.1 जितनी पर 1080p पर महँगा, इसलिए नया वर्ज़न आम तौर पर बेहतर चुनाव है। 1.0 पर ट्यून किए प्रॉम्प्ट के लिए रखने लायक।",
        modelsLabGen4T2ITurbo:
          "Runway के Gen-4 इमेज मॉडल का तेज़, सस्ता वर्ज़न। टेक्स्ट अंदर, इमेज बाहर, Gen4 Image की कीमत के तिहाई से कम में। Runway के सिनेमाई लुक पर तेज़ ड्राफ़्ट और सुधार के लिए अच्छा। यहाँ रेफ़रेंस-इमेज एडिटिंग नहीं। एडिट के लिए FLUX.2 Pro या Seedream 4.5 इस्तेमाल करें।",
        modelsLabGen4Image:
          "Runway का Gen-4 इमेज मॉडल, सिनेमाई, फ़िल्म-स्टिल लुक के लिए जाना जाता है। टेक्स्ट अंदर, इमेज बाहर। कैटलॉग के महँगे इमेज विकल्पों में से एक, इसलिए तभी चुनें जब ख़ास तौर पर वही Runway लुक चाहिए। सस्ते सुधार के लिए Gen4 T2I Turbo से शुरू करें। रेफ़रेंस इमेज से एडिट के लिए FLUX.2 Pro चुनें।",
        modelsLabWan27T2I:
          "Alibaba का Wan 2.7 इमेज मॉडल, Wan वीडियो मॉडल वाली ही फ़ैमिली से। टेक्स्ट अंदर, इमेज बाहर, कम मिड-रेंज कीमत पर। इलस्ट्रेशन और सीन के लिए ठोस जनरल-पर्पज़ चुनाव। यहाँ रेफ़रेंस-इमेज इनपुट नहीं। एडिट के लिए Qwen Image 3 या Seedream 4.5 इस्तेमाल करें।",
        modelsLabGrokT2I:
          "xAI का Grok Imagine इमेज जनरेटर। टेक्स्ट अंदर, इमेज बाहर, चलाने में सस्ता। ओपन टियर, इसलिए Imagen 4 से हल्के फ़िल्टर, पर एक्सप्लिसिट नहीं। तेज़, पंची इमेज के लिए ठीक। रेफ़रेंस-इमेज एडिट और नई पीढ़ी के लिए Grok Imagine Image 2.0 थोड़ा महँगा है।",
        modelsLabZImageBase:
          "Z-Image का पूरा, बिना डिस्टिल किया फ़ाउंडेशन, Alibaba की Tongyi लैब का ओपन-वेट इमेज मॉडल। कैटलॉग की सबसे सस्ती इमेज में से। Z Image Turbo से ज़्यादा विविधता, प्रति इमेज धीमा। सस्ते वॉल्यूम और एक्सपेरिमेंट के लिए अच्छा। पॉलिश्ड फ़ाइनल आर्ट के लिए FLUX.2 Pro पर जाएँ।",
        modelsLabZImageTurbo:
          "Z-Image का डिस्टिल्ड, स्पीड-ट्यून वर्ज़न, Alibaba की Tongyi लैब का ओपन-वेट मॉडल। कुछ ही स्टेप में इमेज, कैटलॉग में सबसे नीचे की कीमत। इस लागत में अच्छे फ़ोटोरियल नतीजे और पढ़ने लायक टेक्स्ट। Z Image Base से कम विविधता, और मुश्किल प्रॉम्प्ट पर FLUX.2 Pro से पीछे।",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I: ModelsLab के ज़रिए Black Forest Labs का Flux 2 Max टेक्स्ट-टू-इमेज",
        modelsLabFluxPro11Ultra:
          "Flux Pro 1.1 का हाई-रेज़ोल्यूशन मोड, करीब 4 मेगापिक्सल की इमेज के लिए बना। सिर्फ़ टेक्स्ट इनपुट। यहाँ के महँगे इमेज मॉडल में से। बड़े, प्रिंट-रेडी स्टिल के लिए चुनें। एडिटिंग या मल्टी-रेफ़रेंस काम के लिए FLUX.2 Pro सस्ता और ज़्यादा लचीला है।",
        modelsLabFluxPro11:
          "Flux Pro 1.1: ModelsLab के ज़रिए Black Forest Labs का Flux Pro 1.1 टेक्स्ट-टू-इमेज",
        modelsLabFlux2ProT2I:
          "Flux 2 Pro T2I: ModelsLab के ज़रिए Black Forest Labs का Flux 2 Pro टेक्स्ट-टू-इमेज",
        modelsLabFlux2DevT2I:
          "Flux 2 Dev T2I: ModelsLab के ज़रिए Black Forest Labs का Flux 2 Dev टेक्स्ट-टू-इमेज",
        modelsLabFluxT2I:
          "Flux T2I: ModelsLab के ज़रिए Black Forest Labs का Flux टेक्स्ट-टू-इमेज",
        modelsLabSeedream45T2I:
          "Seedream 4.5 T2I: ModelsLab के ज़रिए ByteDance का Seedream 4.5 टेक्स्ट-टू-इमेज",
        modelsLabSeedream40T2I:
          "Seedream 4.0 T2I: ModelsLab के ज़रिए ByteDance का Seedream 4.0 टेक्स्ट-टू-इमेज",
        modelsLabSeedreamT2I:
          "Seedream T2I: ModelsLab के ज़रिए ByteDance का Seedream टेक्स्ट-टू-इमेज",
        modelsLabImagen4Ultra:
          "Google के Imagen 4 का टॉप टियर। फ़ैमिली में सबसे सटीक प्रॉम्प्ट फ़ॉलोइंग और इमेज के भीतर साफ़, पढ़ने लायक टेक्स्ट। मेनस्ट्रीम: Google के फ़िल्टर पूरी तरह लागू। Imagen 4 Fast की करीब तीन गुना कीमत, इसलिए फ़ाइनल रेंडर के लिए रखें। कम पाबंदियों के लिए FLUX.2 Pro, एक्सप्लिसिट कंटेंट के लिए Chroma।",
        modelsLabImagen4:
          "Google का स्टैंडर्ड Imagen 4। मिड-रेंज कीमत पर फ़ोटोरियल डिटेल, अच्छी टाइपोग्राफ़ी और भरोसेमंद प्रॉम्प्ट फ़ॉलोइंग। मेनस्ट्रीम: Google के फ़िल्टर लागू, इसलिए तीखे प्रॉम्प्ट पर इनकार की उम्मीद रखें। ड्राफ़्ट के लिए Imagen 4 Fast करीब आधी कीमत का है। आख़िरी निखार के लिए Imagen 4 Ultra है।",
        modelsLabImagen4Fast:
          "Google के Imagen 4 का स्पीड टियर। सबसे सस्ता Imagen, तेज़ नतीजे, ड्राफ़्ट और बल्क बैच के लिए अच्छा। Imagen 4 और Ultra के मुक़ाबले कुछ डिटेल और प्रॉम्प्ट की सटीकता छोड़ता है। मेनस्ट्रीम फ़िल्टर लागू। और सस्ते वॉल्यूम और हल्के फ़िल्टर के लिए Z Image Turbo आज़माएँ।",
        modelsLabImagen3:
          "Imagen 3: ModelsLab के ज़रिए Google का Imagen 3 टेक्स्ट-टू-इमेज",
        modelsLabNanoBananaPro:
          "Nano Banana Pro: ModelsLab के ज़रिए हाई-क्वालिटी इमेज जनरेशन",
        modelsLabNanoBanana: "Nano Banana: ModelsLab के ज़रिए इमेज जनरेशन",
        modelsLabQwenT2I:
          "Alibaba का Qwen टेक्स्ट-टू-इमेज मॉडल। Qwen इमेज लाइन इमेज के भीतर टेक्स्ट, चीनी अक्षर समेत, रेंडर करने में अलग दिखती है, जो पोस्टर, साइन और मॉकअप के लिए सही है। कीमत कैटलॉग में सबसे नीचे। सिर्फ़ टेक्स्ट इनपुट। एडिटिंग के लिए Qwen Image 3 चुनें।",
        modelsLabRealtimeT2I:
          "ModelsLab का रियलटाइम एंडपॉइंट, पॉलिश से ज़्यादा रफ़्तार के लिए ट्यून किया गया। कैटलॉग के सबसे कम कीमत टियर में तेज़ इमेज। तेज़ आइडिया, थंबनेल और FLUX.2 Pro या Imagen 4 पर खर्च करने से पहले प्रॉम्प्ट टेस्ट करने के लिए इस्तेमाल करें। फ़ाइनल आर्ट या जटिल सीन के लिए नहीं।",
        claudeSonnet5:
          "Anthropic का पहला Sonnet 5: 1M कॉन्टेक्स्ट पर संतुलित कोडिंग, एजेंट और विश्लेषण का काम, इमेज इनपुट के साथ। मेनस्ट्रीम फ़िल्टर, विवादित विषयों पर सतर्क, रोलप्ले में कमज़ोर। Claude Sonnet 5.5 उसी कीमत का और नया है, इसलिए रुकने की कोई वजह नहीं।",
        claudeOpus5:
          "Anthropic का पहला Opus 5, सबसे कठिन एजेंटिक और विश्लेषण वाले कामों के लिए, 1M कॉन्टेक्स्ट और इमेज इनपुट के साथ। प्रीमियम कीमत, मेनस्ट्रीम फ़िल्टर, विवादित विषयों पर सतर्क। Claude Opus 5.5 नया और सस्ता है।",
        claudeOpus5Fast:
          "Claude Opus 5 Fast: Claude Opus 5 का हाई-थ्रूपुट वर्ज़न, लेटेंसी-संवेदनशील ऐप्लिकेशन के लिए ऑप्टिमाइज़्ड। 1M-टोकन कॉन्टेक्स्ट।",
        claudeFable5:
          "Anthropic का पहला Fable, गहरे संश्लेषण, क्रिएटिव गहराई और लंबी प्लानिंग के लिए फ़्रंटियर रीज़नर, 1M कॉन्टेक्स्ट और इमेज इनपुट के साथ। यहाँ के सबसे महँगे मॉडल में से, मेनस्ट्रीम-फ़िल्टर्ड। Claude Fable 5.2 नया और सस्ता है। कोड के लिए Claude Opus 5.5 चुनें।",
        grok45:
          "xAI का Grok 4.5 रीज़निंग मॉडल: विश्लेषण और कोडिंग में मज़बूत, इमेज पढ़ता है, 500K कॉन्टेक्स्ट, Grok की खुली कंटेंट पॉलिसी के साथ। Grok 4.7 उसी कीमत पर नया है, इसलिए यही वर्ज़न ज़रूरी न हो तो बदल लें।",
        grok46:
          "Grok 4.6 ने 4.5 से रीज़निंग और कोडिंग तेज़ की, इमेज इनपुट, 500K कॉन्टेक्स्ट और xAI के हल्के कंटेंट फ़िल्टर के साथ। अब भी सक्षम ओपन-फ़िल्टर मॉडल। Grok 4.7 उसी कीमत का है और इसकी जगह लेता है।",
        gpt56Luna:
          "OpenAI की GPT-5.6 लाइन का तेज़, सस्ता टियर, रोज़ की चैट और छोटे कामों के लिए, 1M कॉन्टेक्स्ट और इमेज इनपुट के साथ। गहरे विश्लेषण के लिए नहीं। GPT-6 Luna नया है और करीब आधी कीमत का।",
        gpt56LunaPro:
          "बेहतर कोडिंग और निर्देश मानने वाला Luna, सादे Luna जितनी ही कम कीमत पर। सस्ती कोड मदद और 1M कॉन्टेक्स्ट पर स्ट्रक्चर्ड कामों के लिए अच्छा। GPT-6 Luna नया है और करीब आधी कीमत का।",
        gpt56Terra:
          "OpenAI की GPT-5.6 लाइन का मिड टियर: 1M कॉन्टेक्स्ट पर ठोस कोडिंग, विश्लेषण और चैट, इमेज इनपुट के साथ। रोलप्ले में कमज़ोर। GPT-6.1 Terra नया है और करीब आधी कीमत का।",
        gpt56TerraPro:
          "विश्लेषण-भारी कामों के लिए गहरी रीज़निंग वाला Terra, सादे Terra जितनी ही कीमत पर, 1M कॉन्टेक्स्ट। रोलप्ले में कमज़ोर। GPT-6.1 Terra नया है और करीब आधी कीमत का। ज़्यादा गहराई के लिए GPT-6.1 Sol पर जाएँ।",
        gpt56Sol:
          "OpenAI की GPT-5.6 लाइन का टॉप टियर: 1M कॉन्टेक्स्ट पर जटिल रीज़निंग, कोडिंग, राइटिंग और विश्लेषण, इमेज इनपुट के साथ। प्रीमियम कीमत, मेनस्ट्रीम फ़िल्टर। GPT-6.1 Sol नया है और करीब आधी कीमत का।",
        gpt56SolPro:
          "सबसे कठिन समस्याओं के लिए अतिरिक्त रीज़निंग वाला Sol, सादे Sol जितनी ही कीमत पर, 1M कॉन्टेक्स्ट। रोलप्ले में कमज़ोर, मेनस्ट्रीम फ़िल्टर। GPT-6.1 Sol नया है, आधी कीमत पर। अधिकतम गहराई चाहिए तो GPT-6 Astra।",
        gemini36Flash:
          "Google का Gemini 3.6 Flash: तेज़ और कोडिंग में अच्छा, 1M कॉन्टेक्स्ट और टेक्स्ट, इमेज, वीडियो, ऑडियो इनपुट के साथ। रोज़ के काम के लिए अब भी वाजिब वैल्यू। Gemini 3.8 Flash थोड़े ही ज़्यादा में नया है।",
        gemini35FlashLite:
          "Google का सबसे हल्का Gemini। टेक्स्ट, इमेज, वीडियो और ऑडियो लेता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। सारांश, टैगिंग और तेज़ जवाब जैसे आसान हाई-वॉल्यूम कामों के लिए ठीक। मेनस्ट्रीम फ़िल्टर, रीज़नर नहीं। लाइट मॉडल के लिए उम्मीद से महँगा: GPT-6 Luna और Claude Haiku 5.5 कम में आते हैं।",
        gemini37Flash:
          "Gemini 3.7 Flash ने Flash लाइन में बेहतर रीज़निंग और विश्लेषण लाया, 1M कॉन्टेक्स्ट और टेक्स्ट, इमेज, वीडियो, ऑडियो इनपुट के साथ। वाजिब कीमत पर अच्छा रोज़ का मॉडल। Gemini 3.8 Flash थोड़े ही ज़्यादा में इसकी जगह लेता है।",
        kimiK3:
          "Moonshot AI का Kimi K3, फ़्रंटियर-टियर मॉडल। कोड, विश्लेषण, क्रिएटिव राइटिंग और लंबे एजेंट रन में मज़बूत, इमेज और वीडियो पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। अमेरिकी लैब्स से हल्के फ़िल्टर। Kimi K3.1 Pro नया और ज़्यादा मज़बूत वर्ज़न है, करीब दोगुनी कीमत पर।",
        glm52:
          "Z.AI का GLM-5.2: तेज़ इनफ़रेंस और 1M कॉन्टेक्स्ट के साथ मज़बूत रीज़निंग। लंबे इनपुट पर कोडिंग और विश्लेषण के लिए अच्छा, सिर्फ़ टेक्स्ट, खुला कंटेंट लेवल। GLM-5.3 नया है और करीब तिहाई कीमत का।",
        minimaxM3:
          "MiniMax का पूर्व फ़्लैगशिप। कोड, रीज़निंग और विश्लेषण में अच्छा, इमेज और वीडियो पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट, मेनस्ट्रीम लैब्स से हल्के फ़िल्टर। MiniMax M3.1 Flash इसकी जगह लेता है: एजेंट और कोड में साफ़ तौर पर मज़बूत, आधी या कम कीमत पर।",
        qwen37Flash:
          "Alibaba का अल्ट्रा-सस्ता Flash मॉडल और कैटलॉग के सबसे कम लागत वाले विकल्पों में से: 1M कॉन्टेक्स्ट, टेक्स्ट, इमेज और वीडियो इनपुट, टूल कॉल। बल्क काम और तेज़ चैट के लिए बढ़िया, कठिन रीज़निंग में उथला। Qwen 3.8 Flash नया और ज़्यादा स्मार्ट है पर कई गुना महँगा।",
        qwen38Max:
          "Alibaba का टॉप Qwen। फ़्रंटियर-टियर रीज़निंग, कोड और विश्लेषण, इमेज और वीडियो पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। अमेरिकी लैब्स से हल्के फ़िल्टर। ओपन मॉडल के लिए प्रीमियम: सिर्फ़ टेक्स्ट इनपुट काफ़ी हो तो DeepSeek V4 Pro आधी से काफ़ी कम कीमत पर उसी टियर तक पहुँचता है।",
        mimoV25:
          "Xiaomi का कारगर MiMo V2.5: तेज़ और कोडिंग में अच्छा, 1M कॉन्टेक्स्ट और टेक्स्ट, इमेज, वीडियो, ऑडियो इनपुट के साथ। खुला कंटेंट लेवल। MiMo V2.6 Flash नया है और तिहाई से कम कीमत का।",
        mimoV25Pro:
          "Xiaomi का MiMo V2.5 Pro, कम कीमत पर 1M कॉन्टेक्स्ट वाला गहरी रीज़निंग और कोडिंग मॉडल। सिर्फ़ टेक्स्ट, खुला कंटेंट लेवल। अपने उत्तराधिकारी MiMo V2.6 Pro से अब भी सस्ता, जो नया चुनाव है।",
        metaMuseSpark12:
          "Meta का Muse Spark 1.2, मल्टीमॉडल रीज़निंग मॉडल जो 1M कॉन्टेक्स्ट पर टेक्स्ट, इमेज और वीडियो पढ़ता है। क्रॉस-मॉडल विश्लेषण में अच्छा, खुला कंटेंट लेवल। कोडिंग के लिए टैग नहीं। Meta Muse Spark 1.3 उसी कीमत का और नया है।",
        mistralMedium35:
          "फ़्रांसीसी लैब Mistral AI का मिड-टियर Medium 3.5: कोडिंग, विश्लेषण और इमेज इनपुट, 262K कॉन्टेक्स्ट। मेनस्ट्रीम फ़िल्टर। Mistral Large 4 नया है और आधी से कम कीमत का।",
        claudeOpus55:
          "रोज़ के भारी काम के लिए Anthropic का टॉप Claude। सबसे कठिन कोडिंग, लंबे एजेंटिक काम और ध्यान से किए विश्लेषण के लिए चुनाव, ऊपर से मज़बूत राइटिंग। इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। प्रीमियम कीमत और मेनस्ट्रीम फ़िल्टर: तीखे अनुरोध ठुकराता है और रोलप्ले का कमज़ोर साथी है। Claude Sonnet 5.5 आधी कीमत पर रोज़ का ज़्यादातर काम कर देता है।",
        claudeSonnet55:
          "Anthropic का वर्कहॉर्स Claude। Opus 5.5 की आधी कीमत पर मज़बूत कोडिंग, एजेंट काम, विश्लेषण और राइटिंग। इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। मेनस्ट्रीम फ़िल्टर, इसलिए रोलप्ले या विवादित विषयों के लिए नहीं। कीमत में GPT-6.1 Sol और Gemini 4 Argon के बराबर, यानी सीधा मुक़ाबला।",
        claudeHaiku55:
          "Anthropic का सबसे तेज़, सबसे सस्ता Claude। तेज़ चैट, हल्की कोडिंग, विज़न और टूल, 1M कॉन्टेक्स्ट, हर मैसेज चंद पैसे। मेनस्ट्रीम फ़िल्टर, रोलप्ले और तीखे विषयों में कमज़ोर। कीमत GPT-6 Luna जितनी। काम को असली गहराई चाहिए तो Claude Sonnet 5.5 पर जाएँ।",
        claudeFable51:
          "Anthropic का Fable 5.1, 1M कॉन्टेक्स्ट पर गहरे संश्लेषण, लंबी प्लानिंग और ध्यान से की राइटिंग के लिए फ़्रंटियर रीज़नर। प्रीमियम कीमत, मेनस्ट्रीम-फ़िल्टर्ड, विवादित विषयों पर सतर्क और रोलप्ले में कमज़ोर। Claude Fable 5.2 इसकी जगह लेता है और सस्ता है। कोड के लिए Claude Opus 5.5 बेहतर है।",
        claudeFable52:
          "Anthropic का फ़्रंटियर रीज़नर और सबसे महँगा Claude। गहरे संश्लेषण, रिसर्च और लंबी प्लानिंग के लिए बना, मज़बूत राइटिंग के साथ। इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। Opus 5.5 की करीब दोगुनी कीमत, मेनस्ट्रीम फ़िल्टर के साथ। कोड के लिए Claude Opus 5.5 बेहतर वैल्यू है।",
        gpt6Astra:
          "पिछला Astra फ़्लैगशिप टेक्स्ट, इमेज और टूल सपोर्ट करता है। इसका उत्तराधिकारी GPT-6.2 Astra है।",
        gpt6AstraPro:
          "GPT-6 Astra Pro: एक्सटेंडेड रीज़निंग एफ़र्ट वाला GPT-6 Astra। धीमा, ज़्यादा गहरा। 1.05M-टोकन कॉन्टेक्स्ट।",
        gpt61Sol:
          "पिछला Sol रिलीज़ टेक्स्ट, इमेज और टूल सपोर्ट करता है। इसका उत्तराधिकारी GPT-6.2 Sol है।",
        gpt61SolPro:
          "GPT-6.1 Sol Pro: जटिल विश्लेषण और कोड के लिए एक्सटेंडेड रीज़निंग एफ़र्ट वाला GPT-6.1 Sol। 1.05M-टोकन कॉन्टेक्स्ट।",
        gpt61Terra:
          "OpenAI का संतुलित मिडिल टियर। अच्छी कोडिंग, विश्लेषण और रोज़ की चैट, इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। GPT-6.1 Sol की आधी कीमत। मेनस्ट्रीम फ़िल्टर, रोलप्ले में कमज़ोर। हल्के फ़िल्टर पसंद हों तो DeepSeek V4 Pro कम कीमत में ऊँचे टियर तक पहुँचता है।",
        gpt61TerraPro:
          "GPT-6.1 Terra Pro: विश्लेषण-भारी कामों के लिए गहरी रीज़निंग वाला GPT-6.1 Terra। 1.05M-टोकन कॉन्टेक्स्ट।",
        gpt6Luna:
          "OpenAI का हल्का GPT-6। चंद पैसों में तेज़ जवाब, इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। तेज़ सवाल और आसान कामों के लिए अच्छा, गहरी रीज़निंग या रोलप्ले के लिए नहीं। कीमत Claude Haiku 5.5 जितनी। DeepSeek V4.1 Flash और सस्ता है, हल्के फ़िल्टर के साथ।",
        gpt6LunaPro:
          "GPT-6 Luna Pro: अतिरिक्त रीज़निंग वाला GPT-6 Luna। बेहतर कोड और निर्देश मानना, वही कम कीमत। 1.05M-टोकन कॉन्टेक्स्ट।",
        gemini4Argon:
          "Google का फ़्लैगशिप Gemini। टेक्स्ट, इमेज, वीडियो और ऑडियो लेता है, फिर टॉप टियर पर रीज़न, कोड और विश्लेषण करता है। टूल कॉल करता है, 1M कॉन्टेक्स्ट। जब इनपुट रिकॉर्डिंग, वीडियो या स्क्रीनशॉट का ढेर हो तो मज़बूत चुनाव। मेनस्ट्रीम फ़िल्टर। कीमत Claude Sonnet 5.5 और GPT-6.1 Sol के बराबर। सबसे कठिन कामों में Gemini 4 Carbon और गहरा जाता है। Gemini 4 Hydrogen तेज़ है और चौथाई सस्ता।",
        gemini38Flash:
          "Google का मौजूदा Flash। तेज़, कोड और विश्लेषण में अच्छा, टेक्स्ट, इमेज, वीडियो और ऑडियो लेता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। मेनस्ट्रीम फ़िल्टर। मिड-प्राइस: Gemini 4 Argon की आधी से काफ़ी कम, पर Qwen 3.8 Flash जैसे तेज़ ओपन मॉडल से कहीं ऊपर। Gemini 4 Hydrogen लगभग दोगुनी कीमत पर कहीं स्मार्ट और तेज़ है।",
        grok47:
          "xAI का सबसे नया Grok। तेज़ रीज़निंग और कोड, इमेज पढ़ता है, टूल कॉल करता है, 500K कॉन्टेक्स्ट, यहाँ के ज़्यादातर फ़्लैगशिप जितना आधा। खुली कंटेंट पॉलिसी, इसलिए मेनस्ट्रीम लैब्स से ज़्यादा जवाब देता है, पर पूरी तरह अनसेंसर्ड नहीं। कीमत Qwen 3.8 Max जैसी। xAI में अब कोई सस्ता Fast टियर नहीं: खुले फ़िल्टर के साथ तेज़, सस्ती चैट के लिए MiniMax M3.1 Flash या Meta Muse Ember आज़माएँ।",
        kimiK31Pro:
          "Moonshot AI का सबसे मज़बूत Kimi। टॉप-टियर रीज़निंग, कोड, क्रिएटिव राइटिंग और लंबे एजेंट रन, इमेज और वीडियो पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। अमेरिकी लैब्स से हल्के फ़िल्टर। कीमत Claude Sonnet 5.5 के बराबर। Kimi K3 कुछ ऊपर आधी कीमत पर क़रीब पहुँच जाता है।",
        gpt62Sol: "Sol टेक्स्ट और इमेज पढ़ता है, कोड लिखता है और टूल कॉल करता है।",
        gpt62Astra:
          "Astra टेक्स्ट, इमेज और टूल के साथ जटिल इंजीनियरिंग और विश्लेषण सँभालता है।",
        superGemma426b:
          "Jiunsong का फ़ाइन-ट्यून किया Gemma 4 टेक्स्ट के साथ एक इमेज पढ़ता है और टूल कॉल कर सकता है।",
        deepseekV41FlashCsf:
          "jcartu का abliterated DeepSeek V4.1 Flash टेक्स्ट, रीज़निंग और टूल कॉल सँभालता है।",
        maiImage27: "Microsoft का टेक्स्ट-टू-इमेज मॉडल इस रूट पर 1K में रेंडर करता है।",
        maiImage27Flash: "तेज़ MAI Image 2.7 वर्ज़न टेक्स्ट से 1K इमेज रेंडर करता है।",
        qwen4Max:
          "Alibaba का नया फ़्लैगशिप और पहला Qwen 4। फ़्रंटियर-टियर रीज़निंग, कोड और विश्लेषण, इमेज और वीडियो पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। अमेरिकी लैब्स से हल्के फ़िल्टर। हर जवाब से पहले सोचता है, इसलिए जवाब आने में थोड़ा वक़्त लगता है। Qwen 3.8 Max से चौथाई सस्ता, जिसकी यह जगह लेता है।",
        kimiK31ProUncensored:
          "Moonshot AI का सबसे मज़बूत Kimi, इनकार हटाकर (abliterated), Lyber से सर्व होता है। अनसेंसर्ड सेट का नया टॉप एंड: रीज़निंग, कोड, लंबी राइटिंग और टूल, 1M कॉन्टेक्स्ट। इनकार हटे हैं, नज़रिया वही: राजनीति पर यह बेस Kimi की फ़्रेमिंग में जवाब देता है। मुख्यधारा के उलट राजनीतिक राय के लिए UncensoredLM लें। सिर्फ़ टेक्स्ट। प्रीमियम कीमत, सस्ते भारी खिलाड़ी GLM 5.3 Uncensored से कई गुना।",
        hy4: "Tencent का फ़्लैगशिप Hy4। डिफ़ॉल्ट रूप से रीज़न करता है, कोड करता है, इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। अपने टियर के हिसाब से कम कीमत पर मेनस्ट्रीम फ़िल्टर। नया नाम है, इसलिए अपने प्रॉम्प्ट पर टेस्ट करें। Hy4 Flash सस्ता, तेज़ भाई है।",
        hy4Flash:
          "Tencent का छोटा Hy4। टेक्स्ट और इमेज पढ़ता है, कोड करता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। कैटलॉग के सबसे सस्ते मॉडल में से, हाई-वॉल्यूम काम के लिए बना। गहराई छोड़कर रफ़्तार लेता है: कठिन समस्याएँ Hy4 लेता है।",
        deepseekV41Flash:
          "DeepSeek का तेज़ मॉडल, अब विज़न के साथ। लगभग मुफ़्त में गंभीर कोडिंग और विश्लेषण: कैटलॉग का सबसे सस्ता मॉडल। टूल कॉल करता है, 1M कॉन्टेक्स्ट, हल्के फ़िल्टर। गहरा रीज़नर नहीं। कठिन समस्याओं के लिए DeepSeek V4 Pro पर जाएँ, या बिना इनकार के लिए DeepSeek V4.1 Flash Uncensored चुनें।",
        qwen38Flash:
          "Alibaba का तेज़ Qwen। टेक्स्ट, इमेज और वीडियो अंदर, तेज़ जवाब बाहर, ठीक-ठाक कोडिंग, टूल कॉल करता है, 1M कॉन्टेक्स्ट। बजट कीमत, हल्के फ़िल्टर। रोज़ का साथी, गहरा विचारक नहीं। कठिन समस्याएँ Qwen 4 Max लेता है।",
        glm53:
          "Z.AI का GLM-5.3 फ़ाउंडेशन मॉडल। चंद पैसों में मज़बूत रीज़निंग और कोड, टूल कॉल करता है, 1M कॉन्टेक्स्ट। सिर्फ़ टेक्स्ट, हल्के फ़िल्टर। कैटलॉग के सबसे सस्ते स्मार्ट मॉडल में से। शून्य इनकार चाहिए? GLM 5.3 Uncensored बिना फ़िल्टर वाला वर्ज़न है।",
        glm53Flash:
          "Z.AI का तेज़ GLM। टेक्स्ट, इमेज और वीडियो पढ़ता है, कोड करता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। हल्के फ़िल्टर के साथ बजट कीमत पर हाई-वॉल्यूम काम के लिए बना। GLM-5.3 से रीज़निंग में हल्का, जिसकी कीमत वही है, इसलिए मीडिया इनपुट और रफ़्तार के लिए Flash चुनें।",
        mimoV26Pro:
          "Xiaomi का टॉप MiMo। टॉप-टियर रीज़निंग, कोड और विश्लेषण, टेक्स्ट, इमेज, वीडियो और ऑडियो लेता है। टूल कॉल करता है, 1M कॉन्टेक्स्ट, हल्के फ़िल्टर। यहाँ के सबसे ऊँचे इंटेलिजेंस टियर में सबसे सस्ता मॉडल, मिलते-जुलते इनपुट रेंज के लिए Gemini 4 Argon का एक छोटा हिस्सा। नया नाम है, इसलिए अपने प्रॉम्प्ट पर टेस्ट करें।",
        mimoV26Flash:
          "Xiaomi का तेज़ MiMo। टेक्स्ट, इमेज, वीडियो और ऑडियो लेता है, अपनी कीमत के हिसाब से अच्छा कोड करता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। बहुत सस्ता, हल्के फ़िल्टर। गहराई छोड़कर रफ़्तार लेता है। MiMo V2.6 Pro अगला कदम है, और MiMo V2.6 Flash Abliterated इनकार हटा देता है।",
        metaMuseSpark13:
          "Meta का मिड-टियर Muse। टेक्स्ट, इमेज और वीडियो पर रीज़न और विश्लेषण करता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट, हल्के फ़िल्टर। कोडिंग के लिए नहीं बना। इस कीमत पर Kimi K3 ऊँचे टियर तक पहुँचता है, और Meta Muse Wonder Meta का फ़्लैगशिप है।",
        metaMuseWonder:
          "Meta का फ़्लैगशिप Muse। टॉप-टियर रीज़निंग, कोड, विश्लेषण और क्रिएटिव काम, टेक्स्ट, इमेज, वीडियो और ऑडियो लेता है। टूल कॉल करता है, 1M कॉन्टेक्स्ट, मेनस्ट्रीम लैब्स से हल्के फ़िल्टर। प्रीमियम, कीमत Claude Opus 5.5 जैसी। Kimi K3.1 Pro और Gemini 4 Argon उसी टियर में आधी कीमत पर हैं।",
        mistralLarge4:
          "यूरोपीय लैब Mistral AI का फ़्लैगशिप। कोड और विश्लेषण में अच्छा, इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट, मध्यम कीमत पर। मेनस्ट्रीम फ़िल्टर। टॉप टियर नहीं: DeepSeek V4 Pro थोड़ा ज़्यादा में आता है और गहरी रीज़निंग करता है।",
        gemini4Hydrogen:
          "Google का तेज़ Gemini 4। एजेंट लूप, कोडिंग और तेज़ विश्लेषण के लिए बना, बेंचमार्क पर टॉप टियर में आता है और Gemini 3.8 Flash से करीब 2.5 गुना तेज़ चलता है। टेक्स्ट, इमेज, वीडियो और ऑडियो लेता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट। मेनस्ट्रीम फ़िल्टर। लंबी, गहरी रीज़निंग चेन Gemini 4 Carbon या Argon पर छोड़ें। Argon से चौथाई सस्ता, Gemini 3.8 Flash से लगभग दोगुना।",
        gemini4Carbon:
          "Google का सबसे मज़बूत Gemini और इस वक़्त कहीं के भी टॉप मॉडल में से एक। सबसे कठिन कोड, लंबे एजेंट रन और जटिल रीज़निंग के लिए बना, टेक्स्ट, इमेज, वीडियो और ऑडियो इनपुट के साथ। टूल कॉल करता है, 1M कॉन्टेक्स्ट। मेनस्ट्रीम फ़िल्टर। हर काम पर Argon से ज़्यादा टोकन खर्च करता है, इसलिए व्यवहार में महँगा पड़ता है। लॉन्च कीमत 30 नवंबर तक Argon, Claude Sonnet 5.5 और GPT-6.1 Sol के बराबर है, फिर दोगुनी होकर Claude Opus 5.5 के स्तर पर पहुँचती है।",
        minimaxM31Flash:
          "MiniMax का तेज़ मॉडल और M3 पर बड़ी छलांग: एजेंट, कोड और सिक्योरिटी कामों में कहीं बेहतर। इमेज और वीडियो पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट, मेनस्ट्रीम लैब्स से हल्के फ़िल्टर। जवाब से पहले हमेशा सोचता है और लंबा लिखता है, इसलिए जवाब दूसरे Flash मॉडल से धीमे और लंबे होते हैं। M3 की आधी या कम कीमत, DeepSeek V4.1 Flash और Qwen 3.8 Flash के बजट ब्रैकेट में।",
        metaMuseEmber:
          "Meta का सबसे छोटा Muse, उन कामों के लिए जो एजेंट दिन भर दोहराते हैं: टूल कॉल, रूटिंग, डेटा एक्सट्रैक्शन और तेज़ चैट। टेक्स्ट, इमेज, वीडियो और ऑडियो पढ़ता है, 1M कॉन्टेक्स्ट, मेनस्ट्रीम लैब्स से हल्के फ़िल्टर। अपने साइज़ के हिसाब से टूल इस्तेमाल और कंप्यूटर कामों में मज़बूत, कठिन कोडिंग और गहरी रीज़निंग में उथला। कीमत GPT-6 Luna और Claude Haiku 5.5 जितनी, 200K टोकन से लंबे प्रॉम्प्ट पर तीन गुना।",
        veniceDeepseekV41FlashUncensored:
          "DeepSeek V4.1 Flash, इनकार हटाकर, Venice से सर्व होता है। असली कोडिंग और विश्लेषण के साथ फ़िक्शन और रोलप्ले, बिना उपदेश। इमेज पढ़ता है, टूल कॉल करता है, 1M कॉन्टेक्स्ट, सस्ता। वही ट्रेनिंग, वही नज़रिया: DeepSeek की फ़्रेमिंग अब भी राजनीतिक जवाबों को ढालती है और सबसे डार्क सीन को हल्का कर सकती है। UncensoredLM अलग नज़रिया लाता है। सादे DeepSeek V4.1 Flash से करीब चार गुना कीमत। GLM 5.3 Flash Uncensored सस्ता बेरोकटोक विकल्प है।",
        drummerArtemis31b:
          "TheDrummer का रोलप्ले और फ़िक्शन के लिए Gemma 4 31B फ़ाइनट्यून। किरदार थामे रखता है, बिना इनकार के grimdark और एक्सप्लिसिट एडल्ट सीन लिखता है, और गद्य को साफ़-सुथरा बनाने के बजाय जीवंत रखता है। इमेज पढ़ता है, टूल कॉल करता है, 262K कॉन्टेक्स्ट। कोडिंग और कठिन विश्लेषण में कमज़ोर: कहानीकार है, रीज़नर नहीं। एक ही NanoGPT होस्ट पर कम्युनिटी फ़ाइनट्यून, इसलिए थोड़ी देर के लिए बाहर हो सकता है। Venice Role Play Uncensored की करीब पाँचवें हिस्से की कीमत। कहानी को असली लॉजिक चाहिए तो DeepSeek V4.1 Flash Uncensored ज़्यादा स्मार्ट चुनाव है।",
        hermes4405b:
          "Nous Research का Hermes 4, Meta के Llama 3.1 405B पर बना। हल्के अलाइन्ड ओपन वेट्स: आपका सिस्टम प्रॉम्प्ट मानता है, किरदार थामता है और मेनस्ट्रीम लैब्स से बहुत कम इनकार करता है। Abliterated नहीं है, इसलिए कुछ अनुरोध अब भी ठुकरा सकता है। हाइब्रिड रीज़निंग काम माँगे तो स्टेप-बाय-स्टेप सोचती है। 131K कॉन्टेक्स्ट, सिर्फ़ टेक्स्ट, इस रूट पर टूल कॉल नहीं। लंबे फ़िक्शन, रोलप्ले और खुली बातचीत के लिए बना। कोडिंग में मौजूदा फ़्रंटियर मॉडल से पीछे। शून्य इनकार के लिए GLM 5.3 Uncensored या DeepSeek V4.1 Flash Uncensored लें।",
        grokImagineImage2:
          "xAI का दूसरी पीढ़ी का Grok Imagine इमेज मॉडल। टेक्स्ट या रेफ़रेंस इमेज लेता है, इसलिए नई इमेज के साथ एडिट भी करता है। मिड-रेंज कीमत। ओपन टियर: मेनस्ट्रीम से हल्के फ़िल्टर, एक्सप्लिसिट नहीं। एडिट या कसे हुए प्रॉम्प्ट पालन की ज़रूरत हो तो Grok Imagine T2I से अपग्रेड।",
        recraftV41:
          "Recraft V4.1। डिज़ाइन के काम के लिए बना: लोगो, पोस्टर, पैकेजिंग, विज्ञापन और शब्दों वाली हर चीज़। साफ़ टाइपोग्राफ़ी, मज़बूत कंपोज़िशन, एक रेफ़रेंस इमेज लेता है। करीब 1K पर हर इमेज के लिए लगभग 3.5 क्रेडिट। मेनस्ट्रीम फ़िल्टर लागू। 2K प्रिंट-क्वालिटी आउटपुट के लिए Pro, सस्ते ड्राफ़्ट के लिए Flash।",
        recraftV41Pro:
          "प्रीमियम Recraft V4.1। वही डिज़ाइन समझ और तीखी टाइपोग्राफ़ी, करीब 2K पर बारीक डिटेल के साथ। प्रिंट, प्रोडक्ट शॉट और ब्रांड एसेट के लिए बना जो जस के तस जाते हैं। हर इमेज लगभग 21 क्रेडिट, इसलिए पहले V4.1 या Flash से ड्राफ़्ट बनाएँ। मेनस्ट्रीम फ़िल्टर लागू।",
        recraftV41Flash:
          "Recraft का स्पीड टियर। हर इमेज करीब 1.5 सेकंड, हर एक 1 क्रेडिट से कम, सिर्फ़ टेक्स्ट प्रॉम्प्ट। मूड बोर्ड, थंबनेल और थोक में आइडिया टेस्ट करने के लिए अच्छा। Recraft V4.1 से कम डिटेल। मेनस्ट्रीम फ़िल्टर लागू।",
        qwenImage3:
          "Alibaba के Qwen Image 3 का तेज़ टियर। टेक्स्ट से बनाता है और रेफ़रेंस इमेज से एडिट करता है, कम कीमत पर। तेज़ एडिट, टेक्स्ट-भारी ग्राफ़िक और सुधार के लिए अच्छा। Qwen Image 3 Pro थोड़े ज़्यादा में डिटेल जोड़ता है। अनसेंसर्ड एडिट के लिए Qwen Edit Uncensored इस्तेमाल करें।",
        qwenImage3Pro:
          "Alibaba के Qwen Image 3 का ऊँची क्वालिटी वाला टियर। टेक्स्ट या रेफ़रेंस इमेज अंदर, बेस Qwen Image 3 से ज़्यादा डिटेल और पॉलिश, थोड़े प्रीमियम पर। एडिट और इमेज में टेक्स्ट के काम में मज़बूत। ओपन टियर, इसलिए एक्सप्लिसिट नहीं। उसके लिए Qwen Edit Uncensored है।",
        hailuo3:
          "MiniMax का Hailuo 3। नेटिव ऑडियो, 2K आउटपुट, 15 सेकंड तक की क्लिप, पहले और आख़िरी फ़्रेम का कंट्रोल। कागज़ पर Hailuo 2.3 से साफ़ छलांग, करीब दोगुनी कीमत पर। ऊपरी कीमत रेंज। बिना साउंड के सस्ते 1080p के लिए Hailuo 2.3 T2V इस्तेमाल करें।",
        seedance25:
          "ByteDance का Seedance 2.5। मुख्य बात लंबाई है: नेटिव ऑडियो और फ़्रेम कंट्रोल के साथ 30 सेकंड तक की क्लिप, 480p या 720p पर। प्रति क्लिप सबसे महँगा Seedance। लंबे लगातार शॉट के लिए चुनें। ज़्यादा शार्प छोटी क्लिप के लिए Seedance 2.0 4K तक जाता है।",
        flux3Video:
          "Flux 3 Video: Black Forest Labs का फ़्लैगशिप वीडियो जनरेशन मॉडल, असाधारण क्वालिटी और प्रॉम्प्ट पालन के साथ।",
        grokImagineVideo15:
          "xAI का Grok Imagine Video 1.5। 480p, 720p या 1080p पर 15 सेकंड तक की क्लिप, वैकल्पिक पहले फ़्रेम के साथ। रेज़ोल्यूशन में Grok T2V से ऊपर, करीब दोगुनी कीमत पर। ओपन टियर: Veo या Sora से हल्के फ़िल्टर, एक्सप्लिसिट नहीं।",
        lyria3ProPreview:
          "Google का प्रीमियम Lyria 3 टियर, अभी प्रीव्यू में। हाई प्रोडक्शन क्वालिटी वाले पूरी लंबाई के गानों के लिए बना। मेनस्ट्रीम: Google के फ़िल्टर लागू। Lyria 3 की करीब डेढ़ गुना कीमत। प्रीव्यू का मतलब है कि बर्ताव और उपलब्धता अब भी बदल सकती है।",
        lyria3ClipPreview:
          "Google का शॉर्ट-फ़ॉर्म Lyria 3 Clip, प्रीव्यू में। इंट्रो, स्टिंगर और सोशल पोस्ट के लिए तेज़, सस्ती म्यूज़िक क्लिप। मेनस्ट्रीम फ़िल्टर लागू। सिर्फ़ छोटी अवधि। लंबे ट्रैक के लिए Lyria 3 या Lyria 3 Pro Preview इस्तेमाल करें।",
        geminiNanoBanana21:
          "Google का Nano Banana 2.1। चैट में ही इमेज बनाता और एडिट करता है, एक ही जवाब में टेक्स्ट और तस्वीरें। हर इमेज करीब 3 से 4 क्रेडिट, ओरिजिनल Nano Banana की आधी इमेज कीमत, जिसकी यह जगह लेता है। सटीक एडिट और इमेज में पढ़ने लायक टेक्स्ट में मज़बूत। मेनस्ट्रीम फ़िल्टर, कोई टूल कॉल नहीं। जटिल सीन में Nano Banana Pro अब भी जीतता है, करीब चार गुना कीमत पर।",
        seedream55:
          "ByteDance का Seedream 5.5। टेक्स्ट से बनाता है या दस रेफ़रेंस इमेज तक से एडिट करता है। पोर्ट्रेट, एक जैसे किरदार और मल्टी-इमेज सीन में मज़बूत। हर इमेज 2 क्रेडिट, Seedream 4.5 की आधी कीमत, जिसकी यह जगह लेता है। ओपन टियर: मेनस्ट्रीम से हल्के फ़िल्टर, एक्सप्लिसिट नहीं।",
        flux3Image:
          "Black Forest Labs का FLUX.3। टेक्स्ट या रेफ़रेंस इमेज से, FLUX.2 से ज़्यादा शार्प डिटेल, साफ़ टेक्स्ट और कसा हुआ प्रॉम्प्ट पालन। हर इमेज करीब 5 क्रेडिट, FLUX.2 Max से सस्ता, जिसकी यह जगह लेता है। ओपन टियर, एक्सप्लिसिट नहीं। रोज़ के काम के लिए FLUX.2 Pro सस्ता रहता है। वॉल्यूम के लिए FLUX.3 Klein है।",
        flux3Klein:
          "छोटा, तेज़ FLUX.3। हर इमेज 1 क्रेडिट से कम, कैटलॉग के सबसे सस्ते में से, और एडिट के लिए रेफ़रेंस इमेज भी लेता है। ड्राफ़्ट, थंबनेल और बल्क रन के लिए बना। पूरे FLUX.3 से कम डिटेल। ओपन टियर, एक्सप्लिसिट नहीं।",
        gptImage26Flare:
          "OpenAI का GPT Image 2.6, स्पीड वर्ज़न। टेक्स्ट या रेफ़रेंस इमेज अंदर, साफ़ नतीजे तेज़ी से, टेक्स्ट और लेआउट में अच्छा। हर इमेज करीब 4 क्रेडिट। मेनस्ट्रीम: OpenAI के सख़्त फ़िल्टर लागू। घनी कंपोज़िशन और डिटेल-भारी एडिट के लिए इसका भाई Sunburst इस्तेमाल करें।",
        gptImage26Sunburst:
          "OpenAI का GPT Image 2.6, डिटेल के लिए ट्यून। घनी कंपोज़िशन, टेक्स्ट-भारी पोस्टर और ऐसे एडिट जो राउंड दर राउंड डिटेल बचाए रखते हैं। हर इमेज करीब 6 क्रेडिट। मेनस्ट्रीम: OpenAI के सख़्त फ़िल्टर लागू। बारीक डिटेल कम मायने रखे तो Flare तेज़ और सस्ता है।",
        geminiOmni12Flash:
          "Google का Gemini Omni 1.2 Flash वीडियो मॉडल। नेटिव ऑडियो के साथ 3 से 15 सेकंड की क्लिप, 360p से 4K तक, पहले और आख़िरी फ़्रेम के कंट्रोल के साथ। 720p पर करीब 7 क्रेडिट प्रति सेकंड और 1080p पर 10, उसी रेज़ोल्यूशन पर Veo 3.1 Fast से सस्ता। Google के फ़िल्टर लागू।",
        grokImagineVideo15Lite:
          "xAI के Grok Imagine Video 1.5 का तेज़, सस्ता कट। 480p, 720p या 1080p पर 1 से 15 सेकंड की क्लिप, वैकल्पिक पहला फ़्रेम। 720p पर 3 क्रेडिट प्रति सेकंड, ओरिजिनल Grok Imagine वीडियो की आधी से कम, जिसकी यह जगह लेता है। रफ़्तार के लिए थोड़ी क्वालिटी छोड़ता है। पूरा Grok Imagine Video 1.5 बेहतर दिखता है। ओपन टियर, एक्सप्लिसिट नहीं।",
        wan30:
          "Alibaba का Wan 3.0। नेटिव ऑडियो के साथ 2 से 30 सेकंड की क्लिप, 480p से 1080p, पहले और आख़िरी फ़्रेम का कंट्रोल। 720p पर 10 क्रेडिट प्रति सेकंड, Wan 2.7 जितना जिसकी यह जगह लेता है, साथ में उसकी आधी कीमत वाला 480p टियर। बजट में लंबे टेक। ओपन टियर, एक्सप्लिसिट नहीं।",
        seedance2Mini:
          "बजट Seedance 2.0। टेक्स्ट या इमेज से वीडियो, 4 से 15 सेकंड, नेटिव ऑडियो, पहले और आख़िरी फ़्रेम का कंट्रोल, 480p या 720p पर। 720p पर करीब 7.6 क्रेडिट प्रति सेकंड, Seedance 2.0 Fast से कम। ड्राफ़्ट और सोशल क्लिप के लिए अच्छा। ज़रूरत पड़ने पर Seedance 2.0 4K तक पहुँचता है। ओपन टियर, एक्सप्लिसिट नहीं।",
        seedance25Flash:
          "ByteDance का Seedance 2.5 Flash, तेज़ Seedance 2.5। टेक्स्ट या इमेज से वीडियो, 4 से 30 सेकंड, नेटिव ऑडियो, 480p या 720p पर। 480p पर 8.4 क्रेडिट प्रति सेकंड, 720p पर 18.9, पूरे Seedance 2.5 से कम। कम में लंबे टेक। Venice.ai पर चलता है, अनाम रूप में। ओपन टियर, एक्सप्लिसिट नहीं।",
        hailuo3Max:
          "MiniMax का Hailuo 3 Max, Hailuo 3 की तेज़ ट्रेनिंग। 768p या 480p पर 5 से 15 सेकंड की क्लिप, पहले और आख़िरी फ़्रेम के कंट्रोल के साथ, बिना साउंड। 8 क्रेडिट प्रति सेकंड, Hailuo 3 से काफ़ी कम। तेज़ सुधार के लिए चुनें। Hailuo 3 में 2K और नेटिव ऑडियो है। ओपन टियर, एक्सप्लिसिट नहीं।",
        runwayGen45:
          "Runway का Gen-4.5। सिनेमाई मोशन और मज़बूत प्रॉम्प्ट पालन, टेक्स्ट या पहला फ़्रेम अंदर, 720p पर 2 से 10 सेकंड की क्लिप, बिना साउंड। 12 क्रेडिट प्रति सेकंड, ऊपरी मिड-रेंज। फ़िल्म-स्टाइल शॉट के लिए मज़बूत चुनाव। क्लिप में साउंड के लिए Veo 3.1 Fast या Wan 3.0 इस्तेमाल करें। ओपन टियर, एक्सप्लिसिट नहीं।",
      },
    },
    modelUtilities: {
      adultExplicit: "एडल्ट/एक्सप्लिसिट कंटेंट",
      adultImplied: "एडल्ट/संकेतों वाला कंटेंट",
      analysis: "विश्लेषण",
      chat: "चैट",
      coding: "कोडिंग",
      conspiracy: "साज़िश के सिद्धांत",
      controversial: "विवादित विषय",
      creative: "क्रिएटिव राइटिंग",
      fast: "तेज़",
      harmful: "संभावित हानिकारक कंटेंट",
      illegalInfo: "अवैध जानकारी",
      imageGen: "इमेज जनरेशन",
      legacy: "लेगेसी",
      medicalAdvice: "मेडिकल सलाह",
      offensiveLanguage: "अपमानजनक भाषा",
      politicalLeft: "वामपंथी राजनीतिक विचार",
      politicalRight: "दक्षिणपंथी राजनीतिक विचार",
      reasoning: "एडवांस्ड रीज़निंग",
      roleplay: "रोलप्ले",
      roleplayDark: "डार्क रोलप्ले",
      smart: "स्मार्ट",
      uncensored: "अनसेंसर्ड",
      violence: "हिंसा",
      vision: "विज़न",
    },
    input: {
      attachments: {
        uploadFile: "फ़ाइलें जोड़ें",
        attachedFiles: "जुड़ी हुई फ़ाइलें",
        addMore: "और जोड़ें",
      },
    },
  },

  search: {
    brave: {
      category: "जानकारी",
      get: {
        title: "वेब पर खोजें",
        dynamicTitle: "सर्च: {{query}}",
        description:
          "ताज़ा जानकारी, ख़बरों, तथ्यों या हाल की घटनाओं के लिए इंटरनेट पर खोजें। अप-टू-डेट जानकारी चाहिए या तथ्य जाँचने हों तब इस्तेमाल करें।",
        form: {
          title: "सर्च पैरामीटर",
          description: "अपनी वेब सर्च क्वेरी सेट करें",
        },
        submitButton: {
          label: "खोजें",
          loadingText: "खोज रहा है...",
        },
        backButton: {
          label: "वापस",
        },
        fields: {
          query: {
            title: "सर्च क्वेरी",
            description: "साफ़ और ख़ास सर्च क्वेरी। सवाल की जगह कीवर्ड इस्तेमाल करें।",
            placeholder: "अपनी सर्च क्वेरी लिखें...",
          },
          maxResults: {
            title: "अधिकतम नतीजे",
            description: "लौटाए जाने वाले नतीजों की संख्या (1-10)",
          },
          includeNews: {
            title: "ख़बरें जोड़ें",
            description: "ताज़ा घटनाओं के लिए ख़बरों के नतीजे जोड़ें",
          },
          freshness: {
            title: "ताज़गी",
            description: "नतीजों को कितने ताज़ा हैं, इसके हिसाब से फ़िल्टर करें",
            options: {
              day: "पिछला दिन",
              week: "पिछला हफ़्ता",
              month: "पिछला महीना",
              year: "पिछला साल",
            },
          },
        },
        response: {
          success: {
            title: "सफल",
            description: "सर्च सफल रही या नहीं",
          },
          message: {
            title: "मैसेज",
            description: "सर्च के बारे में स्टेटस मैसेज",
          },
          query: {
            title: "क्वेरी",
            description: "जो सर्च क्वेरी चलाई गई",
          },
          results: {
            title: "नतीजे",
            description: "सर्च नतीजों की ऐरे",
            result: "नतीजा",
            item: {
              title: "सर्च नतीजा",
              description: "एक सर्च नतीजा",
              url: "URL",
              snippet: "स्निपेट",
              age: "उम्र",
              source: "स्रोत",
            },
          },
          cached: {
            title: "कैश्ड",
            description: "नतीजे कैश से दिए गए या नहीं",
          },
          timestamp: {
            title: "टाइमस्टैंप",
            description: "सर्च कब की गई",
          },
        },
        errors: {
          queryEmpty: {
            title: "सर्च क्वेरी ज़रूरी है",
            description: "कृपया सर्च क्वेरी दें",
          },
          queryTooLong: {
            title: "सर्च क्वेरी बहुत लंबी है",
            description: "क्वेरी 400 अक्षर या उससे छोटी होनी चाहिए",
          },
          timeout: {
            title: "सर्च रिक्वेस्ट का समय ख़त्म",
            description: "सर्च पूरी होने में बहुत समय लगा",
          },
          searchFailed: {
            title: "सर्च फ़ेल हुई",
            description: "सर्च के दौरान एरर आया",
          },
          validation: {
            title: "अमान्य सर्च",
            description: "अपने सर्च पैरामीटर जाँचें और दोबारा कोशिश करें",
          },
          internal: {
            title: "कुछ गड़बड़ हो गई",
            description: "आपकी सर्च पूरी नहीं हो सकी। कृपया दोबारा कोशिश करें",
          },
          notConfigured: {
            title:
              "{{label}} API key कॉन्फ़िगर नहीं है। अपनी .env फ़ाइल में {{envKey}}=<your-key> जोड़ें। अपनी key यहाँ से लें: {{url}}",
            description: "वेब सर्च चालू करने के लिए {{label}} सेट करें",
          },
        },
        success: {
          title: "सर्च सफल रही",
          description: "वेब सर्च सफलतापूर्वक पूरी हुई",
        },
      },
      tags: {
        search: "सर्च",
        web: "वेब",
        internet: "इंटरनेट",
      },
    },
    kagi: {
      category: "जानकारी",
      get: {
        title: "Kagi से खोजें",
        dynamicTitle: "Kagi: {{query}}",
        description:
          "Kagi से इंटरनेट पर खोजें या AI जवाब पाएँ। FastGPT मोड स्रोतों के साथ पूरे जवाब देता है, जबकि सर्च मोड सीधे नतीजे लौटाता है।",
        form: {
          title: "सर्च पैरामीटर",
          description: "अपनी Kagi सर्च क्वेरी सेट करें",
        },
        submitButton: {
          label: "खोजें",
          loadingText: "खोज रहा है...",
        },
        backButton: {
          label: "वापस",
        },
        fields: {
          query: {
            title: "सर्च क्वेरी",
            description: "साफ़ और ख़ास सर्च क्वेरी या सवाल।",
            placeholder: "अपनी सर्च क्वेरी लिखें...",
          },
          mode: {
            title: "सर्च मोड",
            description: "AI जवाब (FastGPT) या सीधे सर्च नतीजों में से चुनें",
            options: {
              fastgpt: "FastGPT (AI जवाब)",
              search: "सर्च (सीधे नतीजे)",
            },
          },
        },
        response: {
          success: {
            title: "सफल",
            description: "सर्च सफल रही या नहीं",
          },
          message: {
            title: "मैसेज",
            description: "सर्च के बारे में स्टेटस मैसेज",
          },
          output: {
            title: "जवाब",
            description: "FastGPT का AI जवाब",
          },
          query: {
            title: "क्वेरी",
            description: "जो सर्च क्वेरी चलाई गई",
          },
          references: {
            title: "संदर्भ",
            description: "स्रोत संदर्भ और हवाले",
            reference: "संदर्भ",
            item: {
              title: "संदर्भ",
              description: "हवाले के साथ स्रोत संदर्भ",
              url: "URL",
              snippet: "स्निपेट",
            },
          },
          cached: {
            title: "कैश्ड",
            description: "नतीजे कैश से दिए गए या नहीं",
          },
          timestamp: {
            title: "टाइमस्टैंप",
            description: "सर्च कब की गई",
          },
        },
        errors: {
          queryEmpty: {
            title: "सर्च क्वेरी ज़रूरी है",
            description: "कृपया सर्च क्वेरी दें",
          },
          queryTooLong: {
            title: "सर्च क्वेरी बहुत लंबी है",
            description: "क्वेरी 400 अक्षर या उससे छोटी होनी चाहिए",
          },
          timeout: {
            title: "सर्च रिक्वेस्ट का समय ख़त्म",
            description: "सर्च पूरी होने में बहुत समय लगा",
          },
          searchFailed: {
            title: "सर्च फ़ेल हुई",
            description: "सर्च के दौरान एरर आया",
          },
          validation: {
            title: "अमान्य सर्च",
            description: "अपने सर्च पैरामीटर जाँचें और दोबारा कोशिश करें",
          },
          internal: {
            title: "कुछ गड़बड़ हो गई",
            description: "आपकी सर्च पूरी नहीं हो सकी। कृपया दोबारा कोशिश करें",
          },
          notConfigured: {
            title:
              "{{label}} API key कॉन्फ़िगर नहीं है। अपनी .env फ़ाइल में {{envKey}}=<your-key> जोड़ें। अपनी key यहाँ से लें: {{url}}",
            description: "Kagi सर्च चालू करने के लिए {{label}} सेट करें",
          },
        },
        success: {
          title: "सर्च सफल रही",
          description: "Kagi सर्च सफलतापूर्वक पूरी हुई",
        },
      },
      tags: {
        search: "सर्च",
        web: "वेब",
        ai: "AI",
      },
    },
    enums: {
      provider: {
        BRAVE: "Brave Search",
        KAGI: "Kagi FastGPT",
      },
    },
  },
  speechToText: {
    category: "एजेंट",

    hotkey: {
      post: {
        title: "स्पीच-टू-टेक्स्ट हॉटकी",
        titleShort: "STT हॉटकी",
        description: "ऑडियो रिकॉर्ड और ट्रांसक्राइब करें, टेक्स्ट अपने-आप डल जाए",
        form: {
          title: "हॉटकी कॉन्फ़िगरेशन",
          description: "स्पीच-टू-टेक्स्ट हॉटकी की सेटिंग्स तय करें",
        },
        action: {
          label: "एक्शन",
          description: "किया जाने वाला एक्शन (start/stop/toggle)",
          options: {
            start: "शुरू",
            stop: "रोकें",
            toggle: "टॉगल",
            status: "स्टेटस",
          },
        },
        provider: {
          label: "प्रोवाइडर",
          description: "ट्रांसक्रिप्शन के लिए AI प्रोवाइडर",
        },
        language: {
          label: "भाषा",
          description: "ऑडियो की भाषा",
        },
        insertPrefix: {
          label: "आगे जोड़ें",
          description: "ट्रांसक्रिप्शन से पहले डाला जाने वाला टेक्स्ट",
          placeholder: "जैसे '> '",
        },
        insertSuffix: {
          label: "पीछे जोड़ें",
          description: "ट्रांसक्रिप्शन के बाद डाला जाने वाला टेक्स्ट",
          placeholder: "जैसे ' '",
        },
        response: {
          title: "नतीजा",
          description: "रिकॉर्डिंग और ट्रांसक्रिप्शन का नतीजा",
          success: "सफल",
          status: "स्टेटस",
          message: "मैसेज",
          text: "ट्रांसक्राइब किया टेक्स्ट",
          recordingDuration: "रिकॉर्डिंग की अवधि (ms)",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "यह फ़ीचर इस्तेमाल करने के लिए लॉग इन करें",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "रिकॉर्डिंग प्रोसेस नहीं हो सकी",
          },
          conflict: {
            title: "टकराव",
            description: "रिकॉर्डिंग पहले से चल रही है",
          },
          forbidden: {
            title: "मनाही",
            description: "आपको यह फ़ीचर इस्तेमाल करने की अनुमति नहीं है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "ट्रांसक्रिप्शन सर्विस से कनेक्ट नहीं हो सका",
          },
          notFound: {
            title: "नहीं मिला",
            description: "सेशन नहीं मिला",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "रिकॉर्डिंग चल रही है",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          dependenciesMissing:
            "ज़रूरी डिपेंडेंसी उपलब्ध नहीं हैं: {missing}। {recommendations}",
          invalidAction: "अमान्य एक्शन: {action}",
          actionFailed: "एक्शन पूरा नहीं हो सका: {error}",
          alreadyRecording: "रिकॉर्डिंग पहले से चल रही है",
          notRecording: "कोई रिकॉर्डिंग नहीं चल रही",
        },
        success: {
          title: "सफल",
          description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
        },
      },
      tags: {
        ai: "AI",
        transcription: "ट्रांसक्रिप्शन",
        speech: "आवाज़",
        hotkey: "हॉटकी",
        cli: "CLI",
      },
      platforms: {
        macos: "macOS",
        linuxWayland: "Linux (Wayland)",
        linuxX11: "Linux (X11)",
        windows: "Windows",
      },
      status: {
        idle: "खाली",
        recording: "रिकॉर्ड हो रहा है",
        processing: "प्रोसेस हो रहा है",
        completed: "पूरा हुआ",
        error: "एरर",
      },
      actions: {
        start: "रिकॉर्डिंग शुरू करें",
        stop: "रिकॉर्डिंग रोकें",
        toggle: "रिकॉर्डिंग टॉगल करें",
        status: "स्टेटस जाँचें",
      },
      recorderBackends: {
        ffmpegAvfoundation: "FFmpeg (AVFoundation)",
        ffmpegPulse: "FFmpeg (PulseAudio)",
        ffmpegAlsa: "FFmpeg (ALSA)",
        ffmpegDshow: "FFmpeg (DirectShow)",
        wfRecorder: "wf-recorder",
        arecord: "arecord",
      },
      typerBackends: {
        applescript: "AppleScript",
        wtype: "wtype",
        xdotool: "xdotool",
        wlClipboard: "wl-clipboard",
        xclip: "xclip",
        powershell: "PowerShell",
      },
    },
    post: {
      title: "स्पीच टू टेक्स्ट",
      description:
        "AI ट्रांसक्रिप्शन से ऑडियो को टेक्स्ट में बदलें। चुने हुए मॉडल की दर पर ऑडियो के हर सेकंड के हिसाब से बिल होता है",
      form: {
        title: "ऑडियो ट्रांसक्रिप्शन",
        description:
          "ट्रांसक्राइब करने के लिए ऑडियो फ़ाइल अपलोड करें। चुने हुए मॉडल की दर पर हर सेकंड के हिसाब से बिल होता है",
      },
      fileUpload: {
        title: "ऑडियो फ़ाइल अपलोड",
        description: "ट्रांसक्रिप्शन के लिए अपनी ऑडियो फ़ाइल अपलोड करें",
      },
      audio: {
        label: "ऑडियो फ़ाइल",
        description: "ट्रांसक्राइब होने वाली ऑडियो फ़ाइल (MP3, WAV, WebM आदि)",
        validation: {
          maxSize: "फ़ाइल का साइज़ 25MB से कम होना चाहिए",
          audioOnly: "कृपया ऑडियो या वीडियो फ़ाइल अपलोड करें",
        },
      },
      provider: {
        label: "प्रोवाइडर",
        description: "ट्रांसक्रिप्शन के लिए AI प्रोवाइडर",
      },
      language: {
        label: "भाषा",
        description: "ऑडियो की भाषा",
      },
      response: {
        title: "ट्रांसक्रिप्शन नतीजा",
        description: "आपके ऑडियो से ट्रांसक्राइब किया गया टेक्स्ट",
        success: "सफल",
        text: "ट्रांसक्राइब किया टेक्स्ट",
        provider: "इस्तेमाल हुआ प्रोवाइडर",
        confidence: "कॉन्फ़िडेंस स्कोर",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "यह फ़ीचर इस्तेमाल करने के लिए लॉग इन करें",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "ऑडियो फ़ाइल या पैरामीटर ग़लत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "ट्रांसक्रिप्शन प्रोसेस नहीं हो सका",
        },
        apiKeyMissing: "Eden AI API key कॉन्फ़िगर नहीं है",
        transcriptionFailed: "ट्रांसक्रिप्शन फ़ेल हुआ: {{error}}",
        audioTooShort: "रिकॉर्डिंग बहुत छोटी है। बटन को देर तक दबाकर रखें और साफ़ बोलें।",
        noAudioFile: "कोई ऑडियो फ़ाइल नहीं दी गई",
        internalError: "सर्वर में एरर",
        noPublicId: "पब्लिक ID नहीं मिली",
        pollFailed: "ट्रांसक्रिप्शन के नतीजे पोल नहीं हो सके",
        failed: "ट्रांसक्रिप्शन फ़ेल हुआ",
        timeout: "ट्रांसक्रिप्शन का समय ख़त्म",
        creditsFailed: "क्रेडिट काटे नहीं जा सके: {{error}}",
        providerError:
          "ट्रांसक्रिप्शन सर्विस में एरर आया। कृपया दोबारा कोशिश करें, और दिक्कत बनी रहे तो सपोर्ट से संपर्क करें।",
        balanceCheckFailed:
          "आपका क्रेडिट बैलेंस जाँचा नहीं जा सका। कृपया दोबारा कोशिश करें",
        insufficientCredits:
          "इस ट्रांसक्रिप्शन के लिए आपके पास काफ़ी क्रेडिट नहीं हैं। आगे बढ़ने के लिए और क्रेडिट जोड़ें",
      },
      success: {
        title: "सफल",
        description: "ऑडियो सफलतापूर्वक ट्रांसक्राइब हुआ",
        transcriptionComplete: "ट्रांसक्रिप्शन सफलतापूर्वक पूरा हुआ",
      },
    },
    providers: {
      openai: "OpenAI Whisper",
      assemblyai: "AssemblyAI",
      deepgram: "Deepgram",
      google: "Google Speech-to-Text",
      amazon: "Amazon Transcribe",
      microsoft: "Microsoft Azure",
      ibm: "IBM Watson",
      rev: "Rev.ai",
    },
    languages: {
      en: "अंग्रेज़ी",
      de: "जर्मन",
      pl: "पोलिश",
      es: "स्पेनिश",
      sk: "स्लोवाक",
      hi: "हिंदी",
      fr: "फ़्रेंच",
      it: "इटैलियन",
    },
    models: {
      descriptions: {
        openaiWhisper:
          "OpenAI का Whisper स्पीच रिकग्निशन, 99 भाषाओं पर ट्रेन किया हुआ। इंटरव्यू, वॉइस नोट और मीटिंग ट्रांसक्राइब करता है और लहजे व बैकग्राउंड शोर को अच्छे से सँभालता है। हर इस्तेमाल सस्ता। स्पीकर लेबल नहीं, और लंबी ख़ामोशी में टेक्स्ट गढ़ सकता है। OpenAI का नया विकल्प चाहिए तो GPT-4o Mini Transcribe आज़माएँ।",
        deepgramNova2:
          "Deepgram Nova-2: शोर में भी टिकने वाला तेज़ और सटीक स्पीच-टू-टेक्स्ट",
        whisperLargeV3:
          "Whisper Large V3: OpenAI का ओपन-वेट मॉडल, 99 भाषाएँ, होस्टेड whisper-1 से कहीं सस्ता।",
        voxtralSmall:
          "Mistral के Voxtral Small से रिकॉर्ड की हुई बोली ट्रांसक्राइब करें।",
        voxtralMini:
          "Voxtral Mini Transcribe: डायराइज़ेशन और सेगमेंट टाइमस्टैंप के साथ Mistral का ट्रांसक्रिप्शन, 10 मिनट तक।",
        qwen3Asr: "Qwen3 ASR से 30 भाषाओं और 22 चीनी बोलियों में बोली ट्रांसक्राइब करें।",
        parakeetV3:
          "ऑटोमैटिक भाषा पहचान और विराम चिह्नों के साथ 25 यूरोपीय भाषाएँ ट्रांसक्राइब करें।",
        nemotron35Transcribe:
          "NVIDIA Nemotron से 40 भाषाओं में एक घंटे तक का ऑडियो ट्रांसक्राइब करें।",
        nemotronAsr:
          "Nemotron ASR: NVIDIA का ओपन मल्टीलिंगुअल स्पीच रिकग्निशन, 40 लोकेल, कम लेटेंसी।",
        gpt4oMiniTranscribe:
          "GPT-4o Mini Transcribe: Whisper से कम शब्द-त्रुटि दर, बेहतर भाषा पहचान।",
      },
    },
  },
  textToSpeech: {
    category: "एजेंट",
    tags: {
      speech: "आवाज़",
      tts: "टेक्स्ट-टू-स्पीच",
      ai: "AI",
    },

    post: {
      title: "टेक्स्ट टू स्पीच",
      description:
        "AI से टेक्स्ट को प्राकृतिक आवाज़ में बदलें। चुनी हुई आवाज़ की दर पर हर अक्षर के हिसाब से बिल होता है",
      form: {
        title: "टेक्स्ट से आवाज़ में बदलाव",
        description:
          "आवाज़ में बदलने के लिए टेक्स्ट लिखें। चुनी हुई आवाज़ की दर पर हर अक्षर के हिसाब से बिल होता है",
      },
      text: {
        label: "टेक्स्ट",
        description: "आवाज़ में बदलने वाला टेक्स्ट",
        placeholder: "जो टेक्स्ट आवाज़ में बदलना है वह लिखें...",
      },
      voice: {
        label: "आवाज़",
        description: "स्पीच सिंथेसिस के लिए वॉइस मॉडल",
      },
      response: {
        title: "ऑडियो नतीजा",
        description: "बनी हुई स्पीच ऑडियो",
        success: "सफल",
        audioUrl: "ऑडियो URL",
      },
      errors: {
        validation_failed: {
          title: "वैलिडेशन एरर",
          description: "दिया गया टेक्स्ट या पैरामीटर ग़लत हैं",
        },
        network_error: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "टेक्स्ट-टू-स्पीच इस्तेमाल करने के लिए लॉग इन करें",
        },
        forbidden: {
          title: "मनाही",
          description: "आपको टेक्स्ट-टू-स्पीच इस्तेमाल करने की अनुमति नहीं है",
        },
        not_found: {
          title: "नहीं मिला",
          description: "माँगा गया रिसोर्स नहीं मिला",
        },
        server_error: {
          title: "सर्वर एरर",
          description: "टेक्स्ट को आवाज़ में बदलते समय एरर आया",
        },
        unknown_error: {
          title: "अनजान एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsaved_changes: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हैं",
        },
        conflict: {
          title: "टकराव",
          description: "टकराव हुआ",
        },
        notConfigured:
          "{{label}} API key कॉन्फ़िगर नहीं है। अपनी .env फ़ाइल में {{envKey}}=<your-key> जोड़ें। अपनी key यहाँ से लें: {{url}}",
        conversionFailed: "स्पीच सिंथेसिस फ़ेल हुआ: {{error}}",
        noText: "कोई टेक्स्ट नहीं दिया गया",
        noAudioUrl: "प्रोवाइडर से कोई ऑडियो URL नहीं मिला",
        audioFetchFailed: "ऑडियो फ़ाइल नहीं बन सकी। कृपया दोबारा कोशिश करें",
        providerError: "प्रोवाइडर एरर: {{error}}",
        internalError: "सर्वर में एरर",
        unsupportedProvider:
          "इस आवाज़ के लिए TTS प्रोवाइडर सपोर्टेड नहीं है: {{voiceId}}",
        creditsFailed: "क्रेडिट काटे नहीं जा सके: {{error}}",
        balanceCheckFailed:
          "आपका क्रेडिट बैलेंस जाँचा नहीं जा सका। कृपया दोबारा कोशिश करें",
        insufficientCredits:
          "इस कन्वर्ज़न के लिए आपके पास काफ़ी क्रेडिट नहीं हैं। आगे बढ़ने के लिए और क्रेडिट जोड़ें",
      },
      success: {
        title: "सफल",
        description: "टेक्स्ट सफलतापूर्वक आवाज़ में बदला",
        conversionComplete: "स्पीच सिंथेसिस सफलतापूर्वक पूरा हुआ",
      },
    },
    languages: {
      en: "अंग्रेज़ी",
      de: "जर्मन",
      pl: "पोलिश",
      es: "स्पेनिश",
      sk: "स्लोवाक",
      hi: "हिंदी",
      fr: "फ़्रेंच",
      it: "इटैलियन",
    },
    models: {
      descriptions: {
        openaiAlloy:
          "OpenAI की Alloy आवाज़। संतुलित और तटस्थ, साफ़ तौर पर न पुरुष न महिला, स्थिर रफ़्तार के साथ। नैरेशन, एक्सप्लेनर और प्रोफ़ेशनल कंटेंट के लिए, जहाँ आवाज़ को रास्ते से हटकर रहना चाहिए। एक पैसे के छोटे हिस्से की लागत। Nova से कम गर्मजोशी, Onyx से कम वज़न।",
        openaiNova:
          "OpenAI की Nova आवाज़। चमकदार, गर्मजोशी भरी और दोस्ताना, महिला स्वर के साथ। असिस्टेंट, बातचीत वाले ऐप और खुशमिज़ाज रीड के लिए। बहुत सस्ती। गंभीर या औपचारिक सामग्री के लिए कम सही। वह Onyx बेहतर निभाता है।",
        openaiOnyx:
          "OpenAI की Onyx आवाज़। गहरी, शांत पुरुष आवाज़ जिसमें रौब है। डॉक्यूमेंट्री, औपचारिक नैरेशन और घोषणाओं के लिए। बहुत सस्ती। आम बातचीत के लिए भारी लग सकती है। Nova हल्का, दोस्ताना चुनाव है।",
        openaiEcho: "OpenAI Echo: प्राकृतिक लय वाली साफ़, स्पष्ट आवाज़",
        openaiShimmer: "OpenAI Shimmer: दिलचस्प कंटेंट के लिए भावपूर्ण, गतिशील आवाज़",
        openaiFable: "OpenAI Fable: भावपूर्ण, कहानी सुनाने वाली आवाज़",
        elevenlabsRachel:
          "ElevenLabs Rachel: भावनाओं की रेंज वाली प्राकृतिक महिला आवाज़",
        elevenlabsJosh: "ElevenLabs Josh: बातचीत वाले लहजे की प्राकृतिक पुरुष आवाज़",
        elevenlabsBella:
          "ElevenLabs Bella: नरम अंदाज़ वाली गर्मजोशी भरी महिला आवाज़",
        elevenlabsAdam: "ElevenLabs Adam: कंटेंट बनाने के लिए प्रोफ़ेशनल पुरुष आवाज़",
        elevenlabsRachelTurbo:
          "ElevenLabs Rachel Turbo: v4 Turbo पर वही आवाज़। आधी कीमत, लगभग तुरंत जवाब।",
        elevenlabsJoshTurbo:
          "ElevenLabs Josh Turbo: v4 Turbo पर वही आवाज़। आधी कीमत, लगभग तुरंत जवाब।",
        elevenlabsBellaTurbo:
          "ElevenLabs Bella Turbo: v4 Turbo पर वही आवाज़। आधी कीमत, लगभग तुरंत जवाब।",
        elevenlabsAdamTurbo:
          "ElevenLabs Adam Turbo: v4 Turbo पर वही आवाज़। आधी कीमत, लगभग तुरंत जवाब।",
        kokoroBella:
          "Kokoro Bella: ओपन-वेट 82M मॉडल, गर्मजोशी भरी अमेरिकी महिला आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
        qwen3Ryan:
          "Ryan ओपन Qwen3 वॉइस मॉडल से जर्मन समेत 10 भाषाओं में पढ़कर सुनाता है।",
        orpheusTara: "Tara भावपूर्ण रफ़्तार और आवाज़ के संकेतों के साथ अंग्रेज़ी पढ़ती है।",
        kokoroSarah:
          "Kokoro Sarah: ओपन-वेट 82M मॉडल, साफ़ अमेरिकी महिला आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
        kokoroNicole:
          "Kokoro Nicole: ओपन-वेट 82M मॉडल, नरम, धीमे अंदाज़ की महिला आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
        kokoroAdam:
          "Kokoro Adam: ओपन-वेट 82M मॉडल, स्थिर अमेरिकी पुरुष आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
        kokoroMichael:
          "Kokoro Michael: ओपन-वेट 82M मॉडल, आत्मविश्वास भरी अमेरिकी पुरुष आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
        kokoroEmma:
          "Kokoro Emma: ओपन-वेट 82M मॉडल, ब्रिटिश महिला आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
        kokoroGeorge:
          "Kokoro George: ओपन-वेट 82M मॉडल, ब्रिटिश पुरुष आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
        voxtralPaul:
          "Voxtral Mini के साथ Paul की तटस्थ आवाज़ में अंग्रेज़ी टेक्स्ट पढ़कर सुनाएँ।",
        inworldAshley:
          "Inworld Ashley: जीवंत अंदाज़ वाली तेज़, कम लागत की महिला आवाज़।",
        inworldCraig: "Inworld Craig: तेज़, कम लागत की ब्रिटिश पुरुष आवाज़।",
        xaiEve: "xAI Eve: इनलाइन इमोशन कंट्रोल के साथ भावपूर्ण महिला आवाज़।",
        geminiZephyr:
          "Gemini Zephyr: चमकदार महिला आवाज़, 100+ भाषाएँ, डिलीवरी निर्देश।",
        geminiPuck: "Gemini Puck: खुशमिज़ाज पुरुष आवाज़, 100+ भाषाएँ, डिलीवरी निर्देश।",
      },
    },
  },
};
