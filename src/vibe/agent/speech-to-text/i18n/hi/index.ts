/**
 * Speech-to-Text Hindi translations
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एजेंट",

  hotkey: {
    post: {
      title: "स्पीच-टू-टेक्स्ट हॉटकी",
      titleShort: "STT हॉटकी",
      description: "ऑडियो रिकॉर्ड करें और ट्रांसक्राइब करके टेक्स्ट अपने आप डालें",
      form: {
        title: "हॉटकी कॉन्फ़िगरेशन",
        description: "स्पीच-टू-टेक्स्ट हॉटकी की सेटिंग्स तय करें",
      },
      action: {
        label: "कार्रवाई",
        description: "कौन-सी कार्रवाई करनी है (start/stop/toggle)",
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
        label: "पहले डालें",
        description: "ट्रांसक्रिप्शन से पहले डालने वाला टेक्स्ट",
        placeholder: "जैसे '> '",
      },
      insertSuffix: {
        label: "बाद में डालें",
        description: "ट्रांसक्रिप्शन के बाद डालने वाला टेक्स्ट",
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
          description: "यह फ़ीचर इस्तेमाल करने के लिए लॉग इन करना ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "रिकॉर्डिंग प्रोसेस नहीं हो पाई",
        },
        conflict: {
          title: "टकराव",
          description: "रिकॉर्डिंग पहले से चल रही है",
        },
        forbidden: {
          title: "मना है",
          description: "आपको यह फ़ीचर इस्तेमाल करने की अनुमति नहीं है",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "ट्रांसक्रिप्शन सर्विस से कनेक्ट नहीं हो पाया",
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
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        dependenciesMissing:
          "ज़रूरी डिपेंडेंसी उपलब्ध नहीं हैं: {{missing}}। {{recommendations}}",
        invalidAction: "गलत कार्रवाई: {{action}}",
        noActionProvided: "कोई कार्रवाई नहीं दी गई",
        actionFailed: "कार्रवाई नहीं हो पाई: {{error}}",
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
      speech: "स्पीच",
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
      toggle: "रिकॉर्डिंग चालू/बंद करें",
      status: "स्टेटस देखें",
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
    download: "डाउनलोड करें",
    title: "स्पीच से टेक्स्ट",
    titleShort: "स्पीच से टेक्स्ट",
    dynamicTitle: "ट्रांसक्रिप्ट: {{text}}",
    description:
      "ऑडियो को टेक्स्ट में बदलें। ऑडियो फ़ाइल अपलोड करें (MP3, WAV, WebM, अधिकतम 25MB)। खर्च: चुने गए मॉडल की अपनी दर पर ऑडियो के हर सेकंड के हिसाब से (models टूल देखें)। ट्रांसक्राइब किया टेक्स्ट, इस्तेमाल हुआ प्रोवाइडर और कॉन्फ़िडेंस स्कोर लौटाता है।",
    form: {
      title: "ऑडियो ट्रांसक्रिप्शन",
      description: "ट्रांसक्राइब करने के लिए ऑडियो फ़ाइल अपलोड करें",
    },
    fileUpload: {
      title: "ऑडियो फ़ाइल अपलोड",
      description: "ट्रांसक्रिप्शन के लिए अपनी ऑडियो फ़ाइल अपलोड करें",
    },
    audio: {
      label: "ऑडियो फ़ाइल",
      description: "ट्रांसक्राइब करने वाली ऑडियो फ़ाइल (MP3, WAV, WebM आदि)",
      validation: {
        maxSize: "फ़ाइल का साइज़ 25MB से कम होना चाहिए",
        audioOnly: "कोई ऑडियो या वीडियो फ़ाइल अपलोड करें",
      },
    },
    model: {
      label: "मॉडल",
      description: "ट्रांसक्रिप्शन मॉडल",
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
      title: "ट्रांसक्रिप्शन का नतीजा",
      description: "आपके ऑडियो से ट्रांसक्राइब किया गया टेक्स्ट",
      success: "सफल",
      text: "ट्रांसक्राइब किया टेक्स्ट",
      provider: "इस्तेमाल हुआ प्रोवाइडर",
      confidence: "कॉन्फ़िडेंस स्कोर",
      creditCost: "खर्च हुए क्रेडिट",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "यह फ़ीचर इस्तेमाल करने के लिए लॉग इन करना ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "ऑडियो फ़ाइल या पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "ट्रांसक्रिप्शन प्रोसेस नहीं हो पाया",
      },
      apiKeyMissing: "Eden AI की API key सेट नहीं है",
      transcriptionFailed: "ट्रांसक्रिप्शन फ़ेल हुआ: {{error}}",
      noSttProvider: "कोई स्पीच-टू-टेक्स्ट प्रोवाइडर उपलब्ध नहीं है",
      unsupportedProvider: "अनसपोर्टेड स्पीच-टू-टेक्स्ट प्रोवाइडर: {{provider}}",
      noSttProviderConfigured:
        "कोई स्पीच-टू-टेक्स्ट प्रोवाइडर सेट नहीं है। OPENAI_API_KEY, EDEN_AI_API_KEY या DEEPGRAM_API_KEY जोड़ें, या कोई सिस्टम इनफ़रेंस प्रोवाइडर कनेक्ट करें।",
      notConfigured:
        "{{label}} सेट नहीं है। अपनी .env फ़ाइल में {{envKey}} जोड़ें। key यहाँ से लें: {{url}}",
      audioTooShort: "रिकॉर्डिंग बहुत छोटी है। बटन थोड़ी देर और दबाए रखें और साफ़ बोलें।",
      noAudioFile: "कोई ऑडियो फ़ाइल नहीं दी गई",
      internalError: "इंटरनल सर्वर एरर",
      noPublicId: "कोई पब्लिक ID नहीं मिली",
      pollFailed: "ट्रांसक्रिप्शन के नतीजे पोल नहीं हो पाए",
      failed: "ट्रांसक्रिप्शन फ़ेल हुआ",
      timeout: "ट्रांसक्रिप्शन टाइमआउट",
      creditsFailed: "क्रेडिट नहीं कट पाए: {{error}}",
      providerError:
        "ट्रांसक्रिप्शन सर्विस में एरर। दोबारा कोशिश करें, और दिक्कत बनी रहे तो सपोर्ट से संपर्क करें।",
      balanceCheckFailed: "आपका क्रेडिट बैलेंस जाँचा नहीं जा सका। दोबारा कोशिश करें",
      insufficientCredits:
        "इस ट्रांसक्रिप्शन के लिए आपके पास क्रेडिट कम हैं। जारी रखने के लिए और क्रेडिट जोड़ें",
    },
    success: {
      title: "सफल",
      description: "ऑडियो सफलतापूर्वक ट्रांसक्राइब हो गया",
      transcriptionComplete: "ट्रांसक्रिप्शन सफलतापूर्वक पूरा हुआ",
      transcribing: "ट्रांसक्राइब हो रहा है…",
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
    es: "स्पैनिश",
    sk: "स्लोवाक",
    hi: "हिंदी",
    fr: "फ़्रेंच",
    it: "इतालवी",
  },
  models: {
    descriptions: {
      qwen3Asr: "Qwen3 ASR से 30 भाषाओं और 22 चीनी बोलियों की स्पीच ट्रांसक्राइब करें।",
      parakeetV3:
        "ऑटोमैटिक भाषा पहचान और विराम चिह्नों के साथ 25 यूरोपीय भाषाएँ ट्रांसक्राइब करें।",
      nemotron35Transcribe:
        "NVIDIA Nemotron से 40 भाषाओं में एक घंटे तक का ऑडियो ट्रांसक्राइब करें।",
      openaiWhisper: "OpenAI Whisper: 99 भाषाओं के लिए बेहतरीन स्पीच रिकग्निशन",
      deepgramNova2: "Deepgram Nova-2: शोर में भी तेज़ और सटीक स्पीच-टू-टेक्स्ट",
      whisperLargeV3:
        "Whisper Large V3: OpenAI का ओपन-वेट मॉडल, 99 भाषाएँ, होस्टेड whisper-1 से कहीं सस्ता।",
      voxtralSmall: "Mistral के Voxtral Small से रिकॉर्ड की गई स्पीच ट्रांसक्राइब करें।",
      voxtralMini:
        "Voxtral Mini Transcribe: Mistral का ट्रांसक्रिप्शन, स्पीकर पहचान और सेगमेंट टाइमस्टैम्प के साथ, 10 मिनट तक।",
      nemotronAsr:
        "Nemotron ASR: NVIDIA का ओपन मल्टीलिंगुअल स्पीच रिकग्निशन, 40 लोकेल, कम लेटेंसी।",
      gpt4oMiniTranscribe:
        "GPT-4o Mini Transcribe: Whisper से कम वर्ड एरर रेट, बेहतर भाषा पहचान।",
    },
  },
};

export default translations;
