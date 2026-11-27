import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "टास्क मैनेजमेंट",
  tags: {
    tasks: "टास्क",
  },
  type: {
    cron: "Cron टास्क",
    side: "साइड टास्क",
    task_runner: "टास्क रनर",
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
  status: {
    pending: "पेंडिंग",
    running: "चल रहा है",
    completed: "पूरा हुआ",
    failed: "फ़ेल",
    timeout: "टाइमआउट",
    cancelled: "रद्द",
    skipped: "छोड़ा गया",
    blocked: "ब्लॉक",
    scheduled: "शेड्यूल्ड",
    stopped: "रुके हुए",
    error: "एरर",
    filter: {
      all: "सभी स्टेटस",
      active: "एक्टिव",
      error: "एरर स्टेट",
    },
  },
  taskCategory: {
    development: "डेवलपमेंट",
    build: "बिल्ड",
    watch: "वॉच",
    generator: "जनरेटर",
    test: "टेस्ट",
    maintenance: "मेंटेनेंस",
    database: "डेटाबेस",
    system: "सिस्टम",
    monitoring: "मॉनिटरिंग",
    leadManagement: "लीड मैनेजमेंट",
  },
  enabledFilter: {
    all: "सभी",
    enabled: "चालू",
    disabled: "बंद",
  },
  hiddenFilter: {
    visible: "दिखता है",
    hidden: "छिपा है",
    all: "सभी",
  },
  sort: {
    asc: "बढ़ता क्रम",
    desc: "घटता क्रम",
  },
  pulse: {
    health: {
      healthy: "स्वस्थ",
      warning: "चेतावनी",
      critical: "क्रिटिकल",
      unknown: "अज्ञात",
    },
    execution: {
      success: "सफल",
      failure: "फ़ेल",
      timeout: "टाइमआउट",
      cancelled: "रद्द",
      pending: "पेंडिंग",
    },
  },
  cron: {
    frequency: {
      everyMinute: "हर मिनट",
      everyHour: "हर घंटे",
      everyDays: "हर दिन",
      hourly: "हर घंटे",
    },
    days: {
      sunday: "रविवार",
      monday: "सोमवार",
      tuesday: "मंगलवार",
      wednesday: "बुधवार",
      thursday: "गुरुवार",
      friday: "शुक्रवार",
      saturday: "शनिवार",
    },
    common: {
      dailyAtMidnight: "रोज़ आधी रात को",
      dailyAtNoon: "रोज़ दोपहर को",
      weeklyOnSunday: "हर रविवार",
      monthlyOnFirst: "हर महीने की 1 तारीख़ को",
      everyFiveMinutes: "हर 5 मिनट",
      everyThreeMinutes: "हर 3 मिनट",
      everyOneMinutes: "हर मिनट",
      everyTenMinutes: "हर 10 मिनट",
      everyFifteenMinutes: "हर 15 मिनट",
      everyThirtyMinutes: "हर 30 मिनट",
    },
    patterns: {
      everyIntervalMinutes: "हर {{interval}} मिनट",
      everyIntervalMinutesStarting: "हर {{interval}} मिनट, मिनट {{start}} से शुरू",
      atMinutes: "मिनट {{minutes}} पर",
      fromMinuteToMinute: "मिनट {{from}} से {{to}} तक",
      atMinute: "मिनट {{minute}} पर",
      everyIntervalHours: "हर {{interval}} घंटे",
      everyIntervalHoursStarting: "हर {{interval}} घंटे, घंटा {{start}} से शुरू",
      atHours: "घंटे {{hours}} पर",
      fromHourToHour: "घंटे {{from}} से {{to}} तक",
      atHour: "{{hour}} बजे",
    },
    calendar: {
      onDays: "दिन {{days}} को",
      onDay: "दिन {{day}} को",
      inMonths: "{{months}} में",
      inMonth: "{{month}} में",
      onWeekdays: "{{days}} को",
      fromWeekdayToWeekday: "{{start}} से {{end}} तक",
      onWeekday: "{{day}} को",
    },
    timezone: "{{timezone}} में",
    time: {
      midnight: "आधी रात",
      noon: "दोपहर",
      hourAm: "सुबह {{hour}} बजे",
      hourPm: "शाम {{hour}} बजे",
      hourMinuteAm: "सुबह {{hour}}:{{minute}} बजे",
      hourMinutePm: "शाम {{hour}}:{{minute}} बजे",
    },
    weekdays: {
      sunday: "रविवार",
      monday: "सोमवार",
      tuesday: "मंगलवार",
      wednesday: "बुधवार",
      thursday: "गुरुवार",
      friday: "शुक्रवार",
      saturday: "शनिवार",
    },
    months: {
      january: "जनवरी",
      february: "फ़रवरी",
      march: "मार्च",
      april: "अप्रैल",
      may: "मई",
      june: "जून",
      july: "जुलाई",
      august: "अगस्त",
      september: "सितंबर",
      october: "अक्टूबर",
      november: "नवंबर",
      december: "दिसंबर",
    },
  },
  errors: {
    // Cron Tasks errors
    fetchCronTasks: "cron टास्क नहीं मिल सके: {{error}}",
    createCronTask: "cron टास्क नहीं बन सका",
    updateCronTask: "cron टास्क अपडेट नहीं हो सका",
    deleteCronTask: "cron टास्क नहीं हट सका",
    fetchCronTaskHistory: "cron टास्क का इतिहास नहीं मिल सका",
    fetchCronTaskStats: "cron टास्क के स्टैटिस्टिक्स नहीं मिल सके",
    fetchCronStatus: "cron सिस्टम स्टेटस नहीं मिल सका",
    cronTaskNotFound: "cron टास्क नहीं मिला",

    // Unified Runner errors
    startTaskRunner: "टास्क रनर शुरू नहीं हो सका: {{error}}",
    stopTaskRunner: "टास्क रनर बंद नहीं हो सका",
    getTaskRunnerStatus:
      'टास्क रनर का स्टेटस नहीं मिला: अज्ञात कार्रवाई "{{action}}"',
    executeCronTask: "cron टास्क चल नहीं सका",

    // Pulse errors
    executePulse: "पल्स चल नहीं सका",
    fetchPulseStatus: "पल्स स्टेटस नहीं मिल सका",
    pulseExecutionFailed: "पल्स एक्ज़ीक्यूशन फ़ेल हुआ",
    pulseInternalError: "पल्स सिस्टम में इंटरनल एरर",

    // Validation errors
    invalidTaskInput: "टास्क इनपुट endpoint की रिक्वेस्ट स्कीमा से मेल नहीं खाता",
    endpointNotFound: "दी गई route ID का endpoint नहीं मिला",

    // Repository errors
    repositoryNotFound: "रिसोर्स नहीं मिला",
    repositoryNotFoundDetail: "ID {{taskId}} का कोई टास्क नहीं मिला",
    repositoryInternalError: "इंटरनल एरर आया",
    repositoryInternalErrorDetail: "इंटरनल एरर आया: {{error}}",
    repositoryGetTaskForbidden: "आपके पास टास्क {{taskId}} देखने की अनुमति नहीं है",
    repositoryUpdateTaskForbidden: "आपके पास इस टास्क को अपडेट करने की अनुमति नहीं है",
    repositoryUpdateTaskForbiddenDetail:
      "आपके पास टास्क {{taskId}} अपडेट करने की अनुमति नहीं है",
    repositoryDeleteTaskForbidden:
      "आपके पास टास्क {{taskId}} हटाने की अनुमति नहीं है",
  },
  common: {
    cronRepositoryTaskUpdateFailed:
      "cron टास्क {{taskId}} अपडेट नहीं हो सका: {{error}}",
    cronRepositoryTaskDeleteFailed:
      "cron टास्क {{taskId}} हट नहीं सका: {{error}}",
    cronRepositoryExecutionCreateFailed:
      "cron टास्क {{taskId}} के लिए एक्ज़ीक्यूशन नहीं बन सका: {{error}}",
    cronRepositoryExecutionUpdateFailed: "cron टास्क एक्ज़ीक्यूशन अपडेट नहीं हो सका",
    cronRepositoryExecutionsFetchFailed: "cron टास्क एक्ज़ीक्यूशन नहीं मिल सके",
    cronRepositoryRecentExecutionsFetchFailed:
      "हाल के cron टास्क एक्ज़ीक्यूशन नहीं मिल सके",
    cronRepositorySchedulesFetchFailed: "cron टास्क शेड्यूल नहीं मिल सके",
    cronRepositoryScheduleUpdateFailed: "cron टास्क शेड्यूल अपडेट नहीं हो सका",
    cronRepositoryStatisticsFetchFailed: "cron टास्क के स्टैटिस्टिक्स नहीं मिल सके",
  },
  outputMode: {
    storeOnly: "सिर्फ़ स्टोर करें",
    notifyOnFailure: "फ़ेल होने पर सूचित करें",
    notifyAlways: "हमेशा सूचित करें",
  },
  dbHealthCheck: {
    name: "डेटाबेस हेल्थ चेक",
    description: "हर मिनट डेटाबेस कनेक्शन की सेहत जाँचता है",
  },
  pulseRunner: {
    name: "pulse-runner",
    description:
      "शेड्यूल्ड टास्क ट्रिगर करने के लिए हर मिनट एक बार pulse रिपॉज़िटरी को कॉल करता है",
  },
  devWatcher: {
    name: "dev-file-watcher",
    description: "फ़ाइल बदलावों पर नज़र रखता है और डेवलपमेंट मोड में जनरेटर ट्रिगर करता है",
  },
  dbHealth: {
    tag: "डेटाबेस",
    post: {
      title: "सिस्टम हेल्थ चेक",
      titleShort: "DB हेल्थ",
      description: "डेटाबेस, मेमोरी और डिस्क की सेहत जाँचें",
      container: {
        title: "सिस्टम हेल्थ",
        description: "DB कनेक्टिविटी, मेमोरी इस्तेमाल और डिस्क इस्तेमाल",
      },
      response: {
        healthy: "स्वस्थ",
        status: "स्टेटस",
        dbResponseMs: "DB रिस्पॉन्स (ms)",
        memoryUsedPct: "इस्तेमाल हुई मेमोरी (%)",
        heapUsedMb: "इस्तेमाल हुआ हीप (MB)",
        rssMb: "RSS (MB)",
        diskUsedPct: "इस्तेमाल हुई डिस्क (%)",
        uptimeHours: "अपटाइम (घंटे)",
        warnings: "चेतावनियाँ",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "डेटाबेस हेल्थ चेक फ़ेल हुआ",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        systemAlert: "सिस्टम {{status}}: {{warnings}}",
      },
      success: {
        title: "DB स्वस्थ",
        description: "डेटाबेस कनेक्शन स्वस्थ है",
      },
    },
  },
  completeTask: {
    post: {
      title: "टास्क पूरा करें",
      titleShort: "टास्क पूरा करें",
      description:
        "बैकग्राउंड टास्क को पूरा चिह्नित करें। async काम पूरा होने पर कोडिंग एजेंट इसे कॉल करता है। फ़्रेमवर्क इंतज़ार कर रही AI स्ट्रीम को नतीजे के साथ फिर चालू करता है।",
      fields: {
        taskId: {
          title: "टास्क ID",
          description: "पूरा चिह्नित करने वाले cron टास्क की डेटाबेस ID।",
        },
        status: {
          title: "स्टेटस",
          description:
            "अंतिम स्टेटस: सफलता के लिए 'completed', फ़ेल के लिए 'failed', रद्द करने के लिए 'cancelled'।",
        },
        summary: {
          title: "सारांश",
          description: "संक्षिप्त विवरण कि क्या पूरा हुआ या क्यों फ़ेल हुआ।",
        },
        output: {
          title: "आउटपुट पेलोड",
          description:
            "एक्ज़ीक्यूशन नतीजे से जोड़ने के लिए वैकल्पिक स्ट्रक्चर्ड डेटा पेलोड (key-value जोड़े)।",
        },
        completed: {
          title: "पूरा हुआ",
          description: "टास्क सफलतापूर्वक पूरा चिह्नित हुआ या नहीं।",
        },
        updatedAt: {
          title: "अपडेट का समय",
          description: "टास्क स्टेटस अपडेट होने का टाइमस्टैम्प।",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत टास्क ID या स्टेटस वैल्यू",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        internal: {
          title: "पूरा करना फ़ेल हुआ",
          description: "टास्क पूरा चिह्नित नहीं हो सका",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस नहीं मिला",
        },
        notFound: {
          title: "टास्क नहीं मिला",
          description: "दी गई ID का कोई टास्क नहीं मिला",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "रिमोट इंस्टेंस पर पूर्णता पुश नहीं हो सकी",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsaved: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव मिले",
        },
        conflict: {
          title: "टकराव",
          description: "टास्क पूरा होने की स्थिति में नहीं है",
        },
      },
      success: {
        title: "टास्क पूरा हुआ",
        description: "टास्क पूरा चिह्नित हुआ और AI स्ट्रीम नतीजे के साथ फिर चालू हुई",
      },
    },
  },
  waitForTask: {
    post: {
      title: "टास्क का इंतज़ार करें",
      titleShort: "टास्क का इंतज़ार करें",
      description:
        "किसी पेंडिंग बैकग्राउंड टास्क का इंतज़ार करें। पहले से पूरा हो तो नतीजा तुरंत लौटाता है, नहीं तो टास्क ख़त्म होने तक AI स्ट्रीम रोक देता है (wakeUp मैकेनिज़्म)।",
      fields: {
        taskId: {
          title: "टास्क ID",
          description: "इंतज़ार करने वाले टास्क की ID।",
        },
        status: {
          title: "स्टेटस",
          description: "टास्क का मौजूदा स्टेटस।",
        },
        result: {
          title: "नतीजा",
          description: "टास्क का नतीजा पेलोड (पूरा होने पर मौजूद)।",
        },
        waiting: {
          title: "इंतज़ार में",
          description: "स्ट्रीम टास्क पूरा होने के इंतज़ार में रुकी है तो True।",
        },
        originalToolName: {
          title: "टूल",
          description: "जो मूल टूल चला था।",
        },
        originalArgs: {
          title: "आर्गुमेंट",
          description: "मूल टूल के इनपुट आर्गुमेंट।",
        },
      },
      widget: {
        noToolName: "कोई टूल नाम उपलब्ध नहीं।",
        resolving: "टूल खोजा जा रहा है...",
        unknownTool: "अज्ञात टूल: {{toolName}}",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत taskId",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        internal: {
          title: "इंटरनल एरर",
          description: "टास्क पर वेटर रजिस्टर नहीं हो सका",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस नहीं मिला",
        },
        notFound: {
          title: "टास्क नहीं मिला",
          description: "उस ID का कोई टास्क नहीं मिला",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsaved: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव मिले",
        },
        conflict: {
          title: "टकराव",
          description: "टकराव हो गया",
        },
      },
      success: {
        title: "टास्क का नतीजा तैयार",
        description: "टास्क पूरा हुआ या वेटर रजिस्टर हो गया",
      },
      status: {
        waiting: "टास्क का इंतज़ार हो रहा है...",
        complete: "टास्क पूरा",
      },
    },
  },
  errorMonitor: {
    name: "error-monitor",
    description: "हर 3 घंटे एरर पैटर्न के लिए चैट थ्रेड स्कैन करता है",
    tag: "मॉनिटरिंग",
    post: {
      title: "एरर मॉनिटर",
      description:
        "प्राइवेसी-पहले एरर मॉनिटरिंग: कंटेंट पढ़े बिना मैसेज में एरर पैटर्न स्कैन करता है",
      container: {
        title: "एरर स्कैन के नतीजे",
        description: "चैट मैसेज से जुटाए एरर पैटर्न",
      },
      response: {
        errorsFound: "मिले एरर",
        threadsScanned: "स्कैन किए थ्रेड",
        scanWindowFrom: "स्कैन विंडो की शुरुआत",
        scanWindowTo: "स्कैन विंडो का अंत",
        patternType: "एरर टाइप",
        patternCount: "गिनती",
        patternThreadIds: "थ्रेड ID",
        patternModel: "मॉडल",
        patternTool: "टूल",
        patternFirstSeen: "पहली बार दिखा",
        patternLastSeen: "आख़िरी बार दिखा",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "एरर स्कैन फ़ेल हुआ",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
      },
      success: {
        title: "स्कैन पूरा",
        description: "एरर स्कैन सफलतापूर्वक पूरा हुआ",
      },
    },
    cleanup: {
      name: "एरर लॉग क्लीनअप",
      description:
        "6 महीने से पुराने एरर लॉग हटाता है और कुल रो 100K पर सीमित रखता है",
      post: {
        title: "एरर लॉग क्लीनअप",
        titleShort: "लॉग क्लीनअप",
        description:
          "डेटाबेस को हल्का रखने के लिए पुरानी एरर लॉग एंट्री हटाएँ (समय के आधार पर + गिनती के आधार पर)",
        container: {
          title: "क्लीनअप के नतीजे",
          description: "हटाए गए एरर लॉग की संख्या",
        },
        response: {
          deletedCount: "हटाई गई गिनती",
          deletedByTime: "समय से हटाए गए",
          deletedByCount: "गिनती की सीमा से हटाए गए",
          retentionDays: "रिटेंशन के दिन",
          maxRows: "अधिकतम रो",
        },
        success: {
          title: "क्लीनअप पूरा",
          description: "पुराने एरर लॉग सफलतापूर्वक हटाए गए",
        },
      },
    },
  },
  csvProcessor: {
    description: "CSV इंपोर्ट जॉब को हिस्सों में प्रोसेस करता है",
  },
  imapSync: {
    description: "IMAP अकाउंट, फ़ोल्डर और मैसेज अपने आप सिंक करता है",
  },
  newsletterUnsubscribeSync: {
    description: "न्यूज़लेटर अनसब्सक्राइब के लिए लीड स्टेटस सिंक करता है",
  },
  cronSystem: {
    history: {
      category: "टास्क मैनेजमेंट",

      errors: {
        cronTaskNotFound: "cron टास्क नहीं मिला",
        repositoryInternalError: "इंटरनल एरर आया",
        fetchCronTaskHistory: "cron टास्क का इतिहास नहीं मिल सका",
      },

      get: {
        tags: {
          tasks: "टास्क",
          monitoring: "मॉनिटरिंग",
        },
        title: "टास्क एक्ज़ीक्यूशन इतिहास",
        description: "cron टास्क के पुराने एक्ज़ीक्यूशन रिकॉर्ड देखें",
        fields: {
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
            description: "गलत रिक्वेस्ट पैरामीटर दिए गए",
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
            description: "इंटरनल सर्वर एरर आया",
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
          title: "इतिहास मिल गया",
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
        title: "टास्क एक्ज़ीक्यूशन इतिहास",
        loading: "इतिहास लोड हो रहा है...",
        header: {
          tasks: "टास्क",
          stats: "स्टैट्स",
          pulse: "पल्स",
          refresh: "रीफ़्रेश करें",
        },
        summary: {
          total: "कुल",
          successful: "सफल",
          failed: "फ़ेल",
          successRate: "सफलता दर",
          avgDuration: "औसत अवधि",
        },
        search: {
          placeholder: "टास्क खोजें...",
        },
        filter: {
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
    },
    stats: {
      category: "टास्क मैनेजमेंट",

      errors: {
        fetchCronTaskStats: "cron टास्क के स्टैटिस्टिक्स नहीं मिल सके",
      },

      get: {
        title: "cron टास्क स्टैटिस्टिक्स पाएँ",
        description: "cron टास्क के विस्तृत स्टैटिस्टिक्स और मेट्रिक पाएँ",
        tag: "Cron स्टैटिस्टिक्स",
        form: {
          title: "Cron स्टैटिस्टिक्स रिक्वेस्ट",
          description: "cron टास्क स्टैटिस्टिक्स पाने के पैरामीटर कॉन्फ़िगर करें",
        },
        fields: {
          period: {
            title: "समय अवधि",
            description: "स्टैटिस्टिक्स एग्रीगेशन की समय अवधि",
          },
          type: {
            title: "स्टैटिस्टिक्स का प्रकार",
            description: "कौन से स्टैटिस्टिक्स लाने हैं",
          },
          taskId: {
            title: "टास्क ID",
            description: "स्टैटिस्टिक्स फ़िल्टर करने के लिए वैकल्पिक ख़ास टास्क ID",
          },
          limit: {
            title: "नतीजों की सीमा",
            description: "लौटाए जाने वाले नतीजों की अधिकतम संख्या",
          },
          timePeriod: {
            title: "समय अवधि",
          },
          dateRangePreset: {
            title: "तारीख़ रेंज प्रीसेट",
          },
          taskName: {
            title: "टास्क का नाम",
          },
          taskStatus: {
            title: "टास्क स्टेटस",
          },
          taskPriority: {
            title: "टास्क प्राथमिकता",
          },
          healthStatus: {
            title: "हेल्थ स्टेटस",
          },
          minDuration: {
            title: "न्यूनतम अवधि",
          },
          maxDuration: {
            title: "अधिकतम अवधि",
          },
          includeDisabled: {
            title: "बंद टास्क शामिल करें",
          },
          includeSystemTasks: {
            title: "सिस्टम टास्क शामिल करें",
          },
          hasRecentFailures: {
            title: "हाल में फ़ेल हुए",
          },
          hasTimeout: {
            title: "टाइमआउट हुआ",
          },
          search: {
            title: "खोजें",
          },
        },
        period: {
          hour: "घंटेवार",
          day: "दैनिक",
          week: "साप्ताहिक",
          month: "मासिक",
        },
        type: {
          overview: "ओवरव्यू",
          performance: "परफ़ॉर्मेंस",
          errors: "एरर विश्लेषण",
          trends: "रुझान विश्लेषण",
        },
        response: {
          totalTasks: { title: "कुल टास्क" },
          executedTasks: { title: "चलाए गए टास्क" },
          successfulTasks: { title: "सफल टास्क" },
          failedTasks: { title: "फ़ेल टास्क" },
          averageExecutionTime: { title: "औसत एक्ज़ीक्यूशन समय (ms)" },
          totalExecutions: { title: "कुल एक्ज़ीक्यूशन" },
          executionsLast24h: { title: "पिछले 24 घंटे के एक्ज़ीक्यूशन" },
          successRate: { title: "सफलता दर (%)" },
          successfulExecutions: { title: "सफल एक्ज़ीक्यूशन" },
          failedExecutions: { title: "फ़ेल एक्ज़ीक्यूशन" },
          failureRate: { title: "फ़ेल दर (%)" },
          avgExecutionTime: { title: "औसत एक्ज़ीक्यूशन समय (ms)" },
          minExecutionTime: { title: "न्यूनतम एक्ज़ीक्यूशन समय (ms)" },
          maxExecutionTime: { title: "अधिकतम एक्ज़ीक्यूशन समय (ms)" },
          medianExecutionTime: { title: "मीडियन एक्ज़ीक्यूशन समय (ms)" },
          pendingExecutions: { title: "पेंडिंग एक्ज़ीक्यूशन" },
          runningExecutions: { title: "चल रहे एक्ज़ीक्यूशन" },
          activeTasks: { title: "एक्टिव टास्क" },
          systemStatus: { title: "सिस्टम स्टेटस" },
          uptime: { title: "अपटाइम" },
          healthyTasks: { title: "स्वस्थ टास्क" },
          degradedTasks: { title: "कमज़ोर टास्क" },
          systemLoad: { title: "सिस्टम लोड (%)" },
          queueSize: { title: "क्यू साइज़" },
        },
        errors: {
          server: {
            title: "सर्वर एरर",
            description: "स्टैटिस्टिक्स लाते समय इंटरनल सर्वर एरर आया",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "दिए गए पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "स्टैटिस्टिक्स देखने के लिए ऑथेंटिकेशन ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "स्टैटिस्टिक्स देखने के लिए पर्याप्त अनुमति नहीं",
          },
          notFound: {
            title: "नहीं मिला",
            description: "माँगे गए स्टैटिस्टिक्स नहीं मिल सके",
          },
          conflict: {
            title: "टकराव",
            description: "रिक्वेस्ट प्रोसेस करते समय टकराव हुआ",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "स्टैटिस्टिक्स लाते समय नेटवर्क एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं जिन्हें देखना ज़रूरी है",
          },
        },
        success: {
          title: "स्टैटिस्टिक्स मिल गए",
          description: "cron टास्क स्टैटिस्टिक्स सफलतापूर्वक मिले",
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
        title: "Cron स्टैटिस्टिक्स",
        loading: "स्टैटिस्टिक्स लोड हो रहे हैं...",
        viewTasks: "टास्क",
        viewHistory: "इतिहास",
        viewPulse: "पल्स",
        refresh: "रीफ़्रेश करें",
        totalTasks: "कुल टास्क",
        executedTasks: "चलाए गए टास्क",
        successfulTasks: "सफल",
        failedTasks: "फ़ेल",
        successRate: "सफलता दर",
        avgDuration: "औसत अवधि",
        overallSuccessRate: "कुल सफलता दर",
        activeTasks: "एक्टिव टास्क",
        runningExecutions: "चल रहा है",
        pendingExecutions: "पेंडिंग",
        healthyTasks: "स्वस्थ टास्क",
        degradedTasks: "कमज़ोर टास्क",
        systemLoad: "सिस्टम लोड",
        queueSize: "क्यू साइज़",
        executionsLast24h: "पिछले 24 घंटे",
        tasksByStatus: "स्टेटस के हिसाब से टास्क",
        tasksByPriority: "प्राथमिकता के हिसाब से टास्क",
        topPerforming: "सबसे अच्छे टास्क",
        problemTasks: "समस्या वाले टास्क",
        recentActivity: "हाल की गतिविधि",
        dailyStats: "दैनिक स्टैटिस्टिक्स",
        systemStatus: {
          healthy: "स्वस्थ",
          warning: "चेतावनी",
          critical: "क्रिटिकल",
          unknown: "अज्ञात",
        },
        uptime: "अपटाइम",
        col: {
          rank: "#",
          taskName: "टास्क का नाम",
          executions: "एक्ज़ीक्यूशन",
          avgDuration: "औसत अवधि",
          failures: "फ़ेल",
          failureRate: "फ़ेल दर",
          date: "तारीख",
          successes: "सफलताएँ",
          uniqueTasks: "अलग-अलग टास्क",
        },
      },
    },
    task: {
      category: "सिस्टम",
      tags: {
        cron: "Cron",
        scheduling: "शेड्यूलिंग",
      },
      get: {
        title: "cron टास्क पाएँ",
        description: "ID से एक cron टास्क पाएँ",
        container: {
          title: "Cron टास्क का ब्योरा",
          description: "किसी ख़ास cron टास्क का ब्योरा देखें",
        },
        fields: {
          id: {
            label: "टास्क ID",
            description: "टास्क की यूनिक पहचान",
          },
        },
        response: {
          task: {
            title: "टास्क",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "दी गई टास्क ID गलत है",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "आपको ये टास्क देखने की अनुमति नहीं है",
          },
          notFound: {
            title: "टास्क नहीं मिला",
            description: "माँगा गया टास्क नहीं मिल सका",
          },
          internal: {
            title: "इंटरनल सर्वर एरर",
            description: "टास्क पाते समय एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "आपके पास इस टास्क का एक्सेस नहीं है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
          conflict: {
            title: "टकराव",
            description: "टकराव हो गया",
          },
        },
        success: {
          retrieved: {
            title: "टास्क मिल गया",
            description: "टास्क सफलतापूर्वक मिल गया",
          },
        },
      },
      put: {
        title: "cron टास्क अपडेट करें",
        description: "मौजूदा cron टास्क अपडेट करें",
        container: {
          title: "cron टास्क अपडेट करें",
          description: "टास्क सेटिंग्स बदलें",
        },
        fields: {
          id: {
            label: "टास्क ID",
            description: "टास्क की यूनिक पहचान",
          },
          displayName: {
            label: "डिस्प्ले नाम",
            description: "इस टास्क का इंसान को समझ आने वाला लेबल",
            placeholder: "डिस्प्ले नाम डालें",
          },
          outputMode: {
            label: "आउटपुट मोड",
            description: "एक्ज़ीक्यूशन के बाद नोटिफ़िकेशन कब भेजें",
            placeholder: "आउटपुट मोड चुनें",
          },
          description: {
            label: "विवरण",
            description: "टास्क का विवरण",
            placeholder: "टास्क का विवरण डालें",
          },
          schedule: {
            label: "शेड्यूल",
            description: "Cron शेड्यूल एक्सप्रेशन",
            placeholder: "*/5 * * * *",
          },
          enabled: {
            label: "चालू",
            description: "टास्क चालू है या नहीं",
          },
          priority: {
            label: "प्राथमिकता",
            description: "टास्क की प्राथमिकता",
            placeholder: "प्राथमिकता चुनें",
          },
          category: {
            label: "कैटेगरी",
            description: "टास्क की कैटेगरी",
            placeholder: "कैटेगरी चुनें",
          },
          timeout: {
            label: "टाइमआउट (ms)",
            description: "मिलीसेकंड में अधिकतम एक्ज़ीक्यूशन समय (जैसे 300000 = 5 मिनट)",
            placeholder: "300000",
          },
          retries: {
            label: "रीट्राई",
            description: "फ़ेल होने पर रीट्राई कोशिशों की संख्या",
            placeholder: "3",
          },
          retryAttempts: {
            label: "रीट्राई कोशिशें",
            description: "फ़ेल होने पर रीट्राई कोशिशों की संख्या",
          },
          retryDelay: {
            label: "रीट्राई में देरी (ms)",
            description: "रीट्राई के बीच मिलीसेकंड में देरी (जैसे 5000 = 5 सेकंड)",
            placeholder: "5000",
          },
          taskInput: {
            label: "टास्क इनपुट",
            description: "टास्क के लिए JSON इनपुट डेटा",
          },
          hidden: {
            label: "छिपा है",
            description:
              "इस टास्क को AI सिस्टम प्रॉम्प्ट और डिफ़ॉल्ट टास्क लिस्ट से छिपाएँ",
          },
          runOnce: {
            label: "एक बार चलाएँ",
            description: "इस टास्क को सिर्फ़ एक बार चलाएँ और फिर बंद कर दें",
          },
          targetInstance: {
            label: "टारगेट इंस्टेंस",
            description:
              "वो इंस्टेंस ID जिस पर ये टास्क चलना चाहिए। सिर्फ़ होस्ट इंस्टेंस पर चलाने के लिए खाली छोड़ें।",
            placeholder: "जैसे hermes, thea-prod",
          },
          lastExecutionStatus: {
            label: "एक्ज़ीक्यूशन स्टेटस",
            description:
              "आख़िरी एक्ज़ीक्यूशन स्टेटस ओवरराइड करें। अटके 'running' टास्क को रीसेट करने के लिए इस्तेमाल करें।",
            placeholder: "स्टेटस चुनें",
          },
        },
        response: {
          task: {
            title: "अपडेट किया टास्क",
          },
          success: {
            title: "सफल",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "दिया गया डेटा गलत है",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "आपको इस टास्क को अपडेट करने की अनुमति नहीं है",
          },
          notFound: {
            title: "टास्क नहीं मिला",
            description: "अपडेट करने वाला टास्क नहीं मिल सका",
          },
          internal: {
            title: "इंटरनल सर्वर एरर",
            description: "टास्क अपडेट करते समय एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "आपके पास इस टास्क को अपडेट करने की अनुमति नहीं है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
          conflict: {
            title: "टकराव",
            description: "टास्क अपडेट करते समय टकराव हुआ",
          },
        },
        submitButton: {
          label: "टास्क सेव करें",
          loadingText: "सेव हो रहा है...",
        },
        success: {
          updated: {
            title: "टास्क अपडेट हो गया",
            description: "टास्क सफलतापूर्वक अपडेट हुआ",
          },
        },
      },
      delete: {
        title: "Cron टास्क हटाएँ",
        description: "cron टास्क हटाएँ",
        container: {
          title: "Cron टास्क हटाएँ",
          description: "सिस्टम से टास्क हटाएँ",
        },
        fields: {
          id: {
            label: "टास्क ID",
            description: "हटाने वाले टास्क की यूनिक पहचान",
          },
        },
        response: {
          success: {
            title: "सफल",
          },
          message: {
            title: "मैसेज",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "दी गई टास्क ID गलत है",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "आपको इस टास्क को हटाने की अनुमति नहीं है",
          },
          notFound: {
            title: "टास्क नहीं मिला",
            description: "हटाने वाला टास्क नहीं मिल सका",
          },
          internal: {
            title: "इंटरनल सर्वर एरर",
            description: "टास्क हटाते समय एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "आपके पास इस टास्क को हटाने की अनुमति नहीं है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
          conflict: {
            title: "टकराव",
            description: "टकराव की वजह से टास्क नहीं हट सकता",
          },
        },
        success: {
          deleted: {
            title: "टास्क हट गया",
            description: "टास्क सफलतापूर्वक हट गया",
          },
        },
      },
      priority: {
        critical: "क्रिटिकल",
        high: "हाई",
        medium: "मीडियम",
        low: "लो",
        background: "Cron",
      },
      status: {
        pending: "पेंडिंग",
        running: "चल रहा है",
        completed: "पूरा हुआ",
        failed: "फ़ेल",
        timeout: "टाइमआउट",
        cancelled: "रद्द",
        skipped: "छोड़ा गया",
        blocked: "ब्लॉक",
        scheduled: "शेड्यूल्ड",
        stopped: "रुके हुए",
        error: "एरर",
      },
      taskCategory: {
        development: "डेवलपमेंट",
        build: "बिल्ड",
        watch: "वॉच",
        generator: "जनरेटर",
        test: "टेस्ट",
        maintenance: "मेंटेनेंस",
        database: "डेटाबेस",
        system: "सिस्टम",
        monitoring: "मॉनिटरिंग",
      },
      outputMode: {
        storeOnly: "सिर्फ़ स्टोर करें",
        notifyOnFailure: "फ़ेल होने पर सूचित करें",
        notifyAlways: "हमेशा सूचित करें",
      },
      widget: {
        notFound: "टास्क नहीं मिला",
        never: "कभी नहीं",
        history: "इतिहास",
        edit: "एडिट करें",
        delete: "हटाएँ",
        enabled: "चालू",
        disabled: "बंद",
        identity: "पहचान",
        id: "टास्क ID",
        routeId: "Route ID",
        displayName: "डिस्प्ले नाम",
        version: "वर्ज़न",
        category: "कैटेगरी",
        priority: "प्राथमिकता",
        schedule: "शेड्यूल",
        timezone: "टाइमज़ोन",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
        owner: "ओनर",
        ownerSystem: "सिस्टम",
        ownerUser: "यूज़र",
        outputMode: "आउटपुट मोड",
        outputModes: {
          storeOnly: "सिर्फ़ स्टोर करें",
          notifyOnFailure: "फ़ेल होने पर सूचित करें",
          notifyAlways: "हमेशा सूचित करें",
        },
        stats: {
          totalExecutions: "कुल एक्ज़ीक्यूशन",
          successful: "सफल",
          errors: "एरर",
          successRate: "सफलता दर",
        },
        timingSection: "टाइमिंग",
        timing: {
          avgDuration: "औसत अवधि",
          lastDuration: "आख़िरी अवधि",
          lastRun: "आख़िरी रन",
          nextRun: "अगला रन",
          timeout: "टाइमआउट",
          retries: "रीट्राई",
          retryDelay: "रीट्राई में देरी",
        },
        lastExecutionError: "आख़िरी एरर",
        run: "अभी चलाएँ",
        runSuccess: "टास्क सफलतापूर्वक चला",
        running: "चल रहा है...",
        refresh: "रीफ़्रेश करें",
        taskInput: {
          title: "टास्क इनपुट",
          loading: "Endpoint डेफ़िनिशन लोड हो रही है...",
          notFound: "इस टास्क के लिए endpoint डेफ़िनिशन नहीं मिली",
          empty: "कोई इनपुट पैरामीटर कॉन्फ़िगर नहीं",
          editTitle: "टास्क इनपुट पैरामीटर",
          editDescription: "इस टास्क endpoint के इनपुट पैरामीटर कॉन्फ़िगर करें",
        },
        scheduleAutocomplete: {
          customBadge: "कस्टम",
          noSchedulesFound: "कोई शेड्यूल नहीं मिला",
          useCustomSchedule: "कस्टम शेड्यूल इस्तेमाल करें",
          commonSchedules: "आम शेड्यूल",
        },
        schedulePicker: {
          selectPlaceholder: "शेड्यूल चुनें...",
          customOption: "कस्टम...",
          presets: {
            title: "क्विक प्रीसेट",
            everyMinute: "हर मिनट",
            every5m: "हर 5 मिनट",
            every15m: "हर 15 मिनट",
            every30m: "हर 30 मिनट",
            everyHour: "हर घंटे",
            every2h: "हर 2 घंटे",
            every4h: "हर 4 घंटे",
            every6h: "हर 6 घंटे",
            every12h: "हर 12 घंटे",
            dailyMidnight: "रोज़ आधी रात को",
            daily6am: "रोज़ सुबह 6 बजे",
            dailyNoon: "रोज़ दोपहर को",
            daily6pm: "रोज़ शाम 6 बजे",
            weeklyMon: "हर सोमवार",
            weeklySun: "हर रविवार",
            monthlyFirst: "हर महीने की 1 तारीख़",
          },
          custom: {
            title: "कस्टम शेड्यूल",
            repeatEvery: "हर",
            at: "समय",
            onDays: "चालू",
            preview: "→ {{description}}",
            nextRun: "अगला: {{time}}",
            nextRunMultiple: "अगला: {{first}}, फिर {{second}}",
            unit: {
              minutes: "मिनट",
              hours: "घंटे",
              days: "दिन",
              weeks: "हफ़्ते",
              months: "महीने",
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
            advanced: "एडवांस्ड एक्सप्रेशन",
            advancedPlaceholder: "जैसे 0 9 * * 1-5",
            advancedInvalid: "गलत cron एक्सप्रेशन",
          },
        },
      },
    },
    tasks: {
      category: "API Endpoint",
      tags: {
        tasks: "टास्क",
        cron: "Cron",
        scheduling: "शेड्यूलिंग",
      },
      errors: {
        fetchCronTasks: "cron टास्क नहीं मिल सके",
        createCronTask: "cron टास्क नहीं बन सका",
        invalidTaskInput: "टास्क इनपुट endpoint की रिक्वेस्ट स्कीमा से मेल नहीं खाता",
        endpointNotFound: "दी गई route ID का endpoint नहीं मिला",
        targetInstanceForbidden: "सिर्फ़ एडमिन टास्क का टारगेट इंस्टेंस सेट कर सकते हैं",
      },
      list: {
        columns: {
          createdAt: "बनाने का समय",
          updatedAt: "अपडेट का समय",
        },
      },
      get: {
        title: "Cron टास्क की लिस्ट",
        description: "वैकल्पिक फ़िल्टर के साथ cron टास्क की लिस्ट पाएँ",
        container: {
          title: "Cron टास्क लिस्ट",
          description: "cron टास्क फ़िल्टर करें और देखें",
        },
        fields: {
          status: {
            label: "स्टेटस",
            description: "टास्क स्टेटस से फ़िल्टर करें",
            placeholder: "स्टेटस चुनें...",
          },
          priority: {
            label: "प्राथमिकता",
            description: "टास्क प्राथमिकता से फ़िल्टर करें",
            placeholder: "प्राथमिकता चुनें...",
          },
          category: {
            label: "कैटेगरी",
            description: "टास्क कैटेगरी से फ़िल्टर करें",
            placeholder: "कैटेगरी चुनें...",
          },
          enabled: {
            label: "स्टेटस",
            description: "चालू स्टेटस से फ़िल्टर करें",
            placeholder: "सभी टास्क",
          },
          hidden: {
            label: "दिखने की स्थिति",
            description: "छिपे स्टेटस से फ़िल्टर करें (डिफ़ॉल्ट: सिर्फ़ दिखने वाले)",
            placeholder: "दिखने वाले टास्क",
          },
          search: {
            label: "खोजें",
            description: "नाम, route, विवरण या कैटेगरी से टास्क फ़िल्टर करें",
            placeholder: "टास्क खोजें...",
          },
          sort: {
            label: "क्रम",
            description: "टास्क लिस्ट का क्रम",
          },
          limit: {
            label: "सीमा",
            description: "लौटाए जाने वाले टास्क की अधिकतम संख्या",
          },
          offset: {
            label: "ऑफ़सेट",
            description: "छोड़े जाने वाले टास्क की संख्या",
          },
        },
        response: {
          tasks: {
            title: "टास्क",
          },
          task: {
            title: "टास्क",
            description: "एक टास्क की जानकारी",
            id: "टास्क ID",
            name: "टास्क का नाम",
            taskDescription: "विवरण",
            schedule: "शेड्यूल",
            enabled: "चालू",
            hidden: "छिपा है",
            priority: "प्राथमिकता",
            status: "स्टेटस",
            category: "कैटेगरी",
            lastRun: "आख़िरी रन",
            nextRun: "अगला रन",
            version: "वर्ज़न",
            timezone: "टाइमज़ोन",
            timeout: "टाइमआउट (ms)",
            retries: "रीट्राई",
            retryDelay: "रीट्राई में देरी (ms)",
            lastExecutedAt: "आख़िरी बार चला",
            lastExecutionStatus: "आख़िरी एक्ज़ीक्यूशन स्टेटस",
            lastExecutionError: "आख़िरी एक्ज़ीक्यूशन एरर",
            lastExecutionDuration: "आख़िरी एक्ज़ीक्यूशन अवधि (ms)",
            nextExecutionAt: "अगला एक्ज़ीक्यूशन",
            executionCount: "एक्ज़ीक्यूशन की गिनती",
            successCount: "सफलता की गिनती",
            errorCount: "एरर की गिनती",
            averageExecutionTime: "औसत एक्ज़ीक्यूशन समय (ms)",
            createdAt: "बनाने का समय",
            updatedAt: "अपडेट का समय",
          },
          totalTasks: "कुल टास्क",
        },
        errors: {
          internal: {
            title: "टास्क लाते समय इंटरनल सर्वर एरर आया",
            description: "टास्क लिस्ट लाते समय कोई अनपेक्षित एरर आया",
          },
          unauthorized: {
            title: "टास्क लिस्ट का अनधिकृत एक्सेस",
            description: "आपके पास टास्क लिस्ट देखने की अनुमति नहीं है",
          },
          validation: {
            title: "रिक्वेस्ट के पैरामीटर गलत हैं",
            description: "दिए गए रिक्वेस्ट पैरामीटर गलत हैं",
          },
          forbidden: {
            title: "एक्सेस मना है",
            description: "इस रिसोर्स का एक्सेस मना है",
          },
          notFound: {
            title: "टास्क नहीं मिले",
            description: "शर्तों से मेल खाता कोई टास्क नहीं मिला",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "टास्क लाते समय नेटवर्क एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं जिन्हें देखना ज़रूरी है",
          },
          conflict: {
            title: "टकराव एरर",
            description: "रिक्वेस्ट प्रोसेस करते समय टकराव हुआ",
          },
        },
        success: {
          retrieved: {
            title: "टास्क सफलतापूर्वक मिल गए",
            description: "टास्क लिस्ट सफलतापूर्वक मिल गई",
          },
        },
      },
      post: {
        title: "Cron टास्क बनाएँ",
        description: "नया cron टास्क बनाएँ",
        container: {
          title: "टास्क बनाएँ",
          description: "नया cron टास्क कॉन्फ़िगर करें",
        },
        fields: {
          id: {
            label: "टास्क ID",
            description: "इस टास्क की यूनिक, स्थिर पहचान (जैसे 'db-health')",
            placeholder: "टास्क ID डालें...",
          },
          routeId: {
            label: "Route ID",
            description:
              "हैंडलर की पहचान: टास्क का नाम, endpoint alias, या 'cron-steps'",
            placeholder: "Route ID डालें...",
          },
          displayName: {
            label: "डिस्प्ले नाम",
            description: "इस टास्क का इंसान को समझ आने वाला लेबल",
            placeholder: "डिस्प्ले नाम डालें...",
          },
          outputMode: {
            label: "आउटपुट मोड",
            description: "एक्ज़ीक्यूशन के बाद नोटिफ़िकेशन कब भेजें",
            placeholder: "आउटपुट मोड चुनें...",
          },
          description: {
            label: "विवरण",
            description: "टास्क का विवरण",
            placeholder: "विवरण डालें...",
          },
          schedule: {
            label: "शेड्यूल",
            description: "Cron शेड्यूल एक्सप्रेशन",
            placeholder: "*/5 * * * *",
          },
          priority: {
            label: "प्राथमिकता",
            description: "टास्क की प्राथमिकता",
          },
          category: {
            label: "कैटेगरी",
            description: "टास्क की कैटेगरी",
          },
          enabled: {
            label: "चालू",
            description: "टास्क चालू या बंद करें",
          },
          hidden: {
            label: "छिपा है",
            description:
              "इस टास्क को AI सिस्टम प्रॉम्प्ट और डिफ़ॉल्ट टास्क लिस्ट से छिपाएँ",
          },
          timeout: {
            label: "टाइमआउट (ms)",
            description: "मिलीसेकंड में अधिकतम एक्ज़ीक्यूशन समय",
          },
          retries: {
            label: "रीट्राई",
            description: "रीट्राई कोशिशों की संख्या",
          },
          retryDelay: {
            label: "रीट्राई में देरी (ms)",
            description: "रीट्राई के बीच मिलीसेकंड में देरी",
          },
          taskInput: {
            label: "टास्क इनपुट",
            description: "टास्क के लिए JSON इनपुट डेटा",
          },
          runOnce: {
            label: "एक बार चलाएँ",
            description: "इस टास्क को सिर्फ़ एक बार चलाएँ और फिर बंद कर दें",
          },
          targetInstance: {
            label: "टारगेट इंस्टेंस",
            description:
              "वो इंस्टेंस ID जिस पर ये टास्क चलना चाहिए (जैसे 'hermes', 'thea-prod')। सिर्फ़ होस्ट इंस्टेंस पर चलाने के लिए खाली छोड़ें।",
            placeholder: "सिर्फ़ होस्ट के लिए खाली छोड़ें",
          },
        },
        response: {
          task: {
            title: "बनाया गया टास्क",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन फ़ेल हुआ",
            description: "दिया गया टास्क डेटा गलत है",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "आपके पास टास्क बनाने की अनुमति नहीं है",
          },
          internal: {
            title: "इंटरनल एरर",
            description: "टास्क बनाते समय एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "इस रिसोर्स का एक्सेस मना है",
          },
          conflict: {
            title: "टकराव",
            description: "इस नाम का टास्क पहले से मौजूद है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          notFound: {
            title: "नहीं मिला",
            description: "माँगा गया रिसोर्स नहीं मिला",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं",
          },
        },
        success: {
          created: {
            title: "टास्क बन गया",
            description: "टास्क सफलतापूर्वक बन गया",
          },
        },
      },
      widget: {
        title: "Cron टास्क",
        loading: "टास्क लोड हो रहे हैं...",
        header: {
          stats: "स्टैट्स",
          graphs: "ग्राफ़",
          history: "इतिहास",
          queue: "क्यू",
          refresh: "रीफ़्रेश करें",
          create: "नया टास्क",
        },
        filter: {
          all: "सभी",
          running: "चल रहा है",
          completed: "पूरा हुआ",
          failed: "फ़ेल",
          pending: "पेंडिंग",
          disabled: "बंद",
          allPriorities: "सभी प्राथमिकताएँ",
          allCategories: "सभी कैटेगरी",
          visible: "दिखता है",
          hiddenOnly: "छिपा है",
          allTasks: "सभी टास्क",
        },
        search: {
          placeholder: "टास्क खोजें...",
        },
        sort: {
          nameAsc: "नाम A-Z",
          nameDesc: "नाम Z-A",
          schedule: "शेड्यूल",
          lastRunNewest: "आख़िरी रन (नया पहले)",
          executionsMost: "सबसे ज़्यादा एक्ज़ीक्यूशन",
        },
        task: {
          executions: "एक्ज़ीक्यूशन:",
          lastRun: "आख़िरी रन:",
          never: "कभी नहीं",
          nextRun: "अगला रन:",
          notScheduled: "शेड्यूल नहीं",
          routeId: "Route ID",
          hiddenBadge: "छिपा है",
          owner: {
            system: "सिस्टम",
            user: "यूज़र",
          },
          outputMode: {
            storeOnly: "सिर्फ़ स्टोर करें",
            notifyOnFailure: "फ़ेल होने पर सूचित करें",
            notifyAlways: "हमेशा सूचित करें",
          },
        },
        action: {
          view: "ब्योरा देखें",
          history: "इतिहास देखें",
          edit: "टास्क एडिट करें",
          delete: "टास्क हटाएँ",
          runNow: "अभी चलाएँ",
        },
        bulk: {
          selected: "{count} चुने गए",
          selectAll: "सब चुनें",
          clearSelection: "चयन साफ़ करें",
          enable: "चालू करें",
          disable: "बंद करें",
          runNow: "अभी चलाएँ",
          delete: "हटाएँ",
          confirmDeleteTitle: "टास्क हटाएँ?",
          confirmDelete: "{count} टास्क हटाएँ? ये वापस नहीं हो सकता।",
          cancel: "रद्द करें",
          success: "{succeeded} सफल, {failed} फ़ेल",
        },
        empty: {
          noTasks: "कोई cron टास्क नहीं",
          noTasksDesc: "शुरू करने के लिए अपना पहला cron टास्क बनाइए",
          noMatches: "कोई टास्क आपके फ़िल्टर से मेल नहीं खाता",
          noMatchesDesc: "अपनी खोज या फ़िल्टर शर्तें बदलकर देखें",
          clearFilters: "फ़िल्टर साफ़ करें",
        },
      },
    },
    errors: {
      fetch_all_failed: "cron टास्क नहीं मिल सके",
      fetch_by_id_failed: "ID से cron टास्क नहीं मिला",
      fetch_by_name_failed: "नाम से cron टास्क नहीं मिला",
      create_failed: "cron टास्क नहीं बन सका",
      update_failed: "cron टास्क अपडेट नहीं हो सका",
      delete_failed: "cron टास्क नहीं हट सका",
      not_found: "cron टास्क नहीं मिला",
      execution_create_failed: "cron टास्क एक्ज़ीक्यूशन नहीं बन सका",
      execution_update_failed: "cron टास्क एक्ज़ीक्यूशन अपडेट नहीं हो सका",
      execution_not_found: "cron टास्क एक्ज़ीक्यूशन नहीं मिला",
      executions_fetch_failed: "cron टास्क एक्ज़ीक्यूशन नहीं मिल सके",
      recent_executions_fetch_failed: "हाल के cron एक्ज़ीक्यूशन नहीं मिल सके",
      schedules_fetch_failed: "cron टास्क शेड्यूल नहीं मिल सके",
      schedule_update_failed: "cron टास्क शेड्यूल अपडेट नहीं हो सका",
      schedule_not_found: "cron टास्क शेड्यूल नहीं मिला",
      statistics_fetch_failed: "cron टास्क के स्टैटिस्टिक्स नहीं मिल सके",
    },
  },
  pulseSystem: {
    execute: {
      category: "पल्स एक्ज़ीक्यूशन",
      tags: {
        execute: "चलाएँ",
      },
      post: {
        title: "पल्स चलाएँ",
        description: "पल्स हेल्थ मॉनिटरिंग और टास्क एक्ज़ीक्यूशन चलाएँ",
        container: {
          title: "पल्स एक्ज़ीक्यूशन",
          description: "पल्स मॉनिटरिंग चलाएँ और शेड्यूल्ड टास्क चलाएँ",
        },
        fields: {
          dryRun: {
            label: "ड्राई रन",
            description: "असल बदलाव किए बिना ड्राई रन करें",
          },
          taskNames: {
            label: "टास्क के नाम",
            description: "चलाने वाले ख़ास टास्क के नाम (वैकल्पिक)",
          },
          force: {
            label: "ज़बरदस्ती चलाएँ",
            description: "टास्क का समय न आया हो तब भी चलाएँ",
          },
          success: {
            title: "सफल",
          },
          message: {
            title: "मैसेज",
          },
        },
        response: {
          pulseId: "पल्स ID",
          executedAt: "चलाने का समय",
          totalTasksDiscovered: "खोजे गए कुल टास्क",
          tasksDue: "देय टास्क",
          tasksExecuted: "चलाए गए टास्क",
          tasksSucceeded: "सफल टास्क",
          tasksFailed: "फ़ेल टास्क",
          tasksSkipped: "छोड़े गए टास्क",
          totalExecutionTimeMs: "कुल एक्ज़ीक्यूशन समय (ms)",
          errors: "एरर",
          summary: "एक्ज़ीक्यूशन सारांश",
          results: "नतीजे",
          resultsDescription: "टास्क एक्ज़ीक्यूशन के नतीजे",
          taskName: "टास्क का नाम",
          success: "सफल",
          duration: "अवधि",
          message: "मैसेज",
          executionFailed: "एक्ज़ीक्यूशन फ़ेल हुआ",
          dryRunSuccess: "ड्राई रन सफलतापूर्वक पूरा हुआ",
          executionSuccess: "एक्ज़ीक्यूशन सफलतापूर्वक पूरा हुआ",
        },
        examples: {
          basic: {
            title: "बेसिक पल्स एक्ज़ीक्यूशन",
          },
          dryRun: {
            title: "ड्राई रन एक्ज़ीक्यूशन",
          },
          success: {
            title: "सफल एक्ज़ीक्यूशन",
          },
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          internal: {
            title: "इंटरनल एरर",
            description: "इंटरनल सर्वर एरर आया",
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
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
        },
        success: {
          title: "सफल",
          description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
        },
      },
    },
    status: {
      category: "पल्स स्टेटस",
      tags: {
        status: "स्टेटस",
      },
      get: {
        title: "पल्स स्टेटस",
        description: "पल्स हेल्थ मॉनिटरिंग स्टेटस पाएँ",
        container: {
          title: "पल्स हेल्थ स्टेटस",
          description: "पल्स एक्ज़ीक्यूशन की सेहत और स्टैटिस्टिक्स मॉनिटर करें",
        },
        fields: {
          status: {
            title: "स्टेटस",
            label: "पल्स स्टेटस",
            description: "मौजूदा पल्स हेल्थ स्टेटस",
          },
          lastPulseAt: {
            title: "आख़िरी पल्स का समय",
            label: "आख़िरी पल्स",
            description: "आख़िरी पल्स एक्ज़ीक्यूशन का टाइमस्टैम्प",
          },
          successRate: {
            title: "सफलता दर",
            label: "सफलता दर",
            description: "सफल पल्स एक्ज़ीक्यूशन का प्रतिशत",
          },
          totalExecutions: {
            title: "कुल एक्ज़ीक्यूशन",
            label: "कुल एक्ज़ीक्यूशन",
            description: "पल्स एक्ज़ीक्यूशन की कुल संख्या",
          },
        },
        examples: {
          basic: {
            title: "बेसिक स्टेटस रिक्वेस्ट",
          },
          success: {
            title: "सफल स्टेटस रिस्पॉन्स",
          },
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          internal: {
            title: "इंटरनल एरर",
            description: "इंटरनल सर्वर एरर आया",
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
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
        },
        success: {
          title: "सफल",
          description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
        },
      },
    },
    history: {
      category: "टास्क मैनेजमेंट",

      tags: {
        pulse: "पल्स",
        monitoring: "मॉनिटरिंग",
      },

      errors: {
        fetchCronTaskHistory: "पल्स एक्ज़ीक्यूशन इतिहास नहीं मिल सका",
      },

      get: {
        title: "पल्स एक्ज़ीक्यूशन इतिहास",
        description: "पल्स एक्ज़ीक्यूशन चक्रों का इतिहास देखें",
        fields: {
          startDate: {
            label: "शुरू की तारीख",
            description: "इस तारीख़ के बाद के पल्स चक्र फ़िल्टर करें",
          },
          endDate: {
            label: "अंत की तारीख",
            description: "इस तारीख़ से पहले के पल्स चक्र फ़िल्टर करें",
          },
          status: {
            label: "स्टेटस",
            description: "एक्ज़ीक्यूशन स्टेटस से फ़िल्टर करें",
            placeholder: "सभी स्टेटस",
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
            description: "गलत रिक्वेस्ट पैरामीटर दिए गए",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "पल्स इतिहास लाते समय नेटवर्क एरर आया",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "आपके पास पल्स इतिहास देखने की अनुमति नहीं है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "पल्स इतिहास का एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "पल्स एक्ज़ीक्यूशन रिकॉर्ड नहीं मिला",
          },
          server: {
            title: "सर्वर एरर",
            description: "इंटरनल सर्वर एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
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
          title: "इतिहास मिल गया",
          description: "पल्स एक्ज़ीक्यूशन इतिहास सफलतापूर्वक मिला",
        },
      },
      pulse: {
        execution: {
          success: "सफल",
          failure: "फ़ेल",
          timeout: "टाइमआउट",
          cancelled: "रद्द",
          pending: "पेंडिंग",
        },
      },
      widget: {
        title: "पल्स इतिहास",
        empty: "कोई पल्स एक्ज़ीक्यूशन नहीं मिला",
        details: "ब्योरा",
        discovered: "{{count}} मिले",
        due: "{{count}} देय",
        succeeded: "{{count}} ठीक",
        failed: "{{count}} फ़ेल",
        tasksExecuted: "चलाए गए",
        tasksSucceeded: "सफल हुए",
        tasksFailed: "फ़ेल",
        tasksSkipped: "छोड़ा गया",
        header: {
          cronHistory: "Cron इतिहास",
          stats: "स्टैट्स",
          refresh: "रीफ़्रेश करें",
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
    },
    success: {
      title: "सफल",
      description: "पल्स सफलतापूर्वक चला",
      content: "सफल",
    },
    container: {
      title: "पल्स कंटेनर",
      description: "पल्स कंटेनर का विवरण",
    },
  },
  unifiedRunner: {
    category: "टास्क मैनेजमेंट",

    description: "बैकग्राउंड टास्क चलाता है और साइड टास्क मैनेज करता है",
    common: {
      taskName: "टास्क का नाम",
      taskNamesDescription: "फ़िल्टर करने वाले टास्क के नाम",
      detailed: "विस्तृत",
      detailedDescription: "विस्तृत जानकारी शामिल करें",
      active: "एक्टिव",
      total: "कुल",
      uptime: "अपटाइम",
      id: "ID",
      status: "स्टेटस",
      lastRun: "आख़िरी रन",
      nextRun: "अगला रन",
      schedule: "शेड्यूल",
    },
    post: {
      title: "यूनिफ़ाइड टास्क रनर",
      description: "बैकग्राउंड टास्क और साइड टास्क के लिए यूनिफ़ाइड टास्क रनर मैनेज करें",
      container: {
        title: "यूनिफ़ाइड टास्क रनर मैनेजमेंट",
        description:
          "वो यूनिफ़ाइड टास्क रनर कंट्रोल करें जो बैकग्राउंड टास्क और साइड टास्क दोनों मैनेज करता है",
      },
      fields: {
        action: {
          label: "कार्रवाई",
          description: "टास्क रनर पर की जाने वाली कार्रवाई",
          options: {
            start: "रनर शुरू करें",
            stop: "रनर रोकें",
            status: "स्टेटस पाएँ",
            restart: "रनर रीस्टार्ट करें",
          },
        },
        taskFilter: {
          label: "टास्क फ़िल्टर",
          description: "टाइप से टास्क फ़िल्टर करें",
          options: {
            all: "सभी टास्क",
            cron: "सिर्फ़ Cron टास्क",
            side: "सिर्फ़ साइड टास्क",
          },
        },
        dryRun: {
          label: "ड्राई रन",
          description: "असल बदलाव किए बिना ड्राई रन करें",
        },
      },
      response: {
        success: "ऑपरेशन सफल",
        actionResult: "कार्रवाई का नतीजा",
        message: "रिस्पॉन्स मैसेज",
        timestamp: "टाइमस्टैम्प",
      },
      reasons: {
        previousInstanceRunning: "पिछला इंस्टेंस अब भी चल रहा है",
      },
      messages: {
        taskSkipped: "टास्क छोड़ा गया",
        taskCompleted: "टास्क सफलतापूर्वक पूरा हुआ",
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
        internal: {
          title: "इंटरनल एरर",
          description: "इंटरनल सर्वर एरर आया",
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
        unsaved: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
        execution: {
          title: "टास्क एक्ज़ीक्यूशन एरर",
          description: "टास्क चल नहीं सका",
        },
        taskAlreadyRunning: {
          title: "टास्क पहले से चल रहा है",
          description: "बताया गया टास्क पहले से चल रहा है",
        },
        sideTaskExecution: {
          title: "साइड टास्क एक्ज़ीक्यूशन एरर",
          description: "साइड टास्क चल नहीं सका",
        },
      },
      success: {
        title: "सफल",
        description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
      },
    },
  },
};
