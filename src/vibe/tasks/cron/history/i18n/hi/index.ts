import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "टास्क मैनेजमेंट",

  errors: {
    cronTaskNotFound: "cron टास्क नहीं मिला",
    repositoryInternalError: "इंटरनल एरर आया",
    fetchCronTaskHistoryDetail:
      "टास्क {{taskId}} की हिस्ट्री लोड नहीं हो सकी (लिमिट {{limit}}): {{error}}",
    fetchCronTaskHistoryAllDetail:
      "टास्क हिस्ट्री लोड नहीं हो सकी (लिमिट {{limit}}): {{error}}",
  },

  enums: {
    taskScope: {
      enabled: "सिर्फ़ चालू टास्क",
      all: "सभी टास्क, छिपे और बंद टास्क समेत",
    },
  },

  get: {
    tags: {
      tasks: "टास्क",
      monitoring: "मॉनिटरिंग",
    },
    title: "टास्क एक्ज़ीक्यूशन इतिहास",
    titleShort: "टास्क हिस्ट्री",
    description: "cron टास्क के पुराने एक्ज़ीक्यूशन रिकॉर्ड देखें",
    fields: {
      taskScope: {
        label: "टास्क स्कोप",
        description: "टास्क हेल्थ रिपोर्ट वाला स्कोप इस्तेमाल करें।",
      },
      taskId: {
        label: "टास्क ID",
        description: "किसी ख़ास टास्क ID से फ़िल्टर करें",
        placeholder: "टास्क ID डालें",
      },
      taskName: {
        label: "टास्क का नाम",
        description: "टास्क के नाम से फ़िल्टर करें (आंशिक मेल)",
        placeholder: "टास्क का नाम डालें",
      },
      status: {
        label: "एक्ज़ीक्यूशन स्टेटस",
        description: "एक्ज़ीक्यूशन स्टेटस से फ़िल्टर करें",
        placeholder: "स्टेटस चुनें",
        options: {
          PENDING: "पेंडिंग",
          SCHEDULED: "शेड्यूल्ड",
          RUNNING: "चल रहा है",
          COMPLETED: "पूरा हुआ",
          FAILED: "फ़ेल",
          ERROR: "एरर",
          TIMEOUT: "टाइमआउट",
          SKIPPED: "छोड़ा गया",
          CANCELLED: "रद्द",
          STOPPED: "रुके हुए",
          BLOCKED: "ब्लॉक",
        },
      },
      priority: {
        label: "टास्क प्राथमिकता",
        description: "टास्क की प्राथमिकता से फ़िल्टर करें",
        placeholder: "प्राथमिकताएँ चुनें",
        options: {
          LOW: "लो",
          MEDIUM: "मीडियम",
          HIGH: "हाई",
          CRITICAL: "क्रिटिकल",
        },
      },
      startDate: {
        label: "शुरू की तारीख",
        description: "इस तारीख़ के बाद के एक्ज़ीक्यूशन फ़िल्टर करें",
      },
      endDate: {
        label: "अंत की तारीख",
        description: "इस तारीख़ से पहले के एक्ज़ीक्यूशन फ़िल्टर करें",
      },
      limit: {
        label: "नतीजों की सीमा",
        description: "लौटाए जाने वाले नतीजों की अधिकतम संख्या",
        placeholder: "50",
      },
      offset: {
        label: "नतीजों का ऑफ़सेट",
        description: "पेजिनेशन के लिए छोड़े जाने वाले नतीजों की संख्या",
        placeholder: "0",
      },
    },
    response: {
      title: "टास्क इतिहास रिस्पॉन्स",
      description: "cron टास्क का ऐतिहासिक एक्ज़ीक्यूशन डेटा",
      executions: {
        title: "एक्ज़ीक्यूशन रिकॉर्ड",
      },
      totalCount: {
        title: "कुल गिनती",
      },
      hasMore: {
        title: "और नतीजे हैं",
      },
      statusCounts: {
        title: "स्टेटस की गिनती",
      },
      summary: {
        title: "एक्ज़ीक्यूशन सारांश",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      internal: {
        title: "इंटरनल सर्वर एरर",
        description: "टास्क इतिहास नहीं मिल सका",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपके पास टास्क इतिहास देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "टास्क या एक्ज़ीक्यूशन रिकॉर्ड नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "टास्क इतिहास लाते समय नेटवर्क एरर",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "टास्क इतिहास का एक्सेस मना है",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        titleChanges: "बिना सेव किए बदलाव",
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव हुआ",
      },
    },
    success: {
      title: "हिस्ट्री मिल गई",
      description: "टास्क एक्ज़ीक्यूशन इतिहास सफलतापूर्वक मिला",
    },
    log: {
      fetchSuccess: "{{count}} एक्ज़ीक्यूशन रिकॉर्ड सफलतापूर्वक मिले",
      fetchError: "टास्क एक्ज़ीक्यूशन इतिहास नहीं मिल सका",
    },
    request: {
      title: "रिक्वेस्ट पैरामीटर",
      description: "टास्क एक्ज़ीक्यूशन इतिहास फ़िल्टर करें",
    },
    unknownTask: "अज्ञात टास्क",
  },
  widget: {
    runDetails: "रन की जानकारी",
    runId: "रन ID",
    emptyFiltered:
      "इस व्यू में कोई रन नहीं मिला। टास्क, स्टेटस, प्रायोरिटी या तारीख़ें बदलकर देखें।",
    emptyUnfiltered: "टास्क शुरू होने के बाद उनके रन यहाँ दिखेंगे।",
    title: "टास्क एक्ज़ीक्यूशन इतिहास",
    loading: "इतिहास लोड हो रहा है...",
    header: {
      tasks: "टास्क",
      stats: "स्टैट्स",
      pulse: "पल्स",
      refresh: "रीफ़्रेश करें",
    },
    summary: {
      total: "मैच करने वाले रन",
      successful: "सफल",
      failed: "फ़ेल",
      successRate: "सफलता दर",
      avgDuration: "औसत अवधि",
    },
    search: {
      placeholder: "टास्क खोजें...",
    },
    filter: {
      clearTaskScope: "टास्क स्कोप हटाएँ",
      clear: "फ़िल्टर हटाएँ",
      allTasks: "सभी टास्क",
      allPriorities: "सभी प्रायोरिटी",
      taskHistory: "इस टास्क की हिस्ट्री",
      all: "सभी",
      running: "चल रहा है",
      completed: "पूरा हुआ",
      failed: "फ़ेल",
      timeout: "टाइमआउट",
      cancelled: "रद्द",
    },
    col: {
      taskName: "टास्क का नाम",
      status: "स्टेटस",
      duration: "अवधि",
      started: "शुरू हुआ",
      completed: "पूरा हुआ",
      environment: "एनवायरनमेंट",
      error: "एरर",
    },
    empty: "कोई एक्ज़ीक्यूशन इतिहास नहीं मिला",
    result: "नतीजा",
    error: {
      collapse: "एरर समेटें",
      label: "एरर",
    },
    pagination: {
      info: "पेज {{page}} / {{totalPages}} (कुल {{total}})",
      prev: "पिछला",
      next: "अगला",
    },
  },
};
