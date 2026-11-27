import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "कैंपेन मैनेजमेंट",
  tag: "ईमेल कैंपेन",
  task: {
    description: "लीड के चरण और समय के आधार पर ऑटोमैटिक ईमेल कैंपेन भेजें",
  },
  errors: {
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    forbidden: {
      title: "मना है",
      description: "एक्सेस मना है",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "रिक्वेस्ट के पैरामीटर गलत हैं",
    },
    server: {
      title: "सर्वर एरर",
      description: "आंतरिक सर्वर एरर हुई",
    },
    unknown: {
      title: "अनजान एरर",
      description: "कोई अनजान एरर आई",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर हुई",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "डेटा टकराव हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
  },
  post: {
    title: "ईमेल कैंपेन",
    titleShort: "कैंपेन भेजें",
    description: "लीड के लिए ईमेल कैंपेन प्रोसेस करें",
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एक्सेस मना है" },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
      conflict: { title: "टकराव", description: "डेटा टकराव हुआ" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    fields: {
      batchSize: {
        label: "बैच साइज़",
        description: "हर बैच में प्रोसेस होने वाली लीड की संख्या",
      },
      maxEmailsPerRun: {
        label: "हर रन में अधिकतम ईमेल",
        description: "हर रन में भेजे जाने वाले ईमेल की अधिकतम संख्या",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "ईमेल भेजे बिना चलाएँ",
      },
    },
    response: {
      emailsScheduled: "तय ईमेल",
      emailsSent: "भेजे गए ईमेल",
      emailsFailed: "फ़ेल हुए ईमेल",
      leadsProcessed: "प्रोसेस हुई लीड",
    },
    success: {
      title: "सफल",
      description: "कार्रवाई सफलतापूर्वक पूरी हुई",
    },
  },
  get: {
    title: "ईमेल कैंपेन कॉन्फ़िग लाएँ",
    titleShort: "ईमेल कैंपेन कॉन्फ़िग",
    description: "ईमेल कैंपेन बैकग्राउंड टास्क का कॉन्फ़िगरेशन लाएँ",
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एक्सेस मना है" },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
      conflict: { title: "टकराव", description: "डेटा टकराव हुआ" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    response: {
      enabled: "चालू",
      dryRun: "ड्राई रन मोड",
      batchSize: "बैच साइज़",
      maxEmailsPerRun: "हर रन में अधिकतम ईमेल",
      schedule: "शेड्यूल",
      priority: "प्राथमिकता",
      timeout: "टाइमआउट",
      retries: "रीट्राई",
      retryDelay: "रीट्राई में देरी",
    },
    success: {
      title: "कॉन्फ़िग सफलतापूर्वक मिला",
      description: "ईमेल कैंपेन का कॉन्फ़िगरेशन सफलतापूर्वक मिल गया",
    },
  },
  put: {
    title: "ईमेल कैंपेन कॉन्फ़िग",
    description: "ईमेल कैंपेन बैकग्राउंड टास्क का कॉन्फ़िगरेशन अपडेट करें",
    enabled: {
      label: "चालू",
      description: "ईमेल कैंपेन बैकग्राउंड टास्क चालू या बंद करें",
    },
    dryRun: {
      label: "ड्राई रन मोड",
      description: "ईमेल असल में भेजे बिना प्रोसेस करें",
    },
    batchSize: {
      label: "बैच साइज़",
      description: "हर बैच में प्रोसेस होने वाली लीड की संख्या (1–100)",
    },
    maxEmailsPerRun: {
      label: "हर रन में अधिकतम ईमेल",
      description: "हर बैकग्राउंड रन में भेजे जाने वाले ईमेल की अधिकतम संख्या (1–1000)",
    },
    schedule: {
      label: "शेड्यूल",
      description: "ईमेल कैंपेन कब चलें, इसके लिए cron एक्सप्रेशन",
    },
    priority: {
      label: "प्राथमिकता",
      description: "टास्क एक्ज़ीक्यूशन का प्राथमिकता स्तर",
    },
    timeout: {
      label: "टाइमआउट (ms)",
      description: "मिलीसेकंड में अधिकतम एक्ज़ीक्यूशन समय",
    },
    retries: {
      label: "रीट्राई",
      description: "फ़ेल होने पर रीट्राई की संख्या",
    },
    retryDelay: {
      label: "रीट्राई में देरी (ms)",
      description: "रीट्राई के बीच मिलीसेकंड में देरी",
    },
    success: {
      title: "कॉन्फ़िग सेव हुआ",
      description: "ईमेल कैंपेन का कॉन्फ़िगरेशन सफलतापूर्वक सेव हुआ",
    },
  },
  priority: {
    critical: "अत्यंत ज़रूरी",
    high: "ऊँची",
    medium: "मध्यम",
    low: "कम",
    background: "बैकग्राउंड",
  },
  widget: {
    title: "ईमेल कैंपेन कॉन्फ़िगरेशन",
    titleSaved: "कॉन्फ़िगरेशन सेव हुआ",
    saving: "सेव हो रहा है...",
    save: "सेटिंग्स सेव करें",
    guidanceTitle: "ईमेल कैंपेन बैकग्राउंड टास्क कॉन्फ़िगर करें",
    guidanceDescription:
      "ईमेल कैंपेन cron टास्क चालू या बंद करें और उसका शेड्यूल, बैच साइज़ और एक्ज़ीक्यूशन सेटिंग्स तय करें।",
    runButton: "अभी चलाएँ",
    running: "चल रहा है...",
    done: "हो गया",
    sections: {
      general: "सामान्य",
      generalDescription: "ईमेल कैंपेन टास्क और ड्राई रन मोड चालू करने के मुख्य कंट्रोल।",
      schedule: "शेड्यूल",
      scheduleDescription: "ईमेल कब भेजे जाएँ, इसका cron शेड्यूल सेट करें।",
      processing: "प्रोसेस हो रहा है",
      processingDescription: "तय करें कि हर रन में कितनी लीड और ईमेल प्रोसेस हों।",
      advanced: "एडवांस्ड",
      advancedDescription:
        "प्राथमिकता, टाइमआउट और रीट्राई जैसी टास्क एक्ज़ीक्यूशन सेटिंग्स।",
    },
  },
};
