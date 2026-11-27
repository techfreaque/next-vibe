import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
    category: "चैट",
    tags: {
      favorites: "पसंदीदा",
    },
    voices: {
      MALE: "पुरुष आवाज़",
      FEMALE: "महिला आवाज़",
    },

    get: {
      title: "पसंदीदा देखें",
      description: "कोई खास पसंदीदा कॉन्फ़िगरेशन देखें",
      container: {
        title: "पसंदीदा का ब्योरा",
      },
      editButton: {
        label: "पसंदीदा एडिट करें",
      },
      deleteButton: {
        label: "पसंदीदा हटाएँ",
      },
      viewSkillButton: {
        label: "स्किल देखें",
      },
      signupPrompt: {
        title: "स्किल का अंदाज़ अपने हिसाब से बनाएँ",
        description:
          "स्किल का सिस्टम प्रॉम्प्ट और व्यवहार एडिट करें। शुरू करने के लिए साइन अप करें।",
        backButton: "वापस",
        signupButton: "अकाउंट बनाएँ",
        loginButton: "लॉग इन करें",
      },
      id: {
        label: "पसंदीदा ID",
      },
      response: {
        skillId: {
          content: "स्किल: {{value}}",
        },
        customVariantName: {
          content: "वैरिएंट का नाम: {{value}}",
        },
        customIcon: {
          content: "कस्टम आइकन: {{value}}",
        },
        voice: {
          content: "वॉइस: {{value}}",
        },
        mode: {
          content: "मोड: {{value}}",
        },
        intelligence: {
          content: "इंटेलिजेंस: {{value}}",
        },
        modelSelection: {
          title: "मॉडल का चुनाव",
        },
        selectionType: {
          content: "चुनाव का तरीका: {{value}}",
        },
        minIntelligence: {
          content: "न्यूनतम इंटेलिजेंस: {{value}}",
        },
        maxIntelligence: {
          content: "अधिकतम इंटेलिजेंस: {{value}}",
        },
        minPrice: {
          content: "न्यूनतम कीमत: {{value}}",
        },
        maxPrice: {
          content: "अधिकतम कीमत: {{value}}",
        },
        minContent: {
          content: "न्यूनतम कंटेंट लेवल: {{value}}",
        },
        maxContent: {
          content: "अधिकतम कंटेंट लेवल: {{value}}",
        },
        content: {
          content: "कंटेंट लेवल: {{value}}",
        },
        preferredStrengths: {
          content: "पसंदीदा खूबियाँ: {{value}}",
        },
        ignoredWeaknesses: {
          content: "नज़रअंदाज़ कमज़ोरियाँ: {{value}}",
        },
        manualModelId: {
          content: "मैन्युअल मॉडल: {{value}}",
        },
        position: {
          content: "पोज़िशन: {{value}}",
        },
        color: {
          content: "रंग: {{value}}",
        },
        isActive: {
          content: "सक्रिय: {{value}}",
        },
        useCount: {
          content: "कितनी बार इस्तेमाल हुआ: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "पसंदीदा ID गलत है",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो पाया",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "यह पसंदीदा देखने के लिए लॉग इन करना ज़रूरी है",
        },
        forbidden: {
          title: "मना है",
          description: "आपको यह पसंदीदा देखने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "पसंदीदा नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "पसंदीदा लोड नहीं हो पाया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वे खो जाएँगे",
        },
        conflict: {
          title: "टकराव",
          description: "आपकी रिक्वेस्ट प्रोसेस करते समय टकराव हो गया",
        },
      },
      success: {
        title: "सफल",
        description: "पसंदीदा लोड हो गया",
      },
    },
    patch: {
      title: "पसंदीदा अपडेट करें",
      description: "मौजूदा पसंदीदा कॉन्फ़िगरेशन अपडेट करें",
      container: {
        title: "पसंदीदा एडिट करें",
      },
      backButton: {
        label: "पसंदीदा पर वापस",
      },
      deleteButton: {
        label: "पसंदीदा हटाएँ",
      },
      viewSkillButton: {
        label: "स्किल देखें",
      },
      useThisSkillButton: {
        label: "यह स्किल इस्तेमाल करें",
      },
      useThisModelButton: {
        label: "यह मॉडल इस्तेमाल करें",
      },
      currentlyActiveButton: {
        label: "अभी चालू है",
      },
      signupPrompt: {
        title: "स्किल का अंदाज़ अपने हिसाब से बनाएँ",
        description:
          "स्किल का सिस्टम प्रॉम्प्ट और व्यवहार एडिट करें। शुरू करने के लिए साइन अप करें।",
        backButton: "वापस",
        signupButton: "अकाउंट बनाएँ",
        loginButton: "लॉग इन करें",
      },
      saveButton: {
        label: "सेव करें",
        loadingText: "सेव हो रहा है...",
      },
      saveAndUseButton: {
        label: "सेव करें और इस्तेमाल करें",
        loadingText: "सेव और चालू हो रहा है...",
      },
      id: {
        label: "पसंदीदा ID",
      },
      skillId: {
        label: "स्किल",
        description:
          'स्किल ID। डिफ़ॉल्ट वैरिएंट के लिए "skillSlug", खास वैरिएंट के लिए "skillSlug__variantId" इस्तेमाल करें।',
      },
      customVariantName: {
        label: "वैरिएंट का नाम",
        description:
          "इस वैरिएंट का कस्टम नाम (स्किल का डिफ़ॉल्ट इस्तेमाल करने के लिए खाली छोड़ें)",
      },
      chatModel: {
        label: "चैट मॉडल",
        placeholder: "स्किल से लें",
      },
      voice: {
        label: "AI की आवाज़",
        description:
          "इस पसंदीदा के लिए TTS वॉइस ओवरराइड। null = आपकी ग्लोबल वॉइस सेटिंग चलेगी (ब्रिज मॉडल: यूज़र की सेटिंग को प्राथमिकता)। इस पसंदीदा को अलग वॉइस देने के लिए यहाँ सेट करें।",
        placeholder: "स्किल से लें",
      },
      sttModel: {
        label: "स्पीच-टू-टेक्स्ट मॉडल",
        description:
          "इस पसंदीदा के लिए STT मॉडल ओवरराइड। null = आपकी ग्लोबल STT पसंद चलेगी (ब्रिज मॉडल)। सिर्फ़ खास ट्रांसक्रिप्शन ज़रूरतों के लिए सेट करें।",
        placeholder: "स्किल से लें",
      },
      imageVisionModel: {
        label: "इमेज विज़न मॉडल",
        description:
          "इस पसंदीदा के लिए इमेज विज़न LLM ओवरराइड। null = यूज़र की ग्लोबल पसंद चलेगी (ब्रिज मॉडल)। कोई खास विज़न मॉडल थोपने के लिए सेट करें।",
        placeholder: "स्किल से लें",
      },
      videoVisionModel: {
        label: "वीडियो विज़न मॉडल",
        description:
          "इस पसंदीदा के लिए वीडियो विज़न LLM ओवरराइड। null = यूज़र की ग्लोबल पसंद चलेगी (ब्रिज मॉडल)।",
        placeholder: "स्किल से लें",
      },
      audioVisionModel: {
        label: "ऑडियो विज़न मॉडल",
        description:
          "इस पसंदीदा के लिए ऑडियो विज़न LLM ओवरराइड। null = यूज़र की ग्लोबल पसंद चलेगी (ब्रिज मॉडल)।",
        placeholder: "स्किल से लें",
      },
      imageGenModel: {
        label: "इमेज जनरेशन मॉडल",
        description:
          "इस पसंदीदा के लिए इमेज जनरेटर ओवरराइड। null = स्किल का imageGenModelSelection चलेगा (मीडिया जनरेशन: स्किल को प्राथमिकता)। स्किल के बताए जनरेटर से अलग जनरेटर चाहिए तो यहाँ सेट करें।",
        placeholder: "स्किल से लें",
      },
      musicGenModel: {
        label: "म्यूज़िक जनरेशन मॉडल",
        description:
          "इस पसंदीदा के लिए म्यूज़िक जनरेटर ओवरराइड। null = स्किल का musicGenModelSelection चलेगा (मीडिया जनरेशन: स्किल को प्राथमिकता)।",
        placeholder: "स्किल से लें",
      },
      videoGenModel: {
        label: "वीडियो जनरेशन मॉडल",
        description:
          "इस पसंदीदा के लिए वीडियो जनरेटर ओवरराइड। null = स्किल का videoGenModelSelection चलेगा (मीडिया जनरेशन: स्किल को प्राथमिकता)।",
        placeholder: "स्किल से लें",
      },
      mode: {
        label: "चुनने का मोड",
      },
      modelSelection: {
        title: "मॉडल का चुनाव",
        label: "मॉडल का चुनाव",
        description:
          "इस स्लॉट का मॉडल बदलें। फ़िल्टर इस्तेमाल करें या कोई खास मॉडल चुनें। स्किल का डिफ़ॉल्ट मॉडल इस्तेमाल करने के लिए null दें।",
      },
      selectionType: {
        label: "चुनाव का तरीका",
        characterBased: "स्किल के हिसाब से",

        manual: "खास मॉडल",
        filters: "फ़िल्टर के हिसाब से",
      },
      intelligence: {
        label: "इंटेलिजेंस लेवल",
      },
      minIntelligence: {
        label: "न्यूनतम इंटेलिजेंस",
        description: "मॉडल के लिए ज़रूरी न्यूनतम इंटेलिजेंस/क्षमता का स्तर",
      },
      maxIntelligence: {
        label: "अधिकतम इंटेलिजेंस",
        description: "मॉडल के लिए अधिकतम मंज़ूर इंटेलिजेंस/क्षमता का स्तर",
      },
      minPrice: {
        label: "न्यूनतम कीमत",
        description: "प्रति मैसेज न्यूनतम क्रेडिट खर्च",
      },
      maxPrice: {
        label: "अधिकतम कीमत",
      },
      minContent: {
        label: "न्यूनतम कंटेंट लेवल",
        description: "मॉडल के लिए न्यूनतम कंटेंट मॉडरेशन लेवल",
      },
      maxContent: {
        label: "अधिकतम कंटेंट लेवल",
        description: "मॉडल के लिए अधिकतम कंटेंट मॉडरेशन लेवल",
      },
      content: {
        label: "कंटेंट लेवल",
      },
      preferredStrengths: {
        label: "पसंदीदा खूबियाँ",
        description: "मॉडल की वे क्षमताएँ और खूबियाँ जिन्हें तरजीह देनी है",
      },
      ignoredWeaknesses: {
        label: "नज़रअंदाज़ कमज़ोरियाँ",
        description: "मॉडल की वे कमज़ोरियाँ जिन्हें नज़रअंदाज़ करना या मंज़ूर करना है",
      },
      manualModelId: {
        label: "मैन्युअल मॉडल",
      },
      isActive: {
        label: "सक्रिय",
      },
      position: {
        label: "पोज़िशन",
      },
      color: {
        label: "रंग",
        description: "इस पसंदीदा के लिए कस्टम रंग",
      },
      customIcon: {
        label: "कस्टम आइकन",
        description: "इस पसंदीदा के लिए कस्टम आइकन",
      },
      icon: {
        label: "कस्टम आइकन",
        description: "इस पसंदीदा स्लॉट के लिए स्किल का डिफ़ॉल्ट आइकन बदलें",
      },
      availableTools: {
        label: "अनुमत टूल",
        description:
          "इस स्लॉट के लिए अनुमत टूल बदलें। हर एंट्री में toolId चाहिए (उपलब्ध टूल ID जानने के लिए system_help_GET इस्तेमाल करें)। चलाने से पहले पूछने के लिए requiresConfirmation: true सेट करें। स्किल या ग्लोबल सेटिंग्स पर लौटने के लिए null दें।",
      },
      pinnedTools: {
        label: "पिन किए टूल",
        description:
          "इस स्लॉट के लिए टूलबार में पिन किए टूल बदलें। स्किल या ग्लोबल सेटिंग्स पर लौटने के लिए null दें।",
      },
      deniedTools: {
        label: "ब्लॉक किए टूल",
        description:
          "स्किल की अपनी ब्लॉक लिस्ट के ऊपर, इस स्लॉट के लिए कुछ टूल और ब्लॉक करें। बाकी सेटिंग्स चाहे जो हों, ये टूल कॉल नहीं हो सकते।",
        clearAll: "सब हटाएँ",
        noToolsFound: "कोई टूल नहीं मिला",
        blockedNote: "ब्लॉक किए टूल बाकी सेटिंग्स चाहे जो हों, कॉल नहीं हो सकते।",
        searchPlaceholder: "टूल खोजें...",
        blocked: "ब्लॉक",
      },
      promptAppend: {
        label: "प्रॉम्प्ट में जोड़ें",
        description:
          "सिर्फ़ इस स्लॉट के लिए स्किल के सिस्टम प्रॉम्प्ट में जुड़ने वाले अतिरिक्त निर्देश। साझा स्किल बदले बिना अपने हिसाब से ढालने के लिए इस्तेमाल करें। AI एजेंट: यूज़र का नाम, भाषा की पसंद, तकनीकी स्तर और डोमेन संदर्भ भरें (जैसे 'मेरा नाम Max है। मुझे TypeScript और bun पसंद हैं। हिंदी में जवाब दें।')।",
        placeholder: "जैसे मेरा नाम अमित है। मुझे हिंदी में छोटे जवाब पसंद हैं।",
      },
      compactTrigger: {
        label: "कॉम्पैक्ट ट्रिगर (टोकन)",
        description:
          "इस स्लॉट के लिए बातचीत कॉम्पैक्ट करने वाली टोकन संख्या बदलें। स्किल या ग्लोबल डिफ़ॉल्ट पर लौटने के लिए null दें।",
      },
      memoryLimit: {
        label: "मेमोरी की सीमा (टोकन)",
        description:
          "इस स्लॉट के लिए हर टर्न में डाले जाने वाले मेमोरी कंटेंट के कुल टोकन की अधिकतम सीमा बदलें। स्किल या ग्लोबल डिफ़ॉल्ट पर लौटने के लिए null दें।",
      },
      changeSkill: {
        label: "स्किल बदलें",
      },
      modifySkill: {
        label: "स्किल एडिट करें",
      },
      response: {
        success: {
          content: "अपडेट हुआ: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "अपना इनपुट जाँचें और दोबारा कोशिश करें",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो पाया",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "यह पसंदीदा अपडेट करने के लिए लॉग इन करना ज़रूरी है",
        },
        forbidden: {
          title: "मना है",
          description: "आपको यह पसंदीदा अपडेट करने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "पसंदीदा नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "पसंदीदा अपडेट नहीं हो पाया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वे खो जाएँगे",
        },
        conflict: {
          title: "टकराव",
          description: "पसंदीदा अपडेट करते समय टकराव हो गया",
        },
      },
      slotOverride: {
        label: "इस स्लॉट के लिए ओवरराइड",
      },
      globalDefault: {
        label: "मेरा डिफ़ॉल्ट (फ़ॉलबैक)",
      },
      success: {
        title: "सफल",
        description: "पसंदीदा अपडेट हो गया",
      },
    },
    delete: {
      title: "पसंदीदा हटाएँ",
      description: "पसंदीदा कॉन्फ़िगरेशन हटाएँ",
      container: {
        title: "पसंदीदा हटाएँ",
        description: "इस पसंदीदा कॉन्फ़िगरेशन को हमेशा के लिए हटाएँ",
      },
      backButton: {
        label: "रद्द करें",
      },
      actions: {
        delete: "पसंदीदा हटाएँ",
        deleting: "पसंदीदा हटा रहे हैं",
      },
      id: {
        label: "पसंदीदा ID",
        description: "जिस पसंदीदा को हटाना है उसका स्लग या ID",
      },
      response: {
        success: {
          content: "हटाया गया: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "पसंदीदा ID गलत है",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो पाया",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "यह पसंदीदा हटाने के लिए लॉग इन करना ज़रूरी है",
        },
        forbidden: {
          title: "मना है",
          description: "आपको यह पसंदीदा हटाने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "पसंदीदा नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "पसंदीदा हटाया नहीं जा सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वे खो जाएँगे",
        },
        conflict: {
          title: "टकराव",
          description: "टकराव की वजह से पसंदीदा नहीं हटाया जा सकता",
        },
      },
      success: {
        title: "सफल",
        description: "पसंदीदा हटा दिया गया",
      },
    },
  },
  category: "चैट",
  tags: {
    favorites: "पसंदीदा",
  },
  active: "सक्रिय",
  fallbacks: {
    unknownSkill: "अज्ञात स्किल",
    unknownModel: "अज्ञात मॉडल",
    unknown: "अज्ञात",
    unknownProvider: "अज्ञात",
    noTagline: "",
    noDescription: "",
    zeroCredits: "0 क्रेडिट",
    noModelConfiguration: "एरर: कोई मॉडल कॉन्फ़िगरेशन नहीं",
    configurationMissing: "कॉन्फ़िगरेशन गायब है",
    noModel: "कोई मॉडल नहीं",
    dash: "-",
  },
  enums: {
    selectionType: {
      characterBased: "स्किल के हिसाब से",
      manual: "खास मॉडल",
      filters: "फ़िल्टर के हिसाब से",
    },
    mode: {
      auto: "ऑटो",
      manual: "मैन्युअल",
    },
    intelligence: {
      any: "कोई भी",
      quick: "तेज़",
      smart: "स्मार्ट",
      brilliant: "बेहतरीन",
    },
    price: {
      any: "कोई भी",
      cheap: "सस्ता",
      standard: "स्टैंडर्ड",
      premium: "प्रीमियम",
    },
    content: {
      any: "कोई भी",
      mainstream: "मेनस्ट्रीम",
      open: "ओपन",
      uncensored: "अनसेंसर्ड",
    },
    variantsMode: {
      all: "सभी वैरिएंट",
      some: "कुछ वैरिएंट",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "इंटेलिजेंस लेवल के हिसाब से क्रम",
      price: "कीमत के हिसाब से क्रम",
      content: "कंटेंट पॉलिसी के हिसाब से क्रम",
    },
    sortDirection: {
      asc: "कम से ज़्यादा",
      desc: "ज़्यादा से कम",
    },
    sortField: {
      intelligence: "इंटेलिजेंस",
      price: "कीमत",
      content: "कंटेंट",
    },
  },
  get: {
    title: "पसंदीदा देखें",
    titleShort: "पसंदीदा",
    description: "अपने सारे सेव किए हुए पसंदीदा स्किल कॉन्फ़िगरेशन देखें",
    userId: {
      label: "यूज़र ID",
      description:
        "सिर्फ़ एडमिन: किसी खास यूज़र के पसंदीदा लाएँ। अपने पसंदीदा के लिए खाली छोड़ें।",
    },
    fields: {
      query: {
        label: "सर्च",
        description: "नाम, टैगलाइन या स्किल ID से पसंदीदा खोजें।",
      },
      page: {
        label: "पेज",
        description: "पेजिनेटेड नतीजों के लिए पेज नंबर (AI/MCP: डिफ़ॉल्ट पेज साइज़ 25)।",
      },
      pageSize: {
        label: "पेज साइज़",
        description:
          "प्रति पेज पसंदीदा की संख्या (1–500)। AI/MCP कॉलर के लिए डिफ़ॉल्ट 25, इंसानों को सब मिलते हैं।",
      },
    },
    actions: {
      menu: "विकल्प",
      share: "शेयर करें और कमाएँ",
      addAi: "AI जोड़ें",
      edit: "एडिट करें",
      active: "सक्रिय",
      reorder: "क्रम बदलने के लिए खींचें",
      moveUp: "ऊपर ले जाएँ",
      moveDown: "नीचे ले जाएँ",
      showMore: "{{count}} और मॉडल",
      showLess: "कम दिखाएँ",
      settings: "चैट सेटिंग्स",
    },
    addVariant: "एक और मॉडल जोड़ें",
    viewSkill: "ब्योरा",
    deleteVariant: "यह मॉडल हटाएँ?",
    deleteVariantAction: "हटाएँ",
    deleteGroup: {
      trigger: "स्किल हटाएँ",
      confirm: "यह स्किल और इसके {{count}} मॉडल हटाएँ?",
      cancel: "रद्द करें",
      action: "हटाएँ",
    },
    emptyState: "अभी कोई स्किल नहीं। चैट शुरू करने के लिए कोई चुनें।",
    tabs: {
      myFavorites: "मेरी स्किल",
      browseSkills: "स्किल ब्राउज़ करें",
    },
    sections: {
      companion: "कंपैनियन",
      skills: "स्किल",
      model: "सादे मॉडल",
      background: "बैकग्राउंड एजेंट",
    },
    container: {
      title: "आपकी स्किल",
      description: "अपनी पसंदीदा स्किल और मॉडल कॉन्फ़िगरेशन संभालें",
    },
    createButton: {
      label: "स्किल देखें",
    },
    response: {
      favorite: {
        title: "पसंदीदा कॉन्फ़िगरेशन",
        id: {
          content: "ID: {{value}}",
        },
        skillId: {
          content: "स्किल: {{value}}",
        },
        customVariantName: {
          content: "वैरिएंट का नाम: {{value}}",
        },
        customIcon: {
          content: "कस्टम आइकन: {{value}}",
        },
        voice: {
          content: "वॉइस: {{value}}",
        },
        mode: {
          content: "मोड: {{value}}",
        },
        intelligence: {
          content: "इंटेलिजेंस: {{value}}",
        },
        modelSelection: {
          title: "मॉडल का चुनाव",
        },
        selectionType: {
          content: "चुनाव का तरीका: {{value}}",
        },
        minIntelligence: {
          content: "न्यूनतम इंटेलिजेंस: {{value}}",
        },
        maxIntelligence: {
          content: "अधिकतम इंटेलिजेंस: {{value}}",
        },
        minPrice: {
          content: "न्यूनतम कीमत: {{value}}",
        },
        maxPrice: {
          content: "अधिकतम कीमत: {{value}}",
        },
        minContent: {
          content: "न्यूनतम कंटेंट लेवल: {{value}}",
        },
        maxContent: {
          content: "अधिकतम कंटेंट लेवल: {{value}}",
        },
        content: {
          content: "कंटेंट लेवल: {{value}}",
        },
        preferredStrengths: {
          content: "पसंदीदा खूबियाँ: {{value}}",
        },
        ignoredWeaknesses: {
          content: "नज़रअंदाज़ कमज़ोरियाँ: {{value}}",
        },
        manualModelId: {
          content: "मैन्युअल मॉडल: {{value}}",
        },
        position: {
          content: "पोज़िशन: {{value}}",
        },
        color: {
          content: "रंग: {{value}}",
        },
        isActive: {
          content: "सक्रिय: {{value}}",
        },
        useCount: {
          content: "कितनी बार इस्तेमाल हुआ: {{value}}",
        },
        separator: {
          content: "•",
        },
      },
      hasCompanion: {
        content: "कंपैनियन है: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "पसंदीदा देखने के लिए लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपको इस रिसोर्स को एक्सेस करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई पसंदीदा नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "पसंदीदा लोड नहीं हो पाए",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वे खो जाएँगे",
      },
      conflict: {
        title: "टकराव",
        description: "आपकी रिक्वेस्ट प्रोसेस करते समय टकराव हो गया",
      },
    },
    success: {
      title: "सफल",
      description: "पसंदीदा लोड हो गए",
    },
  },
  post: {
    title: "पसंदीदा बनाएँ",
    description: "नया पसंदीदा स्किल कॉन्फ़िगरेशन बनाएँ",
    container: {
      title: "नया पसंदीदा",
      description: "स्किल कॉन्फ़िगरेशन को पसंदीदा के रूप में सेव करें",
    },
    backButton: {
      label: "रद्द करें",
    },
    useWithoutSavingButton: {
      label: "पसंदीदा में जोड़े बिना इस्तेमाल करें",
      loadingText: "लागू हो रहा है...",
    },
    submitButton: {
      label: "पसंदीदा में जोड़ें",
      loadingText: "जोड़ रहे हैं...",
    },
    skillId: {
      label: "स्किल",
      description: "इस पसंदीदा के लिए स्किल चुनें",
    },
    customVariantName: {
      label: "वैरिएंट का नाम",
      description:
        "इस वैरिएंट का कस्टम नाम (स्किल का डिफ़ॉल्ट इस्तेमाल करने के लिए खाली छोड़ें)",
    },
    customIcon: {
      label: "कस्टम आइकन",
      description: "इस पसंदीदा के लिए वैकल्पिक कस्टम आइकन",
    },
    voice: {
      label: "वॉइस",
      description: "टेक्स्ट-टू-स्पीच वॉइस की पसंद",
    },
    mode: {
      label: "चुनने का मोड",
      description: "मॉडल कैसे चुना जाए",
    },
    modelSelection: {
      title: "मॉडल का चुनाव",
      description:
        "AI मॉडल चुनने का तरीका तय करें: कोई खास मॉडल चुनें, या फ़िल्टर के हिसाब से सिस्टम को चुनने दें",
    },
    selectionType: {
      label: "चुनाव का तरीका",
      manual: "खास मॉडल",
      filters: "फ़िल्टर के हिसाब से",
    },
    intelligence: {
      label: "इंटेलिजेंस लेवल",
      description: "ज़रूरी न्यूनतम इंटेलिजेंस लेवल",
    },
    intelligenceRange: {
      label: "इंटेलिजेंस रेंज",
      description: "मॉडल के लिए ज़रूरी इंटेलिजेंस/क्षमता का स्तर",
      minLabel: "न्यूनतम इंटेलिजेंस",
      maxLabel: "अधिकतम इंटेलिजेंस",
    },
    minIntelligence: {
      label: "न्यूनतम इंटेलिजेंस",
      description: "मॉडल के लिए ज़रूरी न्यूनतम इंटेलिजेंस/क्षमता का स्तर",
    },
    maxIntelligence: {
      label: "अधिकतम इंटेलिजेंस",
      description: "मॉडल के लिए अधिकतम मंज़ूर इंटेलिजेंस/क्षमता का स्तर",
    },
    priceRange: {
      label: "कीमत की रेंज",
      description: "प्रति मैसेज क्रेडिट खर्च की रेंज",
      minLabel: "न्यूनतम कीमत",
      maxLabel: "अधिकतम कीमत",
    },
    minPrice: {
      label: "न्यूनतम कीमत",
      description: "प्रति मैसेज न्यूनतम क्रेडिट खर्च",
    },
    maxPrice: {
      label: "अधिकतम कीमत",
      description: "इस्तेमाल होने वाला अधिकतम कीमत टियर",
    },
    contentRange: {
      label: "कंटेंट रेंज",
      description: "कंटेंट मॉडरेशन लेवल की रेंज",
      minLabel: "न्यूनतम कंटेंट",
      maxLabel: "अधिकतम कंटेंट",
    },
    minContent: {
      label: "न्यूनतम कंटेंट लेवल",
      description: "मॉडल के लिए न्यूनतम कंटेंट मॉडरेशन लेवल",
    },
    maxContent: {
      label: "अधिकतम कंटेंट लेवल",
      description: "मॉडल के लिए अधिकतम कंटेंट मॉडरेशन लेवल",
    },
    content: {
      label: "कंटेंट लेवल",
      description: "कंटेंट मॉडरेशन लेवल",
    },
    preferredStrengths: {
      label: "पसंदीदा खूबियाँ",
      description: "मॉडल की वे क्षमताएँ और खूबियाँ जिन्हें तरजीह देनी है",
    },
    ignoredWeaknesses: {
      label: "नज़रअंदाज़ कमज़ोरियाँ",
      description: "मॉडल की वे कमज़ोरियाँ जिन्हें नज़रअंदाज़ करना या मंज़ूर करना है",
    },
    manualModelId: {
      label: "मैन्युअल मॉडल",
      description: "इस्तेमाल करने वाला खास मॉडल (मैन्युअल मोड के लिए)",
    },
    response: {
      id: {
        content: "बनाया गया पसंदीदा, ID: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "पसंदीदा जोड़ने के लिए लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपको पसंदीदा बनाने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "जिसे पसंदीदा बनाना चाहते हैं, वह मौजूद नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "पसंदीदा में जोड़ नहीं पाए",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वे खो जाएँगे",
      },
      conflict: {
        title: "टकराव",
        description: "यह पसंदीदा पहले से मौजूद है",
      },
    },
    success: {
      title: "सफल",
      description: "पसंदीदा बन गया",
    },
  },
  reorder: {
    post: {
      title: "पसंदीदा का क्रम बदलें",
      description: "अपने पसंदीदा कॉन्फ़िगरेशन का क्रम अपडेट करें",
      errors: {
        validation: {
          title: "गलत क्रम",
          description: "अपने क्रम की सेटिंग्स जाँचें और दोबारा कोशिश करें",
        },
        network: {
          title: "कनेक्शन एरर",
          description: "नया क्रम सेव नहीं हो सका। दोबारा कोशिश करें",
        },
        unauthorized: {
          title: "साइन इन ज़रूरी है",
          description: "अपने पसंदीदा का क्रम बदलने के लिए साइन इन करें",
        },
        forbidden: {
          title: "अनुमति नहीं है",
          description: "आपको पसंदीदा का क्रम बदलने की अनुमति नहीं है",
        },
        notFound: {
          title: "पसंदीदा नहीं मिले",
          description: "क्रम बदलने के लिए आपके पसंदीदा नहीं मिले",
        },
        server: {
          title: "कुछ गड़बड़ हो गई",
          description: "आपका नया क्रम सेव नहीं हो सका। दोबारा कोशिश करें",
        },
        unknown: {
          title: "अनपेक्षित एरर",
          description: "कुछ अनपेक्षित हो गया। दोबारा कोशिश करें",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव अभी सेव नहीं हुए हैं",
        },
        conflict: {
          title: "क्रम में टकराव",
          description: "क्रम बदल गया है। रीफ़्रेश करें और दोबारा कोशिश करें",
        },
      },
      success: {
        title: "क्रम सेव हो गया",
        description: "आपके पसंदीदा का क्रम सफलतापूर्वक बदल गया",
      },
    },
  },
};
