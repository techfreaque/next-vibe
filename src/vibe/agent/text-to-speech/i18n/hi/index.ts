// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/hi";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एजेंट",
  tags: {
    speech: "स्पीच",
    tts: "टेक्स्ट-टू-स्पीच",
    ai: "AI",
  },

  post: {
    title: "टेक्स्ट से स्पीच",
    titleShort: "टेक्स्ट से स्पीच",
    dynamicTitle: "स्पीच: {{text}}",
    description:
      "टेक्स्ट को स्पीच में बदलें। टेक्स्ट और voice id दें। उपलब्ध वॉइस मॉडल देखने के लिए models टूल (modelType=audio) इस्तेमाल करें। हर मॉडल की अपनी यूनिक id होती है, जिसे voice पैरामीटर में देना है। खर्च: चुनी गई वॉइस की अपनी दर पर हर अक्षर के हिसाब से (models टूल देखें)। audioUrl लौटाता है।",
    form: {
      title: "टेक्स्ट से स्पीच कन्वर्ज़न",
      description: "स्पीच में बदलने के लिए टेक्स्ट लिखें",
    },
    text: {
      label: "टेक्स्ट",
      description: "स्पीच में बदलने वाला टेक्स्ट (अधिकतम 5000 अक्षर)",
      placeholder: "जो टेक्स्ट स्पीच में बदलना है, यहाँ लिखें...",
    },
    voice: {
      label: "वॉइस",
      description:
        "वॉइस मॉडल की id। उपलब्ध वॉइस और उनकी id देखने के लिए models टूल (modelType=audio) इस्तेमाल करें।",
    },
    download: "डाउनलोड करें",
    response: {
      title: "ऑडियो का नतीजा",
      description: "बनी हुई स्पीच ऑडियो",
      success: "सफल",
      audioUrl: "ऑडियो URL",
      creditCost: "खर्च हुए क्रेडिट",
    },
    submitButton: {
      label: "बोलकर सुनाएँ",
      loadingText: "बन रहा है...",
    },
    errors: {
      validation_failed: {
        title: "वैलिडेशन एरर",
        description: "दिया गया टेक्स्ट या पैरामीटर गलत हैं",
      },
      network_error: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "टेक्स्ट-टू-स्पीच इस्तेमाल करने के लिए लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपको टेक्स्ट-टू-स्पीच इस्तेमाल करने की अनुमति नहीं है",
      },
      not_found: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      server_error: {
        title: "सर्वर एरर",
        description: "टेक्स्ट को स्पीच में बदलते समय एरर आया",
      },
      unknown_error: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsaved_changes: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
      noTtsProviderConfigured:
        "कोई टेक्स्ट-टू-स्पीच प्रोवाइडर सेट नहीं है। OPENAI_API_KEY, EDEN_AI_API_KEY या ELEVENLABS_API_KEY जोड़ें, या कोई सिस्टम इनफ़रेंस प्रोवाइडर कनेक्ट करें।",
      notConfigured:
        "{{label}} की API key सेट नहीं है। अपनी .env फ़ाइल में {{envKey}}=<your-key> जोड़ें। key यहाँ से लें: {{url}}",
      conversionFailed: "स्पीच सिंथेसिस फ़ेल हुआ: {{error}}",
      providerUnavailable:
        "वॉइस प्रोवाइडर अभी कुछ समय के लिए उपलब्ध नहीं है। आपके क्रेडिट नहीं कटे। थोड़ी देर में फिर कोशिश करें या दूसरी वॉइस चुनें।",
      noText: "कोई टेक्स्ट नहीं दिया गया",
      noAudioUrl: "प्रोवाइडर से कोई ऑडियो URL नहीं मिला",
      audioFetchFailed: "ऑडियो फ़ाइल नहीं बन पाई। दोबारा कोशिश करें",
      providerError: "प्रोवाइडर एरर: {{error}}",
      internalError: "इंटरनल सर्वर एरर",
      unsupportedProvider: "इस वॉइस के लिए TTS प्रोवाइडर अनसपोर्टेड है: {{voiceId}}",
      creditsFailed: "क्रेडिट नहीं कट पाए: {{error}}",
      balanceCheckFailed: "आपका क्रेडिट बैलेंस जाँचा नहीं जा सका। दोबारा कोशिश करें",
      insufficientCredits:
        "इस कन्वर्ज़न के लिए क्रेडिट कम हैं। बैलेंस: {{balance}}, कम से कम ज़रूरी: {{minimum}}। जारी रखने के लिए टॉप अप करें",
    },
    success: {
      title: "सफल",
      description: "टेक्स्ट सफलतापूर्वक स्पीच में बदल गया",
      conversionComplete: "स्पीच सिंथेसिस सफलतापूर्वक पूरा हुआ",
    },
  },
  languages: {
    en: "अंग्रेज़ी",
    de: "जर्मन",
    pl: "पोलिश",
    es: "स्पैनिश",
    sk: "स्लोवाक",
    hi: "हिंदी",
    fr: "फ़्रेंच",
    it: "इतालवी",
  },
  models: {
    descriptions: {
      qwen3Ryan: "Ryan खुले Qwen3 वॉइस मॉडल से जर्मन समेत 10 भाषाओं में पढ़कर सुनाता है।",
      orpheusTara:
        "Tara अंग्रेज़ी को भावपूर्ण रफ़्तार और आवाज़ के उतार-चढ़ाव के साथ पढ़ती है।",
      openaiAlloy: "OpenAI Alloy: प्रोफ़ेशनल कंटेंट के लिए संतुलित, न्यूट्रल आवाज़",
      openaiNova:
        "OpenAI Nova: गर्मजोश, दोस्ताना आवाज़, बातचीत वाले ऐप्स के लिए एकदम सही",
      openaiOnyx: "OpenAI Onyx: औपचारिक कंटेंट के लिए गहरी, रौबदार आवाज़",
      openaiEcho: "OpenAI Echo: साफ़ उच्चारण और स्वाभाविक लय वाली आवाज़",
      openaiShimmer: "OpenAI Shimmer: दिलचस्प कंटेंट के लिए भावपूर्ण, जीवंत आवाज़",
      openaiFable: "OpenAI Fable: भावपूर्ण, कहानी सुनाने वाली आवाज़",
      elevenlabsRachel:
        "ElevenLabs Rachel: भावनाओं की रेंज वाली स्वाभाविक महिला आवाज़",
      elevenlabsJosh: "ElevenLabs Josh: बातचीत वाले लहजे की स्वाभाविक पुरुष आवाज़",
      elevenlabsBella: "ElevenLabs Bella: नर्म अंदाज़ वाली गर्मजोश महिला आवाज़",
      elevenlabsAdam: "ElevenLabs Adam: कंटेंट क्रिएशन के लिए प्रोफ़ेशनल पुरुष आवाज़",
      elevenlabsRachelTurbo:
        "ElevenLabs Rachel Turbo: वही आवाज़, v4 Turbo पर। आधी कीमत, लगभग तुरंत जवाब।",
      elevenlabsJoshTurbo:
        "ElevenLabs Josh Turbo: वही आवाज़, v4 Turbo पर। आधी कीमत, लगभग तुरंत जवाब।",
      elevenlabsBellaTurbo:
        "ElevenLabs Bella Turbo: वही आवाज़, v4 Turbo पर। आधी कीमत, लगभग तुरंत जवाब।",
      elevenlabsAdamTurbo:
        "ElevenLabs Adam Turbo: वही आवाज़, v4 Turbo पर। आधी कीमत, लगभग तुरंत जवाब।",
      kokoroBella:
        "Kokoro Bella: ओपन-वेट 82M मॉडल, गर्मजोश अमेरिकी महिला आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
      kokoroSarah:
        "Kokoro Sarah: ओपन-वेट 82M मॉडल, साफ़ अमेरिकी महिला आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
      kokoroNicole:
        "Kokoro Nicole: ओपन-वेट 82M मॉडल, नर्म और धीमी महिला आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
      kokoroAdam:
        "Kokoro Adam: ओपन-वेट 82M मॉडल, ठहरी हुई अमेरिकी पुरुष आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
      kokoroMichael:
        "Kokoro Michael: ओपन-वेट 82M मॉडल, आत्मविश्वासी अमेरिकी पुरुष आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
      kokoroEmma:
        "Kokoro Emma: ओपन-वेट 82M मॉडल, ब्रिटिश महिला आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
      kokoroGeorge:
        "Kokoro George: ओपन-वेट 82M मॉडल, ब्रिटिश पुरुष आवाज़। कोई कंटेंट फ़िल्टर नहीं।",
      voxtralPaul:
        "Voxtral Mini के साथ Paul की न्यूट्रल आवाज़ में अंग्रेज़ी टेक्स्ट पढ़कर सुनाएँ।",
      inworldAshley: "Inworld Ashley: तेज़, कम खर्च वाली जीवंत महिला आवाज़।",
      inworldCraig: "Inworld Craig: तेज़, कम खर्च वाली ब्रिटिश पुरुष आवाज़।",
      xaiEve: "xAI Eve: इनलाइन इमोशन कंट्रोल वाली भावपूर्ण महिला आवाज़।",
      geminiZephyr:
        "Gemini Zephyr: चमकती हुई महिला आवाज़, 100+ भाषाएँ, बोलने के अंदाज़ के निर्देश।",
      geminiPuck:
        "Gemini Puck: जोशीली पुरुष आवाज़, 100+ भाषाएँ, बोलने के अंदाज़ के निर्देश।",
    },
    names: modelTranslations.names,
  },
};

export default translations;
