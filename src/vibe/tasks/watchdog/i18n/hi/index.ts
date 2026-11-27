import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "टास्क वॉचडॉग",
  tags: {
    taskWatchdog: "task-watchdog",
    vibeSense: "vibe-sense",
    budget: "बजट",
  },
  enums: {
    incidentType: {
      all: "सभी घटनाएँ",
      timeout: "टाइमआउट",
      loop: "लूप",
      budget: "बजट",
      transientRetryExhausted: "रीट्राई ख़त्म",
      watchdogCancel: "वॉचडॉग कैंसल",
    },
    budgetScope: {
      task: "हर टास्क रन पर",
      day: "रोज़ (सभी टास्क)",
      goal: "हर गोल पर, रोज़",
    },
    spendKind: {
      model: "मॉडल टर्न",
      tool: "टूल कॉल",
    },
    healthMetric: {
      started: "शुरू हुए टास्क",
      completed: "पूरे हुए टास्क",
      failed: "फ़ेल हुए टास्क",
      watchdogCancelled: "वॉचडॉग से रद्द टास्क",
      avgDuration: "औसत अवधि (सेकंड)",
      p95Duration: "95वें पर्सेंटाइल की अवधि (सेकंड)",
      creditSpend: "टास्क से खर्च हुए क्रेडिट",
      incidents: "घटनाएँ",
    },
  },
  sweep: {
    post: {
      title: "टास्क वॉचडॉग स्वीप",
      titleShort: "वॉचडॉग स्वीप",
      description:
        "अटके, लूप में फँसे और अनाथ बैकग्राउंड टास्क खोजता है, दर्ज वजह के साथ उन्हें रोकता है और घटना खोलता है। हर मिनट चलता है।",
      container: {
        title: "स्वीप का नतीजा",
        description: "इस पास में वॉचडॉग ने क्या पाया और क्या किया",
      },
      response: {
        checked: "जाँचे गए चालू टास्क",
        cancelled: "रद्द (सीमा पार)",
        orphaned: "रिकवर किए अनाथ रन",
        loops: "बंद किए लूपिंग टास्क",
        incidents: "खोली गई घटनाएँ",
      },
    },
    task: {
      description:
        "बहुत देर चलने वाले, लूप में फँसे या प्रोसेस खो चुके टास्क को रोकता है। हर रोक पर एक घटना खुलती है।",
    },
  },
  health: {
    get: {
      title: "टास्क हेल्थ",
      titleShort: "टास्क हेल्थ",
      description:
        "चालू टास्क की उम्र, टर्न और खर्च, हाल की फ़ेलियर और खुली घटनाएँ। टास्क यहीं से रद्द करें।",
      response: {
        running: "चालू टास्क",
        failures: "हाल की फ़ेलियर",
        incidents: "खुली घटनाएँ",
        daySpent: "आज खर्च हुए क्रेडिट",
        dayCap: "दैनिक सीमा",
      },
      widget: {
        title: "टास्क हेल्थ",
        subtitle: "हर रन पर नज़र है। अटके हुए रोके जाते हैं।",
        refresh: "रीफ़्रेश करें",
        loading: "टास्क हेल्थ लोड हो रही है…",
        spendToday: "आज टास्क ने {{cap}} में से {{spent}} क्रेडिट खर्च किए",
        running: {
          title: "अभी चालू",
          empty: "कुछ नहीं चल रहा।",
        },
        failures: {
          title: "हाल की फ़ेलियर",
          empty: "पिछले 24 घंटे में कोई फ़ेलियर नहीं।",
        },
        incidents: {
          title: "खुली घटनाएँ",
          empty: "कोई खुली घटना नहीं।",
        },
        age: "उम्र",
        turns: "टर्न",
        toolCalls: "टूल कॉल",
        spend: "ख़र्च हुए",
        goal: "गोल {{goal}}",
        limit: "सीमा {{limit}}",
        lastError: "आख़िरी एरर",
        noError: "कोई एरर दर्ज नहीं",
        cancel: "रद्द करें",
        cancelling: "रद्द हो रहा है…",
        resolve: "सुलझाएँ",
        credits: "{{amount}} क्रेडिट",
      },
    },
  },
  cancel: {
    post: {
      title: "टास्क रद्द करें",
      titleShort: "टास्क रद्द करें",
      description:
        "चालू टास्क (और उसका AI लूप) रोकता है और रद्द दर्ज करता है, या घटना को सुलझा हुआ चिह्नित करता है।",
      fields: {
        taskId: {
          label: "टास्क ID",
          description: "जिस चालू टास्क को रोकना है",
          placeholder: "टास्क ID",
        },
        incidentId: {
          label: "घटना ID",
          description: "जिस घटना को सुलझा हुआ चिह्नित करना है",
        },
      },
      response: {
        cancelled: "टास्क रद्द हुआ",
        resolved: "घटना सुलझी",
      },
    },
  },
  budgetCaps: {
    get: {
      title: "टास्क बजट सीमाएँ",
      titleShort: "बजट सीमाएँ",
      description:
        "बैकग्राउंड टास्क रोकने वाली क्रेडिट सीमाएँ: हर टास्क रन, हर दिन और हर गोल पर।",
      response: {
        rows: "सीमाएँ",
        daySpent: "आज खर्च हुए क्रेडिट",
      },
      widget: {
        title: "टास्क बजट सीमाएँ",
        subtitle:
          "सीमा छूने वाला टास्क साफ़ तरीके से रुक जाता है। दैनिक सीमा सभी बिना निगरानी वाले रन की अंतिम छत है।",
        refresh: "रीफ़्रेश करें",
        add: "सीमा सेट करें",
        loading: "सीमाएँ लोड हो रही हैं…",
        empty: {
          title: "कोई सीमा सेट नहीं",
          hint: "डिफ़ॉल्ट लागू हैं: हर टास्क रन पर 100 क्रेडिट, हर दिन 1000, हर गोल पर 500।",
          cta: "पहली सीमा सेट करें",
        },
        spentToday: "आज {{spent}} क्रेडिट खर्च हुए",
        enabled: "एक्टिव",
        disabled: "बंद",
        credits: "{{amount}} क्रेडिट",
        none: "कोई नहीं",
      },
    },
    post: {
      title: "टास्क बजट सीमा सेट करें",
      titleShort: "सीमा सेट करें",
      description:
        "क्रेडिट सीमा बनाएँ या अपडेट करें। हर स्कोप और key पर एक सीमा। टास्क key * हर टास्क का डिफ़ॉल्ट है।",
      fields: {
        scope: {
          label: "स्कोप",
          description: "सीमा किस पर लागू है",
        },
        key: {
          label: "की",
          description:
            "टास्क: टास्क ID या *। दिन: ग्लोबल। गोल: गोल का नाम या * (टास्क पर goal:<name> टैग)",
          placeholder: "*",
        },
        maxCredits: {
          label: "अधिकतम क्रेडिट",
          description:
            "इसके बराबर या ज़्यादा खर्च पर टास्क रुक जाता है। 0 रखने पर टास्क ब्लॉक हो जाता है।",
        },
        enabled: {
          label: "एक्टिव",
          description: "बंद करने पर पंक्ति रहती है पर अनदेखी होती है",
        },
        note: {
          label: "नोट",
          description: "यह सीमा क्यों है",
          placeholder: "रात में चलने वाले रिसर्च एजेंट",
        },
      },
      response: {
        id: "सीमा ID",
      },
      widget: {
        back: "वापस",
        hint: "खर्च सीमा तक पहुँचते ही टास्क रुक जाता है। दैनिक सीमा हमेशा लागू रहती है।",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "रेज़ोल्यूशन", description: "बकेट साइज़" },
      range: { label: "रेंज", description: "क्वेरी की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन मेटाडेटा" },
      metric: {
        label: "मेट्रिक",
        description: "शुरू, पूरे, फ़ेल, वॉचडॉग से रद्द टास्क, अवधि, क्रेडिट खर्च या घटनाएँ",
      },
      incidentType: {
        label: "घटना का प्रकार",
        description: "सिर्फ़ घटना मेट्रिक के लिए। डिफ़ॉल्ट: सभी प्रकार",
      },
    },
    taskHealth: {
      post: {
        title: "टास्क हेल्थ",
        titleShort: "टास्क हेल्थ",
        description:
          "बैकग्राउंड टास्क रन, अवधि, क्रेडिट खर्च और वॉचडॉग घटनाएँ, हर बकेट में",
        fields: {
          result: { label: "वैल्यू", description: "हर बकेट की मेट्रिक वैल्यू" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "गलत इनपुट",
      description: "हाइलाइट की गई फ़ील्ड जाँचें",
    },
    unauthorized: {
      title: "साइन इन नहीं हैं",
      description: "एडमिन के रूप में साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "टास्क वॉचडॉग टूल के लिए एडमिन रोल चाहिए",
    },
    notFound: {
      title: "नहीं मिला",
      description: "वह टास्क या घटना मौजूद नहीं है",
    },
    conflict: {
      title: "टकराव",
      description: "इस बीच एंट्री बदल गई, रीलोड करके दोबारा कोशिश करें",
    },
    server: {
      title: "सर्वर एरर",
      description: "रिक्वेस्ट पूरी नहीं हो सकी",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "रिक्वेस्ट सर्वर तक नहीं पहुँची",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कुछ अनपेक्षित फ़ेल हो गया",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव सेव करें या छोड़ें",
    },
    nothingToDo: "रद्द करने के लिए टास्क ID या सुलझाने के लिए घटना ID दें",
    taskNotRunning: "टास्क {{taskId}} चालू नहीं है",
    incidentNotFound: "घटना {{incidentId}} मौजूद नहीं है",
    invalidCap: "सीमा के लिए ज़ीरो या उससे बड़ी राशि और एक key चाहिए",
  },
  success: {
    title: "हो गया",
    description: "सेव हो गया",
  },
};
