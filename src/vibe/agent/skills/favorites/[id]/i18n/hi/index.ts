import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    titleShort: "पसंदीदा",
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
    titleShort: "पसंदीदा अपडेट करें",
    description: "मौजूदा पसंदीदा कॉन्फ़िगरेशन अपडेट करें",
    container: {
      title: "स्किल सेटअप एडिट करें",
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
    reportButton: {
      label: "रिपोर्ट करें",
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
      label: "लेबल",
      description:
        "इस वैरिएंट का कस्टम नाम (स्किल का डिफ़ॉल्ट इस्तेमाल करने के लिए खाली छोड़ें)",
    },
    chatModel: {
      label: "चैट मॉडल",
      placeholder: "स्किल जैसा ही",
    },
    voice: {
      label: "AI की आवाज़",
      description:
        "इस पसंदीदा के लिए TTS वॉइस ओवरराइड। null = आपकी ग्लोबल वॉइस सेटिंग चलेगी (ब्रिज मॉडल: यूज़र की सेटिंग को प्राथमिकता)। इस पसंदीदा को अलग वॉइस देने के लिए यहाँ सेट करें।",
      placeholder: "स्किल जैसा ही",
    },
    sttModel: {
      label: "स्पीच-टू-टेक्स्ट मॉडल",
      description:
        "इस पसंदीदा के लिए STT मॉडल ओवरराइड। null = आपकी ग्लोबल STT पसंद चलेगी (ब्रिज मॉडल)। सिर्फ़ खास ट्रांसक्रिप्शन ज़रूरतों के लिए सेट करें।",
      placeholder: "स्किल जैसा ही",
    },
    imageVisionModel: {
      label: "इमेज विज़न मॉडल",
      description:
        "इस पसंदीदा के लिए इमेज विज़न LLM ओवरराइड। null = यूज़र की ग्लोबल पसंद चलेगी (ब्रिज मॉडल)। कोई खास विज़न मॉडल थोपने के लिए सेट करें।",
      placeholder: "स्किल जैसा ही",
    },
    videoVisionModel: {
      label: "वीडियो विज़न मॉडल",
      description:
        "इस पसंदीदा के लिए वीडियो विज़न LLM ओवरराइड। null = यूज़र की ग्लोबल पसंद चलेगी (ब्रिज मॉडल)।",
      placeholder: "स्किल जैसा ही",
    },
    audioVisionModel: {
      label: "ऑडियो विज़न मॉडल",
      description:
        "इस पसंदीदा के लिए ऑडियो विज़न LLM ओवरराइड। null = यूज़र की ग्लोबल पसंद चलेगी (ब्रिज मॉडल)।",
      placeholder: "स्किल जैसा ही",
    },
    imageGenModel: {
      label: "इमेज जनरेशन मॉडल",
      description:
        "इस पसंदीदा के लिए इमेज जनरेटर ओवरराइड। null = स्किल का imageGenModelSelection चलेगा (मीडिया जनरेशन: स्किल को प्राथमिकता)। स्किल के बताए जनरेटर से अलग जनरेटर चाहिए तो यहाँ सेट करें।",
      placeholder: "स्किल जैसा ही",
    },
    musicGenModel: {
      label: "म्यूज़िक जनरेशन मॉडल",
      description:
        "इस पसंदीदा के लिए म्यूज़िक जनरेटर ओवरराइड। null = स्किल का musicGenModelSelection चलेगा (मीडिया जनरेशन: स्किल को प्राथमिकता)।",
      placeholder: "स्किल जैसा ही",
    },
    videoGenModel: {
      label: "वीडियो जनरेशन मॉडल",
      description:
        "इस पसंदीदा के लिए वीडियो जनरेटर ओवरराइड। null = स्किल का videoGenModelSelection चलेगा (मीडिया जनरेशन: स्किल को प्राथमिकता)।",
      placeholder: "स्किल जैसा ही",
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
    titleShort: "पसंदीदा हटाएँ",
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
};
