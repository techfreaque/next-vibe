import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "कैंपेन मैनेजमेंट",
  tag: "बाउंस प्रोसेसर",
  task: {
    description: "IMAP इनबॉक्स में बाउंस नोटिफ़िकेशन खोजें और लीड का स्टेटस BOUNCED करें",
  },
  errors: {
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    forbidden: {
      title: "अनुमति नहीं",
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
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर आया",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर आया",
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
    title: "बाउंस प्रोसेसर",
    titleShort: "बाउंस प्रोसेस करें",
    description: "IMAP से ईमेल बाउंस नोटिफ़िकेशन प्रोसेस करें",
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एक्सेस मना है" },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "बाउंस प्रोसेस करते समय एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
      conflict: { title: "टकराव", description: "डेटा टकराव हुआ" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    fields: {
      dryRun: {
        label: "ड्राई रन",
        description: "बदलाव किए बिना चलाएँ",
      },
      batchSize: {
        label: "बैच साइज़",
        description: "हर रन में प्रोसेस होने वाले बाउंस ईमेल की अधिकतम संख्या",
      },
    },
    response: {
      bouncesFound: "मिले बाउंस",
      leadsUpdated: "अपडेट हुई लीड",
      campaignsCancelled: "रद्द हुए कैंपेन",
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "सेटिंग्स सेव करें",
      loadingText: "सेव हो रहा है...",
    },
    success: {
      title: "बाउंस प्रोसेसिंग पूरी हुई",
      description: "बाउंस नोटिफ़िकेशन सफलतापूर्वक प्रोसेस हुए",
    },
  },
  get: {
    title: "बाउंस प्रोसेसर कॉन्फ़िग पाएँ",
    titleShort: "बाउंस कॉन्फ़िग",
    description: "बाउंस प्रोसेसर बैकग्राउंड टास्क का कॉन्फ़िग निकालें",
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एक्सेस मना है" },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
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
      schedule: "शेड्यूल",
      priority: "प्राथमिकता",
      timeout: "टाइमआउट",
      retries: "रीट्राई",
      retryDelay: "रीट्राई में देरी",
    },
    backButton: {
      label: "वापस",
    },
    success: {
      title: "कॉन्फ़िग सफलतापूर्वक मिला",
      description: "बाउंस प्रोसेसर कॉन्फ़िगरेशन सफलतापूर्वक मिल गया",
    },
  },
  put: {
    title: "बाउंस प्रोसेसर कॉन्फ़िग",
    description: "बाउंस प्रोसेसर बैकग्राउंड टास्क का कॉन्फ़िग अपडेट करें",
    enabled: {
      label: "चालू",
      description: "बाउंस प्रोसेसर बैकग्राउंड टास्क चालू या बंद करें",
    },
    dryRun: {
      label: "ड्राई रन मोड",
      description: "लीड स्टेटस बदले बिना बाउंस स्कैन करें",
    },
    batchSize: {
      label: "बैच साइज़",
      description: "हर रन में प्रोसेस होने वाले बाउंस ईमेल की अधिकतम संख्या (1-500)",
    },
    schedule: {
      label: "शेड्यूल",
      description: "बाउंस प्रोसेसर कब चले, इसके लिए क्रॉन एक्सप्रेशन",
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
      description: "फ़ेल होने पर रीट्राई कोशिशों की संख्या",
    },
    retryDelay: {
      label: "रीट्राई में देरी (ms)",
      description: "रीट्राई के बीच मिलीसेकंड में देरी",
    },
    success: {
      title: "कॉन्फ़िग सेव हुआ",
      description: "बाउंस प्रोसेसर कॉन्फ़िगरेशन सफलतापूर्वक सेव हो गया",
    },
  },
  priority: {
    critical: "क्रिटिकल",
    high: "हाई",
    medium: "मीडियम",
    low: "लो",
    background: "बैकग्राउंड",
  },
  widget: {
    title: "बाउंस प्रोसेसर कॉन्फ़िगरेशन",
    titleSaved: "कॉन्फ़िगरेशन सेव हुआ",
    saving: "सेव हो रहा है...",
    save: "सेटिंग्स सेव करें",
    guidanceTitle: "बाउंस प्रोसेसर बैकग्राउंड टास्क कॉन्फ़िगर करें",
    guidanceDescription:
      "बाउंस प्रोसेसर क्रॉन टास्क चालू या बंद करें, और उसका शेड्यूल और बैच सेटिंग तय करें।",
    runButton: "अभी चलाएँ",
    running: "चल रहा है...",
    done: "हो गया",
    sections: {
      general: "सामान्य",
      generalDescription: "बाउंस प्रोसेसर टास्क और ड्राई रन मोड के मुख्य कंट्रोल।",
      schedule: "शेड्यूल",
      scheduleDescription: "बाउंस कब प्रोसेस हों, इसका क्रॉन शेड्यूल सेट करें।",
      processing: "प्रोसेस हो रहा है",
      processingDescription: "हर रन में कितने बाउंस ईमेल प्रोसेस हों, यह तय करें।",
      advanced: "एडवांस्ड",
      advancedDescription:
        "प्राथमिकता, टाइमआउट और रीट्राई जैसी टास्क एक्ज़ीक्यूशन सेटिंग्स।",
    },
  },
};
