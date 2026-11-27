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

  post: {
    title: "पसंदीदा बनाएँ",
    titleShort: "पसंदीदा जोड़ें",
    description: "नया पसंदीदा स्किल कॉन्फ़िगरेशन बनाएँ",
    container: {
      title: "नया पसंदीदा",
      description: "स्किल कॉन्फ़िगरेशन को पसंदीदा के रूप में सेव करें",
    },
    backButton: {
      label: "पसंदीदा पर वापस",
    },
    submitButton: {
      label: "पसंदीदा बनाएँ",
      loadingText: "बन रहा है...",
    },
    addModeButton: {
      label: "मोड जोड़ें",
      loadingText: "जोड़ा जा रहा है...",
    },
    useWithoutSavingButton: {
      label: "बिना सेव किए इस्तेमाल करें",
      loadingText: "लागू हो रहा है...",
    },
    skillId: {
      label: "स्किल",
      description:
        'मर्ज किए फ़ॉर्मैट में स्किल ID: डिफ़ॉल्ट वैरिएंट के लिए "skillSlug", खास वैरिएंट के लिए "skillSlug__variantId" (जैसे "thea__brilliant")। उपलब्ध ID देखने के लिए skills चलाएँ।',
    },
    customVariantName: {
      label: "लेबल",
      description:
        "इस वैरिएंट का कस्टम नाम (स्किल का डिफ़ॉल्ट इस्तेमाल करने के लिए खाली छोड़ें)",
    },
    customIcon: {
      label: "कस्टम आइकन",
      description: "इस पसंदीदा के लिए वैकल्पिक कस्टम आइकन",
    },
    chatModel: {
      label: "चैट मॉडल",
      placeholder: "स्किल जैसा ही",
    },
    voice: {
      label: "वॉइस",
      description:
        "इस पसंदीदा के लिए TTS वॉइस ओवरराइड। null = आपकी ग्लोबल वॉइस सेटिंग चलेगी (ब्रिज मॉडल: यूज़र की सेटिंग को प्राथमिकता)। इस पसंदीदा को अलग वॉइस देने के लिए सेट करें।",
      placeholder: "स्किल जैसा ही",
    },
    sttModel: {
      label: "स्पीच-टू-टेक्स्ट मॉडल",
      description:
        "STT मॉडल ओवरराइड। null = आपकी ग्लोबल STT पसंद चलेगी (ब्रिज मॉडल)। सिर्फ़ खास ट्रांसक्रिप्शन ज़रूरतों के लिए सेट करें।",
      placeholder: "स्किल जैसा ही",
    },
    imageVisionModel: {
      label: "इमेज विज़न मॉडल",
      description:
        "इमेज विज़न LLM ओवरराइड। null = यूज़र की ग्लोबल पसंद चलेगी (ब्रिज मॉडल)।",
      placeholder: "स्किल जैसा ही",
    },
    videoVisionModel: {
      label: "वीडियो विज़न मॉडल",
      description:
        "वीडियो विज़न LLM ओवरराइड। null = यूज़र की ग्लोबल पसंद चलेगी (ब्रिज मॉडल)।",
      placeholder: "स्किल जैसा ही",
    },
    audioVisionModel: {
      label: "ऑडियो विज़न मॉडल",
      description:
        "ऑडियो विज़न LLM ओवरराइड। null = यूज़र की ग्लोबल पसंद चलेगी (ब्रिज मॉडल)।",
      placeholder: "स्किल जैसा ही",
    },
    imageGenModel: {
      label: "इमेज जनरेशन मॉडल",
      description:
        "इमेज जनरेटर ओवरराइड। null = स्किल का imageGenModelSelection चलेगा (मीडिया जनरेशन: स्किल को प्राथमिकता)। स्किल के बताए जनरेटर से अलग जनरेटर चाहिए तो सेट करें।",
      placeholder: "स्किल जैसा ही",
    },
    musicGenModel: {
      label: "म्यूज़िक जनरेशन मॉडल",
      description:
        "म्यूज़िक जनरेटर ओवरराइड। null = स्किल का musicGenModelSelection चलेगा (मीडिया जनरेशन: स्किल को प्राथमिकता)।",
      placeholder: "स्किल जैसा ही",
    },
    videoGenModel: {
      label: "वीडियो जनरेशन मॉडल",
      description:
        "वीडियो जनरेटर ओवरराइड। null = स्किल का videoGenModelSelection चलेगा (मीडिया जनरेशन: स्किल को प्राथमिकता)।",
      placeholder: "स्किल जैसा ही",
    },
    mode: {
      label: "चुनने का मोड",
      description: "मॉडल कैसे चुना जाए",
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
    icon: {
      label: "कस्टम आइकन",
      description: "इस पसंदीदा स्लॉट के लिए स्किल का डिफ़ॉल्ट आइकन बदलें",
    },
    compactTrigger: {
      label: "कॉम्पैक्ट ट्रिगर (टोकन)",
      description:
        "बातचीत कॉम्पैक्ट करने वाली टोकन संख्या बदलें। स्किल या ग्लोबल डिफ़ॉल्ट पर लौटने के लिए null दें।",
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
    changeSkill: {
      label: "स्किल बदलें",
    },
    modifySkill: {
      label: "स्किल एडिट करें",
    },
    character: {
      name: "नाम",
      tagline: "टैगलाइन",
      description: "विवरण",
    },
  },
};
