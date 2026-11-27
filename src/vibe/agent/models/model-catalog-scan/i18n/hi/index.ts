import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एजेंट",
  tags: {
    models: "मॉडल",
  },

  get: {
    title: "मॉडल कैटलॉग स्कैन",
    titleShort: "कैटलॉग स्कैन",
    description:
      "हर प्रोवाइडर की मॉडल लिस्ट का ताज़ा स्कैन: अपस्ट्रीम के नए मॉडल जो हम अभी नहीं चलाते, कीमत में बदलाव, हटाए गए id और घोषित शटडाउन। सिर्फ़ पढ़ने के लिए।",
    success: {
      title: "स्कैन लोड हो गया",
      description: "ताज़ा मॉडल कैटलॉग स्कैन लोड हो गया।",
    },
  },

  post: {
    title: "मॉडल कैटलॉग स्कैन चलाएँ",
    titleShort: "स्कैन चलाएँ",
    description:
      "अभी हर प्रोवाइडर की मॉडल लिस्ट और लाइव कीमतें लाएँ, उन्हें हमारी परिभाषाओं से मिलाएँ, रिपोर्ट सेव करें और ops इनबॉक्स में मेल करें। कोड कभी एडिट नहीं करता।",
    fields: {
      force: {
        label: "हाल का हो तब भी चलाएँ",
        description:
          "5 दिन की रोक छोड़ें। इसके बिना 5 दिन से कम पुराना स्कैन जैसा है वैसा लौटा दिया जाता है।",
      },
      sendEmail: {
        label: "रिपोर्ट ईमेल करें",
        description: "रिपोर्ट hi@ और thea@unbottled.ai को मेल करें।",
      },
    },
    success: {
      title: "स्कैन पूरा हुआ",
      description: "मॉडल कैटलॉग स्कैन सेव हो गया।",
    },
  },

  response: {
    scan: "स्कैन",
    report: "रिपोर्ट",
    history: "पिछले स्कैन",
    skipped: "छोड़ा गया (हाल का स्कैन मौजूद)",
    reportText: "रिपोर्ट",
  },

  widget: {
    back: "वापस",
    runNow: "अभी स्कैन चलाएँ",
    running: "स्कैन हो रहा है...",
    empty: {
      title: "अभी कोई स्कैन नहीं",
      message:
        "पहला स्कैन अपने रोज़ के शेड्यूल पर चलेगा। अपस्ट्रीम में क्या बदला, देखने के लिए अभी चलाएँ।",
    },
    skipped:
      'पिछले 5 दिनों का स्कैन पहले से मौजूद है, इसलिए कुछ नया नहीं लाया गया। ज़बरदस्ती चलाने के लिए "हाल का हो तब भी चलाएँ" चुनें।',
    scannedAt: "स्कैन हुआ",
    newSince: "इसके बाद नया",
    emailedTo: "ईमेल भेजा गया",
    notEmailed: "ईमेल नहीं भेजा",
    emailError: "ईमेल फ़ेल हुआ",
    metrics: {
      newModels: "नए मॉडल",
      uncensored: "अनसेंसर्ड दिखते हैं",
      priceChanges: "कीमत में बदलाव",
      missing: "अपस्ट्रीम से गायब",
      deprecations: "घोषित शटडाउन",
      sourceErrors: "फ़ेल हुए सोर्स",
    },
    sections: {
      newModels: "अपस्ट्रीम के नए मॉडल",
      priceChanges: "कीमत और कॉन्टेक्स्ट में बदलाव",
      missing: "अपस्ट्रीम से गायब",
      deprecations: "घोषित शटडाउन",
      sources: "सोर्स",
      history: "पिछले स्कैन",
    },
    legacy: "पुराना",
    suspect: "संदिग्ध, fetcher जाँचें",
    uncensored: "अनसेंसर्ड",
    ok: "ठीक",
    failed: "फ़ेल",
    models: "मॉडल",
    perMillion: "प्रति 1M",
    context: "ctx",
    nothing: "यहाँ कुछ नहीं है।",
  },

  task: {
    name: "मॉडल कैटलॉग स्कैन",
    description:
      "हर 5 दिन में: प्रोवाइडर की मॉडल लिस्ट और कीमतों को हमारे कैटलॉग से मिलाएँ, रिपोर्ट सेव करें और मेल करें।",
  },

  errors: {
    scanFailed: "मॉडल कैटलॉग स्कैन फ़ेल हो गया: {{error}}",
    loadFailed: "मॉडल कैटलॉग स्कैन लोड नहीं हो पाया: {{error}}",
    server: {
      title: "सर्वर एरर",
      description: "स्कैन पूरा नहीं हो पाया। सर्वर लॉग जाँचें।",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "सर्वर तक नहीं पहुँच पाए।",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कुछ अनपेक्षित गड़बड़ हो गई।",
    },
    validation: {
      title: "गलत इनपुट",
      description: "स्कैन के विकल्प जाँचें।",
    },
    unauthorized: {
      title: "साइन इन नहीं हैं",
      description: "कैटलॉग स्कैन देखने के लिए एडमिन के तौर पर साइन इन करें।",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "कैटलॉग स्कैन सिर्फ़ एडमिन देख या चला सकते हैं।",
    },
    notFound: {
      title: "नहीं मिला",
      description: "कोई कैटलॉग स्कैन नहीं मिला।",
    },
    conflict: {
      title: "टकराव",
      description: "दूसरा स्कैन चल रहा है। थोड़ी देर में फिर कोशिश करें।",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव सेव करें या छोड़ दें।",
    },
  },
};
