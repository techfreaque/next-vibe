import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/hi";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "सिस्टम",

  errors: {
    repositoryInternalError: "इंटरनल एरर आया",
    fetchErrorLogs: "एरर लॉग नहीं मिल सके: {{error}}",
    updateErrorLog: "एरर लॉग स्टेटस अपडेट नहीं हो सका: {{error}}",
    missingTarget: "fingerprint या id दें।",
    idNotUnique:
      "Id प्रीफ़िक्स {{id}} से {{count}} रो मेल खाती हैं। fingerprint या पूरी id इस्तेमाल करें।",
  },

  statusFilter: {
    all: "सभी",
    active: "अनसुलझे",
    resolved: "सुलझा",
  },
  levelFilter: {
    all: "सभी लेवल",
    error: "एरर",
    warn: "चेतावनियाँ",
  },
  sourceFilter: {
    all: "सभी सोर्स",
    client: "ब्राउज़र",
    server: "सर्वर",
  },
  trendSplit: {
    newVsRecurring: "नए बनाम बार-बार आने वाले",
    level: "लेवल",
    source: "सोर्स",
  },
  sort: {
    windowOccurrences: "अवधि में सबसे ज़्यादा हिट",
    lastSeen: "आख़िरी बार देखा",
    firstSeen: "सबसे नए",
    totalOccurrences: "अब तक सबसे ज़्यादा हिट",
  },

  get: {
    title: "एरर लॉग",
    titleShort: "एरर लॉग",
    description:
      "सटीक अनसुलझी गिनती के साथ एरर क्लास, समय के साथ घटनाएँ, टॉप दोषी और प्रभावित यूज़र। अवधि, स्टेटस, लेवल, सोर्स, endpoint या टेक्स्ट से फ़िल्टर करें; एक क्लिक में सुलझाएँ।",
    tags: {
      monitoring: "मॉनिटरिंग",
    },
    fields: {
      group: {
        label: "मिलते-जुलते ग्रुप करें",
        description: "हर मैसेज की एक पंक्ति: अलग routes पर आए वेरिएंट साथ गिने जाते हैं",
      },
      status: {
        label: "स्टेटस",
        description: "सुलझे स्टेटस से फ़िल्टर करें",
      },
      search: {
        label: "एरर खोजें",
        description: "मैसेज, fingerprint या लॉग ID खोजें",
        placeholder: "मैसेज, fingerprint या लॉग ID खोजें",
      },
      errorType: {
        label: "एरर टाइप",
        description: "एरर टाइप वर्गीकरण से फ़िल्टर करें",
        placeholder: "जैसे INTERNAL_ERROR",
      },
      level: {
        label: "लेवल",
        description: "एरर या चेतावनी",
      },
      source: {
        label: "सोर्स",
        description: "ब्राउज़र में उठा (क्लाइंट लॉग) या सर्वर पर",
      },
      endpoint: {
        label: "Endpoint या route",
        description: "Endpoint पाथ, alias या पेज route में ये टेक्स्ट हो",
        placeholder: "जैसे payment/providers",
      },
      fingerprint: {
        label: "Fingerprint",
        description: "सिर्फ़ एक एरर क्लास दिखाएँ",
        placeholder: "Fingerprint",
      },
      split: {
        label: "चार्ट स्प्लिट",
        description: "घटनाओं का चार्ट कैसे स्टैक होता है",
      },
      sort: {
        label: "क्रम",
        description: "लिस्ट का क्रम",
      },
      limit: {
        label: "सीमा",
        description: "लौटाए जाने वाले नतीजों की संख्या",
        placeholder: "50",
      },
      offset: {
        label: "ऑफ़सेट",
        description: "छोड़े जाने वाले नतीजों की संख्या",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "एरर लॉग एंट्री",
      },
      totalCount: {
        title: "कुल गिनती",
      },
      hasMore: {
        title: "और हैं",
      },
      unresolvedCount: {
        title: "अनसुलझी गिनती",
      },
      window: {
        title: "अवधि",
      },
      kpis: {
        title: "मुख्य नंबर",
      },
      trend: {
        title: "समय के साथ घटनाएँ",
      },
      byEndpoint: {
        title: "endpoint के हिसाब से",
      },
      historySince: {
        title: "इतिहास इस तारीख़ से",
      },
    },
    success: {
      title: "लॉग मिल गए",
      description: "एरर लॉग सफलतापूर्वक मिल गए",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस नहीं मिला",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई लॉग नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      server: {
        title: "सर्वर एरर",
        description: "एरर लॉग नहीं मिल सके",
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
  },

  patch: {
    title: "एरर लॉग अपडेट करें",
    titleShort: "लॉग अपडेट करें",
    description: "fingerprint से किसी एरर लॉग को सुलझाएँ या दोबारा खोलें",
    tags: {
      monitoring: "मॉनिटरिंग",
    },
    fields: {
      similarTo: {
        label: "इसके जैसा ही मैसेज",
        description:
          "इस fingerprint जैसे ही मैसेज वाली हर क्लास को सुलझाएँ या दोबारा खोलें",
      },
      fingerprints: {
        label: "Fingerprints",
        description:
          "एक साथ कई fingerprint (बल्क सुलझाना या दोबारा खोलना, ज़्यादा से ज़्यादा 200)",
      },
      fingerprint: {
        label: "Fingerprint",
        description:
          "एरर लॉग का fingerprint (लिस्ट में `fingerprint` कॉलम)। ये या id दें।",
        placeholder: "fingerprint डालें",
      },
      id: {
        label: "लॉग ID",
        description:
          "लिस्ट से रो id (पूरा uuid या उसके पहले 8+ अक्षर)। fingerprint की जगह इस्तेमाल करें।",
        placeholder: "जैसे c21bd4c7",
      },
      resolved: {
        label: "सुलझा",
        description: "सुलझाने के लिए true, दोबारा खोलने के लिए false",
      },
    },
    response: {
      fingerprint: {
        title: "Fingerprint",
      },
      resolved: {
        title: "सुलझा",
      },
      affectedRows: {
        title: "प्रभावित रो",
      },
    },
    success: {
      title: "लॉग अपडेट हुआ",
      description: "एरर लॉग स्टेटस सफलतापूर्वक अपडेट हुआ",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस नहीं मिला",
      },
      notFound: {
        title: "नहीं मिला",
        description: "एरर लॉग नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      server: {
        title: "सर्वर एरर",
        description: "एरर लॉग अपडेट नहीं हो सका",
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
  },

  post: {
    title: "एरर मॉनिटर स्कैन चलाएँ",
    description: "एरर पैटर्न के लिए चैट मैसेज और बैकएंड लॉग स्कैन करें",
    tags: {
      monitoring: "मॉनिटरिंग",
    },
    response: {
      errorsFound: "मिले एरर",
      threadsScanned: "स्कैन किए थ्रेड",
      scanWindowFrom: "स्कैन विंडो कब से",
      scanWindowTo: "स्कैन विंडो कब तक",
      patterns: "एरर पैटर्न",
    },
    success: {
      title: "स्कैन पूरा",
      description: "एरर मॉनिटर स्कैन सफलतापूर्वक पूरा हुआ",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत रिक्वेस्ट",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस नहीं मिला",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      server: {
        title: "सर्वर एरर",
        description: "एरर मॉनिटर स्कैन नहीं चल सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
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
  },

  errorMonitor: {
    name: "एरर मॉनिटर",
    description: "हर 3 घंटे एरर पैटर्न स्कैन करता है",
  },

  widget: {
    subtitle:
      "हर एरर और चेतावनी क्लास के हिसाब से ग्रुप। जो ठीक हो गया उसे सुलझाएँ; दोबारा आए तो वो फिर खुल जाता है।",
    kpi: {
      unresolvedInScope: "इस व्यू में अनसुलझे",
      unresolvedAllTimeLink:
        "सभी अनसुलझी क्लास, एरर और चेतावनियाँ, अब तक की: {{count}}",
      unresolvedMessages: "{{messages}} मैसेज · {{occurrences}} घटनाएँ",
      unresolvedMatching: "{{count}} अनसुलझे फ़िल्टर से मेल खाते हैं",
      unresolved: "अनसुलझी क्लास (अब तक की)",
      unresolvedHint: "अब तक {{occurrences}} हिट",
      unresolvedOutside: "{{count}} इस अवधि में नहीं दिखे",
      occurrences: "घटनाएँ",
      newClasses: "नई क्लास",
      activeClasses: "हिट हुई क्लास",
      affectedUsers: "हिट हुए यूज़र",
      affectedLeads: "हिट हुए विज़िटर",
    },
    chart: {
      noEndpoint: "कोई endpoint दर्ज नहीं",
      emptyFiltered: "इस अवधि में इन फ़िल्टर से कोई घटना मेल नहीं खाती।",
      trendTitle: "घटनाएँ",
      trendSubtitle: "अवधि घटाने के लिए किसी बार पर क्लिक करें",
      endpointTitle: "कहाँ टूटता है",
      endpointSubtitle:
        "घटनाओं के हिसाब से endpoint और routes। फ़िल्टर करने के लिए किसी पंक्ति पर क्लिक करें।",
      endpoint: "Endpoint / route",
      occurrences: "घटनाएँ",
      classes: "क्लास",
      unresolved: "खुला",
      historyNote:
        "दैनिक इतिहास {{date}} से शुरू होता है। उससे पहले की हिट सिर्फ़ कुल गिनती में हैं।",
      historyNone: "अभी तक कोई दैनिक इतिहास दर्ज नहीं। हर क्लास के कुल अब भी सटीक हैं।",
    },
    series: {
      new: "नया",
      recurring: "रिकरिंग",
      error: "एरर",
      warn: "चेतावनियाँ",
      client: "ब्राउज़र",
      server: "सर्वर",
    },
    list: {
      viewGroup: "{{count}} देखें",
      noSession: "कोई सेशन कॉन्टेक्स्ट नहीं",
      cliAct:
        "कार्रवाई: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliStatus: "स्टेटस: {{status}}",
      groupSize: "{{count}} क्लास",
      resolveGroup: "सभी {{count}} सुलझाएँ",
      reopenGroup: "सभी {{count}} दोबारा खोलें",
      groupHint: "मैसेज के हिसाब से ग्रुप",
      subtitleGrouped: "इस अवधि में {{count}} मैसेज दिखे",
      bulkResolveOf: "मेल खाते {{total}} में से {{shown}} सुलझाएँ",
      cliGroup:
        '{{count}} क्लास का ग्रुप। लिस्ट: vibe error-logs --group=false --search="{{search}}" · सब पर कार्रवाई: vibe update-error-log --similarTo={{fingerprint}} --resolved=true',
      allClear: "इन फ़िल्टर से कुछ खुला नहीं मिलता।",
      allClearHint: "बाकी देखने के लिए फ़िल्टर हटाएँ।",
      similar: "+{{count}} मिलते-जुलते",
      cliFilters:
        "फ़िल्टर (दिखाई वैल्यू enum key हैं): --range=analytics.range.last7Days --status=statusFilter.all --level=levelFilter.error --source=sourceFilter.server --endpoint=<text> --search=<text>। बल्क: vibe update-error-log --fingerprints=<a>,<b> --resolved=true",
      more: "+{{count}} और",
      doneResolved: "सुलझाया: {{label}}",
      doneReopened: "दोबारा खोला: {{label}}",
      doneResolvedMany: "{{count}} क्लास सुलझाईं",
      doneReopenedMany: "{{count}} क्लास दोबारा खोलीं",
      undo: "पूर्ववत करें",
      dismiss: "बंद करें",
      bulkResolve: "दिखाई गई सभी {{count}} सुलझाएँ",
      bulkConfirm: "पुष्टि: {{count}} सुलझाएँ",
      cliHits: "अवधि में {{period}} / कुल {{total}}",
      resolveFailed: "सेव नहीं हुआ। दोबारा कोशिश करें।",
      cliResolve:
        "कार्रवाई: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliHint:
        "सुलझाएँ: vibe update-error-log --fingerprint=<fingerprint> --resolved=true। ब्योरा: --fingerprint=<fingerprint>। अगला पेज: --offset={{next}}",
      title: "एरर क्लास",
      subtitle: "इस अवधि में {{count}} दिखे",
      hitsPeriod: "अवधि में {{count}}",
      hitsTotal: "कुल {{count}}",
      users: "यूज़र {{count}}",
      leads: "विज़िटर {{count}}",
      firstSeen: "पहला {{date}}",
      lastSeen: "आख़िरी {{date}}",
      open: "ब्योरा",
      close: "छिपाएँ",
      focus: "सिर्फ़ यही",
      affected: "प्रभावित यूज़र",
      affectedLeads: "प्रभावित विज़िटर",
      resolving: "सेव हो रहा है...",
    },
    filter: {
      apply: "फ़िल्टर लगाएँ",
      more: "फ़िल्टर",
      moreCount: "फ़िल्टर ({{count}})",
      moreDescription: "स्टेटस, गंभीरता या मूल से फ़िल्टर करें।",
      fingerprint: "क्लास",
      endpoint: "Endpoint",
      search: "खोजें",
      errorType: "टाइप",
      status: "स्टेटस",
      level: "लेवल",
      source: "सोर्स",
    },
    emptyFiltered:
      "इन फ़िल्टर से कोई ग्रुप मेल नहीं खाता। कोई फ़िल्टर हटाकर दोबारा कोशिश करें।",
    emptyActive: "कोई एक्टिव एरर ग्रुप नहीं है। सुलझे एरर देखने के लिए सभी चुनें।",
    severity: {
      error: "एरर",
      warning: "चेतावनी",
    },
    title: "एरर लॉग",
    loading: "लॉग लोड हो रहे हैं...",
    empty: "कोई एरर लॉग नहीं मिला",
    header: {
      refresh: "रीफ़्रेश करें",
      runScan: "स्कैन चलाएँ",
      back: "वापस",
      activeCount: "कुल {{count}} खुले",
    },
    col: {
      message: "मैसेज",
      errorType: "एरर टाइप",
      occurrences: "घटनाएँ",
      firstSeen: "पहली बार दिखा",
      createdAt: "आख़िरी बार दिखा",
    },
    status: {
      active: "अनसुलझे",
      resolved: "सुलझा",
    },
    action: {
      confirm: "स्टेटस सेव करें",
      clear: "फ़िल्टर साफ़ करें",
      resolve: "सुलझाएँ",
      reopen: "दोबारा खोलें",
    },
    detail: {
      context: "एरर कॉन्टेक्स्ट",
      stackTrace: "स्टैक ट्रेस",
      metadata: "मेटाडेटा",
      collapse: "समेटें",
      resolved: "सुलझा",
    },
    source: {
      client: "ब्राउज़र",
      server: "सर्वर",
    },
    pagination: {
      matches: "{{count}} मेल खाते ग्रुप",
      info: "पेज {{page}} / {{totalPages}} (कुल {{total}})",
      prev: "पिछला",
      next: "अगला",
    },
  },
};
