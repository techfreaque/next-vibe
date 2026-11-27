import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सर्वर मैनेजमेंट",

  tag: "हेल्थ",
  get: {
    title: "हेल्थ चेक",
    titleShort: "हेल्थ चेक",
    description: "सर्वर का हेल्थ स्टेटस और डायग्नोस्टिक्स देखें",
    form: {
      title: "हेल्थ चेक के विकल्प",
      description: "हेल्थ चेक के पैरामीटर सेट करें",
    },
    fields: {
      detailed: {
        title: "विस्तृत रिपोर्ट",
        description: "विस्तृत सिस्टम जानकारी शामिल करें",
      },
      includeDatabase: {
        title: "डेटाबेस शामिल करें",
        description: "डेटाबेस हेल्थ चेक शामिल करें",
      },
      includeTasks: {
        title: "टास्क शामिल करें",
        description: "टास्क रनर के हेल्थ चेक शामिल करें",
      },
      includeSystem: {
        title: "सिस्टम शामिल करें",
        description: "सिस्टम रिसोर्स की जानकारी शामिल करें",
      },
    },
    widget: {
      refresh: "हेल्थ चेक चलाएँ",
      health: {
        healthy: "स्वस्थ",
        warning: "चेतावनी",
        critical: "क्रिटिकल",
        unknown: "अज्ञात",
      },
      results: {
        pass: "पास",
        warn: "चेतावनी",
        fail: "फ़ेल",
      },
      checks: {
        traffic: "ट्रैफ़िक रेडीनेस",
        process: "सर्वर प्रोसेस",
      },
      messages: {
        draining: "ड्रेन हो रहा है। {{count}} स्ट्रीम अब भी चालू हैं।",
        accepting: "ट्रैफ़िक ले रहा है। {{count}} स्ट्रीम चालू हैं।",
        memory: "मेमोरी का इस्तेमाल ज़्यादा ({{usage}})।",
        processOk: "सर्वर सामान्य रूप से चल रहा है।",
        databaseOk: "डेटाबेस कनेक्शन सफल रहा।",
        databaseFailed: "डेटाबेस कनेक्शन फ़ेल हुआ।",
        tasksDisabled: "इस एनवायरनमेंट में टास्क रनर बंद है।",
        tasksOk: "टास्क रनर उपलब्ध है।",
        systemOk: "सिस्टम रिसोर्स ठीक हैं।",
      },
    },
    response: {
      status: {
        title: "स्टेटस",
        description: "कुल हेल्थ स्टेटस",
      },
      timestamp: {
        title: "जाँच का समय",
        description: "हेल्थ चेक का समय",
      },
      uptime: {
        title: "अपटाइम",
        description: "सर्वर प्रोसेस शुरू होने के बाद का समय",
      },
      revision: {
        title: "बिल्ड कमिट",
      },
      environment: {
        title: "एनवायरनमेंट",
        description: "सर्वर एनवायरनमेंट की जानकारी",
        name: {
          title: "एनवायरनमेंट का नाम",
        },
        nodeEnv: {
          title: "Node एनवायरनमेंट",
        },
        platform: {
          title: "प्लेटफ़ॉर्म",
        },
        supportsTaskRunners: {
          title: "टास्क रनर सपोर्ट",
        },
      },
      database: {
        title: "डेटाबेस स्टेटस",
        description: "डेटाबेस कनेक्शन स्टेटस",
        status: {
          title: "कनेक्शन स्थिति",
        },
        responseTime: {
          title: "रिस्पॉन्स टाइम (ms)",
        },
        error: {
          title: "एरर मैसेज",
        },
      },
      tasks: {
        title: "टास्क स्टेटस",
        description: "टास्क रनर स्टेटस",
        runnerStatus: {
          title: "रनर स्टेटस",
        },
        activeTasks: {
          title: "एक्टिव टास्क",
        },
        totalTasks: {
          title: "कुल टास्क",
        },
        errors: {
          title: "एरर की गिनती",
        },
        lastError: {
          title: "आख़िरी एरर",
        },
      },
      system: {
        title: "सिस्टम जानकारी",
        description: "सिस्टम रिसोर्स की जानकारी",
        memory: {
          title: "मेमोरी उपयोग",
          description: "सिस्टम मेमोरी की जानकारी",
          used: {
            title: "इस्तेमाल हुई मेमोरी",
          },
          total: {
            title: "कुल मेमोरी",
          },
          percentage: {
            title: "मेमोरी उपयोग %",
          },
        },
        cpu: {
          title: "CPU उपयोग",
          description: "सिस्टम CPU की जानकारी",
          usage: {
            title: "CPU उपयोग %",
          },
          loadAverage: {
            title: "लोड एवरेज",
          },
        },
        disk: {
          title: "डिस्क उपयोग",
          description: "सिस्टम डिस्क की जानकारी",
          available: {
            title: "उपलब्ध जगह",
          },
          total: {
            title: "कुल जगह",
          },
          percentage: {
            title: "डिस्क उपयोग %",
          },
        },
      },
      checks: {
        title: "हेल्थ चेक",
        description: "हर कॉम्पोनेंट के अलग हेल्थ चेक",
        item: {
          title: "हेल्थ चेक",
          description: "हर हेल्थ चेक का नतीजा",
          name: {
            title: "चेक का नाम",
          },
          status: {
            title: "चेक का स्टेटस",
          },
          message: {
            title: "चेक का मैसेज",
          },
          duration: {
            title: "अवधि (ms)",
          },
        },
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
        checkFailed: "हेल्थ चेक फ़ेल हुआ: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस मना है",
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
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "हेल्थ चेक सफलतापूर्वक पूरा हुआ",
    },
  },
};
