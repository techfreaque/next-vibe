import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    video: "वीडियो",
    generation: "जनरेशन",
    ai: "AI",
  },
  post: {
    title: "वीडियो बनाएँ",
    titleShort: "वीडियो बनाएँ",
    dynamicTitle: "वीडियो: {{prompt}}",
    description:
      "टेक्स्ट प्रॉम्प्ट से वीडियो बनाएँ। सभी वीडियो मॉडल और उनकी क्षमताएँ देखने के लिए models टूल (modelType=video) इस्तेमाल करें: supportedDurations (क्लिप की मान्य लंबाई, सेकंड में), supportedAspectRatios, supportedFrameImages (first_frame/last_frame = इमेज-टू-वीडियो सपोर्ट)। वीडियो को दिशा देने के लिए frameReferences दें: role 'first' शुरुआती फ़्रेम तय करता है और role 'last' आख़िरी फ़्रेम। दोनों इमेज URL ही होने चाहिए (सिर्फ़ last_frame सपोर्ट वाले मॉडल पर)। role 'reference' (या कोई role नहीं) गाइड करने वाली इमेज, ऑडियो या वीडियो देता है। जो मॉडल सपोर्ट करते हैं उन पर negativePrompt दें। videoUrl लौटाता है।",
    form: {
      title: "वीडियो जनरेशन",
      description: "वीडियो बनाने के लिए प्रॉम्प्ट लिखें",
    },
    prompt: {
      label: "प्रॉम्प्ट",
      description: "बताएँ कि कैसा वीडियो बनाना है",
      placeholder: "सूर्यास्त के वक़्त पहाड़ी झील का सिनेमैटिक शॉट...",
    },
    model: {
      label: "मॉडल",
      description:
        "वीडियो मॉडल की id। यूज़र का डिफ़ॉल्ट इस्तेमाल करने के लिए खाली छोड़ें। मॉडल और उनकी क्षमताएँ देखने के लिए models टूल (modelType=video) इस्तेमाल करें।",
    },
    duration: {
      label: "अवधि",
      description: "बनने वाली वीडियो क्लिप की लंबाई",
      short: "छोटी (~5 सेकंड)",
      medium: "मध्यम (~10 सेकंड)",
      long: "लंबी (~15 सेकंड)",
    },
    aspectRatio: {
      label: "एस्पेक्ट रेशियो",
      description: "आउटपुट वीडियो का एस्पेक्ट रेशियो",
    },
    resolution: {
      label: "रेज़ोल्यूशन",
      description: "आउटपुट वीडियो का रेज़ोल्यूशन",
    },
    frameReferences: {
      label: "फ़्रेम रेफ़रेंस",
      description:
        "वीडियो को दिशा देने वाले रेफ़रेंस। हर एंट्री { url, role } होती है। role 'first' सटीक शुरुआती फ़्रेम तय करता है और role 'last' सटीक आख़िरी फ़्रेम (last_frame सपोर्ट चाहिए)। शुरू और अंत के फ़्रेम सिर्फ़ इमेज हो सकते हैं, इसलिए दोनों इमेज URL ही होने चाहिए। role 'reference' (या कोई role नहीं) गाइड करने वाला असेट है, जो इमेज, ऑडियो या वीडियो URL हो सकता है। इसका टाइप URL से अपने आप पहचाना जाता है (.mp4/.webm/.mov वीडियो, ऑडियो फ़ाइलें ऑडियो, बाकी सब इमेज)। first या reference इमेज हो तो ज़रूरत पड़ने पर सर्वर सबसे सस्ते इमेज-सक्षम मॉडल पर चला जाता है।",
      placeholder: "https://example.com/first-frame.jpg",
    },
    negativePrompt: {
      label: "नेगेटिव प्रॉम्प्ट",
      description:
        "वीडियो से क्या बाहर रखना है। सिर्फ़ उन मॉडल को भेजा जाता है जो negative_prompt या negativePrompt लेते हैं, बाकी पर नज़रअंदाज़ होता है।",
      placeholder: "धुंधला, कम क्वालिटी, बिगड़ा हुआ...",
    },

    download: "डाउनलोड करें",
    generatingNote: "वीडियो बनने में 1–3 मिनट लग सकते हैं",
    backButton: {
      label: "वापस",
    },
    submitButton: {
      text: "वीडियो बनाएँ",
      label: "वीडियो बनाएँ",
      loadingText: "बन रहा है...",
    },
    response: {
      videoUrl: "बनाए गए वीडियो का URL",
      creditCost: "खर्च हुए क्रेडिट",
      durationSeconds: "अवधि (सेकंड में)",
      jobId: "Async जॉब ID",
    },
    errors: {
      referenceNotImage:
        "{{host}} का लिंक एक वेब पेज खोलता है, इमेज फ़ाइल नहीं। इमेज का सीधा लिंक दें (इमेज पर राइट-क्लिक करके इमेज एड्रेस कॉपी करें) या इमेज अपलोड करें।",
      referenceUnreachable:
        "{{host}} का इमेज लिंक लोड नहीं हो रहा (HTTP {{status}})। लिंक जांचें या इमेज अपलोड करें। आपसे कोई शुल्क नहीं लिया गया।",
      modelDiscontinued:
        "{{model}} को उसके प्रोवाइडर ने बंद कर दिया है, अब यह वीडियो नहीं बनाता। कोई दूसरा वीडियो मॉडल चुनें। आपसे कोई शुल्क नहीं लिया गया।",
      referenceStagingFailed:
        "वीडियो प्रोवाइडर इनपुट इमेज नहीं ले सका। फिर से कोशिश करें या कोई दूसरा वीडियो मॉडल चुनें। आपसे कोई शुल्क नहीं लिया गया।",
      referenceUnavailable:
        "इनपुट इमेज उपलब्ध नहीं है। या तो हटा दी गई है, या ऐसी चैट की है जिसे आप खोल नहीं सकते। इसी चैट की कोई इमेज इस्तेमाल करें या दोबारा अपलोड करें।",
      validation_failed: {
        title: "वैलिडेशन एरर",
        description: "अपना प्रॉम्प्ट और सेटिंग्स जाँचें",
      },
      network_error: {
        title: "नेटवर्क एरर",
        description: "वीडियो जनरेशन सर्विस से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "वीडियो बनाने के लिए साइन इन करें",
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
        description: "वीडियो जनरेशन के दौरान अनपेक्षित एरर आया",
      },
      unknown_error: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      unsaved_changes: {
        title: "बिना सेव किए बदलाव",
        description: "वीडियो बनाने से पहले अपने बदलाव सेव करें",
      },
      conflict: {
        title: "टकराव",
        description: "वीडियो जनरेशन के दौरान टकराव हो गया",
      },
      notAVideoModel:
        "चुना गया मॉडल वीडियो जनरेशन सपोर्ट नहीं करता। कोई वीडियो मॉडल चुनें।",
      notConfigured:
        "{{label}} सेट नहीं है। अपनी .env फ़ाइल में {{envKey}} जोड़ें। key यहाँ से लें: {{url}}",
      providerUnsupported: "{{label}} अभी सपोर्टेड नहीं है",
      modelUnavailable: "यह मॉडल अभी कुछ समय के लिए उपलब्ध नहीं है। दूसरा मॉडल चुनें।",
      insufficientCredits: "क्रेडिट कम हैं। बैलेंस: {{balance}}, ज़रूरी: {{minimum}}",
      balanceCheckFailed: "आपका क्रेडिट बैलेंस जाँचा नहीं जा सका",
      unsupportedDuration:
        "मॉडल {{model}} अवधि {{duration}} सपोर्ट नहीं करता। सपोर्टेड अवधि: {{supported}}",
      unsupportedAspectRatio:
        "मॉडल {{model}} एस्पेक्ट रेशियो {{aspectRatio}} सपोर्ट नहीं करता। सपोर्टेड रेशियो: {{supported}}",
      unsupportedResolution:
        "मॉडल {{model}} रेज़ोल्यूशन {{resolution}} सपोर्ट नहीं करता। सपोर्टेड रेज़ोल्यूशन: {{supported}}",
      generationFailed: "वीडियो जनरेशन फ़ेल हो गया: {{error}}",
      providerError: "वीडियो प्रोवाइडर एरर: {{error}}",
      noVideoUrl: "प्रोवाइडर ने कोई वीडियो URL नहीं लौटाया",
      generationFailedUnknown:
        "वीडियो जनरेशन फ़ेल हो गया और प्रोवाइडर ने कोई वजह नहीं बताई",
      providerErrorUnknown: "वीडियो प्रोवाइडर बिना किसी एरर मैसेज के फ़ेल हो गया",
      nonJsonResponse:
        "वीडियो प्रोवाइडर ने non-JSON रिस्पॉन्स लौटाया (HTTP {{status}}): {{body}}",
      providerHttpError: "वीडियो प्रोवाइडर ने HTTP {{status}} लौटाया: {{body}}",
      jobFailedStatus: "वीडियो जॉब इस स्टेटस के साथ खत्म हुआ: {{status}}",
      requestAborted: "वीडियो जनरेशन रद्द हो गया",
      requestTimedOut: "वीडियो जनरेशन का इंतज़ार करते हुए टाइमआउट हो गया",
      contentRejected:
        "वीडियो प्रोवाइडर के कंटेंट फ़िल्टर ने मना कर दिया: {{error}}। यह इनकार है, आउटेज नहीं। प्रॉम्प्ट बदलकर लिखें या कम फ़िल्टर वाला मॉडल चुनें। आपसे कोई चार्ज नहीं लिया गया।",
      providerOutage:
        "वीडियो प्रोवाइडर अभी डाउन है या ओवरलोड है: {{error}}। यह आउटेज है, इनकार नहीं। एक मिनट बाद फिर कोशिश करें या दूसरा मॉडल चुनें। आपसे कोई चार्ज नहीं लिया गया।",
      consentRequired:
        "इनपुट में असली चेहरों के लिए वीडियो प्रोवाइडर सहमति की पुष्टि माँग रहा है: {{error}}। ऐसी इमेज इस्तेमाल करें जिसमें किसी असली इंसान का चेहरा न हो, या दूसरा वीडियो मॉडल चुनें। आपसे कोई चार्ज नहीं लिया गया।",
      storageFailed:
        "वीडियो बन गया लेकिन सेव नहीं हो पाया। आपसे कोई चार्ज नहीं लिया गया। दोबारा कोशिश करें।",
      creditsFailed: "वीडियो जनरेशन के क्रेडिट नहीं कट पाए",
      imageRequiredForModel:
        "{{model}} इमेज को एनिमेट करता है। शुरुआती इमेज जोड़ें, फिर दोबारा बनाएँ।",
      inputMediaRequired:
        "इस मॉडल को इनपुट इमेज URL चाहिए। एनिमेट करने के लिए इमेज का लिंक पेस्ट करें।",
      imageInputUnsupported:
        "वीडियो मॉडल {{model}} ने इनपुट इमेज ठुकरा दी, शायद वह इमेज-टू-वीडियो सपोर्ट नहीं करता। generate_video को model पैरामीटर के बिना दोबारा चलाएँ (डिफ़ॉल्ट मॉडल इमेज को एनिमेट करता है), या इमेज हटा दें।",
      noImageCapableModel:
        "यहाँ कोई भी वीडियो मॉडल रेफ़रेंस इमेज नहीं लेता। सिर्फ़ प्रॉम्प्ट से बनाने के लिए इमेज हटा दें।",
    },
    success: {
      title: "वीडियो बन गया",
      description: "आपका वीडियो सफलतापूर्वक बन गया",
    },
  },
};
