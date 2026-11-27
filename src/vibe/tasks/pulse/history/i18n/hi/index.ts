import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "टास्क मैनेजमेंट",

  tags: {
    pulse: "पल्स",
    monitoring: "मॉनिटरिंग",
  },

  errors: {
    fetchCronTaskHistory: "पल्स एक्ज़ीक्यूशन हिस्ट्री नहीं मिल सकी",
  },

  get: {
    title: "पल्स एक्ज़ीक्यूशन हिस्ट्री",
    titleShort: "पल्स हिस्ट्री",
    description: "पुराने पल्स एक्ज़ीक्यूशन चक्र देखें",
    fields: {
      startDate: {
        label: "शुरुआती तारीख़",
        description: "इस तारीख़ के बाद के पल्स चक्र फ़िल्टर करें",
      },
      endDate: {
        label: "अंतिम तारीख़",
        description: "इस तारीख़ से पहले के पल्स चक्र फ़िल्टर करें",
      },
      status: {
        label: "स्थिति",
        description: "एक्ज़ीक्यूशन स्थिति से फ़िल्टर करें",
        placeholder: "सभी स्थितियाँ",
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
      executions: { title: "पल्स एक्ज़ीक्यूशन" },
      totalCount: { title: "कुल गिनती" },
      hasMore: { title: "और नतीजे हैं" },
      summary: { title: "एक्ज़ीक्यूशन सारांश" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिए गए रिक्वेस्ट पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "पल्स हिस्ट्री लाते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको पल्स हिस्ट्री देखने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "पल्स हिस्ट्री का एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "पल्स एक्ज़ीक्यूशन रिकॉर्ड नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव हुआ",
      },
    },
    success: {
      title: "हिस्ट्री मिल गई",
      description: "पल्स एक्ज़ीक्यूशन हिस्ट्री सफलतापूर्वक मिल गई",
    },
  },
  pulse: {
    execution: {
      success: "सफल",
      failure: "विफलता",
      timeout: "टाइमआउट",
      cancelled: "रद्द",
      pending: "लंबित",
    },
  },
  widget: {
    taskNameUnavailable: "टास्क का नाम उपलब्ध नहीं",
    title: "पल्स हिस्ट्री",
    empty: "कोई पल्स एक्ज़ीक्यूशन नहीं मिला",
    details: "ब्योरा",
    discovered: "{{count}} खोजे गए",
    due: "{{count}} देय",
    succeeded: "{{count}} ठीक",
    failed: "{{count}} फ़ेल",
    tasksExecuted: "चलाया गया",
    tasksSucceeded: "सफल",
    tasksFailed: "फ़ेल",
    tasksSkipped: "छोड़ा गया",
    header: {
      cronHistory: "Cron हिस्ट्री",
      stats: "आँकड़े",
      refresh: "रिफ़्रेश",
    },
    summary: {
      total: "कुल",
      successful: "सफल",
      failed: "फ़ेल",
      successRate: "सफलता दर",
      avgDuration: "औसत अवधि",
    },
    filter: {
      all: "सभी",
      success: "सफल",
      failure: "फ़ेल",
      timeout: "टाइमआउट",
    },
    pagination: {
      info: "पेज {{page}} / {{totalPages}} (कुल {{total}})",
      prev: "पिछला",
      next: "अगला",
    },
  },
};
