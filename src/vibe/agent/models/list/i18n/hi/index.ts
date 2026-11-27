import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    models: "मॉडल",
  },
  endpointCategories: {
    ai: "AI",
  },
  enums: {
    modelType: {
      text: "टेक्स्ट",
      image: "इमेज",
      video: "वीडियो",
      audio: "ऑडियो",
    },
    content: {
      mainstream: "मेनस्ट्रीम",
      open: "ओपन",
      uncensored: "अनसेंसर्ड",
    },
    intelligence: {
      quick: "तेज़",
      smart: "स्मार्ट",
      brilliant: "बेहतरीन",
    },
  },
  get: {
    title: "मॉडल",
    titleShort: "AI मॉडल",
    description:
      "सारे AI मॉडल ब्राउज़ करें। टाइप (टेक्स्ट/इमेज/वीडियो/ऑडियो), कंटेंट लेवल और इंटेलिजेंस से फ़िल्टर करें। वीडियो मॉडल के लिए: supportedDurations में क्लिप की मान्य लंबाई (सेकंड में) होती है, supportedAspectRatios में मान्य रेशियो, supportedFrameImages में मंज़ूर फ़्रेम इनपुट (first_frame = इमेज-टू-वीडियो, last_frame = आख़िरी इमेज की तरफ़ एनिमेट करना), allowedPassthroughParameters में वे अतिरिक्त विकल्प जो मॉडल लेता है (जैसे negative_prompt, cfg_scale), और generateAudio बताता है कि मॉडल वीडियो में ऑडियो बनाता है या नहीं। generate_video कॉल करते समय मॉडल id को model पैरामीटर में दें।",
    dynamicTitle: "{{count}} मॉडल",

    fields: {
      query: {
        label: "सर्च",
        description:
          "नाम, प्रोवाइडर या क्षमता से मॉडल फ़िल्टर करें (जैसे 'coding', 'uncensored', 'image', 'fast')।",
        placeholder: "जैसे GPT, Gemini, coding, uncensored…",
      },
      modelType: {
        label: "टाइप",
        description:
          "मॉडल टाइप से फ़िल्टर करें: text (चैट/LLM), image (इमेज जनरेशन), video, या audio (TTS/STT/म्यूज़िक)। सभी टाइप के लिए खाली छोड़ें।",
        placeholder: "सभी टाइप",
      },
      contentLevel: {
        label: "कंटेंट लेवल",
        description:
          "कंटेंट पॉलिसी से फ़िल्टर करें। Mainstream = स्टैंडर्ड सेफ़्टी फ़िल्टर। Open = कम पाबंदियाँ। Uncensored = कोई फ़िल्टर नहीं।",
        placeholder: "सभी कंटेंट लेवल",
      },
      intelligence: {
        label: "इंटेलिजेंस",
        description:
          "न्यूनतम इंटेलिजेंस टियर। Quick = तेज़ और किफ़ायती। Smart = संतुलित क्वालिटी। Brilliant = गहरी सोच।",
        placeholder: "कोई भी इंटेलिजेंस",
      },
      page: {
        label: "पेज",
        description: "पेजिनेशन के लिए पेज नंबर (1 से शुरू)।",
      },
      pageSize: {
        label: "पेज साइज़",
        description: "प्रति पेज मॉडल की संख्या (डिफ़ॉल्ट 50, अधिकतम 200)।",
      },
    },

    response: {
      models: "मॉडल",
      totalCount: "कुल",
      matchedCount: "मेल खाए",
      currentPage: "पेज",
      totalPages: "पेज",
      hint: "हिंट",
      model: {
        id: "मॉडल ID",
        name: "नाम",
        provider: "प्रोवाइडर",
        type: "टाइप",
        description: "विवरण",
        contextWindow: "कॉन्टेक्स्ट",
        parameterCount: "पैरामीटर",
        intelligence: "इंटेलिजेंस",
        content: "कंटेंट",
        price: "कीमत (क्रेडिट)",
        supportsTools: "टूल",
        utilities: "क्षमताएँ",
        inputs: "इनपुट",
        outputs: "आउटपुट",
        supportedDurations: "अवधि (सेकंड)",
        supportedAspectRatios: "एस्पेक्ट रेशियो",
        supportedResolutions: "रेज़ोल्यूशन",
        supportedFrameImages: "फ़्रेम इमेज टाइप",
        generateAudio: "ऑडियो बनाता है",
        supportedSizes: "सटीक साइज़",
        allowedPassthroughParameters: "अतिरिक्त पैरामीटर",
      },
    },

    errors: {
      server: {
        title: "सर्वर एरर",
        description: "मॉडल की लिस्ट नहीं मिल पाई। दोबारा कोशिश करें।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन फ़ेल हो गया। अपना कनेक्शन जाँचें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया।",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़िल्टर पैरामीटर गलत हैं।",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "मॉडल देखने के लिए लॉग इन करना ज़रूरी है।",
      },
      forbidden: {
        title: "मना है",
        description: "आपको इस रिसोर्स को एक्सेस करने की अनुमति नहीं है।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई मॉडल नहीं मिला।",
      },
      conflict: {
        title: "टकराव",
        description: "रिक्वेस्ट में टकराव है।",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं।",
      },
    },

    success: {
      title: "मॉडल लोड हो गए",
      description: "AI मॉडल की लिस्ट आ गई।",
    },

    browser: {
      subtitle: "प्लेटफ़ॉर्म का हर मॉडल, उसकी कीमत, कॉन्टेक्स्ट विंडो और कंटेंट लेवल के साथ।",
      emptyTitle: "इन फ़िल्टर से कोई मॉडल मेल नहीं खाता",
      emptyHint: "दूसरा टाइप या कंटेंट लेवल आज़माएँ, या सर्च हटा दें।",
      clearFilters: "फ़िल्टर हटाएँ",
      toolCalls: "टूल कॉल",
      context: "{{size}} कॉन्टेक्स्ट",
      supportsTools: "✓ टूल",
      noModels: "आपके फ़िल्टर से कोई मॉडल मेल नहीं खाता।",
      allLabel: "सभी",
      statsLabel: "{{total}} में से {{matched}} मॉडल",
      free: "फ़्री",
      credits: "~{{cost}} क्रेडिट",
      ctx: "ctx",
    },
  },
};
