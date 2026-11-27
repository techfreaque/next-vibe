import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    music: "म्यूज़िक",
    generation: "जनरेशन",
    ai: "AI",
  },
  post: {
    title: "म्यूज़िक बनाएँ",
    titleShort: "म्यूज़िक बनाएँ",
    dynamicTitle: "म्यूज़िक: {{prompt}}",
    description:
      "टेक्स्ट प्रॉम्प्ट से म्यूज़िक बनाएँ। उपलब्ध म्यूज़िक मॉडल देखने के लिए models टूल को modelType=audio के साथ चलाएँ। खास मॉडल चुनने के लिए मॉडल id दें, या यूज़र का डिफ़ॉल्ट इस्तेमाल करने के लिए खाली छोड़ें। ऑडियो-टू-ऑडियो स्टाइल ट्रांसफ़र के लिए वैकल्पिक रूप से inputMediaUrl दें। audioUrl और durationSeconds लौटाता है।",
    form: {
      title: "म्यूज़िक जनरेशन",
      description: "म्यूज़िक बनाने के लिए प्रॉम्प्ट लिखें",
    },
    prompt: {
      label: "प्रॉम्प्ट",
      description: "बताएँ कि कैसा म्यूज़िक बनाना है",
      placeholder: "जोशीला इलेक्ट्रॉनिक म्यूज़िक, दिल में उतरने वाली धुन...",
    },
    model: {
      label: "मॉडल",
      description:
        "म्यूज़िक जनरेशन मॉडल की id। यूज़र का डिफ़ॉल्ट इस्तेमाल करने के लिए खाली छोड़ें। उपलब्ध मॉडल देखने के लिए models टूल (modelType=audio) इस्तेमाल करें।",
    },
    duration: {
      label: "अवधि",
      description: "बनने वाली ऑडियो क्लिप की लंबाई",
      short: "छोटी (~8 सेकंड)",
      medium: "मध्यम (~20 सेकंड)",
      long: "लंबी (~30 सेकंड)",
    },
    inputMediaUrl: {
      label: "रेफ़रेंस ऑडियो URL",
      description:
        "स्टाइल ट्रांसफ़र या रीमिक्स के लिए ऑडियो URL। मॉडल इसे शुरुआती बिंदु की तरह इस्तेमाल करता है। सिर्फ़ उन्हीं मॉडल पर चलता है जो ऑडियो इनपुट सपोर्ट करते हैं।",
      placeholder: "https://example.com/audio.mp3",
    },
    download: "डाउनलोड करें",
    separator: "·",
    backButton: {
      label: "वापस",
    },
    submitButton: {
      text: "म्यूज़िक बनाएँ",
      label: "म्यूज़िक बनाएँ",
      loadingText: "बन रहा है...",
    },
    response: {
      audioUrl: "बनाए गए ऑडियो का URL",
      creditCost: "खर्च हुए क्रेडिट",
      durationSeconds: "अवधि (सेकंड में)",
      jobId: "Async जॉब ID",
    },
    errors: {
      referenceUnavailable:
        "रेफ़रेंस ऑडियो उपलब्ध नहीं है। या तो हटा दिया गया है, या ऐसी चैट का है जिसे आप खोल नहीं सकते। इसी चैट का कोई ऑडियो इस्तेमाल करें या दोबारा अपलोड करें।",
      validation_failed: {
        title: "वैलिडेशन एरर",
        description: "अपना प्रॉम्प्ट और सेटिंग्स जाँचें",
      },
      network_error: {
        title: "नेटवर्क एरर",
        description: "म्यूज़िक जनरेशन सर्विस से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "म्यूज़िक बनाने के लिए साइन इन करें",
      },
      forbidden: {
        title: "मना है",
        description: "आपको यह फ़ीचर इस्तेमाल करने की अनुमति नहीं है",
      },
      not_found: {
        title: "नहीं मिला",
        description: "माँगा गया मॉडल नहीं मिला",
      },
      server_error: {
        title: "सर्वर एरर",
        description: "म्यूज़िक जनरेशन के दौरान अनपेक्षित एरर आया",
      },
      unknown_error: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      unsaved_changes: {
        title: "बिना सेव किए बदलाव",
        description: "म्यूज़िक बनाने से पहले अपने बदलाव सेव करें",
      },
      conflict: {
        title: "टकराव",
        description: "म्यूज़िक जनरेशन के दौरान टकराव हो गया",
      },
      noModelConfigured:
        "कोई म्यूज़िक मॉडल सेट नहीं है। अपनी पसंदीदा सेटिंग्स में म्यूज़िक मॉडल चुनें।",
      notAnAudioModel:
        "चुना गया मॉडल म्यूज़िक जनरेशन सपोर्ट नहीं करता। कोई म्यूज़िक मॉडल चुनें।",
      notConfigured:
        "{{label}} सेट नहीं है। अपनी .env फ़ाइल में {{envKey}} जोड़ें। key यहाँ से लें: {{url}}",
      providerUnsupported: "{{label}} अभी सपोर्टेड नहीं है",
      insufficientCredits: "क्रेडिट कम हैं। बैलेंस: {{balance}}, ज़रूरी: {{minimum}}",
      balanceCheckFailed: "आपका क्रेडिट बैलेंस जाँचा नहीं जा सका",
      unsupportedDuration:
        "मॉडल {{model}} अवधि {{duration}} सपोर्ट नहीं करता। सपोर्टेड अवधि: {{supported}}",
      generationFailed: "म्यूज़िक जनरेशन फ़ेल हो गया",
      providerError: "म्यूज़िक प्रोवाइडर एरर: {{error}}",
      noAudioUrl: "प्रोवाइडर ने कोई ऑडियो URL नहीं लौटाया",
      creditsFailed: "म्यूज़िक जनरेशन के क्रेडिट नहीं कट पाए",
      apiKeyNotConfigured: "API key सेट नहीं है",
      externalServiceError: "एक्सटर्नल सर्विस एरर: {{message}}",
      requestAborted: "रिक्वेस्ट रद्द हो गई",
      requestTimedOut: "म्यूज़िक जनरेशन का इंतज़ार करते हुए रिक्वेस्ट टाइमआउट हो गई",
      requestFailed: "रिक्वेस्ट फ़ेल हुई: {{message}}",
      pollFailed: "पोल रिक्वेस्ट स्टेटस {{status}} के साथ फ़ेल हुई",
    },
    success: {
      title: "म्यूज़िक बन गया",
      description: "आपका म्यूज़िक सफलतापूर्वक बन गया",
    },
  },
  models: {
    names: {
      MUSICGEN_STEREO: "MusicGen Stereo",
      MUSIC_GEN: "ModelsLab Music Gen",
      ELEVENLABS_MUSIC: "ElevenLabs Music",
      CASSETTE_MUSIC: "CassetteAI Music",
      SONAUTO_SONG: "Sonauto Song",
      LYRIA_3: "Lyria 3",
      LYRIA_3_PRO_PREVIEW: "Lyria 3 Pro Preview",
      LYRIA_3_CLIP_PREVIEW: "Lyria 3 Clip Preview",
    },
  },
};
