import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  executeTool: {
    post: {
      title: "टूल चलाएँ",
      titleShort: "टूल चलाएँ",
      dynamicTitle: "चलाएँ: {{toolName}}",
      description:
        "नाम से कोई भी रजिस्टर्ड एंडपॉइंट चलाएँ। टूल का नाम और उसके इनपुट पैरामीटर दें। टारगेट रूट अपना ऑथेंटिकेशन ख़ुद लागू करता है। यह एंडपॉइंट MCP, AI एजेंट और ऑटोमेशन के लिए यूनिवर्सल डिस्पैचर है।",
      container: {
        title: "टूल एक्ज़ीक्यूशन",
        description: "रूट का नाम और इनपुट पैरामीटर",
      },
      fields: {
        toolName: {
          label: "टूल का नाम",
          description:
            "चलाने के लिए रजिस्टर्ड टूल का नाम या अलायस (जैसे 'vibe_agent_skills_GET')। उपलब्ध टूल खोजने के लिए tool-help इस्तेमाल करें।",
          placeholder: "vibe_agent_skills_GET",
        },
        input: {
          label: "इनपुट",
          description:
            "टूल के इनपुट पैरामीटर, JSON ऑब्जेक्ट के रूप में। URL पाथ पैरामीटर (जैसे id) इसी ऑब्जेक्ट से अपने आप निकाले जाते हैं।",
        },
        instanceId: {
          label: "इंस्टेंस ID",
          description:
            'वैकल्पिक रिमोट इंस्टेंस ID। सेट होने पर लोकल की जगह रिमोट इंस्टेंस पर एसिंक टास्क बनता है। रिज़ल्ट {taskId, status:"pending"} होगा।',
        },
        callbackMode: {
          label: "कॉलबैक मोड",
          description:
            '"wait": सिंक्रोनस चलाएँ, रिज़ल्ट तुरंत लौटाएँ (डिफ़ॉल्ट)। "detach": चलाओ और भूल जाओ, {taskId} तुरंत लौटता है। ज़रूरत हो तो बाद में await-task इस्तेमाल करें। "wakeUp": चलाओ और भूल जाओ, रिज़ल्ट तैयार होते ही थ्रेड में अपने आप आ जाता है। await-task कॉल न करें। "endLoop": सामान्य रूप से चलाकर रिज़ल्ट लौटाएँ, पर इस बैच के बाद टूल लूप रोक दें। इस टर्न में आगे कोई टूल कॉल नहीं होगी (उसी बैच की पैरेलल कॉल फिर भी चलती हैं)। "approve": चलाने से पहले यूज़र की मंज़ूरी माँगें।',
        },
      },
      response: {
        result:
          "टारगेट रूट से लौटा रिज़ल्ट डेटा। फ़ेल होने पर यह फ़ील्ड नहीं होता, रिस्पॉन्स ख़ुद एरर होगा।",
        resultLabel: "नतीजा",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "toolName या इनपुट पैरामीटर गलत हैं",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "इस एंडपॉइंट को कॉल करने के लिए ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस नहीं मिला",
        },
        toolDeniedHere: {
          title:
            "{{toolName}} इस थ्रेड में उपलब्ध नहीं है। अपनी टूल सूची के टूल सीधे कॉल करें।",
        },
        emptyInput: {
          title:
            '{{error}} आपकी कॉल में कोई इनपुट नहीं गया। {{toolName}} के आर्ग्युमेंट input के अंदर रखें: {"toolName": "{{toolName}}", "input": { ... }}।',
        },
        notFound: {
          title: "टूल नहीं मिला",
          description: "दिए गए toolName से कोई रजिस्टर्ड टूल मैच नहीं करता",
          // `title` is the definition's declared NOT_FOUND label and renders
          // param-free there, so the tool name gets its own key.
          detail:
            'टूल "{{toolName}}" नहीं मिला। यह कॉल दोबारा न करें, tool-help से उपलब्ध टूल देखें।',
        },
        remoteFailed: {
          title: "रिमोट टूल फ़ेल हुआ: {{message}}",
          description: "रिमोट इंस्टेंस ने कॉल ठुकरा दी या वह फ़ेल हुई",
          detail: 'रिमोट टूल "{{toolName}}" फ़ेल हुआ: {{message}}',
        },
        resultChannelLost: {
          detail:
            '{{instanceId}} से "{{toolName}}" का रिज़ल्ट लेने के लिए {{hubUrl}} पर कोई लोकल सर्वर नहीं है ({{detail}})। पहले उसे शुरू करें (`vibe dev`, Hermes के लिए `vibe --hermes dev`), फिर दोबारा कोशिश करें।',
        },
        server: {
          title: "एक्ज़ीक्यूशन एरर",
          description: "टारगेट रूट पर सर्वर एरर हुआ",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "टूल चलाते समय नेटवर्क एरर हुआ",
        },
        unknown: {
          // `title` is a declared errorTypes label and renders param-free, so
          // the cause lives in `detail` instead.
          title: "अज्ञात एरर",
          description: "एक्ज़ीक्यूशन के दौरान अप्रत्याशित एरर हुआ",
          detail: "एक्ज़ीक्यूशन के दौरान अज्ञात एरर: {{error}}",
        },
      },
      success: {
        title: "टूल चल गया",
        description: "टूल सफलतापूर्वक चल गया",
      },
      widget: {
        enterToolName: "फ़ॉर्म लोड करने के लिए टूल का नाम डालें।",
        resolving: "एंडपॉइंट खोजा जा रहा है…",
        unknownTool: "अज्ञात टूल: {{toolName}}",
      },
      actions: {
        confirm: "कन्फ़र्म करें",
        cancel: "रद्द करें",
      },
    },
  },
  dismissTask: {
    post: {
      title: "टास्क ख़ारिज करें",
      titleShort: "बंद करें",
      description:
        "पेंडिंग wakeUp रिवाइवल रद्द करें। टूल बैकग्राउंड में चलता रहता है, पर थ्रेड तुरंत खुल जाता है। टूल पूरा होने पर रिज़ल्ट चुपचाप हटा दिया जाता है।",
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "callId ज़रूरी है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस नहीं मिला",
        },
        notFound: {
          title: "नहीं मिला",
          description: "इस callId की कोई पेंडिंग कॉल नहीं मिली",
        },
        server: {
          title: "सर्वर एरर",
          description: "पेंडिंग कॉल ख़ारिज नहीं हो सकी",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "टास्क ख़ारिज करते समय नेटवर्क एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
      },
      success: {
        title: "टास्क ख़ारिज हुआ",
        description: "थ्रेड खुल गया। टूल बैकग्राउंड में चल रहा है।",
      },
    },
  },
  cancelTool: {
    post: {
      title: "टूल कॉल रद्द करें",
      titleShort: "टूल रद्द करें",
      description:
        "चल रही किसी एक टूल कॉल को उसकी callId से रोकें। कॉल रुक जाती है और रिज़ल्ट के रूप में एरर लौटाती है। टर्न और उसकी पैरेलल टूल कॉल चलती रहती हैं।",
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "callId ज़रूरी है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
        notFound: {
          title: "नहीं मिला",
          description: "इस callId की कोई चल रही कॉल नहीं है",
        },
        server: {
          title: "सर्वर एरर",
          description: "टूल कॉल रद्द नहीं हो सकी",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "रद्द करते समय नेटवर्क एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
      },
      success: {
        title: "टूल कॉल रद्द हो गई",
        description: "चल रही टूल कॉल रोक दी गई।",
      },
    },
  },
  detachCall: {
    post: {
      title: "टूल कॉल डिटैच करें",
      titleShort: "कॉल डिटैच करें",
      description:
        "चल रही टूल कॉल को उसकी callId से डिटैच्ड बना दें: वह बैकग्राउंड में चलती रहती है, उसका रिज़ल्ट हटा दिया जाता है और टर्न अभी खुल जाता है। रिज़ल्ट चाहिए तो resume-when-done इस्तेमाल करें।",
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "callId ज़रूरी है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
        notFound: {
          title: "नहीं मिला",
          description: "इस callId की कोई चल रही कॉल नहीं है",
        },
        server: {
          title: "सर्वर एरर",
          description: "टूल कॉल डिटैच नहीं हो सकी",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "डिटैच करते समय नेटवर्क एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
      },
      success: {
        title: "टूल कॉल डिटैच हो गई",
        description: "कॉल बैकग्राउंड में चल रही है, उसका रिज़ल्ट हटा दिया जाएगा।",
      },
    },
  },
  resumeWhenDone: {
    post: {
      title: "टूल कॉल को बैकग्राउंड में भेजें",
      titleShort: "बैकग्राउंड टूल",
      description:
        "चल रही टूल कॉल को उसकी callId से बैकग्राउंड में पूरा होने दें। टर्न ख़त्म हो जाता है और काम पूरा होने पर थ्रेड रिज़ल्ट के साथ दोबारा चालू होता है।",
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "callId ज़रूरी है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
        notFound: {
          title: "नहीं मिला",
          description: "इस callId की कोई चल रही कॉल नहीं है",
        },
        server: {
          title: "सर्वर एरर",
          description: "टूल कॉल बैकग्राउंड में नहीं जा सकी",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "बैकग्राउंड में भेजते समय नेटवर्क एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
      },
      success: {
        title: "टूल कॉल बैकग्राउंड में भेजी गई",
        description: "टूल कॉल बैकग्राउंड में चल रही है।",
      },
    },
  },
  tools: {
    // Translations moved to system/help/get - see system/help/i18n/en/index.ts
    get: {
      title: "टूल हेल्प - उपलब्ध टूल खोजें",
      description:
        "आपके लिए उपलब्ध सभी AI टूल खोजें। नाम, विवरण या अलायस से खोजने के लिए query और टूल कैटेगरी से फ़िल्टर करने के लिए category इस्तेमाल करें। टूल के नाम, विवरण, अलायस और मेटाडेटा लौटाता है।",
      category: "AI टूल",
      tags: {
        tools: "टूल",
      },
    },
  },
  executor: {
    errors: {
      toolNotFound: "टूल नहीं मिला: {{toolName}}",
      parameterValidationFailed: "पैरामीटर वैलिडेशन फ़ेल हुआ: {{errors}}",
      executionFailed: "टूल एक्ज़ीक्यूशन फ़ेल हुआ",
    },
  },
  factory: {
    errors: {
      executionFailed: "टूल एक्ज़ीक्यूशन फ़ेल हुआ",
    },
    descriptions: {
      noParametersRequired: "इस एंडपॉइंट के लिए कोई पैरामीटर नहीं चाहिए",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nउदाहरण: ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "एंडपॉइंट: ",
      hiddenPlaceholder: "[छिपा]",
    },
  },
  discovery: {
    constants: {
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed: "टूल रजिस्ट्री शुरू नहीं हो सकी",
    },
  },
};
