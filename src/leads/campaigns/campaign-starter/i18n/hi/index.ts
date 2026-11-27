import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "कैंपेन मैनेजमेंट",
  tag: "कैंपेन स्टार्टर",
  task: {
    description: "नई लीड्स को PENDING स्टेटस में ले जाकर उनके कैंपेन शुरू करें",
  },
  errors: {
    server: {
      title: "सर्वर एरर",
      description: "कैंपेन स्टार्टर रिक्वेस्ट प्रोसेस करते समय एरर आया",
    },
    invalidTransition: "कैंपेन शुरू करने के लिए स्टेटस ट्रांज़िशन गलत है",
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
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "डेटा टकराव हुआ",
    },
  },
  post: {
    title: "कैंपेन स्टार्टर",
    titleShort: "कैंपेन शुरू करें",
    description: "नई लीड्स के कैंपेन शुरू करें",
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
        description: "कैंपेन शुरू करते समय एरर आया",
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
      timezone: {
        label: "टाइमज़ोन",
        description: "घंटे बदलने के लिए ब्राउज़र टाइमज़ोन",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "बदलाव किए बिना चलाएँ",
      },
      force: {
        label: "ज़बरदस्ती",
        description: "दिन/घंटे की शेड्यूल पाबंदियाँ नज़रअंदाज़ करें",
      },
    },
    response: {
      leadsProcessed: "प्रोसेस हुई लीड",
      leadsStarted: "शुरू हुई लीड्स",
      leadsSkipped: "छोड़ी गई लीड्स",
      executionTimeMs: "एक्ज़ीक्यूशन समय (ms)",
      errors: "एरर",
      quotaDetails: "कोटा की जानकारी",
    },
    success: {
      title: "कैंपेन स्टार्टर पूरा हुआ",
      description: "कैंपेन स्टार्टर सफलतापूर्वक चला",
    },
  },
  get: {
    title: "कैंपेन स्टार्टर कॉन्फ़िग देखें",
    titleShort: "कैंपेन कॉन्फ़िग",
    description: "कैंपेन स्टार्टर का कॉन्फ़िगरेशन लाएँ",
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
    fields: {
      timezone: {
        label: "टाइमज़ोन",
        description: "घंटे बदलने के लिए ब्राउज़र टाइमज़ोन",
      },
    },
    response: {
      dryRun: "ड्राई रन मोड",
      minAgeHours: "न्यूनतम उम्र (घंटे)",
      enabledDays: "चालू दिन",
      enabledHours: "चालू घंटे",
      localeConfig: "लोकेल कॉन्फ़िगरेशन",
      leadsPerWeek: "प्रति हफ़्ता लीड्स",
      schedule: "शेड्यूल",
      enabled: "चालू",
      priority: "प्राथमिकता",
      timeout: "टाइमआउट",
      retries: "रीट्राई",
      retryDelay: "रीट्राई में देरी",
    },
    success: {
      title: "कॉन्फ़िग सफलतापूर्वक मिला",
      description: "कैंपेन स्टार्टर कॉन्फ़िगरेशन मिल गया",
    },
  },
  put: {
    title: "कैंपेन स्टार्टर कॉन्फ़िग",
    description: "कैंपेन स्टार्टर कॉन्फ़िगरेशन अपडेट करें",
    dryRun: {
      label: "ड्राई रन मोड",
      description: "टेस्टिंग के लिए ड्राई रन मोड चालू करें",
    },
    minAgeHours: {
      label: "न्यूनतम उम्र (घंटे)",
      description: "लीड्स प्रोसेस करने से पहले की न्यूनतम उम्र (घंटे में)",
    },
    enabledDays: {
      label: "चालू दिन",
      description: "हफ़्ते के वे दिन जब कैंपेन चालू हैं",
      monday: "सोमवार",
      tuesday: "मंगलवार",
      wednesday: "बुधवार",
      thursday: "गुरुवार",
      friday: "शुक्रवार",
      saturday: "शनिवार",
      sunday: "रविवार",
    },
    enabledHours: {
      label: "चालू घंटे",
      description: "दिन के वे घंटे जब कैंपेन चालू हैं",
      start: {
        label: "शुरुआती घंटा",
        description: "दिन का वह घंटा जब कैंपेन शुरू होते हैं (0-23)",
      },
      end: {
        label: "अंतिम घंटा",
        description: "दिन का वह घंटा जब कैंपेन ख़त्म होते हैं (0-23)",
      },
    },
    localeConfig: {
      label: "लोकेल कॉन्फ़िगरेशन",
      description: "हर लोकेल की सेटिंग: प्रति हफ़्ता लीड्स, चालू दिन और चालू घंटे",
    },
    leadsPerWeek: {
      label: "प्रति हफ़्ता लीड्स",
      description: "प्रति हफ़्ता प्रोसेस होने वाली लीड्स की अधिकतम संख्या",
    },
    schedule: {
      label: "शेड्यूल",
      description: "कैंपेन चलाने का शेड्यूल",
    },
    enabled: {
      label: "चालू",
      description: "कैंपेन स्टार्टर चालू या बंद करें",
    },
    priority: {
      label: "प्राथमिकता",
      description: "कैंपेन चलाने की प्राथमिकता",
    },
    timeout: {
      label: "टाइमआउट",
      description: "टाइमआउट वैल्यू (मिलीसेकंड में)",
    },
    retries: {
      label: "रीट्राई",
      description: "रीट्राई कोशिशों की संख्या",
    },
    retryDelay: {
      label: "रीट्राई में देरी",
      description: "रीट्राई के बीच मिलीसेकंड में देरी",
    },
    success: {
      title: "कॉन्फ़िग सेव हुआ",
      description: "कैंपेन स्टार्टर कॉन्फ़िगरेशन सेव हो गया",
    },
  },
  priority: {
    critical: "क्रिटिकल",
    high: "हाई",
    medium: "मीडियम",
    low: "लो",
    background: "बैकग्राउंड",
    filter: {
      all: "सभी प्राथमिकताएँ",
      highAndAbove: "हाई और उससे ऊपर",
      mediumAndAbove: "मीडियम और उससे ऊपर",
    },
  },
  widget: {
    on: "चालू",
    off: "बंद",
    title: "कैंपेन स्टार्टर",
    titleSaved: "कॉन्फ़िगरेशन सेव हुआ",
    description: "उन नई लीड्स के कैंपेन शुरू करें जिनसे संपर्क करने का समय आ गया है।",
    saving: "सेव हो रहा है...",
    save: "सेटिंग्स सेव करें",
    addLocale: "+ लोकेल जोड़ें",
    guidanceTitle: "कैंपेन स्टार्टर सेट करें",
    guidanceDescription:
      "शेड्यूल, चालू दिन/घंटे, प्रति हफ़्ता लीड्स के लक्ष्य और क्रॉन टास्क की सेटिंग्स तय करें।",
    runButton: "कैंपेन शुरू करें",
    running: "चल रहा है...",
    done: "हो गया",
    perRunBudget: "~{{perRunBudget}} लीड्स/रन · {{totalRunsPerWeek}} रन/हफ़्ता",
    perRunBudgetFractional:
      "{{exactBudget}}/रन · {{totalRunsPerWeek}} रन/हफ़्ता (भिन्नात्मक, रन में जुड़ता जाता है)",
    perRunBudgetZeroHint: "leads/week बढ़ाएँ या शेड्यूल की आवृत्ति घटाएँ",
    sections: {
      general: "सामान्य",
      generalDescription: "कैंपेन स्टार्टर और ड्राई रन मोड चालू करने के मास्टर कंट्रोल।",
      schedule: "शेड्यूल",
      scheduleDescription: "कैंपेन कब चलें? क्रॉन शेड्यूल, चालू दिन और घंटे सेट करें।",
      hoursTimezoneNote:
        "घंटे आपके ब्राउज़र टाइमज़ोन ({{offset}}) में हैं। सर्वर पर UTC में स्टोर होते हैं।",
      quotas: "कोटा",
      quotasDescription: "हर हफ़्ते कितनी लीड्स प्रोसेस करनी हैं, लोकेल के हिसाब से।",
      advanced: "एडवांस्ड",
      advancedDescription:
        "प्राथमिकता, टाइमआउट और रीट्राई जैसी टास्क एक्ज़ीक्यूशन सेटिंग्स।",
    },
    days: {
      mon: "सोम",
      tue: "मंगल",
      wed: "बुध",
      thu: "गुरु",
      fri: "शुक्र",
      sat: "शनि",
      sun: "रवि",
    },
  },
};
